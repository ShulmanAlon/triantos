import { CharacterSkillSelection } from '@/types/characters';
import { StatModifier } from '@/types/modifiers';
import { SkillEntity } from '@/types/skills';

export function getCharacterEffects(
  skillSelections: CharacterSkillSelection[],
  skillEntities: SkillEntity[]
): StatModifier[] {
  const skillsById = new Map(skillEntities.map((skill) => [skill.id, skill]));

  return skillSelections
    .map(({ skillId, tier }) => {
      const skill = skillsById.get(skillId);
      if (!skill) return [];
      return skill.tiers
        .filter((t) => t.tier <= tier)
        .flatMap((t) => t.effects ?? []);
    })
    .flat();
}
