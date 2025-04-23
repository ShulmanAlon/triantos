import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Button } from './ui/Button';
import { CampaignData } from '../types/campaign';

interface EditCampaignModalProps {
  open: boolean;
  campaign: CampaignData;
  onClose: () => void;
  onSave?: (updated: CampaignData) => void;
}

export default function EditCampaignModal({
  open,
  campaign,
  onClose,
  onSave,
}: EditCampaignModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (campaign) {
      setName(campaign.name);
      setDescription(campaign.description || '');
      setImageUrl(campaign.image_url || '');
    }
  }, [campaign]);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('campaigns')
      .update({
        name: name.trim(),
        description: description.trim(),
        image_url: imageUrl.trim(),
      })
      .eq('id', campaign.id);

    setSaving(false);
    if (error) {
      alert('Failed to update campaign: ' + error.message);
      return;
    }

    const updatedCampaign = {
      ...campaign,
      name: name.trim(),
      description: description.trim(),
      image_url: imageUrl.trim(),
    };

    onSave?.(updatedCampaign);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full space-y-4">
        <h2 className="text-xl font-semibold">Edit Campaign</h2>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded px-2 py-1"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Image URL</label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full border rounded px-2 py-1"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving || !name.trim()}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}
