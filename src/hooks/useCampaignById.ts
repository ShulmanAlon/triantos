import { useCallback, useEffect, useState } from 'react';
import { useCurrentUser } from './useCurrentUser';
import { TABLES } from '@/config/dbTables';
import { supabase } from '@/lib/supabaseClient';
import { CampaignInterface } from '@/types/campaign';
import { UpdateResult } from '@/types/api';

export function useCampaignById(campaignId: string | undefined) {
  const user = useCurrentUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [campaign, setCampaign] = useState<CampaignInterface | null>(null);

  const fetchCampaign = useCallback(async () => {
    setLoading(true);
    setError(null);

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
  }, [campaignId]);

  const updateCampaign = async (
    updates: Partial<CampaignInterface>
  ): Promise<UpdateResult> => {
    if (!campaignId) {
      return { error: new Error('Missing campaign id') };
    }

    const { error } = await supabase
      .from(TABLES.CAMPAIGNS)
      .update(updates)
      .eq('id', campaignId);

    if (error) {
      setError(error.message);
      return { error };
    }

    await fetchCampaign();
    setError(null);
    return { error: null };
  };

  useEffect(() => {
    if (!campaignId) {
      setLoading(false);
      setCampaign(null);
      return;
    }
    if (!user) {
      setLoading(true);
      return;
    }
    fetchCampaign();
  }, [campaignId, user, fetchCampaign]);

  return {
    campaign,
    loading,
    error,
    refetch: fetchCampaign,
    updateCampaign,
  };
}
