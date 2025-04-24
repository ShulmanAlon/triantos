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
