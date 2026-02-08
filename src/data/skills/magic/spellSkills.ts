import { SkillEntity } from '@/types/skills';

export const spellPenetration: SkillEntity = {
  id: 'spellPenetration',
  name: 'Spell Penetration',
  family: 'magic',
  skillPointType: 'utility',
  description: 'Spells are harder to resist against.',
  forbiddenClasses: ['Fighter'],
  tiers: [
    {
      tier: 1,
      name: 'Advanced',
      description: '-2 to target resistance checks.',
      deltaDescription: '-2 to target resistance checks.',
      totalDescription: '-2 to target resistance checks.',
      prerequisites: [
        { type: 'level', minimum: 6 },
        { type: 'attribute', attribute: 'int', minimum: 13 },
      ],
      effects: [],
    },
    {
      tier: 2,
      name: 'Expert',
      description: '-4 total to target resistance checks.',
      deltaDescription: '-2 to target resistance checks (-4 total).',
      totalDescription: '-4 total to target resistance checks.',
      prerequisites: [
        { type: 'skill', skillId: 'spellPenetration', tier: 1 },
        { type: 'level', minimum: 11 },
        { type: 'attribute', attribute: 'int', minimum: 15 },
      ],
      effects: [],
    },
    {
      tier: 3,
      name: 'Master',
      description: '-6 total to target resistance checks.',
      deltaDescription: '-2 to target resistance checks (-6 total).',
      totalDescription: '-6 total to target resistance checks.',
      prerequisites: [
        { type: 'skill', skillId: 'spellPenetration', tier: 2 },
        { type: 'level', minimum: 16 },
        { type: 'attribute', attribute: 'int', minimum: 17 },
      ],
      effects: [],
    },
  ],
};

const attunementPlaceholder = 'TODO: Define magic attunement effects.';

export const magicAttunementFire: SkillEntity = {
  id: 'magicAttunementFire',
  name: 'Magic Attunement - Fire',
  family: 'magic',
  skillPointType: 'utility',
  description: attunementPlaceholder,
  forbiddenClasses: ['Fighter', 'Cleric'],
  // TODO: Define magic attunement (fire) tiers, prerequisites, and effects.
  tiers: [
    {
      tier: 1,
      name: 'Basic',
      description: attunementPlaceholder,
      deltaDescription: attunementPlaceholder,
      totalDescription: attunementPlaceholder,
      effects: [],
    },
  ],
};

export const magicAttunementCold: SkillEntity = {
  id: 'magicAttunementCold',
  name: 'Magic Attunement - Cold',
  family: 'magic',
  skillPointType: 'utility',
  description: attunementPlaceholder,
  forbiddenClasses: ['Fighter', 'Cleric'],
  // TODO: Define magic attunement (cold) tiers, prerequisites, and effects.
  tiers: [
    {
      tier: 1,
      name: 'Basic',
      description: attunementPlaceholder,
      deltaDescription: attunementPlaceholder,
      totalDescription: attunementPlaceholder,
      effects: [],
    },
  ],
};

export const magicAttunementElectricity: SkillEntity = {
  id: 'magicAttunementElectricity',
  name: 'Magic Attunement - Electricity',
  family: 'magic',
  skillPointType: 'utility',
  description: attunementPlaceholder,
  forbiddenClasses: ['Fighter', 'Cleric'],
  // TODO: Define magic attunement (electricity) tiers, prerequisites, and effects.
  tiers: [
    {
      tier: 1,
      name: 'Basic',
      description: attunementPlaceholder,
      deltaDescription: attunementPlaceholder,
      totalDescription: attunementPlaceholder,
      effects: [],
    },
  ],
};

export const magicAttunementAcid: SkillEntity = {
  id: 'magicAttunementAcid',
  name: 'Magic Attunement - Acid',
  family: 'magic',
  skillPointType: 'utility',
  description: attunementPlaceholder,
  forbiddenClasses: ['Fighter', 'Cleric'],
  // TODO: Define magic attunement (acid) tiers, prerequisites, and effects.
  tiers: [
    {
      tier: 1,
      name: 'Basic',
      description: attunementPlaceholder,
      deltaDescription: attunementPlaceholder,
      totalDescription: attunementPlaceholder,
      effects: [],
    },
  ],
};

export const turnUndead: SkillEntity = {
  id: 'turnUndead',
  name: 'Turn Undead',
  family: 'magic',
  skillPointType: 'utility',
  description: 'Ability to try to turn undead (see turn mechanics).',
  forbiddenClasses: ['Fighter', 'MagicUser'],
  tiers: [
    {
      tier: 1,
      name: 'Basic',
      description: 'Turn undead (cleric feature).',
      deltaDescription: 'Turn undead (cleric feature).',
      totalDescription: 'Turn undead (cleric feature).',
      freeForClasses: [{ classId: 'Cleric', atLevel: 1 }],
      effects: [],
    },
  ],
};

export const turnAbyssal: SkillEntity = {
  id: 'turnAbyssal',
  name: 'Turn Abyssal',
  family: 'magic',
  skillPointType: 'utility',
  description: 'Ability to try to turn abyssal creatures (see turn mechanics).',
  forbiddenClasses: ['Fighter', 'MagicUser'],
  tiers: [
    {
      tier: 1,
      name: 'Basic',
      description: 'Turn abyssal creatures (cleric feature).',
      deltaDescription: 'Turn abyssal creatures (cleric feature).',
      totalDescription: 'Turn abyssal creatures (cleric feature).',
      prerequisites: [
        { type: 'level', minimum: 8 },
        { type: 'attribute', attribute: 'wis', minimum: 17 },
      ],
      effects: [],
    },
  ],
};

