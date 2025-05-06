import { GameItem } from '@/types/items';

export const PlateArmor: GameItem = {
  id: 'plateArmor',
  name: 'Plate Armor',
  type: 'armor',
  tags: ['heavyArmor'],
  modifiers: [{ target: 'ac_with_heavyArmor', operation: 'add', value: 6 }],
  requiresProficiency: ['heavyArmor'],
};

export const PlateArmorPlusOneFireResist: GameItem = {
  id: 'plateArmorPlusOneFireResist',
  name: 'Plate Armor +1, fire resistance',
  type: 'armor',
  tags: ['heavyArmor'],
  modifiers: [
    { target: 'ac_with_heavyArmor', operation: 'add', value: 6 },
    { target: 'ac_with_heavyArmor', operation: 'add', value: 1 },
    { target: 'resist.fire', operation: 'multiply', value: 0.5 },
  ],
  requiresProficiency: ['heavyArmor'],
};
