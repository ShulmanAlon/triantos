import { Link, useNavigate } from 'react-router-dom';
import { useUserCampaigns } from '../hooks/useUserCampaigns';

export default function DashboardPage() {
  const { campaigns, loading, error } = useUserCampaigns();
  const navigate = useNavigate();

  if (loading) return <p>Loading campaigns...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Your Campaigns</h1>

      {campaigns.length === 0 ? (
        <p className="text-gray-600">You are not part of any campaigns yet.</p>
      ) : (
        <div className="space-y-4">
          {campaigns.map((c) => (
            <Link
              to={`/campaign/${c.id}`}
              key={c.id}
              className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm border hover:bg-gray-50 transition"
            >
              {c.image_url && (
                <img
                  src={c.image_url}
                  alt={`${c.name} image`}
                  className="w-24 h-24 object-cover rounded"
                />
              )}

              <div className="flex flex-col gap-1">
                <h2 className="text-xl font-semibold">{c.name}</h2>
                <p className="text-sm text-gray-600">{c.description}</p>

                <p className="text-sm text-gray-500">
                  DM:{' '}
                  <span className="font-medium">
                    {c.members.find((m) => m.role === 'dm')?.username ??
                      'Unknown'}
                  </span>
                </p>

                <p className="text-sm text-gray-500">
                  Players:{' '}
                  {c.members
                    .filter((m) => m.role === 'player')
                    .map((m) => m.username)
                    .join(', ') || 'None'}
                </p>
              </div>
            </Link>
          ))}
          <div className="pt-6">
            <button
              onClick={() => navigate('/create-campaign')}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              + Create New Campaign
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
