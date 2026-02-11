import { SkillEntity } from '@/types/skills';

export const pilotingTracked: SkillEntity = {
  id: 'pilotingTracked',
  name: 'Piloting - Tracked',
  family: 'piloting',
  skillPointType: 'utility',
  description: 'Ability to pilot tracked and hovering vehicles.',
  tiers: [
    {
      tier: 1,
      name: 'Basic',
      description: 'Pilot tracked and hovering vehicles.',
      deltaDescription: 'Pilot tracked and hovering vehicles.',
      totalDescription: 'Pilot tracked and hovering vehicles.',
      prerequisites: [{ type: 'skill', skillId: 'piloting', tier: 2 }],
      effects: [],
    },
  ],
};

export const pilotingPlanetaryShips: SkillEntity = {
  id: 'pilotingPlanetaryShips',
  name: 'Piloting - Planetary Ships',
  family: 'piloting',
  skillPointType: 'utility',
  description: 'Ability to pilot planetary flying ships.',
  tiers: [
    {
      tier: 1,
      name: 'Basic',
      description: 'Pilot planetary ships.',
      deltaDescription: 'Pilot planetary ships.',
      totalDescription: 'Pilot planetary ships.',
      prerequisites: [
        { type: 'level', minimum: 4 },
        { type: 'skill', skillId: 'piloting', tier: 2 },
      ],
      effects: [],
    },
  ],
};

export const pilotingInterplanetaryShips: SkillEntity = {
  id: 'pilotingInterplanetaryShips',
  name: 'Piloting - Interplanetary Ships',
  family: 'piloting',
  skillPointType: 'utility',
  description: 'Ability to pilot interplanetary ships.',
  tiers: [
    {
      tier: 1,
      name: 'Basic',
      description: 'Pilot interplanetary ships.',
      deltaDescription: 'Pilot interplanetary ships.',
      totalDescription: 'Pilot interplanetary ships.',
      prerequisites: [
        { type: 'level', minimum: 7 },
        { type: 'skill', skillId: 'pilotingPlanetaryShips', tier: 1 },
        { type: 'skill', skillId: 'piloting', tier: 3 },
      ],
      effects: [],
    },
  ],
};

export const pilotingDiveAttack: SkillEntity = {
  id: 'pilotingDiveAttack',
  name: 'Piloting - Dive Attack',
  family: 'piloting',
  skillPointType: 'utility',
  description:
    'Dive toward an enemy, granting attack rolls a bonus for that round.',
  tiers: [
    {
      tier: 1,
      name: 'Basic',
      description: 'Dive Attack 1 time per battle.',
      deltaDescription: 'Dive Attack 1 time per battle.',
      totalDescription: 'Dive Attack 1 time per battle.',
      prerequisites: [{ type: 'skill', skillId: 'piloting', tier: 4 }],
      effects: [],
    },
    {
      tier: 2,
      name: 'Expert',
      description: 'Dive Attack 2 times per battle.',
      deltaDescription: 'Dive Attack +1 use per battle (2 total).',
      totalDescription: 'Dive Attack 2 times per battle.',
      prerequisites: [
        { type: 'skill', skillId: 'pilotingDiveAttack', tier: 1 },
        { type: 'skill', skillId: 'piloting', tier: 5 },
      ],
      effects: [],
    },
  ],
};

export const pilotingEvasiveManeuvers: SkillEntity = {
  id: 'pilotingEvasiveManeuvers',
  name: 'Piloting - Evasive Maneuvers',
  family: 'piloting',
  skillPointType: 'utility',
  description: 'Master evasion to boost ship AC.',
  tiers: [
    {
      tier: 1,
      name: 'Basic',
      description: 'Ship AC +5 while piloting.',
      deltaDescription: 'Ship AC +5 while piloting.',
      totalDescription: 'Ship AC +5 while piloting.',
      prerequisites: [{ type: 'skill', skillId: 'piloting', tier: 5 }],
      effects: [],
    },
  ],
};
