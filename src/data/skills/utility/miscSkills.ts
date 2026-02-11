import { SkillEntity } from '@/types/skills';

export const solarGenerator: SkillEntity = {
  id: 'solarGenerator',
  name: 'Solar Generator',
  family: 'utility',
  skillPointType: 'utility',
  description:
    'Use a solar generator mounted on armor to recharge energy packs in sunlight.',
  tiers: [
    {
      tier: 1,
      name: 'Basic',
      description: 'Charges 1 energy per turn in sunlight.',
      deltaDescription: 'Charges 1 energy per turn in sunlight.',
      totalDescription: 'Charges 1 energy per turn in sunlight.',
      prerequisites: [{ type: 'level', minimum: 7 }],
      effects: [],
    },
    {
      tier: 2,
      name: 'Expert',
      description: 'Charges 2 energy per turn in sunlight.',
      deltaDescription: 'Charges +1 energy per turn (2 total).',
      totalDescription: 'Charges 2 energy per turn in sunlight.',
      prerequisites: [
        { type: 'skill', skillId: 'solarGenerator', tier: 1 },
        { type: 'level', minimum: 10 },
      ],
      effects: [],
    },
    {
      tier: 3,
      name: 'Master',
      description: 'Charges 3 energy per turn in sunlight.',
      deltaDescription: 'Charges +1 energy per turn (3 total).',
      totalDescription: 'Charges 3 energy per turn in sunlight.',
      prerequisites: [
        { type: 'skill', skillId: 'solarGenerator', tier: 2 },
        { type: 'level', minimum: 13 },
      ],
      effects: [],
    },
  ],
};

const placeholder = 'TODO: Fill in skill details.';

export const sabotage: SkillEntity = {
  id: 'sabotage',
  name: 'Sabotage',
  family: 'utility',
  skillPointType: 'utility',
  description: placeholder,
  // TODO: Fill in sabotage tiers, prerequisites, and effects.
  tiers: [
    {
      tier: 1,
      name: 'Basic',
      description: placeholder,
      deltaDescription: placeholder,
      totalDescription: placeholder,
      effects: [],
    },
  ],
};

export const communicator: SkillEntity = {
  id: 'communicator',
  name: 'Communicator',
  family: 'utility',
  skillPointType: 'utility',
  description: placeholder,
  // TODO: Fill in communicator tiers, prerequisites, and effects.
  tiers: [
    {
      tier: 1,
      name: 'Basic',
      description: placeholder,
      deltaDescription: placeholder,
      totalDescription: placeholder,
      effects: [],
    },
  ],
};

export const language: SkillEntity = {
  id: 'language',
  name: 'Language',
  family: 'utility',
  skillPointType: 'utility',
  description: placeholder,
  // TODO: Fill in language tiers, prerequisites, and effects.
  tiers: [
    {
      tier: 1,
      name: 'Basic',
      description: placeholder,
      deltaDescription: placeholder,
      totalDescription: placeholder,
      effects: [],
    },
  ],
};

export const disguise: SkillEntity = {
  id: 'disguise',
  name: 'Disguise',
  family: 'utility',
  skillPointType: 'utility',
  description: placeholder,
  // TODO: Fill in disguise tiers, prerequisites, and effects.
  tiers: [
    {
      tier: 1,
      name: 'Basic',
      description: placeholder,
      deltaDescription: placeholder,
      totalDescription: placeholder,
      effects: [],
    },
  ],
};

export const readLanguage: SkillEntity = {
  id: 'readLanguage',
  name: 'Read Language',
  family: 'utility',
  skillPointType: 'utility',
  description: placeholder,
  // TODO: Fill in read language tiers, prerequisites, and effects.
  tiers: [
    {
      tier: 1,
      name: 'Basic',
      description: placeholder,
      deltaDescription: placeholder,
      totalDescription: placeholder,
      effects: [],
    },
  ],
};

export const quickReflexesInitiative: SkillEntity = {
  id: 'quickReflexesInitiative',
  name: 'Quick Reflexes - Initiative',
  family: 'utility',
  skillPointType: 'utility',
  description: placeholder,
  // TODO: Fill in quick reflexes tiers, prerequisites, and effects.
  tiers: [
    {
      tier: 1,
      name: 'Basic',
      description: placeholder,
      deltaDescription: placeholder,
      totalDescription: placeholder,
      effects: [],
    },
  ],
};
