import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export interface CampaignSummary {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  created_at: string;
  members: {
    username: string;
    role: 'player' | 'dm' | 'admin';
  }[];
}

export function useUserCampaigns() {
  const [campaigns, setCampaigns] = useState<CampaignSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('dashboard_campaigns')
        .select('*');

      if (error) {
        setError(error.message);
        setCampaigns([]);
      } else {
        setCampaigns(data);
      }

      setLoading(false);
    };

    fetchCampaigns();
  }, []);

  return { campaigns, loading, error };
}
