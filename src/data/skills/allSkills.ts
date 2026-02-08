import { SkillEntity, SkillId } from '@/types/skills';
import * as attackSkills from './attackSkills';
import * as defenseSkills from './defenseSkills';
import * as magicSkills from './magicSkills';
import * as pilotingSkills from './pilotingSkills';
import * as racialSkills from './racialSkills';
import * as utilitySkills from './utilitySkills';

const collect = (group: Record<string, SkillEntity>): SkillEntity[] =>
  Object.values(group);

const SKILL_METADATA: Record<SkillId, Partial<SkillEntity>> = {
  // Core (basic) skills
  overpower: {
    group: 'basic',
    category: 'basic',
    categoryOrder: 0,
    sortOrder: 1,
  },
  athletics: {
    group: 'basic',
    category: 'basic',
    categoryOrder: 0,
    sortOrder: 2,
  },
  piloting: {
    group: 'basic',
    category: 'basic',
    categoryOrder: 0,
    sortOrder: 3,
  },
  hide: { group: 'basic', category: 'basic', categoryOrder: 0, sortOrder: 4 },
  thieving: {
    group: 'basic',
    category: 'basic',
    categoryOrder: 0,
    sortOrder: 5,
  },
  willpower: {
    group: 'basic',
    category: 'basic',
    categoryOrder: 0,
    sortOrder: 6,
  },
  detect: {
    group: 'basic',
    category: 'basic',
    categoryOrder: 0,
    sortOrder: 7,
  },
  medicine: {
    group: 'basic',
    category: 'basic',
    categoryOrder: 0,
    sortOrder: 8,
  },
  knowledge: {
    group: 'basic',
    category: 'basic',
    categoryOrder: 0,
    sortOrder: 9,
  },
  mechanic: {
    group: 'basic',
    category: 'basic',
    categoryOrder: 0,
    sortOrder: 10,
  },
  toughness: {
    group: 'basic',
    category: 'basic',
    categoryOrder: 0,
    sortOrder: 11,
  },
  negotiate: {
    group: 'basic',
    category: 'basic',
    categoryOrder: 0,
    sortOrder: 12,
  },
  intimidate: {
    group: 'basic',
    category: 'basic',
    categoryOrder: 0,
    sortOrder: 13,
  },

  // Attack (passive)
  basicWeapons: {
    group: 'passive',
    category: 'weaponProficiency',
    categoryOrder: 10,
    sortOrder: 1,
  },
  rangedAdvancedWeapons: {
    group: 'passive',
    category: 'weaponProficiency',
    categoryOrder: 10,
    sortOrder: 2,
  },
  rangedHeavyWeapons: {
    group: 'passive',
    category: 'weaponProficiency',
    categoryOrder: 10,
    sortOrder: 3,
  },
  rangedGunner: {
    group: 'passive',
    category: 'weaponProficiency',
    categoryOrder: 10,
    sortOrder: 4,
  },
  melee2hWeapons: {
    group: 'passive',
    category: 'weaponProficiency',
    categoryOrder: 10,
    sortOrder: 5,
  },
  meleeEnergyWeapons: {
    group: 'passive',
    category: 'weaponProficiency',
    categoryOrder: 10,
    sortOrder: 6,
  },
  meleeArmorPiercer: {
    group: 'passive',
    category: 'melee',
    categoryOrder: 20,
    sortOrder: 1,
  },
  rangedLongAim: {
    group: 'passive',
    category: 'ranged',
    categoryOrder: 30,
    sortOrder: 1,
  },

  // Attack (actionable)
  meleeEnergyOverdrive: {
    group: 'actionable',
    category: 'melee',
    categoryOrder: 20,
    sortOrder: 2,
  },
  meleeFury: {
    group: 'actionable',
    category: 'melee',
    categoryOrder: 20,
    sortOrder: 3,
  },
  rangedCarefulAim: {
    group: 'actionable',
    category: 'ranged',
    categoryOrder: 30,
    sortOrder: 2,
  },
  rangedEnergyOverdrive: {
    group: 'actionable',
    category: 'ranged',
    categoryOrder: 30,
    sortOrder: 3,
  },

  // Defense (passive)
  armorUnarmored: {
    group: 'passive',
    category: 'armor',
    categoryOrder: 10,
    sortOrder: 1,
  },
  armorLight: {
    group: 'passive',
    category: 'armor',
    categoryOrder: 10,
    sortOrder: 2,
  },
  armorHeavy: {
    group: 'passive',
    category: 'armor',
    categoryOrder: 10,
    sortOrder: 3,
  },
  armorPower: {
    group: 'passive',
    category: 'armor',
    categoryOrder: 10,
    sortOrder: 4,
  },
  energyShield: {
    group: 'passive',
    category: 'shield',
    categoryOrder: 20,
    sortOrder: 1,
  },
  shieldFortress: {
    group: 'passive',
    category: 'shield',
    categoryOrder: 20,
    sortOrder: 2,
  },
  strongVitality: {
    group: 'passive',
    category: 'vitality',
    categoryOrder: 30,
    sortOrder: 1,
  },
  resistanceFire: {
    group: 'passive',
    category: 'resistance',
    categoryOrder: 40,
    sortOrder: 1,
  },
  resistanceCold: {
    group: 'passive',
    category: 'resistance',
    categoryOrder: 40,
    sortOrder: 2,
  },
  resistanceElectricity: {
    group: 'passive',
    category: 'resistance',
    categoryOrder: 40,
    sortOrder: 3,
  },
  resistanceAcid: {
    group: 'passive',
    category: 'resistance',
    categoryOrder: 40,
    sortOrder: 4,
  },
  resistancePoison: {
    group: 'passive',
    category: 'resistance',
    categoryOrder: 40,
    sortOrder: 5,
  },

  // Piloting
  pilotingTracked: {
    group: 'passive',
    category: 'piloting',
    subcategory: 'certification',
    categoryOrder: 10,
    sortOrder: 1,
  },
  pilotingPlanetaryShips: {
    group: 'passive',
    category: 'piloting',
    subcategory: 'certification',
    categoryOrder: 10,
    sortOrder: 2,
  },
  pilotingInterplanetaryShips: {
    group: 'passive',
    category: 'piloting',
    subcategory: 'certification',
    categoryOrder: 10,
    sortOrder: 3,
  },
  pilotingEvasiveManeuvers: {
    group: 'passive',
    category: 'piloting',
    subcategory: 'maneuvers',
    categoryOrder: 20,
    sortOrder: 1,
  },
  pilotingDodge: {
    group: 'actionable',
    category: 'piloting',
    subcategory: 'maneuvers',
    categoryOrder: 20,
    sortOrder: 1,
  },
  pilotingDiveAttack: {
    group: 'actionable',
    category: 'piloting',
    subcategory: 'maneuvers',
    categoryOrder: 20,
    sortOrder: 2,
  },

  // Utility (passive)
  solarGenerator: {
    group: 'passive',
    category: 'utility',
    subcategory: 'equipment',
    categoryOrder: 10,
    sortOrder: 1,
  },
  sabotage: {
    group: 'passive',
    category: 'utility',
    subcategory: 'general',
    categoryOrder: 20,
    sortOrder: 1,
  },
  communicator: {
    group: 'passive',
    category: 'utility',
    subcategory: 'general',
    categoryOrder: 20,
    sortOrder: 2,
  },
  language: {
    group: 'passive',
    category: 'utility',
    subcategory: 'general',
    categoryOrder: 20,
    sortOrder: 3,
  },
  disguise: {
    group: 'passive',
    category: 'utility',
    subcategory: 'general',
    categoryOrder: 20,
    sortOrder: 4,
  },
  readLanguage: {
    group: 'passive',
    category: 'utility',
    subcategory: 'general',
    categoryOrder: 20,
    sortOrder: 5,
  },
  quickReflexesInitiative: {
    group: 'passive',
    category: 'utility',
    subcategory: 'combat',
    categoryOrder: 30,
    sortOrder: 1,
  },

  // Magic
  spellPenetration: {
    group: 'passive',
    category: 'magic',
    subcategory: 'spell',
    categoryOrder: 10,
    sortOrder: 1,
  },
  magicAttunementFire: {
    group: 'passive',
    category: 'magic',
    subcategory: 'attunement',
    categoryOrder: 20,
    sortOrder: 1,
  },
  magicAttunementCold: {
    group: 'passive',
    category: 'magic',
    subcategory: 'attunement',
    categoryOrder: 20,
    sortOrder: 2,
  },
  magicAttunementElectricity: {
    group: 'passive',
    category: 'magic',
    subcategory: 'attunement',
    categoryOrder: 20,
    sortOrder: 3,
  },
  magicAttunementAcid: {
    group: 'passive',
    category: 'magic',
    subcategory: 'attunement',
    categoryOrder: 20,
    sortOrder: 4,
  },
  turnUndead: {
    group: 'actionable',
    category: 'magic',
    subcategory: 'turning',
    categoryOrder: 30,
    sortOrder: 1,
  },
  turnAbyssal: {
    group: 'actionable',
    category: 'magic',
    subcategory: 'turning',
    categoryOrder: 30,
    sortOrder: 2,
  },
  turnIntensity: {
    group: 'passive',
    category: 'magic',
    subcategory: 'turning',
    categoryOrder: 30,
    sortOrder: 3,
  },
  turnAreaOfEffect: {
    group: 'passive',
    category: 'magic',
    subcategory: 'turning',
    categoryOrder: 30,
    sortOrder: 4,
  },
  spellDuration: {
    group: 'passive',
    category: 'magic',
    subcategory: 'spell',
    categoryOrder: 10,
    sortOrder: 2,
  },
  forMage: {
    group: 'passive',
    category: 'magic',
    subcategory: 'misc',
    categoryOrder: 40,
    sortOrder: 1,
  },
  forCleric: {
    group: 'passive',
    category: 'magic',
    subcategory: 'misc',
    categoryOrder: 40,
    sortOrder: 2,
  },

  // Racial (passive)
  elfMagicAffinity: {
    group: 'passive',
    category: 'racial',
    categoryOrder: 10,
    sortOrder: 1,
  },
  elfDarkvision: {
    group: 'passive',
    category: 'racial',
    categoryOrder: 10,
    sortOrder: 2,
  },
  elfImmunity: {
    group: 'passive',
    category: 'racial',
    categoryOrder: 10,
    sortOrder: 3,
  },
  dwarfDarkvision: {
    group: 'passive',
    category: 'racial',
    categoryOrder: 10,
    sortOrder: 4,
  },
  dwarfMagicResistance: {
    group: 'passive',
    category: 'racial',
    categoryOrder: 10,
    sortOrder: 5,
  },
  dwarfMagicDamageReduction: {
    group: 'passive',
    category: 'racial',
    categoryOrder: 10,
    sortOrder: 6,
  },
  halflingLuckyCriticals: {
    group: 'passive',
    category: 'racial',
    categoryOrder: 10,
    sortOrder: 7,
  },
  humanQuickLearner: {
    group: 'passive',
    category: 'racial',
    categoryOrder: 10,
    sortOrder: 8,
  },
};

const normalizeSkill = (skill: SkillEntity): SkillEntity => ({
  ...skill,
  ...(SKILL_METADATA[skill.id] ?? {}),
  tiers: skill.tiers.map((tier) => ({
    ...tier,
    deltaDescription: tier.deltaDescription ?? tier.description,
    totalDescription: tier.totalDescription ?? tier.description,
  })),
});

export const allSkills: SkillEntity[] = [
  ...collect(attackSkills as Record<string, SkillEntity>).map(normalizeSkill),
  ...collect(defenseSkills as Record<string, SkillEntity>).map(normalizeSkill),
  ...collect(magicSkills as Record<string, SkillEntity>).map(normalizeSkill),
  ...collect(pilotingSkills as Record<string, SkillEntity>).map(normalizeSkill),
  ...collect(utilitySkills as Record<string, SkillEntity>).map(normalizeSkill),
  ...collect(racialSkills as Record<string, SkillEntity>).map(normalizeSkill),
];
// TODO: Add more skills across categories.

export const skillsById: Map<SkillId, SkillEntity> = new Map(
  allSkills.map((skill) => [skill.id, skill])
);
