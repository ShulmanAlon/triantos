import { useNavigate } from 'react-router-dom';
import { useUserCampaigns } from '@/hooks/useUserCampaigns';
import { CampaignListItem } from '@/components/CampaignListItem';
import { LoadingErrorWrapper } from '@/components/LoadingErrorWrapper';
import { Button } from '@/components/ui/Button';

export default function DashboardPage() {
  const { campaigns, loading: isLoading, error: hasError } = useUserCampaigns();
  const navigate = useNavigate();

  return (
    <LoadingErrorWrapper loading={isLoading} error={hasError}>
      {!campaigns ? (
        <p className="p-4 text-red-600">Campaigns not found.</p>
      ) : (
        <main className="space-y-6 pt-2">
          <div className="flex items-center justify-between gap-4">
            <div className="pl-1">
              <h1 className="text-2xl font-bold">Your Campaigns</h1>
              <p className="text-sm text-(--muted) mt-1 mb-1">
                Manage your active and past campaigns.
              </p>
            </div>
            <Button onClick={() => navigate('/create-campaign')}>
              Create New Campaign
            </Button>
          </div>

          {campaigns.length === 0 ? (
            <div className="panel p-4 text-sm text-(--muted)">
              You are not part of any campaigns yet.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {campaigns.map((c) => (
                <CampaignListItem key={c.campaign_id} campaign={c} />
              ))}
            </div>
          )}
        </main>
      )}
    </LoadingErrorWrapper>
  );
}
