import { Link } from 'react-router-dom';
import { getCampaignImage, getCampaignBlurImage } from '@/utils/imageUtils';
import { ImageWithPlaceholder } from './ImageWithPlaceholder';
import { CampaignInterface } from '@/types/campaign';

export function CampaignListItem({
  campaign,
}: {
  campaign: CampaignInterface;
}) {
  const memberNames = campaign.members
    .filter((member) => member.user_id !== campaign.owner_id)
    .map((member) => member.username);

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
        <p className="text-sm text-(--muted)">{campaign.description}</p>
        <p className="text-sm text-(--muted)">
          DM: <span className="font-medium">{campaign.owner_username}</span>
        </p>
        <p className="text-sm text-(--muted)">
          Members:{' '}
          {memberNames.length > 0 ? memberNames.join(', ') : 'None'}
        </p>
      </div>
    </Link>
  );
}
