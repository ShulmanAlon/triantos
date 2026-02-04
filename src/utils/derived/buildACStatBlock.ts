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

const skillLabelMap: Record<string, string> = {
  ac_with_unarmored: 'Unarmored Skill',
  ac_with_lightArmor: 'Light Armor Skill',
  ac_with_heavyArmor: 'Heavy Armor Skill',
  ac_with_powerArmor: 'Power Armor Skill',
  ac_with_shield: 'Shield Skill',
};

export function buildACStatBlock(
  derived: CharacterDerivedStats,
  attributes: Record<Attribute, number>,
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
  const shieldBonus = (derived.modifiers['ac_with_shield'] ?? 0) + shieldTagBonus;
  const shieldEnabled =
    derived.toggles['ac_with_heavyArmor'] ||
    'ac_with_heavyArmor' in derived.modifiers ||
    derived.toggles['ac_with_lightArmor'] ||
    'ac_with_lightArmor' in derived.modifiers;

  for (const armor of armorTypes) {
    const armorKey = `ac_with_${armor.id}`;
    const armorEnabled =
      derived.toggles[armorKey] || armorKey in derived.modifiers;
    const armorTagBonus = getTagBasedModifier('ac', ['armor', armor.id], derived);
    const armorBonus = (derived.modifiers[armorKey] ?? 0) + armorTagBonus;

    if (!armorEnabled && armorBonus === 0) continue;

    // Without shield
    const baseComponents: StatComponent[] = [
      { source: 'Base', value: base },
      { source: 'DEX Modifier', value: dexMod },
    ];
    if (armorBonus !== 0) {
      baseComponents.push({
        source: skillLabelMap[armorKey] ?? 'Armor Skill Bonus',
        value: armorBonus,
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
      if (shieldBonus !== 0) {
        shieldComponents.push({
          source: skillLabelMap['ac_with_shield'],
          value: shieldBonus,
        });
      }

      entries.push({
        label: `${armor.label} + Shield`,
        components: shieldComponents,
        total: shieldComponents.reduce((sum, c) => sum + c.value, 0),
      });
    }
  }

  const validLabels = entries.map((e) => e.label);
  const pinned =
    selectedLabels?.filter((label) => validLabels.includes(label)) ?? [];

  return pinned.length > 0
    ? { type: 'breakdown', entries, selectedLabels: pinned }
    : { type: 'breakdown', entries };
}
