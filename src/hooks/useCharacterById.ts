import { useState, useEffect, useCallback } from 'react';
import { useCurrentUser } from './useCurrentUser';
import { TABLES } from '@/config/dbTables';
import { supabase } from '@/lib/supabaseClient';
import {
  CharacterWithCampaign,
  RawCharacterWithCampaign,
} from '@/types/character';

export function useCharacterById(characterId: string | undefined) {
  const user = useCurrentUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [character, setCharacter] = useState<CharacterWithCampaign | null>(
    null
  );

  const fetchCharacter = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from(TABLES.CHARACTERS)
      .select(
        `
          id, name, player_name, image_url, class_id, race_id, level, visible, deleted, attributes, user_id, campaign_id,
          users ( username ),
          campaigns ( owner_id )
        `
      )
      .eq('id', characterId)
      .maybeSingle<RawCharacterWithCampaign>();

    if (error) {
      console.error('Error fetching character:', error.message);
      setError(error.message);
      setCharacter(null);
    } else if (data) {
      if (data) {
        const {
          id,
          name,
          player_name,
          image_url,
          class_id,
          race_id,
          level,
          visible,
          deleted,
          attributes,
          user_id,
          campaign_id,
          users,
          campaigns,
        } = data;

        const flattenedCharacter: CharacterWithCampaign = {
          id,
          name,
          player_name,
          image_url: image_url || '',
          class_id,
          race_id,
          level,
          visible,
          deleted,
          attributes,
          user_id,
          campaign_id,
          owner_username: users
            ? (Array.isArray(users) ? users[0]?.username : users.username) ??
              'unknown'
            : 'unknown',
          campaign_owner_id: campaigns
            ? (Array.isArray(campaigns)
                ? campaigns[0]?.owner_id
                : campaigns?.owner_id) ?? 'unknown'
            : 'unknown',
        };

        setCharacter(flattenedCharacter);
      }
    }

    setLoading(false);
  }, [characterId]);

  const updateCharacter = async (updates: Partial<CharacterWithCampaign>) => {
    if (!characterId) return;

    const { error } = await supabase
      .from(TABLES.CHARACTERS)
      .update(updates)
      .eq('id', characterId);

    if (!error) {
      await fetchCharacter();
    }
  };

  useEffect(() => {
    if (!characterId || !user) return;
    fetchCharacter();
  }, [characterId, user, fetchCharacter]);

  return { character, loading, error, updateCharacter };
}
