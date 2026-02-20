import { GameItem } from '@/types/items';

export const powerArmor: GameItem = {
  id: 'powerArmor',
  name: 'Power Armor',
  sortOrder: 300,
  type: 'armor',
  tags: ['powerArmor'],
  modifiers: [{ target: 'ac_armor_base', operation: 'add', value: 10 }],
  requiresProficiency: ['armorPower'],
  notes: 'Energy source required (flavor).',
};
