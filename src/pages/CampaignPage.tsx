import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { Button } from '../components/ui/Button';
import { ImageWithPlaceholder } from '../components/ImageWithPlaceholder';
import {
  getCampaignBlurImage,
  getCampaignImage,
  getCharacterBlurImage,
  getCharacterImage,
} from '../utils/imageUtils';
import type { ClassId } from '../types/gameClass';
import EditCampaignModal from '../components/EditCampaignModal';
import { USER_ROLES } from '../config/userRoles';
import { useCampaignById } from '../hooks/useCamapaignById';
import { useCharactersByCampaignId } from '../hooks/useCharactersByCampaignId';
import { LoadingErrorWrapper } from '../components/LoadingErrorWrapper';

export default function CampaignPage() {
  const { id: campaignId } = useParams<{ id: string }>();
  const user = useCurrentUser();
  const navigate = useNavigate();

  const [showEditModal, setShowEditModal] = useState(false);

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
    <main className="p-6 space-y-6">
      <LoadingErrorWrapper loading={isLoading} error={hasError}>
        {!campaign ? (
          <p className="p-4 text-red-600">Campaign not found.</p>
        ) : (
          <div>
            {canEditCampaign && (
              <Button variant="outline" onClick={() => setShowEditModal(true)}>
                ✏️ Edit Campaign
              </Button>
            )}
            <div className="flex gap-2">
              <h1 className="text-3xl font-bold">{campaign.name}</h1>
              <Button
                variant="primary"
                onClick={() =>
                  navigate(`/campaign/${campaign.campaign_id}/handbook`)
                }
              >
                Player’s Handbook
              </Button>
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                ← Back to Dashboard
              </Button>
            </div>
            <p className="text-gray-700">{campaign.description}</p>
            <div className="relative cursor-pointer w-40 h-40 border rounded overflow-hidden shadow-sm bg-gray-100 group">
              <ImageWithPlaceholder
                src={getCampaignImage(campaign.image_url)}
                blurSrc={getCampaignBlurImage()}
                alt="Campaign preview"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-1 pt-2 text-gray-600">
              <p>
                <span className="font-medium">DM:</span>{' '}
                {campaign.owner_username ?? 'Unknown'}
              </p>
              <p>
                <span className="font-medium">Members:</span>{' '}
                {campaign.members
                  .filter((m) => m.user_id !== campaign.owner_id)
                  .map((m) => m.username)
                  .join(', ') || 'None'}
              </p>
            </div>
            <div className="flex justify-between items-center pt-4">
              <h2 className="text-2xl font-semibold">Characters</h2>
              <Button
                variant="outline"
                onClick={() =>
                  navigate(`/campaign/${campaign.campaign_id}/create-character`)
                }
              >
                + New Character
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {characters
                .filter((char) => {
                  if (!user) return;
                  const isOwner = char.user_id === user.id;
                  const isAdmin = user.role === USER_ROLES.ADMIN;
                  const isDM = campaign.owner_id === user.id;

                  return char.visible || isOwner || isAdmin || isDM;
                })
                .map((char) => (
                  <div
                    key={char.id}
                    onClick={() => navigate(`/character/${char.id}`)}
                    className="cursor-pointer p-4 border rounded hover:bg-gray-50 transition relative"
                  >
                    <ImageWithPlaceholder
                      src={getCharacterImage(
                        char.image_url,
                        char.class_id as ClassId
                      )}
                      blurSrc={getCharacterBlurImage(char.class_id as ClassId)}
                      alt={char.name}
                    />
                    <p className="text-xs italic text-gray-500">
                      Owner: {char.owner_username}
                    </p>
                    <h3 className="text-lg font-bold">{char.name}</h3>
                    <p className="text-sm text-gray-600">{char.player_name}</p>
                    <p className="text-sm text-gray-500">
                      {char.class_id} • {char.race_id} • Level {char.level}
                    </p>
                    {!char.visible && (
                      <div className="absolute text-4xl top-2 right-2 text-gray-500">
                        👁️‍🗨️
                      </div>
                    )}
                  </div>
                ))}
            </div>
            {canEditCampaign && (
              <Button
                variant="destructive"
                onClick={async () => {
                  const confirmed = window.confirm(
                    'Are you sure you want to delete this campaign?'
                  );
                  if (!confirmed) return;

                  await updateCampaign({ deleted: true });
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
                await updateCampaign(updated);
                setShowEditModal(false);
              }}
            />
          </div>
        )}
      </LoadingErrorWrapper>
    </main>
  );
}
