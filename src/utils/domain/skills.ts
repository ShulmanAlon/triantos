import { skillsById } from '@/data/skills/allSkills';
import { ActiveAbilityEffect, SkillEntity, SkillGroup, SkillId } from '@/types/skills';
import { CharacterSkillSelection } from '@/types/characters';

export const getSkillName = (skillId: SkillId): string =>
  skillsById.get(skillId)?.name ?? skillId;

export const getSkillById = (skillId: SkillId): SkillEntity | undefined =>
  skillsById.get(skillId);

export const getSkillTier = (
  skillId: SkillId,
  tier: number
): SkillEntity['tiers'][number] | undefined => {
  return skillsById.get(skillId)?.tiers.find((t) => t.tier === tier);
};

export const getSkillCheckBonus = (
  skillId: SkillId,
  tierNumber: number
): number => {
  const tier = getSkillTier(skillId, tierNumber);
  const text = `${tier?.totalDescription ?? ''} ${tier?.description ?? ''}`.trim();
  if (!text) return 0;
  if (/no bonus|no penalty/i.test(text)) return 0;
  const explicitPenalty = text.match(/-\s*(\d+)\s*penalty/i);
  if (explicitPenalty) return -Number(explicitPenalty[1]);
  const explicitTotal = text.match(/([+-]\d+)\s*(?:total)?/i);
  if (explicitTotal) return Number(explicitTotal[1]);
  return 0;
};

const SKILL_GROUP_ORDER: Record<SkillGroup, number> = {
  basic: 0,
  actionable: 1,
  passive: 2,
};

const DEFAULT_CATEGORY_ORDER: Record<string, number> = {
  attack: 10,
  defense: 20,
  piloting: 30,
  utility: 40,
  magic: 50,
  racial: 60,
};

const isActiveAbilityEffect = (value: unknown): value is ActiveAbilityEffect =>
  !!value &&
  typeof value === 'object' &&
  'abilityName' in value &&
  'actionType' in value;

export const isSkillActionable = (skill: SkillEntity): boolean =>
  skill.tiers.some((tier) =>
    tier.effects.some((effect) => isActiveAbilityEffect(effect.value))
  );

export const getSkillGroup = (skill: SkillEntity): SkillGroup => {
  if (skill.group) return skill.group;
  if (isSkillActionable(skill)) return 'actionable';
  return 'passive';
};

export const getSkillCategory = (skill: SkillEntity): string =>
  skill.category ?? skill.family;

export const compareSkillsForDisplay = (
  a: SkillEntity,
  b: SkillEntity
): number => {
  const groupOrderA = SKILL_GROUP_ORDER[getSkillGroup(a)] ?? 99;
  const groupOrderB = SKILL_GROUP_ORDER[getSkillGroup(b)] ?? 99;
  if (groupOrderA !== groupOrderB) return groupOrderA - groupOrderB;

  const categoryA = getSkillCategory(a);
  const categoryB = getSkillCategory(b);
  const categoryOrderA = a.categoryOrder ?? DEFAULT_CATEGORY_ORDER[categoryA] ?? 999;
  const categoryOrderB = b.categoryOrder ?? DEFAULT_CATEGORY_ORDER[categoryB] ?? 999;
  if (categoryOrderA !== categoryOrderB) return categoryOrderA - categoryOrderB;

  if (categoryA !== categoryB) return categoryA.localeCompare(categoryB);

  const orderA = a.sortOrder ?? 999;
  const orderB = b.sortOrder ?? 999;
  if (orderA !== orderB) return orderA - orderB;

  return a.name.localeCompare(b.name);
};

export const sortSkillsForDisplay = (skills: SkillEntity[]): SkillEntity[] =>
  skills.slice().sort(compareSkillsForDisplay);

export const getHighestSkillTiers = (
  selections: CharacterSkillSelection[]
): Map<SkillId, { tier: number; source?: string }> => {
  const highest = new Map<SkillId, { tier: number; source?: string }>();
  for (const selection of selections) {
    const current = highest.get(selection.skillId);
    if (!current || selection.tier > current.tier) {
      highest.set(selection.skillId, {
        tier: selection.tier,
        source: selection.source,
      });
    }
  }
  return highest;
};

export type SkillSummary = {
  id: SkillId;
  name: string;
  tier: number;
  tierName?: SkillEntity['tiers'][number]['name'];
  source?: string;
  totalDescription?: string;
  skillDescription?: string;
};

export const buildSkillSummary = (
  selections: CharacterSkillSelection[]
): SkillSummary[] => {
  const highestBySkill = getHighestSkillTiers(selections);
  const summaries = Array.from(highestBySkill.entries()).map(
    ([skillId, data]) => {
      const skillName = getSkillName(skillId);
      const skill = getSkillById(skillId);
      const tier = getSkillTier(skillId, data.tier);
      return {
        id: skillId,
        name: skillName,
        tier: data.tier,
        tierName: tier?.name,
        source: data.source,
        totalDescription: tier?.totalDescription ?? tier?.description,
        skillDescription: skill?.description,
      };
    }
  );
  return summaries.sort((a, b) => {
    const skillA = getSkillById(a.id);
    const skillB = getSkillById(b.id);
    if (skillA && skillB) {
      const skillOrder = compareSkillsForDisplay(skillA, skillB);
      if (skillOrder !== 0) return skillOrder;
    }
    return a.name.localeCompare(b.name) || a.tier - b.tier;
  });
};
