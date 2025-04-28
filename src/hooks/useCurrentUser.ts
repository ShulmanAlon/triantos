import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { UserRole } from '../types/users';
import { TABLES } from '../config/dbTables';

export function useCurrentUser() {
  const [user, setUser] = useState<{
    id: string;
    username: string;
    role: UserRole;
  } | null>(null);

  useEffect(() => {
    const getUserData = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) {
        setUser(null);
        return;
      }

      const { data, error } = await supabase
        .from(TABLES.USERS)
        .select('id, username, role')
        .eq('auth_id', authUser.id)
        .single();

      if (error) {
        console.error('Failed to fetch user data:', error);
        setUser(null);
        return;
      }

      setUser(data);
    };

    // Fetch initially
    getUserData();

    // Subscribe to auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          setUser(null);
        } else if (event === 'SIGNED_IN' && session?.user) {
          getUserData();
        }
      }
    );

    // Cleanup listener on unmount
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  return user;
}
