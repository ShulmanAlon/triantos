import { Race } from '../../types/race';

export const halfling: Race = {
  id: 'Halfling',
  name: 'Halfling',
  description: `Playful, lucky and mischievous little humanoids who seem to always find themselves in trouble. Standing 60 to 90 cm tall. Life expectancy ~120 years`,
  baseStats: { str: 8, dex: 12, wis: 12, int: 10, con: 8, cha: 12 },
  specialAbilities: [
    'Lucky criticals: Double damage in 19 and 20 attack rolls (19 only if attack hit)',
  ],
  restrictions: ['Cannot use large items'],
};
