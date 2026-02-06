import { useMemo, useState } from 'react';
import { CharacterSheetView } from '@/components/CharacterSheet/CharacterSheetView';
import { ClassId, GameClass } from '@/types/gameClass';
import { getClassById } from '@/utils/classUtils';
import { getBaseDerivedStats } from '@/utils/derived/getBaseDerivedStats';
import { getFinalStats } from '@/utils/derived/getFinalStats';
import { Button } from '@/components/ui/Button';
import EditCharacterModal from '@/components/EditCharacterModal';
import { useNavigate, useParams } from 'react-router-dom';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { getModifier } from '@/utils/modifier';
import { USER_ROLES } from '@/config/userRoles';
import { useCharacterById } from '@/hooks/useCharacterById';
import { LoadingErrorWrapper } from '@/components/LoadingErrorWrapper';
import { allSkills } from '@/data/skills/allSkills';
import { buildSkillSummary } from '@/utils/domain/skills';
import { getAcquiredSkillSelectionsUpToLevel } from '@/utils/skills/skillProgression';
import EquipmentLoadoutModal from '@/components/EquipmentLoadoutModal';
import { allItems } from '@/data/items/allItems';
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
import { ReactNode } from 'react';
import { GameItem } from '@/types/items';
import { AttributeMap } from '@/types/attributes';

type CharacterSheetHeaderProps = {
  canEdit: boolean;
  visible: boolean;
  onEdit: () => void;
  onBack: () => void;
  onToggleVisibility: () => void;
};

type CharacterSheetModalsProps = {
  canEdit: boolean;
  character: CharacterWithCampaign;
  showEditModal: boolean;
  showLevelDownModal: boolean;
  showDeleteModal: boolean;
  onEditClose: () => void;
  onEditSave: (updated: Partial<CharacterWithCampaign>) => Promise<void>;
  onLevelDownClose: () => void;
  onLevelDownConfirm: () => void;
  onDeleteClose: () => void;
  onDeleteConfirm: () => void;
};

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

const deriveLoadoutWeapon = (
  primary: GameItem | null,
  offhand: GameItem | null
) => ({
  melee:
    primary?.tags.includes('melee')
      ? primary
      : offhand?.tags.includes('melee')
      ? offhand
      : null,
  ranged:
    primary?.tags.includes('ranged')
      ? primary
      : offhand?.tags.includes('ranged')
      ? offhand
      : null,
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

const CharacterSheetHeader = ({
  canEdit,
  visible,
  onEdit,
  onBack,
  onToggleVisibility,
}: CharacterSheetHeaderProps) => (
  <div className="card p-4 flex flex-wrap gap-2 items-center justify-between">
    <div className="flex flex-wrap gap-2">
      {canEdit && (
        <Button variant="outline" onClick={onEdit}>
          ✏️ Edit Character
        </Button>
      )}
      <Button variant="outline" onClick={onBack}>
        ← Back to Campaign
      </Button>
    </div>
    {canEdit && (
      <Button variant="outline" onClick={onToggleVisibility}>
        {visible ? '👁️ Hide from other players' : '🙈 Make visible to players'}
      </Button>
    )}
  </div>
);

const CharacterSheetModals = ({
  canEdit,
  character,
  showEditModal,
  showLevelDownModal,
  showDeleteModal,
  onEditClose,
  onEditSave,
  onLevelDownClose,
  onLevelDownConfirm,
  onDeleteClose,
  onDeleteConfirm,
}: CharacterSheetModalsProps) => {
  const levelDownDescription = character
    ? `This will remove all level ${character.level} progression choices. Continue?`
    : 'This will remove the most recent level progression choices. Continue?';

  return (
    <>
      <EditCharacterModal
        open={showEditModal}
        character={character}
        onClose={onEditClose}
        onSave={onEditSave}
      />
      {canEdit && (
        <ConfirmModal
          open={showLevelDownModal}
          title="Level Down"
          description={levelDownDescription}
          confirmLabel="Level Down"
          confirmVariant="destructive"
          onCancel={onLevelDownClose}
          onConfirm={onLevelDownConfirm}
        />
      )}
      <ConfirmModal
        open={showDeleteModal}
        title="Delete Character"
        description="Are you sure you want to delete this character?"
        confirmLabel="Delete"
        confirmVariant="destructive"
        onCancel={onDeleteClose}
        onConfirm={onDeleteConfirm}
      />
    </>
  );
};

const ConfirmModal = ({
  open,
  title,
  description,
  confirmLabel,
  confirmVariant = 'outline',
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  description: ReactNode;
  confirmLabel: string;
  confirmVariant?: 'outline' | 'destructive' | 'primary';
  onCancel: () => void;
  onConfirm: () => void;
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow max-w-sm w-full space-y-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant={confirmVariant} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
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
    if (!character) return [];
    return getAcquiredSkillSelectionsUpToLevel(
      progressionBuckets,
      allSkills,
      character.class_id,
      character.race_id,
      character.level,
    );
  }, [
    character,
    progressionBuckets,
  ]);
  const skillSummary = useMemo(
    () => buildSkillSummary(skillSelections),
    [skillSelections]
  );
  const normalizedLoadouts = useMemo<EquipmentLoadouts>(() => {
    return normalizeLoadouts(character?.equipment_loadouts ?? null);
  }, [character?.equipment_loadouts]);

  const loadouts = normalizedLoadouts.loadouts;
  const activeLoadoutId = normalizedLoadouts.activeId;
  const activeLoadout =
    loadouts.find((loadout) => loadout.id === activeLoadoutId) ?? null;
  const itemsById = useMemo(() => {
    return new Map(allItems.map((item) => [item.id, item]));
  }, []);
  const getLoadoutItem = (slot: EquipmentSlotKey) => {
    const itemId = getLoadoutItemId(activeLoadout, slot);
    return itemId ? itemsById.get(itemId) ?? null : null;
  };

  const activeArmorItem = getLoadoutItem('armor');
  const activeShieldItem = getLoadoutItem('shield');
  const activePrimaryWeapon = getLoadoutItem('weapon_primary');
  const activeOffhandWeapon = getLoadoutItem('weapon_offhand');

  const armorType = getArmorType(activeArmorItem);

  const { melee: meleeWeapon, ranged: rangedWeapon } = deriveLoadoutWeapon(
    activePrimaryWeapon,
    activeOffhandWeapon
  );

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
        allSkills,
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

  return (
    <LoadingErrorWrapper loading={isLoading} error={hasError}>
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

          <CharacterSheetView
            characterName={character.name}
            playerName={character.player_name}
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
            finalStats={finalStats?.final}
            derived={derivedStats}
          />
          <EquipmentLoadoutModal
            isOpen={showLoadoutModal}
            equipmentLoadouts={normalizedLoadouts}
            selectedLoadoutId={selectedLoadoutId}
            items={allItems}
            onClose={() => setShowLoadoutModal(false)}
            onSave={handleLoadoutSave}
            derived={finalStats?.derived ?? null}
          />
          {canEditCharacter && (
            <div className="mt-4 flex items-center justify-between">
              <div className="flex gap-2">
                <Button
                  variant="primary"
                  onClick={() => navigate(`/character/${character.id}/level-up`)}
                >
                  ⬆️ Level Up
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowLevelDownModal(true)}
                  disabled={character.level <= 1}
                >
                  ⬇️ Level Down
                </Button>
              </div>
              <Button
                variant="destructive"
                onClick={() => setShowDeleteModal(true)}
              >
                🗑️ Delete Character
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
