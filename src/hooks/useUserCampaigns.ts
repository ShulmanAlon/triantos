import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { CampaignInterface } from '../types/campaign';
import { useCurrentUser } from './useCurrentUser';
import { TABLES } from '../config/dbTables';
import { USER_ROLES } from '../config/userRoles';

export function useUserCampaigns() {
  const [campaigns, setCampaigns] = useState<CampaignInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const user = useCurrentUser();

  useEffect(() => {
    if (!user) return;

    const fetchCampaigns = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from(TABLES.DASHBOARD_CAMPAIGNS)
        .select('*');

      if (error) {
        setError(error.message);
        setCampaigns([]);
      } else {
        const filtered = (data as CampaignInterface[]).filter((c) => {
          const isOwner = c.owner_id === user.id;
          const isMember = c.members.some((m) => m.user_id === user.id);
          const isAdmin = user.role === USER_ROLES.ADMIN;
          const isDeleted = c.deleted;

          return isAdmin || isOwner || (isMember && !isDeleted);
        });

        setCampaigns(filtered);
      }

      setLoading(false);
    };

    fetchCampaigns();
  }, [user]);

  return { campaigns, loading, error };
}
