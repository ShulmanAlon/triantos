import { GameClass } from '@/types/gameClass';

export const fighter: GameClass = {
  id: 'Fighter',
  primaryAttributes: { str: 13, dex: 11 },
  hpPerLevelToNine: 8,
  hpPerLevelFromTen: 3,
  allowedRaces: ['Human', 'Elf', 'Dwarf', 'Halfling'],
  progression: [
    {
      level: 1,
      skill: [
        { skillPoints: 1, skillPointType: 'utility' },
        { onlyForRace: 'Human', skillPoints: 1, skillPointType: 'human' },
      ],
      baseAttackBonus: 2,
    },
    {
      level: 2,
      skill: [{ skillPoints: 1, skillPointType: 'core' }],
      baseAttackBonus: 2,
    },
    {
      level: 3,
      skill: [
        { onlyForRace: 'Human', skillPoints: 1, skillPointType: 'human' },
      ],
      baseAttackBonus: 3,
    },
    {
      level: 4,
      skill: [{ skillPoints: 1, skillPointType: 'utility' }],
      baseAttackBonus: 3,
      abilityPoint: 1,
    },
    {
      level: 5,
      skill: [{ skillPoints: 1, skillPointType: 'core' }],
      baseAttackBonus: 4,
    },
    {
      level: 6,
      skill: [
        { onlyForRace: 'Human', skillPoints: 1, skillPointType: 'human' },
      ],
      baseAttackBonus: 4,
    },
    {
      level: 7,
      skill: [{ skillPoints: 1, skillPointType: 'utility' }],
      baseAttackBonus: 5,
    },
    {
      level: 8,
      skill: [{ skillPoints: 1, skillPointType: 'core' }],
      baseAttackBonus: 5,
      abilityPoint: 1,
    },
    {
      level: 9,
      skill: [
        { onlyForRace: 'Human', skillPoints: 1, skillPointType: 'human' },
      ],
      baseAttackBonus: 6,
    },
    {
      level: 10,
      skill: [{ skillPoints: 1, skillPointType: 'utility' }],
      baseAttackBonus: 6,
    },
    {
      level: 11,
      skill: [{ skillPoints: 1, skillPointType: 'core' }],
      baseAttackBonus: 7,
      feature: '2 attacks',
      attacksPerRound: 2,
    },
    {
      level: 12,
      skill: [
        { onlyForRace: 'Human', skillPoints: 1, skillPointType: 'human' },
      ],
      baseAttackBonus: 7,
      abilityPoint: 1,
    },
    {
      level: 13,
      skill: [{ skillPoints: 1, skillPointType: 'utility' }],
      baseAttackBonus: 8,
    },
    {
      level: 14,
      skill: [{ skillPoints: 1, skillPointType: 'core' }],
      baseAttackBonus: 8,
    },
    {
      level: 15,
      skill: [
        { onlyForRace: 'Human', skillPoints: 1, skillPointType: 'human' },
      ],
      baseAttackBonus: 9,
    },
    {
      level: 16,
      skill: [{ skillPoints: 1, skillPointType: 'utility' }],
      baseAttackBonus: 9,
      abilityPoint: 1,
    },
    {
      level: 17,
      skill: [{ skillPoints: 1, skillPointType: 'core' }],
      baseAttackBonus: 10,
    },
    {
      level: 18,
      skill: [
        { onlyForRace: 'Human', skillPoints: 1, skillPointType: 'human' },
      ],
      baseAttackBonus: 10,
    },
  ],
};
