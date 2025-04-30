import { Attribute } from './attributes';
import { ClassId } from './gameClass';
import { RaceId } from './race';
import { ActiveAbilityEffect } from './skills';

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

export type CharacterSkillSelection = {
  skillId: string;
  tier: number;
  acquiredAtLevel: number;
};

export interface DerivedStats {
  hp: number;
  spellSlots?: Record<number, number>;
  attackBonus?: number;
}

export type CharacterDerivedStats = {
  modifiers: Record<string, number>;
  toggles: Record<string, boolean>;
  activeAbilities: ActiveAbilityEffect[];
};

export type FinalCharacterStats = {
  base: DerivedStats;
  derived: CharacterDerivedStats;
  final: {
    hp: number;
    attackBonus: number;
    spellSlots?: Record<number, number>;
    ac: StatBlock;
  };
};

export type StatBlock<T = number> =
  | {
      type: 'simple';
      value: T;
    }
  | {
      type: 'breakdown';
      entries: StatFormula[];
      selectedLabels?: string[];
    };

export type CharacterStatsView = {
  ac: StatBlock<number>;
  // Future: attack, damage, saves, etc.
};

export type StatComponent = {
  source: string; // e.g., 'Base', 'DEX', 'Heavy Armor Skill'
  value: number;
};

export type StatFormula = {
  label: string; // e.g., 'Heavy Armor + Shield'
  total: number;
  components: StatComponent[];
};
