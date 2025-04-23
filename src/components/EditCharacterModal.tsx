import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Button } from './ui/Button';
import { CharacterPreview } from '../types/character';

interface EditCharacterModalProps {
  open: boolean;
  character: CharacterPreview;
  onClose: () => void;
  onSave?: (updated: CharacterPreview) => void;
}

export default function EditCharacterModal({
  open,
  character,
  onClose,
  onSave,
}: EditCharacterModalProps) {
  const [name, setName] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (character) {
      setName(character.name);
      setPlayerName(character.player_name);
      setImageUrl(character.image_url || '');
    }
  }, [character]);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('characters')
      .update({
        name: name.trim(),
        player_name: playerName.trim(),
        image_url: imageUrl.trim(),
      })
      .eq('id', character.id);

    setSaving(false);
    if (error) {
      alert('Failed to update character: ' + error.message);
      return;
    }

    const updatedCharacter = {
      ...character,
      name: name.trim(),
      player_name: playerName.trim(),
      image_url: imageUrl.trim(),
    };

    onSave?.(updatedCharacter);
    onClose();
  };

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
