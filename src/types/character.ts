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
