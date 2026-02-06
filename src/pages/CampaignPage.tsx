import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { Button } from '@/components/ui/Button';
import EditCampaignModal from '@/components/EditCampaignModal';
import { USER_ROLES } from '@/config/userRoles';
import { useCampaignById } from '@/hooks/useCampaignById';
import { useCharactersByCampaignId } from '@/hooks/useCharactersByCampaignId';
import { LoadingErrorWrapper } from '@/components/LoadingErrorWrapper';
import { useToast } from '@/context/ToastContext';
import { CampaignHeader } from '@/pages/campaign/CampaignHeader';
import { CampaignCharacters } from '@/pages/campaign/CampaignCharacters';

export default function CampaignPage() {
  const { id: campaignId } = useParams<{ id: string }>();
  const user = useCurrentUser();
  const navigate = useNavigate();

  const [showEditModal, setShowEditModal] = useState(false);
  const { toast } = useToast();

  const {
    campaign,
    loading: campaignLoading,
    error: campaignError,
    updateCampaign,
  } = useCampaignById(campaignId);
  const {
    characters,
    loading: charactersLoading,
    error: charactersError,
  } = useCharactersByCampaignId(campaign?.campaign_id);

  const canEditCampaign =
    user !== null &&
    (campaign?.owner_id === user.id || user.role === USER_ROLES.ADMIN);

  const isLoading = campaignLoading || charactersLoading;
  const hasError = campaignError || charactersError;

  return (
    <main className="space-y-6">
      <LoadingErrorWrapper loading={isLoading} error={hasError}>
        {!campaign ? (
          <p className="p-4 text-red-600">Campaign not found.</p>
        ) : (
          <div>
            <div className="section-gap">
              <CampaignHeader
              campaign={campaign}
              canEdit={canEditCampaign}
              onEdit={() => setShowEditModal(true)}
              onOpenHandbook={() =>
                navigate(`/campaign/${campaign.campaign_id}/handbook`)
              }
              onBack={() => navigate('/dashboard')}
              />
            </div>
            <div className="section-gap">
              <CampaignCharacters
              campaign={campaign}
              characters={characters}
              user={user}
              onSelect={(characterId) => navigate(`/character/${characterId}`)}
              onCreate={() =>
                navigate(`/campaign/${campaign.campaign_id}/create-character`)
              }
              />
            </div>
            {canEditCampaign && (
              <Button
                variant="destructive"
                className="mt-6"
                onClick={async () => {
                  const confirmed = window.confirm(
                    'Are you sure you want to delete this campaign?'
                  );
                  if (!confirmed) return;

                  const result = await updateCampaign({ deleted: true });
                  if (result?.error) {
                    toast.error(
                      result.error.message ?? 'Failed to delete campaign.'
                    );
                    return;
                  }
                  navigate('/dashboard');
                }}
              >
                Delete Campaign
              </Button>
            )}

            {/* { Modal for campaign edit */}
            <EditCampaignModal
              open={showEditModal}
              campaign={campaign}
              onClose={() => setShowEditModal(false)}
              onSave={async (updated) => {
                const result = await updateCampaign(updated);
                if (result?.error) {
                  toast.error(
                    result.error.message ?? 'Failed to update campaign.'
                  );
                  return;
                }
                setShowEditModal(false);
              }}
            />
          </div>
        )}
      </LoadingErrorWrapper>
    </main>
  );
}
