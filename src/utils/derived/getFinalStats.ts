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
import { buildHPStatBlock } from './buildHPStatBlock';
import { buildTempHPStatBlock } from './buildTempHPStatBlock';
import { buildMeleeAttackStatBlock } from './buildMeleeAttackStatBlock';

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
  const hpBlock = buildHPStatBlock(gameClass, attributes, level, derived);
  const tempHPBlock = buildTempHPStatBlock(derived);
  const acBlock = buildACStatBlock(derived, attributes);
  const meleeAttackBlock = buildMeleeAttackStatBlock(
    attributes,
    derived,
    base.baseAttackBonus
  );

  // const hp = derived.modifiers['hp'] ?? 0;
  // const attackBonusBonus = derived.modifiers['attack_bonus'] ?? 0;

  return {
    base,
    derived,
    final: {
      ac: acBlock,
      hpBreakdown: hpBlock,
      hpTemp: tempHPBlock,
      spellSlots: base.spellSlots, // might be unchanged
      meleeAttack: meleeAttackBlock,
    },
  };
}
