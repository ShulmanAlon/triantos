// --- Skill Core ---

import { Attribute } from './attributes';
import { ClassId } from './gameClass';
import { StatModifier } from './modifiers';
import { RaceId } from './race';

export type SkillPointType = 'core' | 'utility' | 'human';

export type SkillEntity = {
  id: string; // SkillId
  name: string;
  family: SkillFamilyId; // SkillFamilyId
  skillPointType: SkillPointType;
  description: string;
  abilityModifier?: Attribute;
  forbiddenClasses?: ClassId[];
  forbiddenRaces?: RaceId[];
  tiers: TierData[];
};

// --- Skill Tiers ---

export type TierData = {
  tier: number;
  name: TierName; // 'Basic', 'Advanced', etc.
  description?: string;
  prerequisites?: TierPrerequisite[]; // See below
  freeForClasses?: {
    classId: ClassId;
    atLevel: number;
  }[];
  effects: StatModifier[];
};

// --- Enum / Constants ---

export type TierName =
  | 'Initial'
  | 'Proficient'
  | 'Basic'
  | 'Advanced'
  | 'Expert'
  | 'Master';

// --- Tier Unlock Logic (unified) ---

export type TierPrerequisite =
  | { type: 'level'; minimum: number }
  | { type: 'attribute'; attribute: Attribute; minimum: number }
  | { type: 'skill'; skillId: string; tier: number };

export type ActiveAbilityEffect = {
  abilityName: string;
  usageLimit: UsageLimit;
  actionType: 'reaction' | 'bonusAction' | 'mainAction';
  mechanics: ContestMechanic;
};

export type UsageLimit = {
  perBattle: number;
  perRound?: number;
};

export type ContestMechanic = {
  attackerSkill: string;
  defenderSkill: string;
  defenderModifier: number;
};

export type ConditionType = {
  type: 'equipment' | 'status' | 'environment';
  value: string;
};

export type SkillFamilyId =
  | 'attack'
  | 'defense'
  | 'magic'
  | 'piloting'
  | 'utility';
