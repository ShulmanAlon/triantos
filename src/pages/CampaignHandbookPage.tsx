import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { TABLES } from '@/config/dbTables';
import { USER_ROLES } from '@/config/userRoles';
import { Button } from '@/components/ui/Button';

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
    <main className="max-w-6xl mx-auto p-4">
      <div className="card p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="chip">Campaign Handbook</p>
            <h1 className="text-2xl font-bold mt-2">
              {campaign.name} Handbook
            </h1>
            <p className="text-sm text-(--muted) mt-1">
              Rules, lore, and quick references for your campaign.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate(`/campaign/${campaignId}`)}
          >
            Back to Campaign
          </Button>
        </div>

        <div className="section-gap panel p-4 text-sm text-(--muted)">
          {/* TODO: Add rules content for the Player's Handbook. */}
          {/* TODO: Add spells for Cleric and Magic User (no logic needed). */}
          {/* TODO: Skill balancing. */}
          {/* TODO: Item balancing. */}
          {/* TODO: Class balancing. */}
          {/* TODO: Race balancing. */}
          {/* TODO: Add more skills. */}
          Coming soon...
        </div>
      </div>
    </main>
  );
}
