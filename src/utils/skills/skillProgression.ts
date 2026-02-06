import { Attribute } from '@/types/attributes';
import { ClassId, GameClass } from '@/types/gameClass';
import {
  CharacterSkillSelection,
  LevelUpBucket,
  SkillPointPool,
  SkillSelectionEntry,
} from '@/types/characters';
import { RaceId } from '@/types/race';
import {
  SkillEntity,
  TierData,
  TierPrerequisite,
  SkillPointType,
  SkillId,
} from '@/types/skills';

export type SkillTierStatus = 'available' | 'locked' | 'ineligible' | 'acquired';

export type SkillTierAvailability = {
  status: SkillTierStatus;
  reasons: string[];
  canAfford: boolean;
};

export type SkillSelectionValidationResult = {
  isValid: boolean;
  errors: string[];
  pool: SkillPointPool;
  used: SkillPointPool;
  remaining: SkillPointPool;
};

export type InvalidSkillSelection = {
  skillId: SkillId;
  tier: number;
  reason: string;
};

const emptyPool: SkillPointPool = { core: 0, utility: 0, human: 0 };

const addPool = (a: SkillPointPool, b: SkillPointPool): SkillPointPool => ({
  core: a.core + b.core,
  utility: a.utility + b.utility,
  human: a.human + b.human,
});

const subtractPool = (a: SkillPointPool, b: SkillPointPool): SkillPointPool => ({
  core: a.core - b.core,
  utility: a.utility - b.utility,
  human: a.human - b.human,
});

const isPoolNonNegative = (pool: SkillPointPool): boolean =>
  pool.core >= 0 && pool.utility >= 0 && pool.human >= 0;

const poolFromSpendType = (spendType: SkillPointType): SkillPointPool => ({
  core: spendType === 'core' ? 1 : 0,
  utility: spendType === 'utility' ? 1 : 0,
  human: spendType === 'human' ? 1 : 0,
});

const isSkillGrantApplicable = (
  grant: { onlyForClass?: ClassId; onlyForRace?: RaceId } | undefined,
  classId: ClassId,
  raceId: RaceId
): boolean => {
  if (!grant) return true;
  if (grant.onlyForClass && grant.onlyForClass !== classId) return false;
  if (grant.onlyForRace && grant.onlyForRace !== raceId) return false;
  return true;
};

export const getSkillPointPoolForLevel = (
  gameClass: GameClass,
  raceId: RaceId,
  level: number
): SkillPointPool => {
  const levelData = gameClass.progression.find((l) => l.level === level);
  if (!levelData?.skill) return { ...emptyPool };

  return levelData.skill.reduce<SkillPointPool>((pool, grant) => {
    if (!isSkillGrantApplicable(grant, gameClass.id, raceId)) return pool;
    return addPool(pool, {
      core: grant.skillPointType === 'core' ? grant.skillPoints : 0,
      utility: grant.skillPointType === 'utility' ? grant.skillPoints : 0,
      human: grant.skillPointType === 'human' ? grant.skillPoints : 0,
    });
  }, { ...emptyPool });
};

export const getSkillPointUsageForLevel = (
  selections: SkillSelectionEntry[] | undefined
): SkillPointPool => {
  if (!selections || selections.length === 0) return { ...emptyPool };
  return selections.reduce<SkillPointPool>((pool, selection) => {
    return addPool(pool, poolFromSpendType(selection.spendType));
  }, { ...emptyPool });
};

export const getFreeSkillGrantsUpToLevel = (
  skillEntities: SkillEntity[],
  classId: ClassId,
  raceId: RaceId,
  level: number
): CharacterSkillSelection[] => {
  const grants: CharacterSkillSelection[] = [];

  for (const skill of skillEntities) {
    for (const tier of skill.tiers) {
      const classGrant = tier.freeForClasses?.find(
        (g) => g.classId === classId && g.atLevel <= level
      );
      const raceGrant = tier.freeForRaces?.find(
        (g) => g.raceId === raceId && g.atLevel <= level
      );

      if (classGrant) {
        grants.push({
          skillId: skill.id,
          tier: tier.tier,
          acquiredAtLevel: classGrant.atLevel,
          source: 'class',
        });
      }

      if (raceGrant) {
        grants.push({
          skillId: skill.id,
          tier: tier.tier,
          acquiredAtLevel: raceGrant.atLevel,
          source: 'race',
        });
      }
    }
  }

  return grants;
};

