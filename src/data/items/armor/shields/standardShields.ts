import { GameItem } from '@/types/items';

export const smallShield: GameItem = {
  id: 'smallShield',
  name: 'Small Shield',
  sortOrder: 110,
  type: 'shield',
  tags: [],
  modifiers: [{ target: 'ac_shield_base', operation: 'add', value: 1 }],
  requiresProficiency: ['armorLight'],
};

export const largeShield: GameItem = {
  id: 'largeShield',
  name: 'Large Shield',
  sortOrder: 120,
  type: 'shield',
  tags: [],
  modifiers: [{ target: 'ac_shield_base', operation: 'add', value: 2 }],
  requiresProficiency: ['armorHeavy'],
};
