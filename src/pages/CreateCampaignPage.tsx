import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import ImageUrlModal from '@/components/ImageUrlModal';
import { TABLES } from '@/config/dbTables';
import { useToast } from '@/context/ToastContext';
import { CampaignImagePicker } from '@/pages/createCampaign/CampaignImagePicker';
import { Button } from '@/components/ui/Button';

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

    setLoading(false);
    navigate(`/campaign/${campaign.id}`);
  };

  return (
    <main className="w-full">
      <div className="card p-5 w-full">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="chip">Create Campaign</p>
            <h1 className="text-2xl font-bold mt-2">Create New Campaign</h1>
            <p className="text-sm text-(--muted) mt-1">
              Set up a campaign to invite players and manage characters.
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>

        <div className="mt-4 panel p-4 grid gap-4 lg:grid-cols-[1.4fr_0.6fr] items-start">
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium">Campaign Name</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-1 p-2 border border-black/10 rounded-lg"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium">Description (optional)</span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full mt-1 p-2 border border-black/10 rounded-lg"
                rows={4}
              />
            </label>
          </div>
          <div className="flex justify-end">
            <CampaignImagePicker
              imageUrl={imageUrl}
              onEdit={() => setShowImageModal(true)}
            />
          </div>
        </div>

        <div className="mt-4 flex justify-between gap-4">
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!name.trim() || loading}>
            {loading ? 'Creating...' : 'Create Campaign'}
          </Button>
        </div>
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
