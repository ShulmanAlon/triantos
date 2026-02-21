import { useEffect, useMemo, useState } from 'react';
import { CharacterSheetView } from '@/components/CharacterSheet/CharacterSheetView';
import { ClassId, GameClass } from '@/types/gameClass';
import { getClassById } from '@/utils/classUtils';
import { getBaseDerivedStats } from '@/utils/derived/getBaseDerivedStats';
import { getFinalStats } from '@/utils/derived/getFinalStats';
import { Button } from '@/components/ui/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { getModifier } from '@/utils/modifier';
import { USER_ROLES } from '@/config/userRoles';
import { useCharacterById } from '@/hooks/useCharacterById';
import { LoadingErrorWrapper } from '@/components/LoadingErrorWrapper';
import { SkillEntity } from '@/types/skills';
import { buildSkillSummary, getHighestSkillTiers, getSkillTier } from '@/utils/domain/skills';
import { getAcquiredSkillSelectionsUpToLevel } from '@/utils/skills/skillProgression';
import EquipmentLoadoutModal from '@/components/EquipmentLoadoutModal';
import { EquipmentLoadouts, EquipmentSlotKey, CharacterWithCampaign } from '@/types/characters';
import { StatModifier } from '@/types/modifiers';
import { buildDamageBreakdown } from '@/utils/domain/modifiers';
import {
  getLoadoutItemId,
  normalizeLoadouts,
} from '@/utils/domain/loadouts';
import { useToast } from '@/context/ToastContext';
import { ProficiencyId } from '@/config/constants';
import {
  getArmorType,
  getRangedAttackType,
  getWeaponDamageTag,
  getWeaponTypeLabel,
} from '@/utils/domain/weapons';
import { GameItem } from '@/types/items';
import { AttributeMap } from '@/types/attributes';
import { CharacterSheetHeader } from '@/pages/characterSheet/CharacterSheetHeader';
import { CharacterSheetModals } from '@/pages/characterSheet/CharacterSheetModals';

const getArmorTypeLabel = (
  armorType: ReturnType<typeof getArmorType>
): string => {
  switch (armorType) {
    case 'heavyArmor':
      return 'Heavy Armor';
    case 'lightArmor':
      return 'Light Armor';
    case 'powerArmor':
      return 'Power Armor';
    default:
      return 'Unarmored';
  }
};

const deriveLoadoutWeapon = (primary: GameItem | null) => ({
  melee: primary?.tags.includes('melee') ? primary : null,
  ranged: primary?.tags.includes('ranged') ? primary : null,
});

const buildWeaponDamageBreakdown = (
  weapon: GameItem | null,
  includeStr: boolean,
  attributes: AttributeMap
) => {
  if (!weapon) return { summary: '—', parts: [] as { label: string; value: string }[] };
  const strMod = includeStr ? getModifier(attributes.str) : undefined;
  return buildDamageBreakdown({
    baseModifiers: weapon.baseDamage ?? [],
    enchantmentModifiers: weapon.modifiers ?? [],
    strengthModifier: strMod,
  });
};


