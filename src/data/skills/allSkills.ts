import { SkillEntity, SkillId } from '@/types/skills';
import * as attackSkills from './attackSkills';
import * as defenseSkills from './defenseSkills';
import * as pilotingSkills from './pilotingSkills';
import * as racialSkills from './racialSkills';

const collect = (group: Record<string, SkillEntity>): SkillEntity[] =>
  Object.values(group);

const normalizeSkill = (skill: SkillEntity): SkillEntity => ({
  ...skill,
  tiers: skill.tiers.map((tier) => ({
    ...tier,
    deltaDescription: tier.deltaDescription ?? tier.description,
    totalDescription: tier.totalDescription ?? tier.description,
  })),
});

export const allSkills: SkillEntity[] = [
  ...collect(attackSkills as Record<string, SkillEntity>).map(normalizeSkill),
  ...collect(defenseSkills as Record<string, SkillEntity>).map(normalizeSkill),
  ...collect(pilotingSkills as Record<string, SkillEntity>).map(normalizeSkill),
  ...collect(racialSkills as Record<string, SkillEntity>).map(normalizeSkill),
];
// TODO: Add more skills across categories.

export const skillsById: Map<SkillId, SkillEntity> = new Map(
  allSkills.map((skill) => [skill.id, skill])
);
