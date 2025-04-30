import { CharacterSkillSelection } from '@/types/characters';
import { SkillEntity, EffectType } from '@/types/skills';

export function getCharacterEffects(
  skillSelections: CharacterSkillSelection[],
  skillEntities: SkillEntity[]
): EffectType[] {
  return skillSelections
    .map(({ skillId, tier }) => {
      const skill = skillEntities.find((s) => s.id === skillId);
      const tierData = skill?.tiers.find((t) => t.tier === tier);
      return tierData?.effects ?? [];
    })
    .flat();
}
