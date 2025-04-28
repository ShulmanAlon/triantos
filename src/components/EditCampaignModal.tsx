import { useState } from 'react';
import { Button } from './ui/Button';
import { CampaignInterface } from '../types/campaign';

interface EditCampaignModalProps {
  open: boolean;
  campaign: CampaignInterface;
  onClose: () => void;
  onSave?: (updated: Partial<CampaignInterface>) => void;
}

export default function EditCampaignModal({
  open,
  campaign,
  onClose,
  onSave,
}: EditCampaignModalProps) {
  const [name, setName] = useState(campaign.name);
  const [description, setDescription] = useState(campaign.description);
  const [imageUrl, setImageUrl] = useState(campaign.image_url);

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
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => onSave?.({ name, description, image_url: imageUrl })}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