export const turnIntensity: SkillEntity = {
  id: 'turnIntensity',
  name: 'Turn Intensity',
  family: 'magic',
  skillPointType: 'utility',
  description: 'Increase total HD affected by turning.',
  forbiddenClasses: ['Fighter', 'MagicUser'],
  tiers: [
    {
      tier: 1,
      name: 'Basic',
      description: 'Turn intensity 1d6 HD.',
      deltaDescription: 'Turn intensity 1d6 HD.',
      totalDescription: 'Turn intensity 1d6 HD.',
      freeForClasses: [{ classId: 'Cleric', atLevel: 1 }],
      effects: [],
    },
    {
      tier: 2,
      name: 'Advanced',
      description: 'Turn intensity 2d6 HD.',
      deltaDescription: 'Turn intensity 2d6 HD.',
      totalDescription: 'Turn intensity 2d6 HD.',
      prerequisites: [
        { type: 'skill', skillId: 'turnIntensity', tier: 1 },
        { type: 'level', minimum: 4 },
      ],
      effects: [],
    },
    {
      tier: 3,
      name: 'Expert',
      description: 'Turn intensity 4d6 HD.',
      deltaDescription: 'Turn intensity 4d6 HD.',
      totalDescription: 'Turn intensity 4d6 HD.',
      prerequisites: [
        { type: 'skill', skillId: 'turnIntensity', tier: 2 },
        { type: 'level', minimum: 10 },
        { type: 'attribute', attribute: 'wis', minimum: 15 },
      ],
      effects: [],
    },
    {
      tier: 4,
      name: 'Master',
      description: 'Turn intensity 6d6 HD.',
      deltaDescription: 'Turn intensity 6d6 HD.',
      totalDescription: 'Turn intensity 6d6 HD.',
      prerequisites: [
        { type: 'skill', skillId: 'turnIntensity', tier: 3 },
        { type: 'level', minimum: 16 },
        { type: 'attribute', attribute: 'wis', minimum: 17 },
      ],
      effects: [],
    },
  ],
};

export const turnAreaOfEffect: SkillEntity = {
  id: 'turnAreaOfEffect',
  name: 'Turn Area of Effect',
  family: 'magic',
  skillPointType: 'utility',
  description: 'Increase turning radius around the cleric.',
  forbiddenClasses: ['Fighter', 'MagicUser'],
  tiers: [
    {
      tier: 1,
      name: 'Basic',
      description: '20m radius around the cleric.',
      deltaDescription: '20m radius around the cleric.',
      totalDescription: '20m radius around the cleric.',
      freeForClasses: [{ classId: 'Cleric', atLevel: 1 }],
      effects: [],
    },
    {
      tier: 2,
      name: 'Advanced',
      description: '40m radius around the cleric.',
      deltaDescription: '40m radius around the cleric.',
      totalDescription: '40m radius around the cleric.',
      prerequisites: [
        { type: 'skill', skillId: 'turnAreaOfEffect', tier: 1 },
        { type: 'level', minimum: 8 },
        { type: 'attribute', attribute: 'wis', minimum: 17 },
      ],
      effects: [],
    },
    {
      tier: 3,
      name: 'Expert',
      description: '60m radius around the cleric.',
      deltaDescription: '60m radius around the cleric.',
      totalDescription: '60m radius around the cleric.',
      prerequisites: [
        { type: 'skill', skillId: 'turnAreaOfEffect', tier: 2 },
        { type: 'level', minimum: 16 },
        { type: 'attribute', attribute: 'wis', minimum: 19 },
      ],
      effects: [],
    },
    {
      tier: 4,
      name: 'Master',
      description: '80m radius around the cleric.',
      deltaDescription: '80m radius around the cleric.',
      totalDescription: '80m radius around the cleric.',
      prerequisites: [
        { type: 'skill', skillId: 'turnAreaOfEffect', tier: 3 },
        { type: 'level', minimum: 24 },
      ],
      effects: [],
    },
  ],
};

const placeholder = 'TODO: Fill in skill details.';

export const spellDuration: SkillEntity = {
  id: 'spellDuration',
  name: 'Spell Duration',
  family: 'magic',
  skillPointType: 'utility',
  description: 'Placeholder from CSV entry "Spell duration?".',
  forbiddenClasses: ['Fighter'],
  // TODO: Define spell duration tiers, prerequisites, and effects.
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

export const forMage: SkillEntity = {
  id: 'forMage',
  name: 'For Mage',
  family: 'magic',
  skillPointType: 'utility',
  description: 'Placeholder from CSV entry "For mage?".',
  // TODO: Define mage-specific tiers, prerequisites, and effects.
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

export const forCleric: SkillEntity = {
  id: 'forCleric',
  name: 'For Cleric',
  family: 'magic',
  skillPointType: 'utility',
  description: 'Placeholder from CSV entry "For cleric?".',
  // TODO: Define cleric-specific tiers, prerequisites, and effects.
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
