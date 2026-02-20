import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabaseClient';
import { TABLES } from '@/config/dbTables';
import { useToast } from '@/context/ToastContext';
import { useCurrentUser } from '@/hooks/useCurrentUser';

type CampaignMemberRow = {
  user_id: string;
  status: 'active' | 'invited' | 'left';
  joined_at: string | null;
  users: { username: string }[] | null;
};

type Props = {
  campaignId: string;
  ownerId: string;
  memberUsernames?: Record<string, string>;
  onChanged?: () => Promise<void> | void;
};

export function CampaignMembersManager({
  campaignId,
  ownerId,
  memberUsernames = {},
  onChanged,
}: Props) {
  const { toast } = useToast();
  const currentUser = useCurrentUser();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [inviteCode, setInviteCode] = useState<string>('');
  const [members, setMembers] = useState<CampaignMemberRow[]>([]);

  const fetchData = async () => {
    setLoading(true);

    const [campaignRes, membersRes] = await Promise.all([
      supabase
        .from(TABLES.CAMPAIGNS)
        .select('invite_code')
        .eq('id', campaignId)
        .single(),
      supabase
        .from(TABLES.CAMPAIGN_MEMBERS)
        .select('user_id, status, joined_at, users(username)')
        .eq('campaign_id', campaignId)
        .order('joined_at', { ascending: true }),
    ]);

    if (campaignRes.error) {
      toast.error(campaignRes.error.message);
    } else {
      setInviteCode(campaignRes.data?.invite_code ?? '');
    }

    if (membersRes.error) {
      toast.error(membersRes.error.message);
      setMembers([]);
    } else {
      setMembers(((membersRes.data as unknown as CampaignMemberRow[]) ?? []));
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [campaignId]);

  const regenerateInviteCode = async () => {
    setSaving(true);
    const { data, error } = await supabase.rpc('regenerate_campaign_invite_code', {
      p_campaign_id: campaignId,
    });

    if (error || !data) {
      toast.error(error?.message ?? 'Failed to regenerate invite code.');
      setSaving(false);
      return;
    }

    setInviteCode(data as string);
    toast.info('Invite code regenerated.');
    setSaving(false);
  };

  const makeDm = async (userId: string) => {
    setSaving(true);
    const { error } = await supabase.rpc('transfer_campaign_owner', {
      p_campaign_id: campaignId,
      p_new_owner_user_id: userId,
    });

    if (error) {
      toast.error(error.message);
      setSaving(false);
      return;
    }

    await fetchData();
    if (onChanged) await onChanged();
    toast.info('DM updated.');
    setSaving(false);
  };

  const removeMember = async (userId: string) => {
    setSaving(true);
    const { error } = await supabase.rpc('remove_campaign_member', {
      p_campaign_id: campaignId,
      p_member_user_id: userId,
    });

    if (error) {
      toast.error(error.message);
      setSaving(false);
      return;
    }

    await fetchData();
    if (onChanged) await onChanged();
    toast.info('Member removed.');
    setSaving(false);
  };

  return (
    <section className="card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Members</h2>
          <p className="text-sm text-(--muted)">DM is the campaign owner. Transfer ownership to change DM.</p>
        </div>
        <Button variant="outline" onClick={regenerateInviteCode} disabled={saving}>
          Regenerate Invite Code
        </Button>
      </div>

      <div className="panel p-3 mt-3">
        <p className="text-xs text-(--muted)">Invite Code</p>
        <p className="font-mono text-lg tracking-wide mt-1">{inviteCode || '—'}</p>
      </div>

      {loading ? (
        <p className="text-sm text-(--muted) mt-4">Loading members...</p>
      ) : members.length === 0 ? (
        <p className="text-sm text-(--muted) mt-4">No members yet.</p>
      ) : (
        <div className="mt-4 space-y-2">
          {members.map((member) => {
            const isOwner = member.user_id === ownerId;
            const isSelf = member.user_id === currentUser?.id;
            const canModify = !isOwner;

            return (
              <div
                key={member.user_id}
                className="panel p-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-medium">
                    {memberUsernames[member.user_id] ??
                      member.users?.[0]?.username ??
                      'Unknown user'}
                  </p>
                  <p className="text-xs text-(--muted)">id: {member.user_id}</p>
                  <p className="text-xs text-(--muted)">
                    role: {isOwner ? 'dm' : 'player'} · status: {member.status}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    disabled={saving || !canModify}
                    onClick={() => makeDm(member.user_id)}
                  >
                    Make DM
                  </Button>
                  <Button
                    variant="destructive"
                    disabled={saving || !canModify || isSelf}
                    onClick={() => removeMember(member.user_id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
