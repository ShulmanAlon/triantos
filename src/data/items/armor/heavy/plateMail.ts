import { GameItem } from '@/types/items';

export const plateArmor: GameItem = {
  id: 'plateArmor',
  name: 'Plate Armor',
  type: 'armor',
  tags: ['heavyArmor'],
  modifiers: [{ target: 'ac_armor_base', operation: 'add', value: 6 }],
  requiresProficiency: ['armorHeavy'],
};

export const plateArmorPlusOneFireResist: GameItem = {
  id: 'plateArmorPlusOneFireResist',
  name: 'Plate Armor +1, fire resistance',
  type: 'armor',
  tags: ['heavyArmor'],
  modifiers: [
    { target: 'ac_armor_base', operation: 'add', value: 6 },
    { target: 'ac_armor_magic', operation: 'add', value: 1 },
    { target: 'resist.fire', operation: 'multiply', value: 0.5 },
  ],
  requiresProficiency: ['armorHeavy'],
};
