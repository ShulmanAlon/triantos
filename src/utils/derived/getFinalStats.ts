import { Attribute } from '@/types/attributes';
import {
  CharacterSkillSelection,
  FinalCharacterStats,
} from '@/types/characters';
import { GameClass } from '@/types/gameClass';
import { SkillEntity } from '@/types/skills';
import { getCharacterEffects } from '@/utils/skills/getCharacterEffects';
import { interpretEffects } from '@/utils/skills/interpretEffects';
import { getBaseDerivedStats } from './getBaseDerivedStats';
import { buildACStatBlock } from './buildACStatBlock';
import { buildHPStatBlock } from './buildHPStatBlock';
import { buildTempHPStatBlock } from './buildTempHPStatBlock';
import { buildMeleeAttackStatBlock } from './buildMeleeAttackStatBlock';
import { buildRangedAttackStatBlock, RangedType } from './buildRangedAttackStatBlock';
import { StatModifier } from '@/types/modifiers';
import { EquipmentACContext } from './buildACStatBlock';
import { MeleeTypes, ProficiencyId } from '@/config/constants';

type EquipmentContext = {
  ac?: EquipmentACContext;
  melee?: {
    id: MeleeTypes;
    label: string;
    requiredProficiencyId?: ProficiencyId;
  };
  ranged?: {
    id: RangedType;
    label: string;
    requiredProficiencyId?: ProficiencyId;
  };
};

export function getFinalStats(
  gameClass: GameClass,
  attributes: Record<Attribute, number>,
  level: number,
  skillSelections: CharacterSkillSelection[],
  skillEntities: SkillEntity[],
  equipmentModifiers: StatModifier[] = [],
  equipmentContext?: EquipmentContext,
): FinalCharacterStats {
  const base = getBaseDerivedStats(gameClass, attributes, level);

  const skillEffects = getCharacterEffects(skillSelections, skillEntities);
  const derivedFromSkills = interpretEffects(skillEffects);
  const derived = interpretEffects([...skillEffects, ...equipmentModifiers]);
  const hpBlock = buildHPStatBlock(gameClass, attributes, level, derived);
  const tempHPBlock = buildTempHPStatBlock(derived);
  const acBlock = buildACStatBlock(
    derived,
    attributes,
    equipmentModifiers,
    derivedFromSkills,
    equipmentContext?.ac
  );
  const meleeAttackBlock = buildMeleeAttackStatBlock(
    attributes,
    derived,
    base.baseAttackBonus,
    equipmentContext?.melee,
    equipmentContext?.melee?.requiredProficiencyId,
  );
  const rangedAttackBlock = buildRangedAttackStatBlock(
    attributes,
    derived,
    base.baseAttackBonus,
    equipmentContext?.ranged,
    equipmentContext?.ranged?.requiredProficiencyId,
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
      rangedAttack: rangedAttackBlock,
    },
  };
}
