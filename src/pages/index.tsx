import { useNavigate } from 'react-router-dom';
import { useRedirectIfLoggedIn } from '@/hooks/useRedirectIfLoggedIn';

export default function LandingPage() {
  const navigate = useNavigate();

  useRedirectIfLoggedIn('/dashboard');

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-100 flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Triantos</h1>
      <p className="text-lg text-gray-700 mb-8 max-w-xl">
        Create your characters, join campaigns, and dive into your next tabletop
        adventure.
      </p>

      <button
        onClick={() => navigate('/login')}
        className="bg-blue-600 text-white px-6 py-2 rounded-xl shadow hover:bg-blue-700 transition"
      >
        Login
      </button>
    </main>
  );
}
