import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import ImageUrlModal from '@/components/ImageUrlModal';
import { TABLES } from '@/config/dbTables';
import { useToast } from '@/context/ToastContext';
import { CampaignImagePicker } from '@/pages/createCampaign/CampaignImagePicker';

export default function CreateCampaign() {
  const user = useCurrentUser();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const { toast } = useToast();

  const handleCreate = async () => {
    if (!name.trim() || !user) return;

    setLoading(true);
    setError(null);

    const { data: campaign, error: insertError } = await supabase
      .from(TABLES.CAMPAIGNS)
      .insert({
        name,
        description,
        image_url: imageUrl,
        owner_id: user.id,
      })
      .select()
      .single();

    if (insertError || !campaign) {
      const message = insertError?.message || 'Failed to create campaign';
      setError(message);
      toast.error(message);
      setLoading(false);
      return;
    }

    const { error: memberError } = await supabase
      .from(TABLES.CAMPAIGN_MEMBERS)
      .insert({
        user_id: user.id,
        campaign_id: campaign.id,
      });

    if (memberError) {
      const message = 'Campaign created, but failed to register as DM.';
      setError(message);
      toast.error(message);
    }

    setLoading(false);
    navigate(`/campaign/${campaign.id}`);
  };

  return (
    <main className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Create New Campaign</h1>
      <div className="section-gap">
        <CampaignImagePicker
          imageUrl={imageUrl}
          onEdit={() => setShowImageModal(true)}
        />
      </div>

      <label className="block section-gap">
        <span className="text-sm font-medium">Campaign Name</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mt-1 p-2 border rounded"
        />
      </label>

      <label className="block section-gap">
        <span className="text-sm font-medium">Description (optional)</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full mt-1 p-2 border rounded"
        />
      </label>

      <div className="section-gap flex justify-between gap-4 pt-2">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-gray-700 px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          onClick={handleCreate}
          disabled={!name.trim() || loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Campaign'}
        </button>
      </div>

      {/* { Modal for image URL input */}
      <ImageUrlModal
        isOpen={showImageModal}
        imageUrl={imageUrl || ''}
        setImageUrl={setImageUrl}
        onClose={() => setShowImageModal(false)}
        title="Set Campaign Image URL"
      />
      {error && <div className="sr-only">{error}</div>}
    </main>
  );
}
