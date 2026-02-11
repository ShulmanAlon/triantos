import { SkillEntity, TierPrerequisite } from '@/types/skills';

const freeForAllClasses = [
  { classId: 'Fighter', atLevel: 1 },
  { classId: 'Cleric', atLevel: 1 },
  { classId: 'MagicUser', atLevel: 1 },
] as const;

const makeTier = (
  tier: number,
  name: 'Initial' | 'Basic' | 'Advanced' | 'Expert' | 'Master',
  description: string,
  prerequisites?: TierPrerequisite[],
) => ({
  tier,
  name,
  description,
  deltaDescription: description,
  totalDescription: description,
  prerequisites,
  effects: [],
});

export const overpower: SkillEntity = {
  id: 'overpower',
  name: 'Overpower',
  family: 'utility',
  skillPointType: 'utility',
  abilityModifier: 'str',
  description: 'Check your strength against an opponent or obstacle.',
  tiers: [
    {
      ...makeTier(1, 'Initial', 'No bonus to overpower checks.'),
      freeForClasses: [...freeForAllClasses],
    },
    makeTier(2, 'Advanced', '+3 to overpower checks.', [
      { type: 'skill', skillId: 'overpower', tier: 1 },
    ]),
    makeTier(3, 'Expert', '+6 total to overpower checks.', [
      { type: 'skill', skillId: 'overpower', tier: 2 },
      { type: 'level', minimum: 4 },
      { type: 'attribute', attribute: 'str', minimum: 13 },
    ]),
    makeTier(4, 'Master', '+9 total to overpower checks.', [
      { type: 'skill', skillId: 'overpower', tier: 3 },
      { type: 'level', minimum: 7 },
      { type: 'attribute', attribute: 'str', minimum: 15 },
    ]),
  ],
};

export const athletics: SkillEntity = {
  id: 'athletics',
  name: 'Athletics',
  family: 'utility',
  skillPointType: 'utility',
  abilityModifier: 'dex',
  description: 'Dodge danger, jump higher, run faster, climb better.',
  tiers: [
    {
      ...makeTier(1, 'Initial', 'No bonus to athletics checks.'),
      freeForClasses: [...freeForAllClasses],
    },
    makeTier(2, 'Advanced', '+3 to athletics checks.', [
      { type: 'skill', skillId: 'athletics', tier: 1 },
    ]),
    makeTier(3, 'Expert', '+6 total to athletics checks.', [
      { type: 'skill', skillId: 'athletics', tier: 2 },
      { type: 'level', minimum: 4 },
      { type: 'attribute', attribute: 'dex', minimum: 13 },
    ]),
    makeTier(4, 'Master', '+9 total to athletics checks.', [
      { type: 'skill', skillId: 'athletics', tier: 3 },
      { type: 'level', minimum: 7 },
      { type: 'attribute', attribute: 'dex', minimum: 15 },
    ]),
  ],
};

export const hide: SkillEntity = {
  id: 'hide',
  name: 'Hide',
  family: 'utility',
  skillPointType: 'utility',
  abilityModifier: 'dex',
  description: 'Hide and move silently; loud gear increases difficulty.',
  tiers: [
    {
      ...makeTier(1, 'Initial', 'Hide checks at -4 penalty.'),
      freeForClasses: [...freeForAllClasses],
    },
    makeTier(2, 'Basic', 'No penalty to hide checks.', [
      { type: 'skill', skillId: 'hide', tier: 1 },
      { type: 'attribute', attribute: 'dex', minimum: 11 },
    ]),
    makeTier(3, 'Advanced', '+3 to hide checks.', [
      { type: 'skill', skillId: 'hide', tier: 2 },
      { type: 'level', minimum: 4 },
      { type: 'attribute', attribute: 'dex', minimum: 13 },
    ]),
    makeTier(4, 'Expert', '+6 total to hide checks.', [
      { type: 'skill', skillId: 'hide', tier: 3 },
      { type: 'level', minimum: 7 },
      { type: 'attribute', attribute: 'dex', minimum: 15 },
    ]),
    makeTier(5, 'Master', '+9 total to hide checks.', [
      { type: 'skill', skillId: 'hide', tier: 4 },
      { type: 'level', minimum: 10 },
      { type: 'attribute', attribute: 'dex', minimum: 17 },
    ]),
  ],
};

