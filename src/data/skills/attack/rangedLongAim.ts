import { SkillEntity } from '@/types/skills';

export const rangedLongAim: SkillEntity = {
  id: 'rangedLongAim',
  name: 'Long Aim',
  family: 'attack',
  description: 'Gain additional range for handheld ranged weapons.',
  tiers: [
    {
      tier: 1,
      name: 'Basic',
      description: '+10% to range with ranged weapons.',
      prerequisites: [
        { type: 'level', minimum: 4 },
        { type: 'attribute', attribute: 'dex', minimum: 15 },
      ],
      effects: [
        {
          target: 'ranged_attack_range',
          operation: 'add',
          value: 0.1,
          sourceSkill: 'rangedLongAim',
          tier: 1,
        },
      ],
    },
    {
      tier: 2,
      name: 'Expert',
      description: '+10% additional range (+20% total).',
      prerequisites: [
        { type: 'skill', skillId: 'rangedLongAim', tier: 1 },
        { type: 'level', minimum: 8 },
      ],
      effects: [
        {
          target: 'ranged_attack_range',
          operation: 'add',
          value: 0.1,
          sourceSkill: 'rangedLongAim',
          tier: 2,
        },
      ],
    },
  ],
};
