import { SkillEntity } from '@/types/skills';

export const meleeEnergyOverdrive: SkillEntity = {
  id: 'meleeEnergyOverdrive',
  name: 'Melee - Energy Overdrive',
  family: 'attack',
  skillPointType: 'core',
  description:
    'Spend double energy cost to deal double weapon damage dice with Power Fist and Plasma Cutter.',
  tiers: [
    {
      tier: 1,
      name: 'Basic',
      description: 'Selectable per round; doubles weapon damage dice only.',
      deltaDescription:
        'Selectable per round; doubles weapon damage dice only.',
      totalDescription:
        'Selectable per round; doubles weapon damage dice only.',
      prerequisites: [
        { type: 'level', minimum: 10 },
        { type: 'attribute', attribute: 'int', minimum: 13 },
      ],
      effects: [],
    },
  ],
};

export const rangedEnergyOverdrive: SkillEntity = {
  id: 'rangedEnergyOverdrive',
  name: 'Ranged - Energy Overdrive',
  family: 'attack',
  skillPointType: 'core',
  description:
    'Spend triple energy cost to deal double weapon damage dice with energy-based ranged weapons.',
  tiers: [
    {
      tier: 1,
      name: 'Basic',
      description: 'Selectable per round; doubles weapon damage dice only.',
      deltaDescription:
        'Selectable per round; doubles weapon damage dice only.',
      totalDescription:
        'Selectable per round; doubles weapon damage dice only.',
      prerequisites: [
        { type: 'level', minimum: 12 },
        { type: 'attribute', attribute: 'int', minimum: 13 },
      ],
      effects: [],
    },
  ],
};

export const meleeFury: SkillEntity = {
  id: 'meleeFury',
  name: 'Melee - Fury',
  family: 'attack',
  skillPointType: 'core',
  description:
    'Sacrifice focus and embrace rage to deal extra damage with melee weapons.',
  tiers: [
    {
      tier: 1,
      name: 'Basic',
      description: 'Selectable per round: -4 attack, +3 damage.',
      deltaDescription: 'Selectable per round: -4 attack, +3 damage.',
      totalDescription: 'Selectable per round: -4 attack, +3 damage.',
      prerequisites: [
        { type: 'level', minimum: 6 },
        { type: 'attribute', attribute: 'str', minimum: 17 },
      ],
      effects: [],
    },
  ],
};

export const rangedCarefulAim: SkillEntity = {
  id: 'rangedCarefulAim',
  name: 'Ranged - Careful Aim',
  family: 'attack',
  skillPointType: 'core',
  description:
    'Spend extra time aiming to gain precision with handheld ranged weapons.',
  tiers: [
    {
      tier: 1,
      name: 'Basic',
      description:
        'Selectable per round; double aiming time for +5 attack bonus (handheld only).',
      deltaDescription:
        'Selectable per round; double aiming time for +5 attack bonus (handheld only).',
      totalDescription:
        'Selectable per round; double aiming time for +5 attack bonus (handheld only).',
      prerequisites: [
        { type: 'level', minimum: 6 },
        { type: 'attribute', attribute: 'dex', minimum: 15 },
      ],
      effects: [],
    },
  ],
};
