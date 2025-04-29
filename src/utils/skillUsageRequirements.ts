import { SkillFamily, SkillTier } from '@/types/skill';

export function getSkillUsageRequirements(
  family: SkillFamily,
  tier?: SkillTier
) {
  return tier?.usageRequirements || family.usageRequirements || [];
}
