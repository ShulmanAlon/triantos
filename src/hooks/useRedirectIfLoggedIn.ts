import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export function useRedirectIfLoggedIn(destination = '/dashboard') {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate(destination);
      }
    };

    checkSession();
  }, [navigate, destination]);
}
