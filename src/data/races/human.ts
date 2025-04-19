import { Race } from '../../types/race';

export const human: Race = {
  id: 'Human',
  name: 'Human',
  description: `Greedy, cunning and power hungry, humans are the most influential and numerous race in The Exile even though they are the shortest lived. Very adaptable. Standing 1.5 up to 2.20 meters tall. Life expectancy ~80 years`,
  baseStats: { str: 10, dex: 10, wis: 10, int: 10, con: 10, cha: 10 },
  specialAbilities: ['Quick learner (+1 skill on levels 2,5,8,11..)'],
  restrictions: ['None'],
};
