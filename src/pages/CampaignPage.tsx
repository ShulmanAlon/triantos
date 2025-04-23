import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { Button } from '../components/ui/Button';
import { ImageWithPlaceholder } from '../components/ImageWithPlaceholder';
import {
  getCampaignBlurImage,
  getCampaignImage,
  getCharacterBlurImage,
  getCharacterImage,
} from '../utils/imageUtils';
import { ClassId } from '../types/gameClass';
import EditCampaignModal from '../components/EditCampaignModal';
import { CampaignInterface } from '../types/campaign';

type RawCharacter = Omit<CharacterPreview, 'owner_username'> & {
  users: { username: string }[] | { username: string } | null;
};

interface CharacterPreview {
  id: string;
  name: string;
  player_name: string;
  image_url?: string;
  class_id: string;
  race_id: string;
  level: number;
  visible: boolean;
  owner_username: string;
}

export default function CampaignPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<CampaignInterface | null>(null);
  const [characters, setCharacters] = useState<CharacterPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

  const user = useCurrentUser();
  const canEdit =
    user?.role === 'admin' ||
    (campaign && campaign.members.some((m) => m.user_id === campaign.owner_id));

  useEffect(() => {
    if (!id || !user) return;

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
          'id, name, player_name, image_url, class_id, race_id, level, visible, users(username)'
        )
        .eq('campaign_id', id);

      const flattenedCampaign = (characterData as RawCharacter[] | null)?.map(
        (char) => ({
          ...char,
          owner_username: Array.isArray(char.users)
            ? char.users[0]?.username ?? 'unknown'
            : char.users?.username ?? 'unknown',
        })
      );
      setCampaign(campaignData);
      setCharacters(flattenedCampaign || []);
      setLoading(false);
    };

    fetchData();
  }, [id]);

  if (loading) return <p className="p-6">Loading campaign...</p>;
  if (!campaign) return <p className="p-6 text-red-600">Campaign not found.</p>;

  return (
    <main className="p-6 space-y-6">
      {canEdit && (
        <Button variant="outline" onClick={() => setShowEditModal(true)}>
          ✏️ Edit Campaign
        </Button>
      )}
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
      <div className="relative cursor-pointer w-40 h-40 border rounded overflow-hidden shadow-sm bg-gray-100 group">
        <ImageWithPlaceholder
          src={getCampaignImage(campaign.image_url)}
          blurSrc={getCampaignBlurImage()}
          alt="Campaign preview"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="space-y-1 pt-2 text-gray-600">
        <p>
          <span className="font-medium">DM:</span>{' '}
          {campaign.owner_username ?? 'Unknown'}
        </p>
        <p>
          <span className="font-medium">Members:</span>{' '}
          {campaign.members
            .filter((m) => m.user_id !== campaign.owner_id)
            .map((m) => m.username)
            .join(', ') || 'None'}
        </p>
      </div>
      <div className="flex justify-between items-center pt-4">
        <h2 className="text-2xl font-semibold">Characters</h2>
        <Button
          variant="outline"
          onClick={() =>
            navigate(`/campaign/${campaign.campaign_id}/create-character`)
          }
        >
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
            <ImageWithPlaceholder
              src={getCharacterImage(char.image_url, char.class_id as ClassId)}
              blurSrc={getCharacterBlurImage(char.class_id as ClassId)}
              alt={char.name}
            />
            <p className="text-xs italic text-gray-500">
              Owner: {char.owner_username}
            </p>
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
      {canEdit && (
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
              .eq('id', campaign.campaign_id);

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

      {/* { Modal for campaign edit */}
      <EditCampaignModal
        open={showEditModal}
        campaign={campaign}
        onClose={() => setShowEditModal(false)}
        onSave={(updated) => setCampaign(updated)}
      />
    </main>
  );
}
