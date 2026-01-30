import { SkillEntity } from '@/types/skills';

export const pilotingDodge: SkillEntity = {
  id: 'pilotingDodge',
  name: 'Piloting Dodge',
  family: 'piloting',
  description:
    'Perform a piloting-based dodge maneuver against incoming vehicle attacks.',
  tiers: [
    {
      tier: 1,
      name: 'Basic',
      description: 'Can dodge once per battle, max 1 per round.',
      prerequisites: [{ type: 'skill', skillId: 'piloting', tier: 2 }],
      effects: [
        {
          target: 'piloting_dodge',
          operation: 'grantActive',
          value: {
            abilityName: 'Piloting Dodge',
            usageLimit: { perBattle: 1, perRound: 1 },
            actionType: 'reaction',
            mechanics: {
              attackerSkill: 'piloting_check',
              defenderSkill: 'piloting_check',
              defenderModifier: -2,
            },
          },
          sourceSkill: 'pilotingDodge',
          tier: 1,
        },
      ],
    },
    {
      tier: 2,
      name: 'Expert',
      description: 'Can dodge twice per battle, max 1 per round.',
      prerequisites: [
        { type: 'skill', skillId: 'pilotingDodge', tier: 1 },
        { type: 'skill', skillId: 'piloting', tier: 3 },
      ],
      effects: [
        {
          target: 'piloting_dodge',
          operation: 'grantActive',
          value: {
            abilityName: 'Piloting Dodge',
            usageLimit: { perBattle: 2, perRound: 1 },
            actionType: 'reaction',
            mechanics: {
              attackerSkill: 'piloting_check',
              defenderSkill: 'piloting_check',
              defenderModifier: 0,
            },
          },
          sourceSkill: 'pilotingDodge',
          tier: 2,
        },
      ],
    },
    {
      tier: 3,
      name: 'Master',
      description: 'Can dodge 3 times per battle, max 1 per round.',
      prerequisites: [
        { type: 'skill', skillId: 'pilotingDodge', tier: 2 },
        { type: 'skill', skillId: 'piloting', tier: 4 },
      ],
      effects: [
        {
          target: 'piloting_dodge',
          operation: 'grantActive',
          value: {
            abilityName: 'Piloting Dodge',
            usageLimit: { perBattle: 3, perRound: 1 },
            actionType: 'reaction',
            mechanics: {
              attackerSkill: 'piloting_check',
              defenderSkill: 'piloting_check',
              defenderModifier: 2,
            },
          },
          sourceSkill: 'pilotingDodge',
          tier: 3,
        },
      ],
    },
  ],
};
