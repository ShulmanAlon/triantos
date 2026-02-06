import { ChangeEvent } from 'react';
import { Button } from './ui/Button';

type Props = {
  isOpen: boolean;
  imageUrl: string;
  setImageUrl: (url: string) => void;
  onClose: () => void;
  title?: string;
};

export default function ImageUrlModal({
  isOpen,
  imageUrl,
  setImageUrl,
  onClose,
  title = 'Set Image URL',
}: Props) {
  if (!isOpen) return null;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setImageUrl(event.target.value);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow max-w-sm w-full space-y-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <input
          value={imageUrl}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
          className="w-full border rounded p-2"
        />
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onClose}>Save</Button>
        </div>
      </div>
    </div>
  );
}
