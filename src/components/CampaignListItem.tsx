import { Link } from 'react-router-dom';
import { getCampaignImage, getCampaignBlurImage } from '../utils/imageUtils';
import { ImageWithPlaceholder } from './ImageWithPlaceholder';
import { CampaignInterface } from '../types/campaign';

export function CampaignListItem({
  campaign,
}: {
  campaign: CampaignInterface;
}) {
  return (
    <Link
      to={`/campaign/${campaign.campaign_id}`}
      className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm border hover:bg-gray-50 transition"
    >
      <ImageWithPlaceholder
        src={getCampaignImage(campaign.image_url)}
        blurSrc={getCampaignBlurImage()}
        alt="Campaign preview"
        className="w-24 h-24 object-cover rounded"
      />

      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold">{campaign.name}</h2>
        <p className="text-sm text-gray-600">{campaign.description}</p>
        <p className="text-sm text-gray-500">
          DM: <span className="font-medium">{campaign.owner_username}</span>
        </p>
        <p className="text-sm text-gray-600">
          Members:{' '}
          {campaign.members
            .filter((m) => m.user_id !== campaign.owner_id)
            .map((m) => m.username)
            .join(', ') || 'None'}
        </p>
      </div>
    </Link>
  );
}
