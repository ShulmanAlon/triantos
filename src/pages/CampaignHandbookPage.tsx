import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { TABLES } from '@/config/dbTables';
import { USER_ROLES } from '@/config/userRoles';

export default function CampaignHandbookPage() {
  const campaignId = useParams<{ id: string }>().id;
  const navigate = useNavigate();
  const user = useCurrentUser();

  type CampaignMember = { user_id: string };
  type CampaignData = {
    campaign_id: string;
    owner_id: string;
    members: CampaignMember[];
    name: string;
  };

  const [campaign, setCampaign] = useState<CampaignData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!campaignId || !user) return;

    const fetchCampaign = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from(TABLES.DASHBOARD_CAMPAIGNS)
        .select('campaign_id, owner_id, members, name')
        .eq('campaign_id', campaignId)
        .maybeSingle();

      if (error || !data) {
        alert('Failed to load campaign or unauthorized.');
        navigate('/dashboard');
        return;
      }

      const isMember = data.members.some((m: CampaignMember) => m.user_id === user.id);
      const isOwner = data.owner_id === user.id;
      const isAdmin = user.role === USER_ROLES.ADMIN;

      if (!isMember && !isOwner && !isAdmin) {
        alert('You do not have access to this handbook.');
        navigate('/dashboard');
        return;
      }

      setCampaign(data);
      setLoading(false);
    };

    fetchCampaign();
  }, [campaignId, user, navigate]);

  if (loading) return <p className="p-6">Loading handbook...</p>;
  if (!campaign) return <p className="p-6 text-red-600">Campaign not found.</p>;

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">📘 {campaign.name} Handbook</h1>
      <p className="text-gray-500 italic">Coming soon...</p>
      <button
        className="text-sm text-blue-600 underline"
        onClick={() => navigate(`/campaign/${campaignId}`)}
      >
        ← Back to Campaign
      </button>
    </main>
  );
}
