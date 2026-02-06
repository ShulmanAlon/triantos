import { Button } from '@/components/ui/Button';
import { ImageWithPlaceholder } from '@/components/ImageWithPlaceholder';
import { getCampaignBlurImage, getCampaignImage } from '@/utils/imageUtils';
import { CampaignInterface } from '@/types/campaign';

type CampaignHeaderProps = {
  campaign: CampaignInterface;
  canEdit: boolean;
  onEdit: () => void;
  onOpenHandbook: () => void;
  onBack: () => void;
};

export const CampaignHeader = ({
  campaign,
  canEdit,
  onEdit,
  onOpenHandbook,
  onBack,
}: CampaignHeaderProps) => {
  const memberNames = campaign.members
    .filter((member) => member.user_id !== campaign.owner_id)
    .map((member) => member.username);

  return (
    <div className="card p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">{campaign.name}</h1>
          {campaign.description && (
            <p className="text-sm text-(--muted) mt-1">
              {campaign.description}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {canEdit && (
            <Button variant="outline" onClick={onEdit}>
              ✏️ Edit Campaign
            </Button>
          )}
          <Button variant="primary" onClick={onOpenHandbook}>
            Player’s Handbook
          </Button>
          <Button variant="outline" onClick={onBack}>
            ← Back to Dashboard
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-6 items-start">
        <div className="relative w-40 h-40 rounded-xl overflow-hidden shadow-sm bg-white/80 border border-black/5">
          <ImageWithPlaceholder
            src={getCampaignImage(campaign.image_url)}
            blurSrc={getCampaignBlurImage()}
            alt="Campaign preview"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="space-y-2 text-sm text-(--muted)">
          <p>
            <span className="font-semibold text-(--ink)">DM:</span>{' '}
            {campaign.owner_username ?? 'Unknown'}
          </p>
          <p>
            <span className="font-semibold text-(--ink)">Members:</span>{' '}
            {memberNames.length > 0 ? memberNames.join(', ') : 'None'}
          </p>
        </div>
      </div>
    </div>
  );
};
