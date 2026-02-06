import { DamageTarget, DamageType, ProficiencyId } from '@/config/constants';
import { DiceRoll, isDiceRoll, StatModifier } from '@/types/modifiers';
import { CharacterDerivedStats } from '@/types/characters';

export type DamagePart = {
  type: DamageType;
  value: number | DiceRoll;
};

const makeDamageLabel = (label: string, value: string) => ({
  label,
  value,
});

const formatSignedValue = (value: number): string =>
  value > 0 ? `+${value}` : `${value}`;

export const isDamageTarget = (target: string): target is DamageTarget =>
  target.startsWith('damage.');

export const parseDamageParts = (mods: StatModifier[]): DamagePart[] => {
  return mods
    .filter((mod) => isDamageTarget(mod.target) && mod.operation === 'add')
    .flatMap((mod) => {
      if (typeof mod.value === 'number' || isDiceRoll(mod.value)) {
        const type = mod.target.split('.')[1] as DamageType;
        return [{ type, value: mod.value }];
      }
      return [];
    });
};

export const formatDamagePart = (part: DamagePart): string => {
  if (typeof part.value === 'number') {
    return `${part.value} ${part.type}`;
  }
  return `${part.value.diceRoll}d${part.value.diceType} ${part.type}`;
};

export const getModifierValue = (
  derived: CharacterDerivedStats,
  target: string
): number => {
  const value = derived.modifiers[target];
  return typeof value === 'number' ? value : 0;
};

export const getProficiencyToggleKey = (req: ProficiencyId) => {
  switch (req) {
    case 'armorHeavy':
      return 'ac_with_heavyArmor';
    case 'armorLight':
      return 'ac_with_lightArmor';
    case 'armorPower':
      return 'ac_with_powerArmor';
    case 'armorUnarmored':
      return 'ac_with_unarmored';
    case 'shieldFortress':
      return 'ac_with_shield';
    default:
      return `proficiency.${req}`;
  }
};

export type DamageBreakdown = {
  summary: string;
  parts: { label: string; value: string }[];
};

export const buildDamageBreakdown = ({
  baseModifiers,
  enchantmentModifiers,
  strengthModifier,
}: {
  baseModifiers: StatModifier[];
  enchantmentModifiers: StatModifier[];
  strengthModifier?: number;
}): DamageBreakdown => {
  const baseParts = parseDamageParts(baseModifiers);
  const enchantParts = parseDamageParts(enchantmentModifiers);

  const parts: { label: string; value: string }[] = [];

  for (const part of baseParts) {
    parts.push(makeDamageLabel('weapon', formatDamagePart(part)));
  }

  if (typeof strengthModifier === 'number' && strengthModifier !== 0) {
    parts.push({
      label: 'STR',
      value: formatSignedValue(strengthModifier),
    });
  }

  for (const part of enchantParts) {
    const text = formatDamagePart(part);
    parts.push(
      makeDamageLabel(
        'enchantment',
        text.startsWith('-') ? text : `+${text}`
      )
    );
  }

  const summaryParts: string[] = [];
  for (const part of parts) {
    if (part.label === 'weapon') {
      summaryParts.push(part.value.split(' ')[0]);
    } else if (part.label === 'STR') {
      summaryParts.push(part.value);
    } else if (part.label === 'enchantment') {
      summaryParts.push(part.value.split(' ')[0]);
    } else if (part.label.startsWith('skill')) {
      summaryParts.push(part.value);
    }
  }

  return {
    summary: summaryParts.length > 0 ? summaryParts.join(' ') : '—',
    parts,
  };
};
