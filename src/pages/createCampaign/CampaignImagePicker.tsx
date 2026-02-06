import { ImageWithPlaceholder } from '@/components/ImageWithPlaceholder';
import { getCampaignBlurImage, getCampaignImage } from '@/utils/imageUtils';

type CampaignImagePickerProps = {
  imageUrl: string;
  onEdit: () => void;
};

export const CampaignImagePicker = ({
  imageUrl,
  onEdit,
}: CampaignImagePickerProps) => (
  <div
    onClick={onEdit}
    className="relative cursor-pointer w-40 h-40 border rounded overflow-hidden shadow-sm bg-gray-100 group"
  >
    {imageUrl ? (
      <>
        <ImageWithPlaceholder
          src={getCampaignImage(imageUrl)}
          blurSrc={getCampaignBlurImage()}
          alt="Campaign preview"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-60 transition-opacity flex items-center justify-center">
          <span className="text-white text-sm font-medium">Edit</span>
        </div>
      </>
    ) : (
      <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">
        + Add Image
      </div>
    )}
  </div>
);