export const thieving: SkillEntity = {
  id: 'thieving',
  name: 'Thieving',
  family: 'utility',
  skillPointType: 'utility',
  abilityModifier: 'dex',
  description: 'Open locks, disarm traps, and steal items.',
  tiers: [
    {
      ...makeTier(1, 'Initial', 'Thieving checks at -4 penalty.'),
      freeForClasses: [...freeForAllClasses],
    },
    makeTier(2, 'Basic', 'No penalty to thieving checks.', [
      { type: 'skill', skillId: 'thieving', tier: 1 },
      { type: 'attribute', attribute: 'dex', minimum: 11 },
    ]),
    makeTier(3, 'Advanced', '+3 to thieving checks.', [
      { type: 'skill', skillId: 'thieving', tier: 2 },
      { type: 'level', minimum: 4 },
      { type: 'attribute', attribute: 'dex', minimum: 13 },
    ]),
    makeTier(4, 'Expert', '+6 total to thieving checks.', [
      { type: 'skill', skillId: 'thieving', tier: 3 },
      { type: 'level', minimum: 7 },
      { type: 'attribute', attribute: 'dex', minimum: 15 },
      { type: 'attribute', attribute: 'cha', minimum: 11 },
    ]),
    makeTier(5, 'Master', '+9 total to thieving checks.', [
      { type: 'skill', skillId: 'thieving', tier: 4 },
      { type: 'level', minimum: 10 },
      { type: 'attribute', attribute: 'dex', minimum: 17 },
      { type: 'attribute', attribute: 'cha', minimum: 15 },
    ]),
  ],
};

export const willpower: SkillEntity = {
  id: 'willpower',
  name: 'Willpower',
  family: 'utility',
  skillPointType: 'utility',
  abilityModifier: 'wis',
  description: 'Resist mind control, threats, and charm effects.',
  tiers: [
    {
      ...makeTier(1, 'Initial', 'No bonus to willpower checks.'),
      freeForClasses: [...freeForAllClasses],
    },
    makeTier(2, 'Advanced', '+3 to willpower checks.', [
      { type: 'skill', skillId: 'willpower', tier: 1 },
    ]),
    makeTier(3, 'Expert', '+6 total to willpower checks.', [
      { type: 'skill', skillId: 'willpower', tier: 2 },
      { type: 'level', minimum: 4 },
      { type: 'attribute', attribute: 'wis', minimum: 13 },
    ]),
    makeTier(4, 'Master', '+9 total to willpower checks.', [
      { type: 'skill', skillId: 'willpower', tier: 3 },
      { type: 'level', minimum: 7 },
      { type: 'attribute', attribute: 'wis', minimum: 15 },
    ]),
  ],
};

export const detect: SkillEntity = {
  id: 'detect',
  name: 'Detect',
  family: 'utility',
  skillPointType: 'utility',
  abilityModifier: 'wis',
  description: 'Detect hidden creatures, traps, doors, and compartments.',
  tiers: [
    {
      ...makeTier(1, 'Initial', 'No bonus to detect checks.'),
      freeForClasses: [...freeForAllClasses],
    },
    makeTier(2, 'Advanced', '+3 to detect checks.', [
      { type: 'skill', skillId: 'detect', tier: 1 },
    ]),
    makeTier(3, 'Expert', '+6 total to detect checks.', [
      { type: 'skill', skillId: 'detect', tier: 2 },
      { type: 'level', minimum: 4 },
      { type: 'attribute', attribute: 'wis', minimum: 13 },
    ]),
    makeTier(4, 'Master', '+9 total to detect checks.', [
      { type: 'skill', skillId: 'detect', tier: 3 },
      { type: 'level', minimum: 7 },
      { type: 'attribute', attribute: 'wis', minimum: 15 },
    ]),
  ],
};