export const CharacterSheet = () => {
  const { id: characterId } = useParams<{ id: string }>();
  const user = useCurrentUser();
  const navigate = useNavigate();

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLoadoutModal, setShowLoadoutModal] = useState(false);
  const [showLevelDownModal, setShowLevelDownModal] = useState(false);
  const [selectedLoadoutId, setSelectedLoadoutId] = useState('loadout-1');

  const {
    character,
    loading: isLoading,
    error: hasError,
    updateCharacter,
  } = useCharacterById(characterId);
  const { toast } = useToast();

  const [skillsData, setSkillsData] = useState<SkillEntity[] | null>(null);
  const [itemsData, setItemsData] = useState<GameItem[] | null>(null);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      import('@/data/skills/allSkills'),
      import('@/data/items/allItems'),
    ]).then(([skillsModule, itemsModule]) => {
      if (!isMounted) return;
      setSkillsData(skillsModule.allSkills);
      setItemsData(itemsModule.allItems);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const canEditCharacter =
    character !== null &&
    user !== null &&
    (character.user_id === user.id ||
      character.campaign_owner_id === user.id ||
      user.role === USER_ROLES.ADMIN);

  const progressionBuckets = useMemo(
    () => character?.progression?.buckets ?? [],
    [character?.progression]
  );

  const skillSelections = useMemo(() => {
    if (!character || !skillsData) return [];
    return getAcquiredSkillSelectionsUpToLevel(
      progressionBuckets,
      skillsData,
      character.class_id,
      character.race_id,
      character.level,
    );
  }, [
    character,
    progressionBuckets,
    skillsData,
  ]);
  const skillSummary = useMemo(
    () => buildSkillSummary(skillSelections),
    [skillSelections]
  );
  const normalizedLoadouts = useMemo<EquipmentLoadouts>(() => {
    return normalizeLoadouts(character?.equipment_loadouts ?? null);
  }, [character?.equipment_loadouts]);

  const items = useMemo(() => itemsData ?? [], [itemsData]);
  const loadouts = normalizedLoadouts.loadouts;
  const activeLoadoutId = normalizedLoadouts.activeId;
  const activeLoadout =
    loadouts.find((loadout) => loadout.id === activeLoadoutId) ?? null;
  const itemsById = useMemo(() => {
    return new Map(items.map((item) => [item.id, item]));
  }, [items]);
  const getLoadoutItem = (slot: EquipmentSlotKey) => {
    const itemId = getLoadoutItemId(activeLoadout, slot);
    if (itemId) return itemsById.get(itemId) ?? null;
    if (slot === 'weapon_primary') {
      return itemsById.get('unarmed') ?? null;
    }
    return null;
  };

  const activeArmorItem = getLoadoutItem('armor');
  const activeShieldItem = getLoadoutItem('shield');
  const activePrimaryWeapon = getLoadoutItem('weapon_primary');
  const armorType = getArmorType(activeArmorItem);

  const { melee: meleeWeapon, ranged: rangedWeapon } =
    deriveLoadoutWeapon(activePrimaryWeapon);

  const meleeDamageType = getWeaponDamageTag(meleeWeapon);

  const meleeTypeLabel = getWeaponTypeLabel(meleeWeapon);
  const rangedTypeLabel = getWeaponTypeLabel(rangedWeapon);
  const showRangedSummary = !!rangedWeapon;
  const showMeleeSummary = !rangedWeapon;
  const meleeProficiencyId = meleeWeapon?.requiresProficiency?.[0];
  const rangedProficiencyId = rangedWeapon?.requiresProficiency?.[0];

  const meleeDamageBreakdown = useMemo(
    () =>
      character
        ? buildWeaponDamageBreakdown(meleeWeapon, true, character.attributes)
        : { summary: '—', parts: [] as { label: string; value: string }[] },
    [character, meleeWeapon]
  );
  const rangedDamageBreakdown = useMemo(
    () =>
      character
        ? buildWeaponDamageBreakdown(rangedWeapon, false, character.attributes)
        : { summary: '—', parts: [] as { label: string; value: string }[] },
    [character, rangedWeapon]
  );
  const equipmentModifiers: StatModifier[] = useMemo(() => {
    if (!activeLoadout) return [];
    return Object.values(activeLoadout.items)
      .filter((itemId): itemId is string => !!itemId)
      .map((itemId) => itemsById.get(itemId))
      .flatMap((item) =>
        (item?.modifiers ?? []).map((modifier) => ({
          ...modifier,
          sourceItem: modifier.sourceItem ?? item?.name ?? 'equipment',
        }))
      );
  }, [activeLoadout, itemsById]);

  const classData = character
    ? (getClassById(character.class_id as ClassId) as GameClass)
    : null;
  const finalStats = character && classData
    ? getFinalStats(
        classData,
        character.attributes,
        character.level,
        skillSelections,
        skillsData ?? [],
        equipmentModifiers,
        {
          ac: {
            armorType,
            shieldEquipped: !!activeShieldItem,
          },
          melee: {
            id: meleeDamageType,
            label: meleeTypeLabel,
            requiredProficiencyId: meleeProficiencyId,
          },
          ranged: rangedWeapon
            ? {
                id: getRangedAttackType(
                  (rangedWeapon?.requiresProficiency ?? []) as ProficiencyId[]
                ),
                label: rangedTypeLabel,
                requiredProficiencyId: rangedProficiencyId,
              }
            : undefined,
        },
      )
    : null;

  const equipmentSummary = useMemo(
    () => ({
      armorTypeLabel: getArmorTypeLabel(armorType),
      rangedTypeLabel,
      meleeTypeLabel,
      showRangedSummary,
      showMeleeSummary,
      rangedDamageSummary: rangedDamageBreakdown.summary,
      rangedDamageParts: rangedDamageBreakdown.parts,
      meleeDamageSummary: meleeDamageBreakdown.summary,
      meleeDamageParts: meleeDamageBreakdown.parts,
    }),
    [
      armorType,
      rangedTypeLabel,
      meleeTypeLabel,
      showRangedSummary,
      showMeleeSummary,
      rangedDamageBreakdown.summary,
      rangedDamageBreakdown.parts,
      meleeDamageBreakdown.summary,
      meleeDamageBreakdown.parts,
    ]
  );

  const combatSummaryExtras = useMemo(() => {
    if (!character || character.class_id !== 'Cleric') return undefined;
    const highestBySkill = getHighestSkillTiers(skillSelections);
    const turnUndeadTier = highestBySkill.get('turnUndead')?.tier ?? 0;
    const turnAbyssTier = highestBySkill.get('turnAbyssal')?.tier ?? 0;
    const turnIntensityTier = highestBySkill.get('turnIntensity')?.tier ?? 0;
    const turnAreaTier = highestBySkill.get('turnAreaOfEffect')?.tier ?? 0;
    const turnIntensityDescription =
      getSkillTier('turnIntensity', turnIntensityTier)?.totalDescription ??
      'No turn intensity selected.';
    const turnAreaDescription =
      getSkillTier('turnAreaOfEffect', turnAreaTier)?.totalDescription ??
      'No turn range selected.';
    const turnPowers = [
      {
        title: 'Turn Undead',
        enabled: turnUndeadTier > 0,
        description:
          turnUndeadTier > 0
            ? 'Attempt to repel undead creatures.'
            : 'Unlock this in magic skills.',
        intensity: turnIntensityDescription,
        area: turnAreaDescription,
      },
      ...(turnAbyssTier > 0
        ? [
            {
              title: 'Turn Abyssal',
              enabled: true,
              description: 'Attempt to repel abyssal creatures.',
              intensity: turnIntensityDescription,
              area: turnAreaDescription,
            },
          ]
        : []),
    ];
    return turnPowers.length > 0 ? { turnPowers } : undefined;
  }, [character, skillSelections]);

  const handleLevelDown = () => {
    if (!character || character.level <= 1) return;
    const currentLevelBucket = progressionBuckets.find(
      (bucket: { level: number }) => bucket.level === character.level
    );
    const attributeIncreases = currentLevelBucket?.attributeIncreases ?? {};
    const nextAttributes = { ...character.attributes };
    for (const [key, value] of Object.entries(attributeIncreases)) {
      if (typeof value !== 'number') continue;
      const attr = key as keyof typeof nextAttributes;
      nextAttributes[attr] = (nextAttributes[attr] ?? 0) - value;
    }
    const nextBuckets = progressionBuckets.filter(
      (bucket: { level: number }) => bucket.level !== character.level
    );
    updateCharacter({
      level: character.level - 1,
      attributes: nextAttributes,
      progression: { buckets: nextBuckets },
    }).then((result) => {
      if (result?.error) {
        toast.error(result.error.message ?? 'Failed to level down.');
      }
    });
  };

  const handleLoadoutSelect = async (loadoutId: string) => {
    const next = {
      ...normalizedLoadouts,
      activeId: loadoutId,
    };
    const result = await updateCharacter({ equipment_loadouts: next });
    if (result?.error) {
      toast.error(result.error.message ?? 'Failed to update loadout.');
    }
  };

  const handleVisibilityToggle = async () => {
    if (!character) return;
    const result = await updateCharacter({ visible: !character.visible });
    if (result?.error) {
      toast.error(result.error.message ?? 'Failed to update visibility.');
    }
  };

  const handleLoadoutSave = async (next: EquipmentLoadouts) => {
    const result = await updateCharacter({ equipment_loadouts: next });
    if (result?.error) {
      toast.error(result.error.message ?? 'Failed to update loadout.');
    }
  };

  const handleDeleteCharacter = async () => {
    if (!character) return;
    const result = await updateCharacter({ deleted: true });
    if (result?.error) {
      toast.error(result.error.message ?? 'Failed to delete character.');
      return;
    }
    navigate(`/campaign/${character.campaign_id}`);
  };

  const handleEditSave = async (updated: Partial<CharacterWithCampaign>) => {
    const result = await updateCharacter(updated);
    if (result?.error) {
      toast.error(result.error.message ?? 'Failed to update character.');
      return;
    }
    setShowEditModal(false);
  };

  const derivedStats =
    finalStats?.base ??
    (character && classData
      ? getBaseDerivedStats(classData, character.attributes, character.level)
      : null);

  const dataLoading = skillsData === null || itemsData === null;

  return (
    <LoadingErrorWrapper loading={isLoading || dataLoading} error={hasError}>
      {!character ? (
        <p className="p-4 text-red-600">Character not found.</p>
      ) : (
        <div>
          <CharacterSheetHeader
            canEdit={canEditCharacter}
            visible={character.visible}
            onEdit={() => setShowEditModal(true)}
            onBack={() => navigate(`/campaign/${character.campaign_id}`)}
            onToggleVisibility={handleVisibilityToggle}
          />

          <div className="section-gap">
            <CharacterSheetView
            characterName={character.name}
            playerName={character.player_name}
            imageUrl={character.image_url}
            selectedClassId={character.class_id}
            selectedRaceId={character.race_id}
            level={character.level}
            attributes={character.attributes}
            skills={skillSummary}
            equipmentLoadouts={loadouts}
            activeLoadoutId={activeLoadoutId}
            onLoadoutSelect={handleLoadoutSelect}
            onLoadoutEdit={(loadoutId) => {
              setSelectedLoadoutId(loadoutId);
              setShowLoadoutModal(true);
            }}
            equipmentSummary={equipmentSummary}
            combatSummaryExtras={combatSummaryExtras}
            finalStats={finalStats?.final}
            derived={derivedStats}
            />
          </div>
          <EquipmentLoadoutModal
            isOpen={showLoadoutModal}
            equipmentLoadouts={normalizedLoadouts}
            selectedLoadoutId={selectedLoadoutId}
            items={items}
            onClose={() => setShowLoadoutModal(false)}
            onSave={handleLoadoutSave}
            derived={finalStats?.derived ?? null}
            characterClassId={character.class_id}
            characterRaceId={character.race_id}
            characterAttributes={character.attributes}
          />
          {canEditCharacter && (
            <div className="section-gap flex items-center justify-between">
              <div className="flex gap-2">
                <Button
                  variant="primary"
                  onClick={() => navigate(`/character/${character.id}/level-up`)}
                >
                  Level Up
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowLevelDownModal(true)}
                  disabled={character.level <= 1}
                >
                  Level Down
                </Button>
              </div>
              <Button
                variant="destructive"
                onClick={() => setShowDeleteModal(true)}
              >
                Delete Character
              </Button>
            </div>
          )}

          <CharacterSheetModals
            canEdit={canEditCharacter}
            character={character}
            showEditModal={showEditModal}
            showLevelDownModal={showLevelDownModal}
            showDeleteModal={showDeleteModal}
            onEditClose={() => setShowEditModal(false)}
            onEditSave={handleEditSave}
            onLevelDownClose={() => setShowLevelDownModal(false)}
            onLevelDownConfirm={() => {
              handleLevelDown();
              setShowLevelDownModal(false);
            }}
            onDeleteClose={() => setShowDeleteModal(false)}
            onDeleteConfirm={() => {
              handleDeleteCharacter();
              setShowDeleteModal(false);
            }}
          />
        </div>
      )}
    </LoadingErrorWrapper>
  );
};

export default CharacterSheet;
