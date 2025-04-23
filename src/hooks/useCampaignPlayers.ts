// import { useEffect, useState } from 'react';
// import { supabase } from '../lib/supabaseClient';
// import { CampaignMember } from '../types/campaign';

// export function useCampaignMembers(campaignId: string) {
//   const [members, setMembers] = useState<CampaignMember[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!campaignId) return;

//     const fetchMembers = async () => {
//       setLoading(true);

//       const { data, error } = await supabase
//         .from('campaign_members')
//         .select('users(username')
//         .eq('campaign_id', campaignId)
//         .eq('role', 'player');

//       if (error) {
//         console.error('Error fetching players:', error.message);
//         setPlayers([]);
//       } else {
//         const formatted = (data ?? []).map((item: any) => ({
//           username: item.users?.username ?? 'Unknown',
//           role: item.role,
//         }));
//         console.log(formatted);
//         setMembers(formatted);
//       }

//       setLoading(false);
//     };

//     fetchMembers();
//   }, [campaignId]);

//   return { members, loading };
// }

// TODO delete
