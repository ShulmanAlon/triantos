import { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export const TestSupabaseConnection = () => {
  useEffect(() => {
    const fetchCharacters = async () => {
      const { data, error } = await supabase.from('characters').select('*');

      if (error) {
        console.error('❌ Error fetching characters:', error);
      } else {
        console.log('✅ Characters:', data);
      }
    };

    fetchCharacters();
  }, []);

  return (
    <div className="text-sm text-gray-600">Check the console for results.</div>
  );
};

// TODO remove this after done testing
