import { SkillEntity } from '@/types/skills';
import * as attackSkills from './attackSkills';
import * as defenseSkills from './defenseSkills';
import * as pilotingSkills from './pilotingSkills';
import * as racialSkills from './racialSkills';

const collect = (group: Record<string, SkillEntity>): SkillEntity[] =>
  Object.values(group);

export const allSkills: SkillEntity[] = [
  ...collect(attackSkills as Record<string, SkillEntity>),
  ...collect(defenseSkills as Record<string, SkillEntity>),
  ...collect(pilotingSkills as Record<string, SkillEntity>),
  ...collect(racialSkills as Record<string, SkillEntity>),
];
