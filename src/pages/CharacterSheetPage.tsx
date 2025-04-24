import { useEffect, useState } from 'react';
import { CharacterSheetView } from '../components/CharacterSheet/CharacterSheetView';
import { ClassId, GameClass } from '../types/gameClass';
import { getClassById } from '../utils/classUtils';
import { calculateDerivedStats } from '../utils/derivedStats';
import { Button } from '../components/ui/Button';
import EditCharacterModal from '../components/EditCharacterModal';
import { useNavigate, useParams } from 'react-router-dom';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { supabase } from '../lib/supabaseClient';
import { CharacterPreview } from '../types/character';

export const CharacterSheet = () => {
  const { id } = useParams<{ id: string }>();
  const user = useCurrentUser();
  const navigate = useNavigate();

  const [character, setCharacter] = useState<CharacterPreview | null>(null);
  const [campaignOwnerId, setCampaignOwnerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const canEditCharacter =
    character !== null &&
    user !== null &&
    (character.user_id === user.id ||
      campaignOwnerId === user.id ||
      user.role === 'admin');

  const handleToggleVisibility = async () => {
    if (!character) return;

    const { error } = await supabase
      .from('characters')
      .update({ visible: !character.visible })
      .eq('id', character.id);

    if (error) {
      alert('Failed to update visibility: ' + error.message);
    } else {
      setCharacter({ ...character, visible: !character.visible });
    }
  };

  useEffect(() => {
    const fetchCharacter = async () => {
      if (!id) return;

      const { data: characterData, error: characterError } = await supabase
        .from('characters')
        .select('*')
        .eq('id', id)
        .single();

      if (!characterError && characterData) {
        setCharacter(characterData);
      }

      const { data: campaignData, error: campaignError } = await supabase
        .from('campaigns')
        .select('owner_id')
        .eq('id', characterData?.campaign_id)
        .maybeSingle();

      if (!campaignError && campaignData) {
        setCampaignOwnerId(campaignData.owner_id ?? null);
      }

      setLoading(false);
    };

    fetchCharacter();
  }, [id]);

  const handleDelete = async () => {
    if (!character) return;

    const { error } = await supabase
      .from('characters')
      .update({ deleted: true })
      .eq('id', character.id);

    if (error) {
      alert('Failed to delete character: ' + error.message);
    } else {
      setShowDeleteModal(false);
      navigate(`/campaign/${character.campaign_id}`);
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;
  if (!character)
    return <p className="p-4 text-red-600">Character not found.</p>;
  return (
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
          onClick={handleToggleVisibility}
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
        derived={calculateDerivedStats(
          getClassById(character.class_id as ClassId) as GameClass,
          character.attributes,
          character.level
        )}
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
        onSave={(updated) => setCharacter(updated)}
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
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
