import { useNavigate } from 'react-router-dom';
import { useRedirectIfLoggedIn } from '@/hooks/useRedirectIfLoggedIn';
import { Button } from '@/components/ui/Button';

export default function LandingPage() {
  const navigate = useNavigate();

  useRedirectIfLoggedIn('/dashboard');

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="card p-6 text-center max-w-md w-full">
        <h1 className="text-3xl font-bold">Triantos</h1>
        <p className="text-sm text-(--muted) mt-2">
          A simple hub for our campaigns.
        </p>
        <Button className="mt-6 w-full" onClick={() => navigate('/login')}>
          Log In
        </Button>
      </div>
    </main>
  );
}
