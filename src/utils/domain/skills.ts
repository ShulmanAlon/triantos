import { skillsById } from '@/data/skills/allSkills';
import { SkillEntity, SkillId } from '@/types/skills';
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
  name: string;
  tier: number;
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
        name: skillName,
        tier: data.tier,
        source: data.source,
        totalDescription: tier?.totalDescription ?? tier?.description,
        skillDescription: skill?.description,
      };
    }
  );
  return summaries.sort(
    (a, b) => a.name.localeCompare(b.name) || a.tier - b.tier
  );
};
