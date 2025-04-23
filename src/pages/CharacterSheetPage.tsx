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
  const [character, setCharacter] = useState<CharacterPreview | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

  const navigate = useNavigate();
  const user = useCurrentUser();
  const canEdit = user?.role === 'admin' || character?.user_id === user?.id;

  useEffect(() => {
    const fetchCharacter = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from('characters')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        setCharacter(data);
      }

      setLoading(false);
    };

    fetchCharacter();
  }, [id]);

  if (loading) return <p className="p-4">Loading...</p>;
  if (!character)
    return <p className="p-4 text-red-600">Character not found.</p>;
  return (
    <div>
      {canEdit && (
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
      <CharacterSheetView
        characterName={character.name}
        playerName={character.player_name}
        selectedClassId={character.class_id}
        selectedRaceId={character.race_id}
        level={character.level}
        attributes={character.attributes}
        onLevelUp={() => console.log('Level Up')}
        onLevelDown={() => console.log('Level Down')}
        derived={calculateDerivedStats(
          getClassById(character.class_id as ClassId) as GameClass,
          character.attributes,
          character.level
        )}
      />
      <EditCharacterModal
        open={showEditModal}
        character={character}
        onClose={() => setShowEditModal(false)}
        onSave={(updated) => setCharacter(updated)}
      />
    </div>
  );
};
