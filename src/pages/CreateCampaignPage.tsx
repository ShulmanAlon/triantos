import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useCurrentUser } from '../hooks/useCurrentUser';

export default function CreateCampaign() {
  const user = useCurrentUser();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim() || !user) return;

    setLoading(true);
    setError(null);

    const { data: campaign, error: insertError } = await supabase
      .from('campaigns')
      .insert({
        name,
        description,
        image_url: imageUrl,
        owner_id: user.id,
      })
      .select()
      .single();

    if (insertError || !campaign) {
      setError(insertError?.message || 'Failed to create campaign');
      setLoading(false);
      return;
    }

    const { error: memberError } = await supabase
      .from('campaign_members')
      .insert({
        user_id: user.id,
        campaign_id: campaign.id,
        role: 'dm',
      });

    if (memberError) {
      setError('Campaign created, but failed to register as DM.');
    }

    setLoading(false);
    navigate(`/campaign/${campaign.id}`);
  };

  return (
    <main className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Create New Campaign</h1>

      <label className="block">
        <span className="text-sm font-medium">Campaign Name</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mt-1 p-2 border rounded"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium">Description (optional)</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full mt-1 p-2 border rounded"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium">Image URL (optional)</span>
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full mt-1 p-2 border rounded"
        />
      </label>

      <div className="flex justify-between gap-4 pt-2">
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

      {error && <p className="text-red-600">{error}</p>}
    </main>
  );
}
