import { CharacterSkillSelection } from '@/types/characters';
import { StatModifier } from '@/types/modifiers';
import { SkillEntity } from '@/types/skills';

export function getCharacterEffects(
  skillSelections: CharacterSkillSelection[],
  skillEntities: SkillEntity[]
): StatModifier[] {
  return skillSelections
    .map(({ skillId, tier }) => {
      const skill = skillEntities.find((s) => s.id === skillId);
      if (!skill) return [];
      return skill.tiers
        .filter((t) => t.tier <= tier)
        .flatMap((t) => t.effects ?? []);
    })
    .flat();
}
