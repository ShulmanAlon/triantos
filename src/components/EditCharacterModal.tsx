import { useState } from 'react';
import { Button } from './ui/Button';
import { CharacterPreview, CharacterWithCampaign } from '@/types/characters';

interface EditCharacterModalProps {
  open: boolean;
  character: CharacterWithCampaign;
  onClose: () => void;
  onSave?: (updated: Partial<CharacterPreview>) => void;
}

export default function EditCharacterModal({
  open,
  character,
  onClose,
  onSave,
}: EditCharacterModalProps) {
  const [name, setName] = useState(character.name);
  const [playerName, setPlayerName] = useState(character.player_name);
  const [imageUrl, setImageUrl] = useState(character.image_url);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full space-y-4">
        <h2 className="text-xl font-semibold">Edit Character</h2>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Character Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Player Name</label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="w-full border rounded px-2 py-1"
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
            onClick={() =>
              onSave?.({ name, player_name: playerName, image_url: imageUrl })
            }
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
