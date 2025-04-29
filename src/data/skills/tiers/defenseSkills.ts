import { SkillTier } from '@/types/skill';

export const defenseSkillTiers: SkillTier[] = [
  {
    id: 'shield-fortress-tier1',
    familyId: 'shield-fortress',
    tier: 1,
    subName: 'Basic',
    description: 'Gain +1 AC when using a shield.',
    prerequisites: [
      { type: 'level', value: 4 },
      { type: 'attribute', attribute: 'con', value: 13 },
    ],
    effects: [{ type: 'ac_bonus', bonus: 1 }],
  },
  {
    id: 'shield-fortress-tier2',
    familyId: 'shield-fortress',
    tier: 2,
    subName: 'Expert',
    description: 'Gain +2 AC when using a shield.',
    prerequisites: [
      { type: 'level', value: 10 },
      { type: 'attribute', attribute: 'con', value: 15 },
      { type: 'skill', skillId: 'shield-fortress-tier1' },
    ],
    effects: [{ type: 'ac_bonus', bonus: 2 }],
  },
  {
    id: 'shield-fortress-tier3',
    familyId: 'shield-fortress',
    tier: 3,
    subName: 'Master',
    description: 'Gain +3 AC when using a shield.',
    prerequisites: [
      { type: 'level', value: 16 },
      { type: 'attribute', attribute: 'con', value: 17 },
      { type: 'skill', skillId: 'shield-fortress-tier2' },
    ],
    effects: [{ type: 'ac_bonus', bonus: 3 }],
  },
];
