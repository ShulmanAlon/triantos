import { useCallback, useEffect, useState } from 'react';
import { useCurrentUser } from './useCurrentUser';
import { TABLES } from '@/config/dbTables';
import { supabase } from '@/lib/supabaseClient';
import { CharacterPreview, RawCharacter } from '@/types/characters';
import { parseJsonField } from '@/utils/json';

export function useCharactersByCampaignId(campaignId: string | undefined) {
  const user = useCurrentUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [characters, setCharacters] = useState<CharacterPreview[]>([]);

  const fetchData = useCallback(async () => {
    if (!campaignId) return;
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from(TABLES.CHARACTERS)
      .select(
        'id, name, player_name, image_url, class_id, race_id, level, visible, created_at, progression, equipment_loadouts, user_id, users(username)'
      )
      .eq('campaign_id', campaignId)
      .eq('deleted', false);

    const flattenedCharacters = (data as RawCharacter[] | null)?.map((char) => ({
      ...char,
      owner_username: Array.isArray(char.users)
        ? char.users[0]?.username ?? 'unknown'
        : char.users?.username ?? 'unknown',
      progression: parseJsonField(char.progression),
      equipment_loadouts: parseJsonField(char.equipment_loadouts),
    }));

    if (error) {
      console.error('Error fetching characters:', error);
      setError(error.message);
      setCharacters([]);
    } else {
      setCharacters(flattenedCharacters || []);
    }
    setLoading(false);
  }, [campaignId]);

  useEffect(() => {
    if (!campaignId) {
      setLoading(false);
      setCharacters([]);
      return;
    }
    if (!user) {
      setLoading(true);
      return;
    }
    fetchData();
  }, [campaignId, user, fetchData]);

  return { characters, loading, error, refetch: fetchData };
}
