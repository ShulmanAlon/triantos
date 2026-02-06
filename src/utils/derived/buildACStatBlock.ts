import {
  CharacterDerivedStats,
  StatBlock,
  StatFormula,
  StatComponent,
} from '@/types/characters';
import { Attribute } from '@/types/attributes';
import { BASE_AC } from '@/config/constants';
import { getModifier } from '../modifier';
import { getTagBasedModifier } from '@/utils/logic/tagModifiers';
import { StatModifier } from '@/types/modifiers';
import { getModifierValue } from '@/utils/domain/modifiers';

export type EquipmentACContext = {
  armorType?: 'unarmored' | 'lightArmor' | 'heavyArmor' | 'powerArmor';
  shieldEquipped?: boolean;
};

const SKILL_LABELS: Record<string, string> = {
  ac_with_unarmored: 'Unarmored Skill',
  ac_with_lightArmor: 'Light Armor Skill',
  ac_with_heavyArmor: 'Heavy Armor Skill',
  ac_with_powerArmor: 'Power Armor Skill',
  ac_with_shield: 'Shield Skill',
};

const sumModifiers = (mods: StatModifier[], target: string): number =>
  mods
    .filter((mod) => mod.target === target && typeof mod.value === 'number')
    .reduce((sum, mod) => sum + (mod.value as number), 0);

const buildArmorLabel = (armorType?: string): string => {
  switch (armorType) {
    case 'lightArmor':
      return 'Light Armor';
    case 'heavyArmor':
      return 'Heavy Armor';
    case 'powerArmor':
      return 'Power Armor';
    default:
      return 'Unarmored';
  }
};

export function buildACStatBlock(
  derived: CharacterDerivedStats,
  attributes: Record<Attribute, number>,
  equipmentModifiers: StatModifier[] = [],
  skillDerived?: CharacterDerivedStats,
  equipmentContext?: EquipmentACContext,
  selectedLabels?: string[]
): StatBlock<number> {
  const entries: StatFormula[] = [];

  const dexMod = getModifier(attributes.dex);
  const base = BASE_AC;

  const armorTypes = [
    { id: 'unarmored', label: 'Unarmored' },
    { id: 'lightArmor', label: 'Light Armor' },
    { id: 'heavyArmor', label: 'Heavy Armor' },
    { id: 'powerArmor', label: 'Power Armor' },
  ];

  const shieldTagBonus = getTagBasedModifier('ac', ['shield'], derived);
  const shieldSkillBonus =
    (skillDerived ? getModifierValue(skillDerived, 'ac_with_shield') : 0) +
    shieldTagBonus;
  const shieldBaseBonus = sumModifiers(equipmentModifiers, 'ac_shield_base');
  const shieldMagicBonus = sumModifiers(equipmentModifiers, 'ac_shield_magic');
  const shieldEnabled = equipmentContext
    ? !!equipmentContext.shieldEquipped
    : derived.toggles['ac_with_heavyArmor'] ||
      'ac_with_heavyArmor' in derived.modifiers ||
      derived.toggles['ac_with_lightArmor'] ||
      'ac_with_lightArmor' in derived.modifiers;

  const filteredArmorTypes = equipmentContext?.armorType
    ? armorTypes.filter((armor) => armor.id === equipmentContext.armorType)
    : armorTypes;

  for (const armor of filteredArmorTypes) {
    const armorKey = `ac_with_${armor.id}`;
    const isSelectedArmor = equipmentContext?.armorType === armor.id;
    const armorEnabled =
      isSelectedArmor ||
      derived.toggles[armorKey] ||
      armorKey in derived.modifiers;
    const armorTagBonus = getTagBasedModifier('ac', ['armor', armor.id], derived);
    const armorSkillBonus =
      (skillDerived ? getModifierValue(skillDerived, armorKey) : 0) + armorTagBonus;
    const armorBaseBonus = sumModifiers(equipmentModifiers, 'ac_armor_base');
    const armorMagicBonus = sumModifiers(equipmentModifiers, 'ac_armor_magic');
    const armorBonus = armorSkillBonus + armorBaseBonus + armorMagicBonus;

    if (!armorEnabled && armorBonus === 0) continue;

    // Without shield
    const baseComponents: StatComponent[] = [
      { source: 'Base', value: base },
      { source: 'DEX Modifier', value: dexMod },
    ];
    if (armorBaseBonus !== 0) {
      baseComponents.push({
        source: 'Armor Base',
        value: armorBaseBonus,
      });
    }
    if (armorMagicBonus !== 0) {
      baseComponents.push({
        source: 'Armor Magic Bonus',
        value: armorMagicBonus,
      });
    }
    if (armorEnabled) {
      baseComponents.push({
        source: SKILL_LABELS[armorKey] ?? 'Armor Skill Bonus',
        value: armorSkillBonus,
      });
    }
    entries.push({
      label: armor.label,
      components: baseComponents,
      total: baseComponents.reduce((sum, c) => sum + c.value, 0),
    });

    // With shield
    if (shieldEnabled) {
      const shieldComponents: StatComponent[] = [...baseComponents];
      if (shieldBaseBonus !== 0) {
        shieldComponents.push({
          source: 'Shield Base',
          value: shieldBaseBonus,
        });
      }
      if (shieldMagicBonus !== 0) {
        shieldComponents.push({
          source: 'Shield Magic Bonus',
          value: shieldMagicBonus,
        });
      }
      shieldComponents.push({
        source: SKILL_LABELS['ac_with_shield'],
        value: shieldSkillBonus,
      });

      entries.push({
        label: `${armor.label} + Shield`,
        components: shieldComponents,
        total: shieldComponents.reduce((sum, c) => sum + c.value, 0),
      });
    }
  }

  const validLabels = entries.map((e) => e.label);
  let pinned =
    selectedLabels?.filter((label) => validLabels.includes(label)) ?? [];

  if (equipmentContext?.armorType) {
    const armorLabel =
      armorTypes.find((armor) => armor.id === equipmentContext.armorType)
        ?.label ?? buildArmorLabel(equipmentContext.armorType);
    const preferred = equipmentContext.shieldEquipped
      ? `${armorLabel} + Shield`
      : armorLabel;
    pinned = validLabels.includes(preferred) ? [preferred] : pinned;
  }

  return pinned.length > 0
    ? { type: 'breakdown', entries, selectedLabels: pinned }
    : { type: 'breakdown', entries };
}
