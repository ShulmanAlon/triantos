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
  const visibleMembers = memberNames.slice(0, 4);
  const remainingCount = memberNames.length - visibleMembers.length;

  return (
    <div className="card p-5">
      <div className="flex flex-col lg:flex-row items-start gap-6">
        <div className="flex-1 space-y-4">
          <div>
            <h1 className="text-3xl font-bold">{campaign.name}</h1>
            {campaign.description && (
              <p className="text-sm text-(--muted) mt-1">
                {campaign.description}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <div className="relative w-48 h-48 rounded-xl overflow-hidden shadow-sm border border-black/10">
                <ImageWithPlaceholder
                  src={getCampaignImage(campaign.image_url)}
                  blurSrc={getCampaignBlurImage()}
                  alt="Campaign preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-2 text-sm text-(--muted) min-w-55">
                <p>
                  <span className="font-semibold text-(--ink)">DM:</span>{' '}
                  {campaign.owner_username ?? 'Unknown'}
                </p>
                <p>
                  <span className="font-semibold text-(--ink)">Members:</span>{' '}
                  {memberNames.length > 0
                    ? `${visibleMembers.join(', ')}${
                        remainingCount > 0 ? ` +${remainingCount} more` : ''
                      }`
                    : 'None'}
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-between gap-2 h-48 w-48 lg:ml-auto lg:items-end lg:justify-center">
              {canEdit && (
                <Button
                  variant="outline"
                  onClick={onEdit}
                  className="w-full justify-center"
                >
                  Edit Campaign
                </Button>
              )}
              <Button
                variant="outline"
                onClick={onOpenHandbook}
                className="w-full justify-center"
              >
                Player’s Handbook
              </Button>
              <Button
                variant="outline"
                onClick={onBack}
                className="w-full justify-center"
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
