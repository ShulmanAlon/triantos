import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/context/ToastContext';

export default function JoinCampaignPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoin = async (e: FormEvent) => {
    e.preventDefault();
    const normalizedCode = inviteCode.trim().toUpperCase();
    if (!normalizedCode) return;

    setLoading(true);

    const { data, error } = await supabase.rpc('join_campaign_by_code', {
      p_invite_code: normalizedCode,
    });

    if (error || !data) {
      toast.error(error?.message ?? 'Failed to join campaign.');
      setLoading(false);
      return;
    }

    toast.info('Joined campaign successfully.');
    navigate(`/campaign/${data}`);
    setLoading(false);
  };

  return (
    <main className="space-y-6 pt-2">
      <div className="card p-5 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold">Join Campaign</h1>
        <p className="text-sm text-(--muted) mt-1">
          Enter an invite code from your DM.
        </p>

        <form onSubmit={handleJoin} className="mt-4 space-y-4">
          <label className="block">
            <span className="text-sm font-medium">Invite Code</span>
            <input
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              className="w-full mt-1 p-2 border border-black/10 rounded-lg uppercase"
              placeholder="e.g. A1B2C3D4E5"
              autoCapitalize="characters"
            />
          </label>

          <div className="flex justify-between gap-3">
            <Button
              variant="outline"
              type="button"
              onClick={() => navigate('/dashboard')}
            >
              Back to Dashboard
            </Button>
            <Button type="submit" disabled={!inviteCode.trim() || loading}>
              {loading ? 'Joining...' : 'Join Campaign'}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
