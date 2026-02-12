import { GameItem } from '@/types/items';
import { requiresWeaponProficiency } from '../weaponProficiencyMap';

export const knife: GameItem = {
  id: 'knife',
  name: 'Knife',
  type: 'weapon',
  tags: ['melee', 'slash', 'small', '1h'],
  baseDamage: [
    { target: 'damage.slash', operation: 'add', value: { diceRoll: 1, diceType: 4 } },
  ],
  requiresProficiency: requiresWeaponProficiency('knife'),
};

export const unarmed: GameItem = {
  id: 'unarmed',
  name: 'Unarmed',
  type: 'weapon',
  tags: ['melee', 'blunt', '1h'],
  baseDamage: [
    { target: 'damage.blunt', operation: 'add', value: { diceRoll: 1, diceType: 2 } },
  ],
  requiresProficiency: requiresWeaponProficiency('unarmed'),
};

export const dagger: GameItem = {
  id: 'dagger',
  name: 'Dagger',
  type: 'weapon',
  tags: ['melee', 'pierce', 'small', '1h'],
  baseDamage: [
    { target: 'damage.pierce', operation: 'add', value: { diceRoll: 1, diceType: 4 } },
  ],
  requiresProficiency: requiresWeaponProficiency('dagger'),
};

export const mace: GameItem = {
  id: 'mace',
  name: 'Mace',
  type: 'weapon',
  tags: ['melee', 'blunt', 'medium', '1h'],
  baseDamage: [
    { target: 'damage.blunt', operation: 'add', value: { diceRoll: 1, diceType: 8 } },
  ],
  requiresProficiency: requiresWeaponProficiency('mace'),
};

export const hammer: GameItem = {
  id: 'hammer',
  name: 'Hammer',
  type: 'weapon',
  tags: ['melee', 'blunt', 'medium', '1h'],
  baseDamage: [
    { target: 'damage.blunt', operation: 'add', value: { diceRoll: 1, diceType: 8 } },
  ],
  requiresProficiency: requiresWeaponProficiency('hammer'),
};

export const sword: GameItem = {
  id: 'sword',
  name: 'Sword',
  type: 'weapon',
  tags: ['melee', 'slash', 'medium', '1h'],
  baseDamage: [
    { target: 'damage.slash', operation: 'add', value: { diceRoll: 1, diceType: 10 } },
  ],
  requiresProficiency: requiresWeaponProficiency('sword'),
};

export const axe: GameItem = {
  id: 'axe',
  name: 'Axe',
  type: 'weapon',
  tags: ['melee', 'slash', 'medium', '1h'],
  baseDamage: [
    { target: 'damage.slash', operation: 'add', value: { diceRoll: 1, diceType: 10 } },
  ],
  requiresProficiency: requiresWeaponProficiency('axe'),
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
  requiresProficiency: requiresWeaponProficiency('powerFist'),
};

export const warhammer: GameItem = {
  id: 'warhammer',
  name: 'Warhammer',
  type: 'weapon',
  tags: ['melee', 'blunt', 'medium', '2h'],
  baseDamage: [
    { target: 'damage.blunt', operation: 'add', value: { diceRoll: 1, diceType: 10 } },
  ],
  requiresProficiency: requiresWeaponProficiency('warhammer'),
};

export const battleaxe: GameItem = {
  id: 'battleaxe',
  name: 'Battleaxe',
  type: 'weapon',
  tags: ['melee', 'slash', 'medium', '2h'],
  baseDamage: [
    { target: 'damage.slash', operation: 'add', value: { diceRoll: 2, diceType: 6 } },
  ],
  requiresProficiency: requiresWeaponProficiency('battleaxe'),
};

export const longsword: GameItem = {
  id: 'longsword',
  name: 'Longsword',
  type: 'weapon',
  tags: ['melee', 'slash', 'large', '2h'],
  baseDamage: [
    { target: 'damage.slash', operation: 'add', value: { diceRoll: 2, diceType: 6 } },
  ],
  requiresProficiency: requiresWeaponProficiency('longsword'),
};

export const greatsword: GameItem = {
  id: 'greatsword',
  name: 'Greatsword',
  type: 'weapon',
  tags: ['melee', 'slash', 'large', 'heavy', '2h'],
  baseDamage: [
    { target: 'damage.slash', operation: 'add', value: { diceRoll: 2, diceType: 8 } },
  ],
  requiresProficiency: requiresWeaponProficiency('greatsword'),
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
  requiresProficiency: requiresWeaponProficiency('plasmaCutter'),
  ammo: 'energy',
  ammoConsumption: 2,
};
