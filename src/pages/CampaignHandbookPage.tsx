import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useCurrentUser } from '../hooks/useCurrentUser';

export default function CampaignHandbookPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useCurrentUser();

  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || !user) return;

    const fetchCampaign = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from('dashboard_campaigns')
        .select('campaign_id, owner_id, members')
        .eq('campaign_id', id)
        .maybeSingle();

      if (error || !data) {
        alert('Failed to load campaign or unauthorized.');
        navigate('/dashboard');
        return;
      }

      const isMember = data.members.some((m: any) => m.user_id === user.id);
      const isOwner = data.owner_id === user.id;
      const isAdmin = user.role === 'admin';

      if (!isMember && !isOwner && !isAdmin) {
        alert('You do not have access to this handbook.');
        navigate('/dashboard');
        return;
      }

      setCampaign(data);
      setLoading(false);
    };

    fetchCampaign();
  }, [id, user, navigate]);

  if (loading) return <p className="p-6">Loading handbook...</p>;
  if (!campaign) return <p className="p-6 text-red-600">Campaign not found.</p>;

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">📘 {campaign.name} Handbook</h1>
      <p className="text-gray-500 italic">Coming soon...</p>
      <button
        className="text-sm text-blue-600 underline"
        onClick={() => navigate(`/campaign/${id}`)}
      >
        ← Back to Campaign
      </button>
    </main>
  );
}
