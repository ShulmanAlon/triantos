import { ImageWithPlaceholder } from '@/components/ImageWithPlaceholder';
import { getCharacterBlurImage, getCharacterImage } from '@/utils/imageUtils';
import { ClassId } from '@/types/gameClass';

type CharacterImagePickerProps = {
  imageUrl: string | null;
  classId?: ClassId;
  characterName: string;
  onEdit: () => void;
};

export const CharacterImagePicker = ({
  imageUrl,
  classId,
  characterName,
  onEdit,
}: CharacterImagePickerProps) => (
  <div className="w-40 shrink-0">
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-sm font-medium">Character Image</h3>
      <span className="text-xs text-(--muted)">Optional</span>
    </div>
    <div
      onClick={onEdit}
      className="relative cursor-pointer w-40 h-40 border rounded-xl overflow-hidden shadow-sm bg-white/80 group"
    >
      {imageUrl || classId ? (
        <>
          <ImageWithPlaceholder
            src={getCharacterImage(imageUrl ?? '', classId)}
            blurSrc={getCharacterBlurImage(classId)}
            alt={characterName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-60 transition-opacity flex items-center justify-center">
            <span className="text-white text-sm font-medium">Edit</span>
          </div>
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-sm text-(--muted)">
          + Add Image
        </div>
      )}
    </div>
  </div>
);