export const getSelectedSkillsUpToLevel = (
  buckets: LevelUpBucket[],
  level: number
): CharacterSkillSelection[] => {
  return buckets
    .filter((b) => b.level <= level)
    .flatMap((b) =>
      (b.skillSelections ?? []).map((s) => ({
        skillId: s.skillId,
        tier: s.tier,
        acquiredAtLevel: b.level,
        source: 'selected' as const,
        spendType: s.spendType,
      }))
    );
};

const uniqueSkillSelections = (
  selections: CharacterSkillSelection[]
): CharacterSkillSelection[] => {
  const seen = new Set<string>();
  const unique: CharacterSkillSelection[] = [];

  for (const selection of selections) {
    const key = `${selection.skillId}:${selection.tier}:${selection.source}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(selection);
  }

  return unique;
};

export const getAcquiredSkillSelectionsUpToLevel = (
  buckets: LevelUpBucket[],
  skillEntities: SkillEntity[],
  classId: ClassId,
  raceId: RaceId,
  level: number
): CharacterSkillSelection[] => {
  const selected = getSelectedSkillsUpToLevel(buckets, level);
  const freeGrants = getFreeSkillGrantsUpToLevel(
    skillEntities,
    classId,
    raceId,
    level
  );

  return uniqueSkillSelections([...selected, ...freeGrants]);
};

const isSkillForbidden = (
  skill: SkillEntity,
  classId: ClassId,
  raceId: RaceId
): boolean => {
  if (skill.forbiddenClasses?.includes(classId)) return true;
  if (skill.forbiddenRaces?.includes(raceId)) return true;
  return false;
};

const hasSkillTier = (
  acquired: CharacterSkillSelection[],
  skillId: SkillId,
  tier: number,
  level: number,
  allowSameLevel: boolean
): boolean => {
  return acquired.some((s) => {
    if (s.skillId !== skillId || s.tier < tier) return false;
    return allowSameLevel ? s.acquiredAtLevel <= level : s.acquiredAtLevel < level;
  });
};

const isPrerequisiteMet = (
  prereq: TierPrerequisite,
  attributes: Record<Attribute, number>,
  acquired: CharacterSkillSelection[],
  level: number,
  allowSameLevel: boolean
): boolean => {
  switch (prereq.type) {
    case 'level':
      return level >= prereq.minimum;
    case 'attribute':
      return (attributes[prereq.attribute] ?? 0) >= prereq.minimum;
    case 'skill':
      return hasSkillTier(
        acquired,
        prereq.skillId,
        prereq.tier,
        level,
        allowSameLevel
      );
  }
};

const getTierByNumber = (
  skill: SkillEntity,
  tierNumber: number
): TierData | undefined => skill.tiers.find((t) => t.tier === tierNumber);

const canSpendOnSkill = (
  skill: SkillEntity,
  spendType: SkillPointType
): boolean => {
  if (spendType === 'human') return true;
  return skill.skillPointType === spendType;
};

export const getSkillTierAvailability = ({
  skill,
  tier,
  attributes,
  classId,
  raceId,
  level,
  pool,
  acquired,
  allowSameLevelForPrereqs = true,
}: {
  skill: SkillEntity;
  tier: TierData;
  attributes: Record<Attribute, number>;
  classId: ClassId;
  raceId: RaceId;
  level: number;
  pool: SkillPointPool;
  acquired: CharacterSkillSelection[];
  allowSameLevelForPrereqs?: boolean;
}): SkillTierAvailability => {
  const reasons: string[] = [];

  if (isSkillForbidden(skill, classId, raceId)) {
    return { status: 'ineligible', reasons: ['forbidden'], canAfford: false };
  }

  if (hasSkillTier(acquired, skill.id, tier.tier, level, true)) {
    return { status: 'acquired', reasons: [], canAfford: false };
  }

  const prereqs = tier.prerequisites ?? [];
  for (const prereq of prereqs) {
    if (!isPrerequisiteMet(prereq, attributes, acquired, level, allowSameLevelForPrereqs)) {
      reasons.push(prereq.type);
    }
  }

  const canAfford =
    (skill.skillPointType === 'core' && (pool.core > 0 || pool.human > 0)) ||
    (skill.skillPointType === 'utility' &&
      (pool.utility > 0 || pool.human > 0)) ||
    (skill.skillPointType === 'human' && pool.human > 0);

  if (reasons.length > 0) {
    return { status: 'locked', reasons, canAfford };
  }

  return { status: 'available', reasons: [], canAfford };
};

export const validateLevelSkillSelections = ({
  buckets,
  level,
  gameClass,
  raceId,
  attributes,
  skillEntities,
}: {
  buckets: LevelUpBucket[];
  level: number;
  gameClass: GameClass;
  raceId: RaceId;
  attributes: Record<Attribute, number>;
  skillEntities: SkillEntity[];
}): SkillSelectionValidationResult => {
  const errors: string[] = [];

  const currentBucket = buckets.find((b) => b.level === level);
  const selections = currentBucket?.skillSelections ?? [];

  const pool = getSkillPointPoolForLevel(gameClass, raceId, level);
  const used = getSkillPointUsageForLevel(selections);
  const remaining = subtractPool(pool, used);

  if (!isPoolNonNegative(remaining)) {
    errors.push('spent more skill points than available');
  }

  if (remaining.core !== 0 || remaining.utility !== 0 || remaining.human !== 0) {
    errors.push('all skill points must be spent for this level');
  }

  const acquired = getAcquiredSkillSelectionsUpToLevel(
    buckets,
    skillEntities,
    gameClass.id,
    raceId,
    level
  );

  const seen = new Set<string>();

  for (const selection of selections) {
    const key = `${selection.skillId}:${selection.tier}`;
    if (seen.has(key)) {
      errors.push(`duplicate selection for ${selection.skillId} tier ${selection.tier}`);
      continue;
    }
    seen.add(key);

    const skill = skillEntities.find((s) => s.id === selection.skillId);
    if (!skill) {
      errors.push(`unknown skill ${selection.skillId}`);
      continue;
    }

    if (!canSpendOnSkill(skill, selection.spendType)) {
      errors.push(`invalid spend type for ${selection.skillId} tier ${selection.tier}`);
    }

    const tier = getTierByNumber(skill, selection.tier);
    if (!tier) {
      errors.push(`invalid tier ${selection.tier} for ${selection.skillId}`);
      continue;
    }

    if (isSkillForbidden(skill, gameClass.id, raceId)) {
      errors.push(`skill ${selection.skillId} is forbidden for this class or race`);
      continue;
    }

    const prereqs = tier.prerequisites ?? [];
    for (const prereq of prereqs) {
      if (!isPrerequisiteMet(prereq, attributes, acquired, level, true)) {
        errors.push(
          `missing prerequisite ${prereq.type} for ${selection.skillId} tier ${selection.tier}`
        );
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    pool,
    used,
    remaining,
  };
};

export const getInvalidSelectionsForLevel = ({
  buckets,
  level,
  gameClass,
  raceId,
  attributes,
  skillEntities,
}: {
  buckets: LevelUpBucket[];
  level: number;
  gameClass: GameClass;
  raceId: RaceId;
  attributes: Record<Attribute, number>;
  skillEntities: SkillEntity[];
}): InvalidSkillSelection[] => {
  const invalid: InvalidSkillSelection[] = [];
  const currentBucket = buckets.find((b) => b.level === level);
  const selections = currentBucket?.skillSelections ?? [];
  if (selections.length === 0) return invalid;

  const acquired = getAcquiredSkillSelectionsUpToLevel(
    buckets,
    skillEntities,
    gameClass.id,
    raceId,
    level
  );

  for (const selection of selections) {
    const skill = skillEntities.find((s) => s.id === selection.skillId);
    if (!skill) {
      invalid.push({
        skillId: selection.skillId,
        tier: selection.tier,
        reason: 'unknown',
      });
      continue;
    }

    const tier = getTierByNumber(skill, selection.tier);
    if (!tier) {
      invalid.push({
        skillId: selection.skillId,
        tier: selection.tier,
        reason: 'invalid-tier',
      });
      continue;
    }

    if (isSkillForbidden(skill, gameClass.id, raceId)) {
      invalid.push({
        skillId: selection.skillId,
        tier: selection.tier,
        reason: 'forbidden',
      });
      continue;
    }

    const prereqs = tier.prerequisites ?? [];
    for (const prereq of prereqs) {
      if (!isPrerequisiteMet(prereq, attributes, acquired, level, true)) {
        invalid.push({
          skillId: selection.skillId,
          tier: selection.tier,
          reason: 'prerequisite',
        });
        break;
      }
    }
  }

  return invalid;
};
