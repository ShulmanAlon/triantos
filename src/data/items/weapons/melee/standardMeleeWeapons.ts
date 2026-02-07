import { GameItem } from '@/types/items';

export const knife: GameItem = {
  id: 'knife',
  name: 'Knife',
  type: 'weapon',
  tags: ['melee', 'slash', 'small', '1h'],
  baseDamage: [
    { target: 'damage.slash', operation: 'add', value: { diceRoll: 1, diceType: 4 } },
  ],
  requiresProficiency: ['basicWeapons'],
};

export const unarmed: GameItem = {
  id: 'unarmed',
  name: 'Unarmed',
  type: 'weapon',
  tags: ['melee', 'blunt', '1h'],
  baseDamage: [
    { target: 'damage.blunt', operation: 'add', value: { diceRoll: 1, diceType: 2 } },
  ],
  requiresProficiency: ['basicWeapons'],
};

export const dagger: GameItem = {
  id: 'dagger',
  name: 'Dagger',
  type: 'weapon',
  tags: ['melee', 'pierce', 'small', '1h'],
  baseDamage: [
    { target: 'damage.pierce', operation: 'add', value: { diceRoll: 1, diceType: 4 } },
  ],
  requiresProficiency: ['basicWeapons'],
};

export const mace: GameItem = {
  id: 'mace',
  name: 'Mace',
  type: 'weapon',
  tags: ['melee', 'blunt', 'medium', '1h'],
  baseDamage: [
    { target: 'damage.blunt', operation: 'add', value: { diceRoll: 1, diceType: 8 } },
  ],
  requiresProficiency: ['basicWeapons'],
};

export const hammer: GameItem = {
  id: 'hammer',
  name: 'Hammer',
  type: 'weapon',
  tags: ['melee', 'blunt', 'medium', '1h'],
  baseDamage: [
    { target: 'damage.blunt', operation: 'add', value: { diceRoll: 1, diceType: 8 } },
  ],
  requiresProficiency: ['basicWeapons'],
};

export const sword: GameItem = {
  id: 'sword',
  name: 'Sword',
  type: 'weapon',
  tags: ['melee', 'slash', 'medium', '1h'],
  baseDamage: [
    { target: 'damage.slash', operation: 'add', value: { diceRoll: 1, diceType: 10 } },
  ],
  requiresProficiency: ['basicWeapons'],
};

export const axe: GameItem = {
  id: 'axe',
  name: 'Axe',
  type: 'weapon',
  tags: ['melee', 'slash', 'medium', '1h'],
  baseDamage: [
    { target: 'damage.slash', operation: 'add', value: { diceRoll: 1, diceType: 10 } },
  ],
  requiresProficiency: ['basicWeapons'],
};

export const powerFist: GameItem = {
  id: 'powerFist',
  name: 'Power Fist',
  type: 'weapon',
  tags: ['melee', 'energy', 'small', '1h'],
  baseDamage: [
    { target: 'damage.energy', operation: 'add', value: { diceRoll: 1, diceType: 10 } },
  ],
  ammo: 'energy',
  ammoConsumption: 1,
  requiresProficiency: ['meleeEnergyWeapons'],
};

export const warhammer: GameItem = {
  id: 'warhammer',
  name: 'Warhammer',
  type: 'weapon',
  tags: ['melee', 'blunt', 'medium', '2h'],
  baseDamage: [
    { target: 'damage.blunt', operation: 'add', value: { diceRoll: 1, diceType: 10 } },
  ],
  requiresProficiency: ['melee2hWeapons'],
};

export const battleaxe: GameItem = {
  id: 'battleaxe',
  name: 'Battleaxe',
  type: 'weapon',
  tags: ['melee', 'slash', 'medium', '2h'],
  baseDamage: [
    { target: 'damage.slash', operation: 'add', value: { diceRoll: 2, diceType: 6 } },
  ],
  requiresProficiency: ['melee2hWeapons'],
};

export const longsword: GameItem = {
  id: 'longsword',
  name: 'Longsword',
  type: 'weapon',
  tags: ['melee', 'slash', 'large', '2h'],
  baseDamage: [
    { target: 'damage.slash', operation: 'add', value: { diceRoll: 2, diceType: 6 } },
  ],
  requiresProficiency: ['melee2hWeapons'],
};

export const greatsword: GameItem = {
  id: 'greatsword',
  name: 'Greatsword',
  type: 'weapon',
  tags: ['melee', 'slash', 'large', 'heavy', '2h'],
  baseDamage: [
    { target: 'damage.slash', operation: 'add', value: { diceRoll: 2, diceType: 8 } },
  ],
  requiresProficiency: ['melee2hWeapons'],
};

export const plasmaCutter: GameItem = {
  id: 'plasmaCutter',
  name: 'Plasma Cutter',
  type: 'weapon',
  tags: ['melee', 'energy', '2h', 'medium'],
  baseDamage: [
    {
      target: 'damage.energy',
      operation: 'add',
      value: { diceRoll: 2, diceType: 8 },
    },
  ],
  requiresProficiency: ['meleeEnergyWeapons'],
  ammo: 'energy',
  ammoConsumption: 2,
};
