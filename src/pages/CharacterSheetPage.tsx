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
import { EquipmentLoadouts, EquipmentSlotKey } from '@/types/characters';
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

  const meleeWeapon =
    activePrimaryWeapon?.tags.includes('melee')
      ? activePrimaryWeapon
      : activeOffhandWeapon?.tags.includes('melee')
      ? activeOffhandWeapon
      : null;
  const rangedWeapon =
    activePrimaryWeapon?.tags.includes('ranged')
      ? activePrimaryWeapon
      : activeOffhandWeapon?.tags.includes('ranged')
      ? activeOffhandWeapon
      : null;

  const meleeDamageType = getWeaponDamageTag(meleeWeapon) as
    | 'energy'
    | 'blunt'
    | 'slash'
    | 'pierce';

  const meleeTypeLabel = getWeaponTypeLabel(meleeWeapon);
  const rangedTypeLabel = getWeaponTypeLabel(rangedWeapon);
  const showRangedSummary = !!rangedWeapon;
  const showMeleeSummary = !rangedWeapon;
  const meleeProficiencyId = meleeWeapon?.requiresProficiency?.[0];
  const rangedProficiencyId = rangedWeapon?.requiresProficiency?.[0];

  const makeDamageBreakdown = (
    weapon: typeof activePrimaryWeapon | null,
    includeStr: boolean
  ) => {
    if (!weapon) return { summary: '—', parts: [] as { label: string; value: string }[] };
    const strMod = includeStr ? getModifier(character?.attributes.str ?? 0) : undefined;
    return buildDamageBreakdown({
      baseModifiers: weapon.baseDamage ?? [],
      enchantmentModifiers: weapon.modifiers ?? [],
      strengthModifier: strMod,
    });
  };

  const meleeDamageBreakdown = makeDamageBreakdown(meleeWeapon, true);
  const rangedDamageBreakdown = makeDamageBreakdown(rangedWeapon, false);
  const equipmentModifiers: StatModifier[] = activeLoadout
    ? Object.values(activeLoadout.items)
        .filter((itemId): itemId is string => !!itemId)
        .map((itemId) => itemsById.get(itemId))
        .flatMap((item) =>
          (item?.modifiers ?? []).map((modifier) => ({
            ...modifier,
            sourceItem: modifier.sourceItem ?? item?.name ?? 'equipment',
          }))
        )
    : [];

  const finalStats = character
    ? getFinalStats(
        getClassById(character.class_id as ClassId) as GameClass,
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

  return (
    <LoadingErrorWrapper loading={isLoading} error={hasError}>
      {!character ? (
        <p className="p-4 text-red-600">Character not found.</p>
      ) : (
        <div>
          <div className="card p-4 flex flex-wrap gap-2 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {canEditCharacter && (
                <Button variant="outline" onClick={() => setShowEditModal(true)}>
                  ✏️ Edit Character
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => navigate(`/campaign/${character.campaign_id}`)}
              >
                ← Back to Campaign
              </Button>
            </div>
            {canEditCharacter && (
              <Button
                variant="outline"
                onClick={() => {
                  updateCharacter({ visible: !character.visible }).then((result) => {
                    if (result?.error) {
                      toast.error(
                        result.error.message ?? 'Failed to update visibility.'
                      );
                    }
                  });
                }}
              >
                {character.visible
                  ? '👁️ Hide from other players'
                  : '🙈 Make visible to players'}
              </Button>
            )}
          </div>

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
            onLoadoutSelect={async (loadoutId) => {
              const next = {
                ...normalizedLoadouts,
                activeId: loadoutId,
              };
              const result = await updateCharacter({ equipment_loadouts: next });
              if (result?.error) {
                toast.error(result.error.message ?? 'Failed to update loadout.');
              }
            }}
            onLoadoutEdit={(loadoutId) => {
              setSelectedLoadoutId(loadoutId);
              setShowLoadoutModal(true);
            }}
            equipmentSummary={{
              armorTypeLabel:
                armorType === 'heavyArmor'
                  ? 'Heavy Armor'
                  : armorType === 'lightArmor'
                  ? 'Light Armor'
                  : armorType === 'powerArmor'
                  ? 'Power Armor'
                  : 'Unarmored',
              rangedTypeLabel,
              meleeTypeLabel,
              showRangedSummary,
              showMeleeSummary,
              rangedDamageSummary: rangedDamageBreakdown.summary,
              rangedDamageParts: rangedDamageBreakdown.parts,
              meleeDamageSummary: meleeDamageBreakdown.summary,
              meleeDamageParts: meleeDamageBreakdown.parts,
            }}
            finalStats={finalStats?.final}
            derived={
              finalStats?.base ??
              getBaseDerivedStats(
                getClassById(character.class_id as ClassId) as GameClass,
                character.attributes,
                character.level,
              )
            }
          />
          <EquipmentLoadoutModal
            isOpen={showLoadoutModal}
            equipmentLoadouts={normalizedLoadouts}
            selectedLoadoutId={selectedLoadoutId}
            items={allItems}
            onClose={() => setShowLoadoutModal(false)}
            onSave={async (next) => {
              const result = await updateCharacter({ equipment_loadouts: next });
              if (result?.error) {
                toast.error(result.error.message ?? 'Failed to update loadout.');
              }
            }}
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

          <EditCharacterModal
            open={showEditModal}
            character={character}
            onClose={() => setShowEditModal(false)}
            onSave={async (updated) => {
              const result = await updateCharacter(updated);
              if (result?.error) {
                toast.error(
                  result.error.message ?? 'Failed to update character.'
                );
                return;
              }
              setShowEditModal(false);
            }}
          />
          {showLevelDownModal && character && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded shadow max-w-sm w-full space-y-4">
                <h3 className="text-lg font-semibold">Level Down</h3>
                <p className="text-sm text-gray-600">
                  This will remove all level {character.level} progression
                  choices. Continue?
                </p>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowLevelDownModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      handleLevelDown();
                      setShowLevelDownModal(false);
                    }}
                  >
                    Level Down
                  </Button>
                </div>
              </div>
            </div>
          )}
          {showDeleteModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded shadow max-w-sm w-full space-y-4">
                <h3 className="text-lg font-semibold">Delete Character</h3>
                <p className="text-sm text-gray-600">
                  Are you sure you want to delete this character?
                </p>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      updateCharacter({ deleted: true }).then((result) => {
                        if (result?.error) {
                          toast.error(
                            result.error.message ?? 'Failed to delete character.'
                          );
                          return;
                        }
                        navigate(`/campaign/${character.campaign_id}`);
                      });
                      setShowDeleteModal(false);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </LoadingErrorWrapper>
  );
};
