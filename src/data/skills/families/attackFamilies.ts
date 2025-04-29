import { SkillFamily } from '@/types/skill';

export const attackSkillFamilies: SkillFamily[] = [
  {
    id: 'long-aim',
    title: 'Long Aim',
    description:
      'Enhance your precision to extend the range of handheld ranged weapons.',
    type: 'passive',
    usageRequirements: [{ type: 'equipment', equipment: 'ranged-weapon' }],
    tiers: ['long-aim-tier1', 'long-aim-tier2'],
  },
];
