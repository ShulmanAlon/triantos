import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { CampaignInterface } from '@/types/campaign';
import { useCurrentUser } from './useCurrentUser';
import { USER_ROLES } from '@/config/userRoles';

export function useUserCampaigns() {
  const [campaigns, setCampaigns] = useState<CampaignInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const user = useCurrentUser();

  useEffect(() => {
    if (!user) return;

    const fetchCampaigns = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.rpc('get_campaigns_for_viewer');

      if (error) {
        setError(error.message);
        setCampaigns([]);
      } else {
        const normalized = ((data as CampaignInterface[] | null) ?? []).map((c) => ({
          ...c,
          members: (c.members ?? []) as CampaignInterface['members'],
        }));
        const filtered = normalized.filter((c) => {
          const isOwner = c.owner_id === user.id;
          const isMember = c.members.some((m) => m.user_id === user.id);
          const isAdmin = user.role === USER_ROLES.ADMIN;
          const isDeleted = c.deleted;

          return (
            (isAdmin && !isDeleted) ||
            (isOwner && !isDeleted) ||
            (isMember && !isDeleted)
          );
        });

        setCampaigns(filtered);
      }

      setLoading(false);
    };

    fetchCampaigns();
  }, [user]);

  return { campaigns, loading, error };
}
