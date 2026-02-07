import { GameItem } from '@/types/items';

export const bowCrossbow: GameItem = {
  id: 'bowCrossbow',
  name: 'Bow / Crossbow',
  type: 'weapon',
  tags: ['ranged', 'pierce', 'small', 'silent', '2h'],
  baseDamage: [
    { target: 'damage.pierce', operation: 'add', value: { diceRoll: 1, diceType: 6 } },
  ],
  ammo: 'arrow',
  ammoConsumption: 1,
  requiresProficiency: ['rangedAdvancedWeapons'],
};

export const energyPistol: GameItem = {
  id: 'energyPistol',
  name: 'Energy Pistol',
  type: 'weapon',
  tags: ['ranged', 'energy', 'small', '1h'],
  baseDamage: [
    { target: 'damage.energy', operation: 'add', value: { diceRoll: 1, diceType: 4 } },
  ],
  ammo: 'energy',
  ammoConsumption: 1,
  requiresProficiency: ['rangedAdvancedWeapons'],
};

export const liberatorHandgun: GameItem = {
  id: 'liberatorHandgun',
  name: 'Liberator Handgun',
  type: 'weapon',
  tags: ['ranged', 'energy', 'medium', '1h'],
  baseDamage: [
    { target: 'damage.energy', operation: 'add', value: { diceRoll: 1, diceType: 8 } },
  ],
  ammo: 'energy',
  ammoConsumption: 2,
  requiresProficiency: ['rangedAdvancedWeapons'],
};

export const creosantRifle: GameItem = {
  id: 'creosantRifle',
  name: 'Creosant Rifle',
  type: 'weapon',
  tags: ['ranged', 'energy', 'medium', '2h'],
  baseDamage: [
    { target: 'damage.energy', operation: 'add', value: { diceRoll: 1, diceType: 8 } },
  ],
  ammo: 'energy',
  ammoConsumption: 1,
  requiresProficiency: ['rangedAdvancedWeapons'],
};

export const assaultRifle: GameItem = {
  id: 'assaultRifle',
  name: 'Assault Rifle',
  type: 'weapon',
  tags: ['ranged', 'energy', 'medium', '2h'],
  baseDamage: [
    { target: 'damage.energy', operation: 'add', value: { diceRoll: 3, diceType: 4 } },
  ],
  ammo: 'energy',
  ammoConsumption: 3,
  requiresProficiency: ['rangedAdvancedWeapons'],
};

export const huntsmanRifle: GameItem = {
  id: 'huntsmanRifle',
  name: 'Huntsman Rifle',
  type: 'weapon',
  tags: ['ranged', 'energy', 'medium', 'crit19', '2h'],
  baseDamage: [
    { target: 'damage.energy', operation: 'add', value: { diceRoll: 1, diceType: 10 } },
  ],
  ammo: 'energy',
  ammoConsumption: 2,
  requiresProficiency: ['rangedAdvancedWeapons'],
};

export const sniperRifle: GameItem = {
  id: 'sniperRifle',
  name: 'Sniper Rifle',
  type: 'weapon',
  tags: ['ranged', 'energy', 'large', 'crit19', '2h'],
  baseDamage: [
    { target: 'damage.energy', operation: 'add', value: { diceRoll: 2, diceType: 6 } },
  ],
  ammo: 'energy',
  ammoConsumption: 4,
  requiresProficiency: ['rangedAdvancedWeapons'],
};

export const minigun: GameItem = {
  id: 'minigun',
  name: 'Minigun',
  type: 'weapon',
  tags: ['ranged', 'energy', 'large', 'heavy', 'silent', '2h'],
  baseDamage: [
    { target: 'damage.energy', operation: 'add', value: { diceRoll: 4, diceType: 6 } },
  ],
  ammo: 'energy',
  ammoConsumption: 10,
  requiresProficiency: ['rangedHeavyWeapons'],
};

export const heavyBlasterRepeater: GameItem = {
  id: 'heavyBlasterRepeater',
  name: 'Heavy Blaster Repeater',
  type: 'weapon',
  tags: ['ranged', 'energy', 'large', 'veryHeavy', '2h'],
  baseDamage: [
    { target: 'damage.energy', operation: 'add', value: { diceRoll: 2, diceType: 10 } },
  ],
  ammo: 'energy',
  ammoConsumption: 5,
  requiresProficiency: ['rangedHeavyWeapons'],
};

export const dimpleGrenade: GameItem = {
  id: 'dimpleGrenade',
  name: 'Dimple Grenade',
  type: 'weapon',
  tags: ['ranged', 'energy', 'small', '1h'],
  baseDamage: [
    { target: 'damage.energy', operation: 'add', value: { diceRoll: 10, diceType: 6 } },
  ],
  ammo: 'self',
  ammoConsumption: 1,
  requiresProficiency: ['rangedAdvancedWeapons'],
};

export const powerShotgun: GameItem = {
  id: 'powerShotgun',
  name: 'Power Shotgun',
  type: 'weapon',
  tags: ['ranged', 'energy', '2h', 'medium'],
  baseDamage: [
    {
      target: 'damage.energy',
      operation: 'add',
      value: { diceRoll: 3, diceType: 6 },
    },
  ],
  requiresProficiency: ['rangedAdvancedWeapons'],
  ammo: 'energy',
  ammoConsumption: 3,
};

export const hvrl: GameItem = {
  id: 'hvrl',
  name: 'HVRL - Handheld Variable Rocket Launcher',
  type: 'weapon',
  tags: ['ranged', 'large', 'heavy', '2h'],
  baseDamage: [
    { target: 'damage.energy', operation: 'add', value: { diceRoll: 20, diceType: 6 } },
  ],
  ammo: 'self',
  ammoConsumption: 1,
  requiresProficiency: ['rangedHeavyWeapons'],
  notes: 'Takes one action to load and one to fire.',
};
