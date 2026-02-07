import { GameItem } from '@/types/items';

export const clothing: GameItem = {
  id: 'clothing',
  name: 'Clothing',
  type: 'armor',
  tags: ['clothing'],
  modifiers: [{ target: 'ac_armor_base', operation: 'add', value: 0 }],
  requiresProficiency: ['armorUnarmored'],
};

export const leatherArmor: GameItem = {
  id: 'leatherArmor',
  name: 'Leather Armor',
  type: 'armor',
  tags: ['lightArmor'],
  modifiers: [{ target: 'ac_armor_base', operation: 'add', value: 2 }],
  requiresProficiency: ['armorLight'],
};

export const ceramicArmor: GameItem = {
  id: 'ceramicArmor',
  name: 'Ceramic Armor',
  type: 'armor',
  tags: ['lightArmor'],
  modifiers: [{ target: 'ac_armor_base', operation: 'add', value: 3 }],
  requiresProficiency: ['armorLight'],
};
