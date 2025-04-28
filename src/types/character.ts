import { Attribute } from './attributes';
import { ClassId } from './gameClass';
import { RaceId } from './race';

export interface CharacterPreview {
  id: string;
  name: string;
  player_name: string;
  image_url?: string;
  class_id: ClassId;
  race_id: RaceId;
  level: number;
  visible: boolean;
  attributes: Record<Attribute, number>;
  user_id: string;
  campaign_id: string;
  owner_username?: string;
}

export interface CharacterWithCampaign {
  id: string;
  name: string;
  player_name: string;
  image_url?: string;
  class_id: ClassId;
  race_id: RaceId;
  level: number;
  visible: boolean;
  deleted: boolean;
  attributes: Record<Attribute, number>;
  user_id: string;
  campaign_id: string;
  campaign_owner_id: string;
  owner_username?: string;
}

export interface RawCharacterWithCampaign {
  id: string;
  name: string;
  player_name: string;
  image_url?: string;
  class_id: ClassId;
  race_id: RaceId;
  level: number;
  visible: boolean;
  deleted: boolean;
  attributes: Record<Attribute, number>;
  user_id: string;
  campaign_id: string;
  users: { username: string }[] | { username: string } | null;
  campaigns: { owner_id: string }[] | { owner_id: string } | null;
}

export type RawCharacter = Omit<CharacterPreview, 'owner_username'> & {
  users: { username: string }[] | { username: string } | null;
};
