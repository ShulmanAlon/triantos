import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { CampaignInterface } from '../types/campaign';
import { useCurrentUser } from './useCurrentUser';

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
        .from('dashboard_campaigns')
        .select('*');

      if (error) {
        setError(error.message);
        setCampaigns([]);
      } else {
        console.log(data);
        const filtered = (data as CampaignInterface[]).filter((c) => {
          const isOwner = c.owner_id === user.id;
          const isMember = c.members.some((m) => m.user_id === user.id);
          const isAdmin = user.role === 'admin';
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
