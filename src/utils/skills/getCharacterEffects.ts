import { CharacterSkillSelection } from '@/types/characters';
import { StatModifier } from '@/types/modifiers';
import { SkillEntity } from '@/types/skills';

export function getCharacterEffects(
  skillSelections: CharacterSkillSelection[],
  skillEntities: SkillEntity[]
): StatModifier[] {
  const skillsById = new Map(skillEntities.map((skill) => [skill.id, skill]));
  const maxTierBySkill = new Map<string, number>();
  for (const { skillId, tier } of skillSelections) {
    const current = maxTierBySkill.get(skillId) ?? 0;
    if (tier > current) maxTierBySkill.set(skillId, tier);
  }

  return Array.from(maxTierBySkill.entries())
    .map(([skillId, tier]) => {
      const skill = skillsById.get(skillId);
      if (!skill) return [];
      return skill.tiers
        .filter((t) => t.tier <= tier)
        .flatMap((t) => t.effects ?? []);
    })
    .flat();
}
