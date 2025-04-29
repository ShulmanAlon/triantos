import { useNavigate } from 'react-router-dom';
import { useUserCampaigns } from '@/hooks/useUserCampaigns';
import { CampaignListItem } from '@/components/CampaignListItem';
import { LoadingErrorWrapper } from '@/components/LoadingErrorWrapper';

export default function DashboardPage() {
  const { campaigns, loading: isLoading, error: hasError } = useUserCampaigns();
  const navigate = useNavigate();

  return (
    <LoadingErrorWrapper loading={isLoading} error={hasError}>
      {!campaigns ? (
        <p className="p-4 text-red-600">Campaigns not found.</p>
      ) : (
        <main className="p-6 space-y-6">
          <h1 className="text-2xl font-bold">Your Campaigns</h1>

          {campaigns.length === 0 ? (
            <p className="text-gray-600">
              You are not part of any campaigns yet.
            </p>
          ) : (
            <div className="space-y-4">
              {campaigns.map((c) => (
                <CampaignListItem key={c.campaign_id} campaign={c} />
              ))}
            </div>
          )}
          <div className="pt-6">
            <button
              onClick={() => navigate('/create-campaign')}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              + Create New Campaign
            </button>
          </div>
        </main>
      )}
    </LoadingErrorWrapper>
  );
}
