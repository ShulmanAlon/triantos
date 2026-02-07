import { GameItem } from '@/types/items';

export const plateArmor: GameItem = {
  id: 'plateArmor',
  name: 'Plate Armor',
  type: 'armor',
  tags: ['heavyArmor'],
  modifiers: [{ target: 'ac_armor_base', operation: 'add', value: 6 }],
  requiresProficiency: ['armorHeavy'],
};

export const chainMail: GameItem = {
  id: 'chainMail',
  name: 'Chain Mail',
  type: 'armor',
  tags: ['heavyArmor'],
  modifiers: [{ target: 'ac_armor_base', operation: 'add', value: 4 }],
  requiresProficiency: ['armorHeavy'],
};

export const ultronNanoArmor: GameItem = {
  id: 'ultronNanoArmor',
  name: 'Ultron Nano Armor',
  type: 'armor',
  tags: ['heavyArmor'],
  modifiers: [{ target: 'ac_armor_base', operation: 'add', value: 7 }],
  requiresProficiency: ['armorHeavy'],
};
