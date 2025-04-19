import { Race } from '../../types/race';

export const dwarf: Race = {
  id: 'Dwarf',
  name: 'Dwarf',
  description: `Stout, short and very proud race that seems to flourish underground. Strong warriors, builders and miners. Dwarves have a resistance against magic. Standing 1.10 up to 1.30 meters tall. Life expectancy ~160 years`,
  baseStats: { str: 12, dex: 8, wis: 10, int: 8, con: 12, cha: 10 },
  specialAbilities: [
    'Magic resistance: +1 on saving throws vs spells',
    'Level 11: Half damage from magic effects',
  ],
  restrictions: ['Cannot use large items', 'Cannot be a magic user'],
};