export const medicine: SkillEntity = {
  id: 'medicine',
  name: 'Medicine',
  family: 'utility',
  skillPointType: 'utility',
  abilityModifier: 'wis',
  description: 'Stabilize, heal, and diagnose wounds or conditions.',
  tiers: [
    {
      ...makeTier(1, 'Initial', 'Medicine checks at -4 penalty.'),
      freeForClasses: [...freeForAllClasses],
    },
    makeTier(2, 'Basic', 'No penalty to medicine checks.', [
      { type: 'skill', skillId: 'medicine', tier: 1 },
      { type: 'attribute', attribute: 'wis', minimum: 11 },
    ]),
    makeTier(3, 'Advanced', '+3 to medicine checks.', [
      { type: 'skill', skillId: 'medicine', tier: 2 },
      { type: 'level', minimum: 4 },
      { type: 'attribute', attribute: 'wis', minimum: 13 },
    ]),
    makeTier(4, 'Expert', '+6 total to medicine checks.', [
      { type: 'skill', skillId: 'medicine', tier: 3 },
      { type: 'level', minimum: 7 },
      { type: 'attribute', attribute: 'wis', minimum: 15 },
      { type: 'attribute', attribute: 'int', minimum: 11 },
    ]),
    makeTier(5, 'Master', '+9 total to medicine checks.', [
      { type: 'skill', skillId: 'medicine', tier: 4 },
      { type: 'level', minimum: 10 },
      { type: 'attribute', attribute: 'wis', minimum: 17 },
      { type: 'attribute', attribute: 'int', minimum: 13 },
    ]),
  ],
};

export const knowledge: SkillEntity = {
  id: 'knowledge',
  name: 'Knowledge',
  family: 'utility',
  skillPointType: 'utility',
  abilityModifier: 'int',
  description: 'Understand how and why things work.',
  tiers: [
    {
      ...makeTier(1, 'Initial', 'No bonus to knowledge checks.'),
      freeForClasses: [...freeForAllClasses],
    },
    makeTier(2, 'Advanced', '+3 to knowledge checks.', [
      { type: 'skill', skillId: 'knowledge', tier: 1 },
    ]),
    makeTier(3, 'Expert', '+6 total to knowledge checks.', [
      { type: 'skill', skillId: 'knowledge', tier: 2 },
      { type: 'level', minimum: 4 },
      { type: 'attribute', attribute: 'int', minimum: 13 },
    ]),
    makeTier(4, 'Master', '+9 total to knowledge checks.', [
      { type: 'skill', skillId: 'knowledge', tier: 3 },
      { type: 'level', minimum: 7 },
      { type: 'attribute', attribute: 'int', minimum: 15 },
    ]),
  ],
};

export const mechanic: SkillEntity = {
  id: 'mechanic',
  name: 'Mechanic',
  family: 'utility',
  skillPointType: 'utility',
  abilityModifier: 'int',
  description: 'Repair and tinker with machines using available parts.',
  tiers: [
    {
      ...makeTier(1, 'Initial', 'Mechanic checks at -4 penalty.'),
      freeForClasses: [...freeForAllClasses],
    },
    makeTier(2, 'Basic', 'No penalty to mechanic checks.', [
      { type: 'skill', skillId: 'mechanic', tier: 1 },
    ]),
    makeTier(3, 'Advanced', '+3 to mechanic checks.', [
      { type: 'skill', skillId: 'mechanic', tier: 2 },
      { type: 'level', minimum: 4 },
      { type: 'attribute', attribute: 'int', minimum: 13 },
    ]),
    makeTier(4, 'Expert', '+6 total to mechanic checks.', [
      { type: 'skill', skillId: 'mechanic', tier: 3 },
      { type: 'level', minimum: 7 },
      { type: 'attribute', attribute: 'int', minimum: 15 },
    ]),
    makeTier(5, 'Master', '+9 total to mechanic checks.', [
      { type: 'skill', skillId: 'mechanic', tier: 4 },
      { type: 'level', minimum: 10 },
      { type: 'attribute', attribute: 'int', minimum: 17 },
    ]),
  ],
};

