import { Attribute } from './attributes';
import { ClassId } from './gameClass';
import { RaceId } from './race';

export interface SkillFamily {
  id: string; // "shield-fortress"
  title: string; // "Shield Fortress"
  description: string;
  type: 'active' | 'passive';
  forbiddenClasses?: ClassId[]; // Optional
  forbiddenRaces?: RaceId[]; // Optional
  usageRequirements?: Requirement[];
  tiers: string[]; // Array of SkillTier IDs in order
}

export interface SkillTier {
  id: string; // Unique tier ID, e.g., "shield-fortress-tier1"
  familyId: string; // Points to the parent skill family, e.g., "shield-fortress"
  tier: number; // 1, 2, 3, etc.
  subName: string; // "Basic", "Expert", "Master"
  description: string;
  prerequisites: Prerequisite[];
  usageRequirements?: Requirement[];
  effects: SkillEffect[];
}

export type Prerequisite =
  | { type: 'class'; value: ClassId }
  | { type: 'race'; value: RaceId }
  | { type: 'level'; value: number }
  | { type: 'attribute'; attribute: Attribute; value: number }
  | { type: 'skill'; skillId: string };

export type SkillEffect =
  | { type: 'ac_bonus'; bonus: number }
  | { type: 'attack_bonus'; bonus: number }
  | { type: 'custom'; description: string };

export type Requirement =
  | { type: 'equipment'; equipment: string } // e.g., shield, sword
  | { type: 'state'; state: 'mounted' | 'swimming' | 'flying' }
  | { type: 'action'; action: string }; // e.g., 'Attack', 'Dodge'
