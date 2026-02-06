import { Attribute } from './attributes';
import { ClassId } from './gameClass';
import { RaceId } from './race';
import { ActiveAbilityEffect, SkillId, SkillPointType } from './skills';

interface CharacterBase {
  id: string;
  name: string;
  player_name: string;
  image_url?: string;
  class_id: ClassId;
  race_id: RaceId;
  level: number;
  visible: boolean;
  created_at?: string;
  attributes: Record<Attribute, number>;
  user_id: string;
  campaign_id: string;
  progression?: CharacterProgression;
  equipment_loadouts?: EquipmentLoadouts;
}

export interface CharacterPreview extends CharacterBase {
  owner_username?: string;
}

export interface CharacterWithCampaign extends CharacterBase {
  deleted: boolean;
  campaign_owner_id: string;
  owner_username?: string;
}

export interface RawCharacterWithCampaign extends CharacterBase {
  deleted: boolean;
  users: { username: string }[] | { username: string } | null;
  campaigns: { owner_id: string }[] | { owner_id: string } | null;
}

export type RawCharacter = Omit<CharacterPreview, 'owner_username'> & {
  users: { username: string }[] | { username: string } | null;
};

export type CharacterSkillSelection = {
  skillId: SkillId;
  tier: number;
  acquiredAtLevel: number;
  source?: 'selected' | 'class' | 'race';
  spendType?: SkillPointType;
};

export type EquipmentSlotKey =
  | 'armor'
  | 'weapon_primary'
  | 'weapon_offhand'
  | 'shield';

export type EquipmentLoadout = {
  id: string;
  name: string;
  items: Partial<Record<EquipmentSlotKey, string | null>>;
  toggles?: Record<string, boolean>;
  notes?: string;
};

export type EquipmentLoadouts = {
  activeId: string;
  loadouts: EquipmentLoadout[];
};

export type SkillPointPool = {
  core: number;
  utility: number;
  human: number;
};

export type SkillSelectionEntry = {
  skillId: SkillId;
  tier: number;
  spendType: SkillPointType;
};

export type LevelUpBucket = {
  level: number;
  attributeIncreases?: Partial<Record<Attribute, number>>;
  skillSelections?: SkillSelectionEntry[];
};

export type CharacterProgression = {
  buckets: LevelUpBucket[];
};

export interface DerivedStats {
  hp: number;
  spellSlots?: Record<number, number>;
  baseAttackBonus: number;
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
    hpBreakdown: StatBlock<number>;
    hpTemp: StatBlock<number>;
    meleeAttack: StatBlock<number>;
    rangedAttack: StatBlock<number>;
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
