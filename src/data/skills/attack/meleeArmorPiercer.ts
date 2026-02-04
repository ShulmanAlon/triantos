import { SkillEntity } from '@/types/skills';

export const meleeArmorPiercer: SkillEntity = {
  id: 'meleeArmorPiercer',
  name: 'Armor Piercer',
  family: 'attack',
  skillPointType: 'core',
  description:
    'Every armor has a weak point, you no longer deal half damage with slashing and piercing weapons',
  tiers: [
    {
      tier: 1,
      name: 'Proficient',
      description: 'Ignore half-damage penalty with slashing and piercing weapons.',
      deltaDescription:
        'Ignore half-damage penalty with slashing and piercing weapons.',
      totalDescription:
        'Ignore half-damage penalty with slashing and piercing weapons.',
      prerequisites: [
        { type: 'level', minimum: 6 },
        { type: 'attribute', attribute: 'str', minimum: 11 },
        { type: 'attribute', attribute: 'dex', minimum: 13 },
      ],
      effects: [
        {
          target: 'flag.meleeArmorPiercer',
          operation: 'enable',
          value: true,
          sourceSkill: 'meleeArmorPiercer',
        },
      ],
    },
  ],
};
