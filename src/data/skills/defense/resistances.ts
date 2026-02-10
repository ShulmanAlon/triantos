import { SkillEntity } from '@/types/skills';

const resistanceDescription =
  'Gain resistance to this damage type, reducing damage by 1 per die (minimum 1 per die).';

const makeResistance = (id: string, name: string): SkillEntity => ({
  id,
  name,
  family: 'defense',
  skillPointType: 'core',
  description: resistanceDescription,
  tiers: [
    {
      tier: 1,
      name: 'Basic',
      description: resistanceDescription,
      deltaDescription: resistanceDescription,
      totalDescription: resistanceDescription,
      prerequisites: [{ type: 'level', minimum: 5 }],
      effects: [],
    },
  ],
});

export const resistanceFire = makeResistance('resistanceFire', 'Resistance - Fire');
export const resistanceCold = makeResistance('resistanceCold', 'Resistance - Cold');
export const resistanceElectricity = makeResistance(
  'resistanceElectricity',
  'Resistance - Electricity'
);
export const resistanceAcid = makeResistance('resistanceAcid', 'Resistance - Acid');
export const resistancePoison = makeResistance('resistancePoison', 'Resistance - Poison');
export const resistanceRadiation = makeResistance(
  'resistanceRadiation',
  'Resistance - Radiation'
);
