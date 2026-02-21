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
import { getModifier } from '@/utils/modifier';
import { getClassLevelDataById } from '@/utils/classUtils';
import { getHighestSkillTiers } from '@/utils/domain/skills';

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
  const tempHPBlock = buildTempHPStatBlock(
    derived,
    derivedFromSkills,
    equipmentModifiers
  );
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
  const spellResistanceBonus = derived.modifiers['spell_resistance_bonus'] ?? 0;
  const spellResistanceBlock =
    spellResistanceBonus === 0
      ? { type: 'simple' as const, value: 0 }
      : {
          type: 'breakdown' as const,
          entries: [
            {
              label: 'Spell Resistance',
              total: spellResistanceBonus,
              components: [{ source: 'Race Progression', value: spellResistanceBonus }],
            },
          ],
          selectedLabels: ['Spell Resistance'],
        };
  const highestBySkill = getHighestSkillTiers(skillSelections);
  const casterAttribute =
    gameClass.id === 'MagicUser'
      ? 'int'
      : gameClass.id === 'Cleric'
        ? 'wis'
        : null;
  const casterPenetrationTier =
    gameClass.id === 'MagicUser'
      ? highestBySkill.get('spellPenetrationMage')?.tier ?? 0
      : gameClass.id === 'Cleric'
        ? highestBySkill.get('spellPenetrationCleric')?.tier ?? 0
        : 0;
  const spellPenetrationBonus = casterPenetrationTier * 2;
  const classSpellPower =
    getClassLevelDataById(gameClass.id, level)?.spellPower ??
    (base.spellSlots ? level : 0);
  const casterAttributeBonus = casterAttribute
    ? getModifier(attributes[casterAttribute])
    : 0;
  const canCast = casterAttribute !== null;
  const baseSpellPower = canCast
    ? classSpellPower + spellPenetrationBonus + casterAttributeBonus
    : 0;
  const spellPowerByLevel = canCast
    ? Object.fromEntries(
        Object.keys(base.spellSlots ?? {}).map((spellLevel) => [
          Number(spellLevel),
          baseSpellPower + Number(spellLevel),
        ])
      )
    : undefined;
  const spellPowerBlock = canCast
    ? {
        type: 'breakdown' as const,
        entries: [
          {
            label: 'Base Spell Power',
            total: baseSpellPower,
            components: [
              { source: 'Class Progression', value: classSpellPower },
              { source: 'Spell Penetration Skill', value: spellPenetrationBonus },
              {
                source: `${casterAttribute === 'int' ? 'INT' : 'WIS'} Modifier`,
                value: casterAttributeBonus,
              },
              { source: 'Spell Level', value: 0 },
            ],
          },
        ],
        selectedLabels: ['Base Spell Power'],
      }
    : undefined;

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
      spellResistance: spellResistanceBlock,
      spellPower: spellPowerBlock,
      spellPowerByLevel,
    },
  };
}
