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
import { getAcquiredSkillSelectionsUpToLevel } from '@/utils/skills/skillProgression';
import EquipmentLoadoutModal from '@/components/EquipmentLoadoutModal';
import { allItems } from '@/data/items/allItems';
import { EquipmentLoadout, EquipmentLoadouts } from '@/types/characters';
import { StatModifier } from '@/types/modifiers';

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

  const canEditCharacter =
    character !== null &&
    user !== null &&
    (character.user_id === user.id ||
      character.campaign_owner_id === user.id ||
      user.role === USER_ROLES.ADMIN);

  const progressionBuckets = (() => {
    if (!character?.progression) return [];
    if (typeof character.progression === 'string') {
      try {
        const parsed = JSON.parse(character.progression);
        return parsed?.buckets ?? [];
      } catch {
        return [];
      }
    }
    return character.progression.buckets ?? [];
  })();

  const skillSelections = character
    ? getAcquiredSkillSelectionsUpToLevel(
        progressionBuckets,
        allSkills,
        character.class_id,
        character.race_id,
        character.level,
      )
    : [];
  const skillById = new Map(allSkills.map((skill) => [skill.id, skill]));
  const highestBySkill = new Map<
    string,
    { tier: number; source?: string }
  >();
  for (const selection of skillSelections) {
    const current = highestBySkill.get(selection.skillId);
    if (!current || selection.tier > current.tier) {
      highestBySkill.set(selection.skillId, {
        tier: selection.tier,
        source: selection.source,
      });
    }
  }
  const skillSummary = Array.from(highestBySkill.entries()).map(
    ([skillId, data]) => {
      const skill = skillById.get(skillId);
      const tier = skill?.tiers.find((t) => t.tier === data.tier);
      return {
        name: skill?.name ?? skillId,
        tier: data.tier,
        source: data.source,
        totalDescription: tier?.totalDescription ?? tier?.description,
        skillDescription: skill?.description,
      };
    }
  );
  const normalizedLoadouts = useMemo<EquipmentLoadouts>(() => {
    if (!character?.equipment_loadouts) {
      return {
        activeId: 'loadout-1',
        loadouts: [
          { id: 'loadout-1', name: 'Loadout 1', items: {} },
          { id: 'loadout-2', name: 'Loadout 2', items: {} },
          { id: 'loadout-3', name: 'Loadout 3', items: {} },
          { id: 'loadout-4', name: 'Loadout 4', items: {} },
        ],
      };
    }
    const raw =
      typeof character.equipment_loadouts === 'string'
        ? (JSON.parse(character.equipment_loadouts) as EquipmentLoadouts)
        : character.equipment_loadouts;
    const loadouts = (raw.loadouts ?? []).map((loadout) => ({
      ...loadout,
      items: Array.isArray(loadout.items) ? {} : loadout.items,
    }));
    const existingIds = new Set(loadouts.map((l) => l.id));
    const defaults: EquipmentLoadout[] = [
      { id: 'loadout-1', name: 'Loadout 1', items: {} },
      { id: 'loadout-2', name: 'Loadout 2', items: {} },
      { id: 'loadout-3', name: 'Loadout 3', items: {} },
      { id: 'loadout-4', name: 'Loadout 4', items: {} },
    ];
    for (const def of defaults) {
      if (!existingIds.has(def.id)) {
        loadouts.push(def);
      }
    }
    return { activeId: raw.activeId ?? 'loadout-1', loadouts };
  }, [character?.equipment_loadouts]);

  const loadouts = normalizedLoadouts.loadouts;
  const activeLoadoutId = normalizedLoadouts.activeId;
  const activeLoadout =
    loadouts.find((loadout) => loadout.id === activeLoadoutId) ?? null;
  const activeArmorItem =
    allItems.find((item) => item.id === activeLoadout?.items['armor']) ?? null;
  const activeShieldItem =
    allItems.find((item) => item.id === activeLoadout?.items['shield']) ?? null;
  const activePrimaryWeapon =
    allItems.find(
      (item) => item.id === activeLoadout?.items['weapon_primary']
    ) ?? null;
  const activeOffhandWeapon =
    allItems.find(
      (item) => item.id === activeLoadout?.items['weapon_offhand']
    ) ?? null;

  const armorType = activeArmorItem?.tags.includes('heavyArmor')
    ? 'heavyArmor'
    : activeArmorItem?.tags.includes('lightArmor')
    ? 'lightArmor'
    : activeArmorItem?.tags.includes('powerArmor')
    ? 'powerArmor'
    : 'unarmored';

  const getWeaponTypeLabel = (item: typeof activePrimaryWeapon | null) => {
    if (!item) return 'Fists';
    const isRanged = item.tags.includes('ranged');
    const isMelee = item.tags.includes('melee');
    const damageType =
      item.tags.find((tag) =>
        ['energy', 'blunt', 'slash', 'pierce'].includes(tag)
      ) ?? 'physical';
    if (isRanged) return `${damageType} ranged`;
    if (isMelee) return `${damageType} melee`;
    return 'weapon';
  };

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

  const meleeDamageType =
    (meleeWeapon?.tags.find((tag) =>
      ['energy', 'blunt', 'slash', 'pierce'].includes(tag)
    ) ?? 'blunt') as 'energy' | 'blunt' | 'slash' | 'pierce';

  const getRangedAttackType = () => {
    const profs = rangedWeapon?.requiresProficiency ?? [];
    if (profs.includes('rangedAdvancedWeapons')) return 'advanced';
    if (profs.includes('rangedHeavyWeapons')) return 'heavy';
    if (profs.includes('rangedMounted')) return 'mounted';
    return 'basic';
  };

  const meleeTypeLabel = getWeaponTypeLabel(meleeWeapon);
  const rangedTypeLabel = getWeaponTypeLabel(rangedWeapon);
  const showRangedSummary = !!rangedWeapon;
  const showMeleeSummary = !rangedWeapon;
  const meleeProficiencyId = meleeWeapon?.requiresProficiency?.[0];
  const rangedProficiencyId = rangedWeapon?.requiresProficiency?.[0];

  const buildDamageBreakdown = (
    weapon: typeof activePrimaryWeapon | null,
    includeStr: boolean
  ) => {
    if (!weapon) return { summary: '—', parts: [] as { label: string; value: string }[] };

    const baseMods = (weapon.baseDamage ?? []).filter(
      (mod) => mod.target.startsWith('damage.') && mod.operation === 'add'
    );
    const enchantMods = (weapon.modifiers ?? []).filter(
      (mod) => mod.target.startsWith('damage.') && mod.operation === 'add'
    );

    const formatDamage = (mod: { target: string; value: unknown }) => {
      const damageType = mod.target.split('.')[1] ?? 'damage';
      if (typeof mod.value === 'number') {
        return `${mod.value} ${damageType}`;
      }
      if (
        typeof mod.value === 'object' &&
        mod.value !== null &&
        'diceRoll' in mod.value &&
        'diceType' in mod.value
      ) {
        const roll = mod.value as { diceRoll: number; diceType: number };
        return `${roll.diceRoll}d${roll.diceType} ${damageType}`;
      }
      return null;
    };

    const parts: { label: string; value: string }[] = [];

    for (const mod of baseMods) {
      const text = formatDamage(mod);
      if (!text) continue;
      parts.push({ label: 'weapon', value: text });
    }

    if (includeStr) {
      const strMod = getModifier(character?.attributes.str ?? 0);
      if (strMod !== 0) {
        parts.push({
          label: 'STR',
          value: strMod > 0 ? `+${strMod}` : `${strMod}`,
        });
      }
    }

    for (const mod of enchantMods) {
      const text = formatDamage(mod);
      if (!text) continue;
      parts.push({
        label: 'enchantment',
        value: text.startsWith('-') ? text : `+${text}`,
      });
    }

    const summaryParts: string[] = [];
    for (const part of parts) {
      if (part.label === 'weapon') {
        summaryParts.push(part.value.split(' ')[0]);
      } else if (part.label === 'STR') {
        summaryParts.push(part.value);
      } else if (part.label === 'enchantment') {
        summaryParts.push(part.value.split(' ')[0]);
      } else if (part.label.startsWith('skill')) {
        summaryParts.push(part.value);
      }
    }
    const summary = summaryParts.length > 0 ? summaryParts.join(' ') : '—';

    return {
      summary: summary || '—',
      parts,
    };
  };

  const meleeDamageBreakdown = buildDamageBreakdown(meleeWeapon, true);
  const rangedDamageBreakdown = buildDamageBreakdown(rangedWeapon, false);
  const equipmentModifiers: StatModifier[] = activeLoadout
    ? Object.values(activeLoadout.items)
        .filter((itemId): itemId is string => !!itemId)
        .map((itemId) => allItems.find((item) => item.id === itemId))
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
                id: getRangedAttackType(),
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
                  updateCharacter({ visible: !character.visible });
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
              await updateCharacter({ equipment_loadouts: next });
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
              await updateCharacter({ equipment_loadouts: next });
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
              await updateCharacter(updated);
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
                      updateCharacter({ deleted: true });
                      setShowDeleteModal(false);
                      navigate(`/campaign/${character.campaign_id}`);
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
