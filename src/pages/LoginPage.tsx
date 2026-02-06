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
  const [resetMsg, setResetMsg] = useState('');

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
      setResetMsg('');
      navigate('/dashboard');
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      toast.error('Please enter your email first.');
      return;
    }
    const redirectTo = `${window.location.origin}/reset-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    const msg = 'Password reset email sent.';
    setResetMsg(msg);
    toast.info(msg);
  };

  return (
    <div className="max-w-sm mx-auto mt-10">
      <div className="card p-6">
        <div className="text-center">
          <p className="chip inline-flex">Welcome Back</p>
          <h1 className="text-2xl font-bold mt-3">Log In</h1>
          <p className="text-sm text-(--muted) mt-1">
            Sign in to continue to your campaigns.
          </p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4 mt-6">
        <div>
          <label className="block text-sm font-semibold mb-1">Email</label>
          <input
            className="w-full border border-black/10 px-3 py-2 rounded-lg"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Password</label>
          <input
            className="w-full border border-black/10 px-3 py-2 rounded-lg"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {errorMsg && <div className="sr-only">{errorMsg}</div>}
        {resetMsg && (
          <div className="text-xs text-(--muted) text-center">{resetMsg}</div>
        )}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleResetPassword}
            className="text-xs font-semibold text-(--ink) hover:underline"
          >
            Forgot password?
          </button>
        </div>

        <Button type="submit" className="w-full">
          Log In
        </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
