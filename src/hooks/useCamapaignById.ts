import { useEffect, useState } from 'react';
import { useCurrentUser } from './useCurrentUser';
import { TABLES } from '../config/dbTables';
import { supabase } from '../lib/supabaseClient';
import { CampaignInterface } from '../types/campaign';

export function useCampaignById(campaignId: string | undefined) {
  const user = useCurrentUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [campaign, setCampaign] = useState<CampaignInterface | null>(null);

  const fetchCampaign = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from(TABLES.DASHBOARD_CAMPAIGNS)
      .select('*')
      .eq('campaign_id', campaignId)
      .maybeSingle();

    if (error) {
      setError(error.message);
      setCampaign(null);
    } else {
      setCampaign(data);
    }
    setLoading(false);
  };

  const updateCampaign = async (updates: Partial<CampaignInterface>) => {
    if (!campaignId) return;

    const { error } = await supabase
      .from(TABLES.CAMPAIGNS)
      .update(updates)
      .eq('id', campaignId);

    if (!error) {
      await fetchCampaign();
    }
  };

  useEffect(() => {
    if (!campaignId || !user) return;
    fetchCampaign();
  }, [campaignId, user]);

  return {
    campaign,
    loading,
    error,
    refetchCampaign: fetchCampaign,
    updateCampaign,
  };
}
