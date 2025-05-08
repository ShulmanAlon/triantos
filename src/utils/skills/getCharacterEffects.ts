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
      const tierData = skill?.tiers.find((t) => t.tier === tier);
      return tierData?.effects ?? [];
    })
    .flat();
}
