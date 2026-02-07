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
      skill: [{ onlyForRace: 'Human', skillPoints: 1, skillPointType: 'human' }],
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
      skill: [{ onlyForRace: 'Human', skillPoints: 1, skillPointType: 'human' }],
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
      skill: [{ onlyForRace: 'Human', skillPoints: 1, skillPointType: 'human' }],
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
    },
    {
      level: 12,
      skill: [{ onlyForRace: 'Human', skillPoints: 1, skillPointType: 'human' }],
      baseAttackBonus: 7,
      // TODO: Move to intended level when progression is finalized.
      attacksPerRound: 2,
      abilityPoint: 1,
    },
    // TODO: ... continue through level 18
  ],
};
