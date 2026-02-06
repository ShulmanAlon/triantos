import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/context/ToastContext';
import { Button } from '@/components/ui/Button';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirm) {
      toast.error('Please fill out both password fields.');
      return;
    }
    if (password !== confirm) {
      toast.error('Passwords do not match.');
      return;
    }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      toast.error(error.message);
      setSaving(false);
      return;
    }
    toast.info('Password updated. Please log in.');
    navigate('/login');
  };

  return (
    <div className="max-w-sm mx-auto mt-10">
      <div className="card p-6">
        <div className="text-center">
          <p className="chip inline-flex">Reset Password</p>
          <h1 className="text-2xl font-bold mt-3">Set a New Password</h1>
          <p className="text-sm text-(--muted) mt-1">
            Enter a new password to finish resetting your account.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div>
            <label className="block text-sm font-semibold mb-1">New password</label>
            <input
              className="w-full border border-black/10 px-3 py-2 rounded-lg bg-white/80"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">
              Confirm password
            </label>
            <input
              className="w-full border border-black/10 px-3 py-2 rounded-lg bg-white/80"
              type="password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={saving}>
            Update Password
          </Button>
        </form>
      </div>
    </div>
  );
}
