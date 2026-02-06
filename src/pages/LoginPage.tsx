import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRedirectIfLoggedIn } from '@/hooks/useRedirectIfLoggedIn';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/context/ToastContext';
import { Button } from '@/components/ui/Button';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();
  const { toast } = useToast();

  useRedirectIfLoggedIn('/dashboard');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      toast.error(error.message);
    } else {
      setErrorMsg('');
      navigate('/dashboard');
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 card">
      <h1 className="text-xl font-bold mb-4 text-center">Login</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            className="w-full border px-3 py-2 rounded"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Password</label>
          <input
            className="w-full border px-3 py-2 rounded"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {errorMsg && <div className="sr-only">{errorMsg}</div>}

        <Button type="submit" className="w-full">
          Log In
        </Button>
      </form>
    </div>
  );
};

export default LoginPage;
