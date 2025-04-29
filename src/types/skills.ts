import { Attribute } from './attributes';
import { ClassId } from './gameClass';
import { RaceId } from './race';

export interface SkillFamily {
  id: string;
  name: string;
  description: string;
}

export interface Skill {
  id: string;
  familyId: string;
  tier: number;
  name: string;
  description: string;
  prerequisites: Prerequisite[];
  effects: SkillEffect[];
}

export type Prerequisite =
  | { type: 'class'; value: ClassId }
  | { type: 'race'; value: RaceId }
  | { type: 'level'; value: number }
  | { type: 'attribute'; attribute: Attribute; value: number }
  | { type: 'skill'; skillId: string };

export type SkillEffect =
  | { type: 'ac_bonus'; bonus: number; conditions?: string }
  | { type: 'attack_bonus'; bonus: number; conditions?: string }
  | { type: 'custom'; description: string };
