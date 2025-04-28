import { useEffect, useState } from 'react';
import { useCurrentUser } from './useCurrentUser';
import { TABLES } from '../config/dbTables';
import { supabase } from '../lib/supabaseClient';
import { CharacterPreview, RawCharacter } from '../types/character';

export function useCharactersByCampaignId(campaignId: string | undefined) {
  const user = useCurrentUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [characters, setCharacters] = useState<CharacterPreview[]>([]);

  useEffect(() => {
    if (!campaignId || !user) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from(TABLES.CHARACTERS)
        .select(
          'id, name, player_name, image_url, class_id, race_id, level, visible, users(username)'
        )
        .eq('campaign_id', campaignId)
        .eq('deleted', false);

      const flattenedCharacters = (data as RawCharacter[] | null)?.map(
        (char) => ({
          ...char,
          owner_username: Array.isArray(char.users)
            ? char.users[0]?.username ?? 'unknown'
            : char.users?.username ?? 'unknown',
        })
      );

      if (error) {
        console.error('Error fetching characters:', error);
        setError(error.message);
        setCharacters([]);
      } else {
        setCharacters(flattenedCharacters || []);
      }
      setLoading(false);
    };

    fetchData();
  }, [campaignId, user]);

  return { characters, loading, error };
}