export const toughness: SkillEntity = {
  id: 'toughness',
  name: 'Toughness',
  family: 'utility',
  skillPointType: 'utility',
  abilityModifier: 'con',
  description: 'Resist physical strain and certain effects.',
  tiers: [
    {
      ...makeTier(1, 'Initial', 'No bonus to toughness checks.'),
      freeForClasses: [...freeForAllClasses],
    },
    makeTier(2, 'Advanced', '+3 to toughness checks.', [
      { type: 'skill', skillId: 'toughness', tier: 1 },
    ]),
    makeTier(3, 'Expert', '+6 total to toughness checks.', [
      { type: 'skill', skillId: 'toughness', tier: 2 },
      { type: 'level', minimum: 4 },
      { type: 'attribute', attribute: 'con', minimum: 13 },
    ]),
    makeTier(4, 'Master', '+9 total to toughness checks.', [
      { type: 'skill', skillId: 'toughness', tier: 3 },
      { type: 'level', minimum: 7 },
      { type: 'attribute', attribute: 'con', minimum: 15 },
    ]),
  ],
};

export const negotiate: SkillEntity = {
  id: 'negotiate',
  name: 'Negotiate',
  family: 'utility',
  skillPointType: 'utility',
  abilityModifier: 'cha',
  description: 'Buy, sell, and make deals more effectively.',
  tiers: [
    {
      ...makeTier(1, 'Initial', 'No bonus to negotiate checks.'),
      freeForClasses: [...freeForAllClasses],
    },
    makeTier(2, 'Advanced', '+3 to negotiate checks.', [
      { type: 'skill', skillId: 'negotiate', tier: 1 },
      { type: 'attribute', attribute: 'cha', minimum: 11 },
    ]),
    makeTier(3, 'Expert', '+6 total to negotiate checks.', [
      { type: 'skill', skillId: 'negotiate', tier: 2 },
      { type: 'level', minimum: 4 },
      { type: 'attribute', attribute: 'cha', minimum: 13 },
    ]),
    makeTier(4, 'Master', '+9 total to negotiate checks.', [
      { type: 'skill', skillId: 'negotiate', tier: 3 },
      { type: 'level', minimum: 7 },
      { type: 'attribute', attribute: 'cha', minimum: 15 },
    ]),
  ],
};

export const intimidate: SkillEntity = {
  id: 'intimidate',
  name: 'Intimidate',
  family: 'utility',
  skillPointType: 'utility',
  abilityModifier: 'cha',
  description: 'Threaten and coerce effectively.',
  tiers: [
    {
      ...makeTier(1, 'Initial', 'No bonus to intimidate checks.'),
      freeForClasses: [...freeForAllClasses],
    },
    makeTier(2, 'Advanced', '+3 to intimidate checks.', [
      { type: 'skill', skillId: 'intimidate', tier: 1 },
      { type: 'attribute', attribute: 'cha', minimum: 11 },
    ]),
    makeTier(3, 'Expert', '+6 total to intimidate checks.', [
      { type: 'skill', skillId: 'intimidate', tier: 2 },
      { type: 'level', minimum: 4 },
      { type: 'attribute', attribute: 'cha', minimum: 13 },
    ]),
    makeTier(4, 'Master', '+9 total to intimidate checks.', [
      { type: 'skill', skillId: 'intimidate', tier: 3 },
      { type: 'level', minimum: 7 },
      { type: 'attribute', attribute: 'cha', minimum: 15 },
    ]),
  ],
};
