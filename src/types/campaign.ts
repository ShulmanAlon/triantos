export interface CampaignMember {
  user_id: string;
  campaign_id: string;
}

export interface CampaignInterface {
  campaign_id: string;
  name: string;
  description: string;
  image_url?: string;
  owner_id: string;
  owner_username: string;
  members: { user_id: string; username: string }[];
  deleted: boolean;
}

// export interface Campaign {
//   id: string;
//   name: string;
//   description: string;
//   imageUrl?: string; // Optional image shown on dashboard
//   createdAt: string; // ISO date string
//   updatedAt?: string;

//   // Optional fields to be populated from joins:
//   dmName?: string; // Resolved via users table
//   playerNames?: string[]; // Optional, for display purposes
// } //TODO delete when done

// export interface CampaignData {
//   id: string;
//   name: string;
//   description?: string;
//   image_url?: string;
//   members: {
//     username: string;
//   }[];
// } //TODO delete when done
