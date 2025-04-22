import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';

export const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <button
      onClick={handleLogout}
      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
    >
      Log Out
    </button>
  );
};
