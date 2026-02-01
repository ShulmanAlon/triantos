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
