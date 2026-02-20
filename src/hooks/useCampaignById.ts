import { useCallback, useEffect, useState } from 'react';
import { useCurrentUser } from './useCurrentUser';
import { TABLES } from '@/config/dbTables';
import { supabase } from '@/lib/supabaseClient';
import { CampaignInterface } from '@/types/campaign';
import { UpdateResult } from '@/types/api';
import { User } from '@/types/users';

type CampaignBaseRow = {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  owner_id: string;
  deleted: boolean;
};

type MemberRow = {
  user_id: string;
  users: { username: string }[] | { username: string } | null;
};

type CampaignRpcRow = {
  campaign_id: string;
  name: string;
  description: string;
  image_url?: string;
  owner_id: string;
  owner_username: string;
  members: { user_id: string; username: string }[] | null;
  deleted: boolean;
};

export function useCampaignById(campaignId: string | undefined) {
  const user = useCurrentUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [campaign, setCampaign] = useState<CampaignInterface | null>(null);

  const fetchViaRpc = useCallback(async () => {
    const { data: rpcData, error: rpcError } = await supabase.rpc(
      'get_campaign_for_viewer',
      { p_campaign_id: campaignId }
    );

    if (rpcError || !rpcData || !Array.isArray(rpcData) || rpcData.length === 0) {
      setError(rpcError?.message ?? null);
      setCampaign(null);
      setLoading(false);
      return;
    }

    const row = rpcData[0] as CampaignRpcRow;
    const rpcCampaign: CampaignInterface = {
      campaign_id: row.campaign_id,
      name: row.name,
      description: row.description,
      image_url: row.image_url,
      owner_id: row.owner_id,
      owner_username: row.owner_username,
      members: row.members ?? [],
      deleted: row.deleted,
    };

    setCampaign(rpcCampaign);
    setError(null);
    setLoading(false);
  }, [campaignId]);

  const fetchCampaign = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data: rpcData, error: rpcError } = await supabase.rpc(
      'get_campaign_for_viewer',
      { p_campaign_id: campaignId }
    );

    if (!rpcError && rpcData && Array.isArray(rpcData) && rpcData.length > 0) {
      const row = rpcData[0] as CampaignRpcRow;
      setCampaign({
        campaign_id: row.campaign_id,
        name: row.name,
        description: row.description,
        image_url: row.image_url,
        owner_id: row.owner_id,
        owner_username: row.owner_username,
        members: row.members ?? [],
        deleted: row.deleted,
      });
      setError(null);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from(TABLES.DASHBOARD_CAMPAIGNS)
      .select('*')
      .eq('campaign_id', campaignId)
      .maybeSingle();

    if (error) {
      setError(error.message);
      setCampaign(null);
      setLoading(false);
      return;
    }

    if (data) {
      setCampaign(data);
      setLoading(false);
      return;
    }

    const { data: baseData, error: baseError } = await supabase
      .from(TABLES.CAMPAIGNS)
      .select('id, name, description, image_url, owner_id, deleted')
      .eq('id', campaignId)
      .maybeSingle();

    if (baseError || !baseData) {
      await fetchViaRpc();
      return;
    }

    const base = baseData as CampaignBaseRow;

    const [ownerRes, membersRes] = await Promise.all([
      supabase
        .from(TABLES.USERS)
        .select('username')
        .eq('id', base.owner_id)
        .maybeSingle(),
      supabase
        .from(TABLES.CAMPAIGN_MEMBERS)
        .select('user_id, users(username)')
        .eq('campaign_id', base.id),
    ]);

    if (ownerRes.error) {
      setError(ownerRes.error.message);
      setCampaign(null);
      setLoading(false);
      return;
    }

    if (membersRes.error) {
      setError(membersRes.error.message);
      setCampaign(null);
      setLoading(false);
      return;
    }

    const ownerUsername = (ownerRes.data as Pick<User, 'username'> | null)?.username ?? 'Unknown';
    const members = ((membersRes.data as MemberRow[]) ?? []).map((member) => ({
      user_id: member.user_id,
      username: Array.isArray(member.users)
        ? member.users[0]?.username ?? 'unknown'
        : member.users?.username ?? 'unknown',
    }));

    const fallbackCampaign: CampaignInterface = {
      campaign_id: base.id,
      name: base.name,
      description: base.description,
      image_url: base.image_url,
      owner_id: base.owner_id,
      owner_username: ownerUsername,
      members,
      deleted: base.deleted,
    };

    setCampaign(fallbackCampaign);
    setError(null);
    setLoading(false);
  }, [campaignId, fetchViaRpc]);

  const updateCampaign = async (
    updates: Partial<CampaignInterface>
  ): Promise<UpdateResult> => {
    if (!campaignId) {
      return { error: new Error('Missing campaign id') };
    } else {
      if (typeof updates.deleted === 'boolean') {
        const { error } = await supabase.rpc('set_campaign_deleted', {
          p_campaign_id: campaignId,
          p_deleted: updates.deleted,
        });

        if (error) {
          setError(error.message);
          return { error };
        }

        await fetchCampaign();
        setError(null);
        return { error: null };
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
    }
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
