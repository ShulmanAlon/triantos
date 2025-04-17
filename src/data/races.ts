import { Race } from '../types/race';

export const human: Race = {
  name: 'Human',
  description: `Greedy, cunning and power hungry, humans are the most influential and numerous race in The Exile even though they are the shortest lived. Very adaptable. Standing 1.5 up to 2.20 meters tall. Life expectancy ~80 years`,
  baseStats: { STR: 10, DEX: 10, WIS: 10, INT: 10, CON: 10, CHA: 10 },
  specialAbilities: ['Quick learner (+1 skill on levels 2,5,8,11..)'],
  restrictions: ['None'],
};
export const elf: Race = {
  name: 'Elf',
  description: `The seemingly immortal elves are a proud, elegant race with an affinity to magic and nature. Slow to change and learn. Their slender bodies are nimble yet not as durable or strong as humans. Standing 1.40 up to 1.60 meters tall. Life expectancy ~800 years`,
  baseStats: { STR: 10, DEX: 10, WIS: 10, INT: 10, CON: 10, CHA: 10 },
  specialAbilities: [
    'Magic affinity (+1 to magic dice rolls)',
    'Immunity to paralysis and sleep',
  ],
  restrictions: ['Cannot use heavy weapons without power armor'],
};
export const dwarf: Race = {
  name: 'Dwarf',
  description: `Stout, short and very proud race that seems to flourish underground. Strong warriors, builders and miners. Dwarves have a resistance against magic. Standing 1.10 up to 1.30 meters tall. Life expectancy ~160 years`,
  baseStats: { STR: 10, DEX: 10, WIS: 10, INT: 10, CON: 10, CHA: 10 },
  specialAbilities: [
    'Magic resistance: +1 on saving throws vs spells',
    'Level 11: Half damage from magic effects',
  ],
  restrictions: ['Cannot use large items', 'Cannot be a magic user'],
};
export const halfling: Race = {
  name: 'Halfling',
  description: `Playful, lucky and mischievous little humanoids who seem to always find themselves in trouble. Standing 60 to 90 cm tall. Life expectancy ~120 years`,
  baseStats: { STR: 10, DEX: 10, WIS: 10, INT: 10, CON: 10, CHA: 10 },
  specialAbilities: [
    'Lucky criticals: Double damage in 19 and 20 attack rolls (19 only if attack hit)',
  ],
  restrictions: ['Cannot use large items'],
};

export const races: Race[] = [human, elf, dwarf, halfling];
