import { SkillFamily } from '@/types/skill';

export const defenseSkillFamilies: SkillFamily[] = [
  {
    id: 'shield-fortress',
    title: 'Shield Fortress',
    description: 'Using a shield, your defense becomes an immovable bulwark.',
    type: 'passive',
    usageRequirements: [{ type: 'equipment', equipment: 'shield' }],
    forbiddenClasses: ['MagicUser'],
    tiers: [
      'shield-fortress-tier1',
      'shield-fortress-tier2',
      'shield-fortress-tier3',
    ],
  },
];
