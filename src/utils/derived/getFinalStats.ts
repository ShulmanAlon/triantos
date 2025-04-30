import { Attribute } from '@/types/attributes';
import {
  CharacterSkillSelection,
  FinalCharacterStats,
} from '@/types/characters';
import { GameClass } from '@/types/gameClass';
import { SkillEntity } from '@/types/skills';
import { getCharacterEffects } from '@/utils/skills/getCharacterEffects';
import { interpretEffects } from '@/utils/skills/interpretEffects';
import { getBaseDerivedStats } from './getBasederivedStats';
import { buildACStatBlock } from './buildACStatBlock';

export function getFinalStats(
  gameClass: GameClass,
  attributes: Record<Attribute, number>,
  level: number,
  skillSelections: CharacterSkillSelection[],
  skillEntities: SkillEntity[]
): FinalCharacterStats {
  const base = getBaseDerivedStats(gameClass, attributes, level);

  const effects = getCharacterEffects(skillSelections, skillEntities);
  const derived = interpretEffects(effects);
  const ac = buildACStatBlock(derived, attributes);

  const hpBonus = derived.modifiers['hp'] ?? 0;
  const attackBonusBonus = derived.modifiers['attack_bonus'] ?? 0;

  return {
    base,
    derived,
    final: {
      hp: base.hp + hpBonus,
      attackBonus: (base.attackBonus ?? 0) + attackBonusBonus,
      spellSlots: base.spellSlots, // might be unchanged
      ac,
    },
  };
}
