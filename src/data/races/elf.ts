import { Race } from '../../types/race';

export const elf: Race = {
  id: 'Elf',
  name: 'Elf',
  description: `The seemingly immortal elves are a proud, elegant race with an affinity to magic and nature. Slow to change and learn. Their slender bodies are nimble yet not as durable or strong as humans. Standing 1.40 up to 1.60 meters tall. Life expectancy ~800 years`,
  baseStats: { str: 8, dex: 12, wis: 10, int: 12, con: 8, cha: 12 },
  specialAbilities: [
    'Magic affinity (+1 to magic dice rolls)',
    'Immunity to paralysis and sleep',
  ],
  restrictions: ['Cannot use heavy weapons without power armor'],
  allowedClassesId: ['Fighter', 'MagicUser', 'Cleric'],
};
