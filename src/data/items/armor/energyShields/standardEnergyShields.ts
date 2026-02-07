import { GameItem } from '@/types/items';

export const standardEnergyShield: GameItem = {
  id: 'standardEnergyShield',
  name: 'Standard Issue Energy Shield',
  type: 'energyShield',
  tags: ['energyShield'],
  modifiers: [{ target: 'hp_temp', operation: 'add', value: 10 }],
  requiresProficiency: ['energyShield'],
};

export const officersEnergyShield: GameItem = {
  id: 'officersEnergyShield',
  name: "Officer's Energy Shield",
  type: 'energyShield',
  tags: ['energyShield'],
  modifiers: [{ target: 'hp_temp', operation: 'add', value: 20 }],
  requiresProficiency: ['energyShield'],
};

export const commandersEnergyShield: GameItem = {
  id: 'commandersEnergyShield',
  name: "Commander's Energy Shield",
  type: 'energyShield',
  tags: ['energyShield'],
  modifiers: [{ target: 'hp_temp', operation: 'add', value: 30 }],
  requiresProficiency: ['energyShield'],
};
