import { useState } from 'react';
import { CharacterSheetView } from '@/components/CharacterSheet/CharacterSheetView';
import { ClassId, GameClass } from '@/types/gameClass';
import { getClassById } from '@/utils/classUtils';
import { getBaseDerivedStats } from '@/utils/derived/getBaseDerivedStats';
import { Button } from '@/components/ui/Button';
import EditCharacterModal from '@/components/EditCharacterModal';
import { useNavigate, useParams } from 'react-router-dom';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { USER_ROLES } from '@/config/userRoles';
import { useCharacterById } from '@/hooks/useCharacterById';
import { LoadingErrorWrapper } from '@/components/LoadingErrorWrapper';
import { allSkills } from '@/data/skills/allSkills';
import { getAcquiredSkillSelectionsUpToLevel } from '@/utils/skills/skillProgression';

export const CharacterSheet = () => {
  const { id: characterId } = useParams<{ id: string }>();
  const user = useCurrentUser();
  const navigate = useNavigate();

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

  const skillSelections =
    character && progressionBuckets.length > 0
      ? getAcquiredSkillSelectionsUpToLevel(
          progressionBuckets,
          allSkills,
          character.class_id,
          character.race_id,
          character.level,
        )
      : [];
  const skillNameById = new Map(allSkills.map((skill) => [skill.id, skill.name]));
  const skillSummary = skillSelections.map((selection) => ({
    name: skillNameById.get(selection.skillId) ?? selection.skillId,
    tier: selection.tier,
    source: selection.source,
  }));
  const debugBuckets =
    typeof character?.progression === 'string'
      ? character.progression
      : JSON.stringify(character?.progression ?? {});
  const debugSummary = `buckets:${progressionBuckets.length} selections:${skillSelections.length}`;
  const debugMeta = `progressionType:${typeof character?.progression} keys:${Object.keys(character ?? {}).join(',')}`;

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
            derived={getBaseDerivedStats(
              getClassById(character.class_id as ClassId) as GameClass,
              character.attributes,
              character.level,
            )}
          />
          <div className="text-xs text-gray-500 mt-2">
            Debug skills: {debugSummary}
          </div>
          <div className="text-xs text-gray-500 mt-1">{debugMeta}</div>
          <pre className="text-xs text-gray-400 whitespace-pre-wrap mt-1">
            {debugBuckets}
          </pre>
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
