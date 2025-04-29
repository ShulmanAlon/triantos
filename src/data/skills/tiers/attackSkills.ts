import { SkillTier } from '@/types/skill';

export const attackSkillTiers: SkillTier[] = [
  {
    id: 'long-aim-tier1',
    familyId: 'long-aim',
    tier: 1,
    subName: 'Basic',
    description: 'Increase the range of handheld ranged weapons by 10%.',
    prerequisites: [
      { type: 'level', value: 4 },
      { type: 'attribute', attribute: 'dex', value: 15 },
    ],
    effects: [
      {
        type: 'custom',
        description: 'Increase range of handheld ranged weapons by 10%.',
      },
    ],
  },
  {
    id: 'long-aim-tier2',
    familyId: 'long-aim',
    tier: 2,
    subName: 'Expert',
    description:
      'Further increase the range of handheld ranged weapons by an additional 10% (20% total).',
    prerequisites: [
      { type: 'level', value: 8 },
      { type: 'skill', skillId: 'long-aim-tier1' },
    ],
    effects: [
      {
        type: 'custom',
        description:
          'Increase range of handheld ranged weapons by an additional 10% (20% total).',
      },
    ],
  },
];
