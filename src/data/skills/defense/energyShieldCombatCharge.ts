import { SkillEntity } from '@/types/skills';

export const energyShieldCombatCharge: SkillEntity = {
  id: 'energyShieldCombatCharge',
  name: 'Energy Shield - Combat Charge',
  family: 'defense',
  skillPointType: 'core',
  description:
    'After your Energy Shield is depleted, it recharges fully 2 rounds later at double energy cost.',
  tiers: [
    {
      tier: 1,
      name: 'Basic',
      description:
        '2 rounds after shield depletion, shield recharges fully at double energy cost.',
      deltaDescription:
        '2 rounds after shield depletion, shield recharges fully at double energy cost.',
      totalDescription:
        '2 rounds after shield depletion, shield recharges fully at double energy cost.',
      prerequisites: [
        { type: 'skill', skillId: 'energyShield', tier: 1 },
        { type: 'level', minimum: 10 },
      ],
      effects: [],
    },
  ],
};
