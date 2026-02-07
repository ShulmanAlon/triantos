import { GameItem } from '@/types/items';

export const smallShield: GameItem = {
  id: 'smallShield',
  name: 'Small Shield',
  type: 'shield',
  tags: [],
  modifiers: [{ target: 'ac_shield_base', operation: 'add', value: 1 }],
  requiresProficiency: ['armorLight'],
};

export const largeShield: GameItem = {
  id: 'largeShield',
  name: 'Large Shield',
  type: 'shield',
  tags: [],
  modifiers: [{ target: 'ac_shield_base', operation: 'add', value: 2 }],
  requiresProficiency: ['armorHeavy'],
};
