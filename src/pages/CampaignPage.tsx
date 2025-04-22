import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { Button } from '../components/ui/Button';

interface CharacterPreview {
  id: string;
  name: string;
  player_name: string;
  image_url?: string;
  class_id: string;
  race_id: string;
  level: number;
  visible: boolean;
}

interface CampaignData {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  members: {
    username: string;
    role: 'player' | 'dm' | 'admin';
  }[];
}

export default function CampaignPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<CampaignData | null>(null);
  const [characters, setCharacters] = useState<CharacterPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useCurrentUser();
  const canDelete =
    user?.role === 'admin' ||
    (campaign &&
      campaign.members.some(
        (m) => m.role === 'dm' && m.username === user?.username
      ));

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);

      const { data: campaignData } = await supabase
        .from('dashboard_campaigns')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      const { data: characterData } = await supabase
        .from('characters')
        .select(
          'id, name, player_name, image_url, class_id, race_id, level, visible'
        )
        .eq('campaign_id', id);

      setCampaign(campaignData);
      setCharacters(characterData || []);
      setLoading(false);
    };

    fetchData();
  }, [id]);

  if (loading) return <p className="p-6">Loading campaign...</p>;
  if (!campaign) return <p className="p-6 text-red-600">Campaign not found.</p>;

  return (
    <main className="p-6 space-y-6">
      <div className="flex gap-2">
        <h1 className="text-3xl font-bold">{campaign.name}</h1>
        <Button variant="primary" onClick={() => navigate('/handbook')}>
          Player’s Handbook
        </Button>
        <Button variant="outline" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </Button>
      </div>

      <p className="text-gray-700">{campaign.description}</p>

      {campaign.image_url && (
        <img
          src={campaign.image_url}
          alt="Campaign"
          className="w-full max-w-3xl rounded shadow"
        />
      )}
      <div className="space-y-1 pt-2 text-gray-600">
        <p>
          <span className="font-medium">DM:</span>{' '}
          {campaign.members.find((m) => m.role === 'dm')?.username ?? 'Unknown'}
        </p>
        <p>
          <span className="font-medium">Players:</span>{' '}
          {campaign.members
            .filter((m) => m.role === 'player')
            .map((m) => m.username)
            .join(', ') || 'None'}
        </p>
      </div>

      <div className="flex justify-between items-center pt-4">
        <h2 className="text-2xl font-semibold">Characters</h2>
        <Button variant="outline" onClick={() => navigate('/create-character')}>
          + New Character
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {characters.map((char) => (
          <div
            key={char.id}
            onClick={() => navigate(`/character/${char.id}`)}
            className="cursor-pointer p-4 border rounded hover:bg-gray-50 transition relative"
          >
            <img
              src={char.image_url || '/placeholder.png'}
              alt={char.name}
              className="w-full h-40 object-cover rounded mb-2"
            />
            <h3 className="text-lg font-bold">{char.name}</h3>
            <p className="text-sm text-gray-600">{char.player_name}</p>
            <p className="text-sm text-gray-500">
              {char.class_id} • {char.race_id} • Level {char.level}
            </p>
            {!char.visible && (
              <div className="absolute top-2 right-2 text-gray-500">👁️‍🗨️</div>
            )}
          </div>
        ))}
      </div>
      {canDelete && (
        <Button
          variant="destructive"
          onClick={async () => {
            const confirmed = window.confirm(
              'Are you sure you want to delete this campaign?'
            );
            if (!confirmed) return;

            const { error } = await supabase
              .from('campaigns')
              .update({ deleted: true })
              .eq('id', campaign.id);

            if (error) {
              alert('Failed to delete campaign: ' + error.message);
            } else {
              navigate('/dashboard');
            }
          }}
        >
          Delete Campaign
        </Button>
      )}
    </main>
  );
}
