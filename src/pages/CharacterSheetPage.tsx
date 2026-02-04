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
import { USER_ROLES } from '@/config/userRoles';
import { useCharacterById } from '@/hooks/useCharacterById';
import { LoadingErrorWrapper } from '@/components/LoadingErrorWrapper';
import { allSkills } from '@/data/skills/allSkills';
import { getAcquiredSkillSelectionsUpToLevel } from '@/utils/skills/skillProgression';
import EquipmentLoadoutModal from '@/components/EquipmentLoadoutModal';
import { allItems } from '@/data/items/allItems';
import { EquipmentLoadout, EquipmentLoadouts } from '@/types/characters';

export const CharacterSheet = () => {
  const { id: characterId } = useParams<{ id: string }>();
  const user = useCurrentUser();
  const navigate = useNavigate();

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLoadoutModal, setShowLoadoutModal] = useState(false);
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
  const finalStats = character
    ? getFinalStats(
        getClassById(character.class_id as ClassId) as GameClass,
        character.attributes,
        character.level,
        skillSelections,
        allSkills,
      )
    : null;

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

  return (
    <LoadingErrorWrapper loading={isLoading} error={hasError}>
      {!character ? (
        <p className="p-4 text-red-600">Character not found.</p>
      ) : (
        <div>
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
          {canEditCharacter && (
            <Button
              variant="outline"
              onClick={() => {
                updateCharacter({ visible: !character.visible });
              }}
              className="mt-2"
            >
              {character.visible
                ? '👁️ Hide from other players'
                : '🙈 Make visible to players'}
            </Button>
          )}

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
            onLoadoutSelect={(loadoutId) => {
              setSelectedLoadoutId(loadoutId);
              setShowLoadoutModal(true);
            }}
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
            onSave={(next) => updateCharacter({ equipment_loadouts: next })}
          />
          {canEditCharacter && (
            <Button
              variant="destructive"
              onClick={() => setShowDeleteModal(true)}
              className="mt-4"
            >
              🗑️ Delete Character
            </Button>
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
          {canEditCharacter && (
            <Button
              variant="primary"
              className="mt-4"
              onClick={() => navigate(`/character/${character.id}/level-up`)}
            >
              ⬆️ Level Up
            </Button>
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
