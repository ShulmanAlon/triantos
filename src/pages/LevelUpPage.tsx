import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { LoadingErrorWrapper } from '@/components/LoadingErrorWrapper';
import { useLanguage } from '@/context/LanguageContext';
import { SkillEntity } from '@/types/skills';
import { getSkillName } from '@/utils/domain/skills';
import { uiLabels } from '@/i18n/ui';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useCharacterById } from '@/hooks/useCharacterById';
import { USER_ROLES } from '@/config/userRoles';
import { Attribute } from '@/types/attributes';
import { ClassId } from '@/types/gameClass';
import { RaceId } from '@/types/race';
import {
  LevelUpBucket,
  SkillSelectionEntry,
  CharacterProgression,
} from '@/types/characters';
import {
  getAcquiredSkillSelectionsUpToLevel,
  getSkillPointPoolForLevel,
  getSkillPointUsageForLevel,
  getSkillTierAvailability,
  getInvalidSelectionsForLevel,
  validateLevelSkillSelections,
} from '@/utils/skills/skillProgression';
import { SkillPointType, SkillId } from '@/types/skills';
import { getClassById, getClassLevelDataById } from '@/utils/classUtils';
import { getBaseDerivedStats } from '@/utils/derived/getBaseDerivedStats';
import { getRaceById } from '@/utils/raceUtils';
import { attributeLabels } from '@/i18n/attributes';
import { getClassNameById } from '@/utils/classUtils';
import { getRaceNameById } from '@/utils/raceUtils';
import { useToast } from '@/context/ToastContext';
import { LevelUpHeader } from '@/pages/levelUp/LevelUpHeader';
import { LevelUpStatsPanel } from '@/pages/levelUp/LevelUpStatsPanel';
import { SkillsPanel } from '@/pages/levelUp/SkillsPanel';
import { AttributePointSection } from '@/pages/levelUp/AttributePointSection';

const ensureNextLevelBucket = (
  buckets: LevelUpBucket[],
  nextLevel: number
): LevelUpBucket[] => {
  const existing = buckets.find((b) => b.level === nextLevel);
  if (existing) return buckets;
  return [
    ...buckets,
    { level: nextLevel, skillSelections: [], attributeIncreases: {} },
  ].sort((a, b) => a.level - b.level);
};

const applyAttributeIncreases = (
  base: Record<Attribute, number>,
  increases: Partial<Record<Attribute, number>>
): Record<Attribute, number> => {
  const next = { ...base };
  for (const [key, value] of Object.entries(increases)) {
    const attr = key as Attribute;
    if (typeof value !== 'number') continue;
    next[attr] = (next[attr] ?? 0) + value;
  }
  return next;
};

export default function CharacterLevelUpPage() {
  const { id: characterId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const ui = uiLabels[language];
  const user = useCurrentUser();
  const { toast } = useToast();

  const [skillsData, setSkillsData] = useState<SkillEntity[] | null>(null);

  useEffect(() => {
    let isMounted = true;
    import('@/data/skills/allSkills').then((module) => {
      if (!isMounted) return;
      setSkillsData(module.allSkills);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const {
    character,
    loading: isLoading,
    error: hasError,
    updateCharacter,
  } = useCharacterById(characterId);

  const [skillBuckets, setSkillBuckets] = useState<LevelUpBucket[]>([]);
  const [attributes, setAttributes] = useState<Record<Attribute, number>>(
    {} as Record<Attribute, number>
  );
  const [levelIncreases, setLevelIncreases] = useState<
    Partial<Record<Attribute, number>>
  >({});
  const [usedPoints, setUsedPoints] = useState(0);
  const [showLockedSkills, setShowLockedSkills] = useState(false);
  const [showIneligibleSkills, setShowIneligibleSkills] = useState(false);
  const [showAcquiredSkills, setShowAcquiredSkills] = useState(false);
  const [spendTypeByTier, setSpendTypeByTier] = useState<
    Record<string, SkillPointType>
  >({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canEditCharacter =
    character !== null &&
    user !== null &&
    (character.user_id === user.id ||
      character.campaign_owner_id === user.id ||
      user.role === USER_ROLES.ADMIN);

  const progressionBuckets = useMemo(() => {
    return character?.progression?.buckets ?? [];
  }, [character?.progression]);

  const currentLevel = character?.level ?? 1;
  const nextLevel = currentLevel + 1;
  const selectedClassData = character
    ? getClassById(character.class_id as ClassId)
    : undefined;
  const selectedRaceData = character
    ? getRaceById(character.race_id as RaceId)
    : undefined;
  const nextLevelData = character
    ? getClassLevelDataById(character.class_id as ClassId, nextLevel)
    : undefined;
  const hasAbilityPointThisLevel = !!nextLevelData?.abilityPoint;

  useEffect(() => {
    if (!character) return;
    const initializedBuckets = ensureNextLevelBucket(
      progressionBuckets,
      nextLevel
    );
    setSkillBuckets(initializedBuckets);

    const nextBucket =
      initializedBuckets.find((b) => b.level === nextLevel) ?? null;
    const increases = nextBucket?.attributeIncreases ?? {};
    setLevelIncreases(increases);
    setUsedPoints(
      Object.values(increases).reduce((sum, value) => sum + (value ?? 0), 0)
    );
    setAttributes(applyAttributeIncreases(character.attributes, increases));
  }, [character, nextLevel, progressionBuckets]);

  const currentBucket =
    skillBuckets.find((bucket) => bucket.level === nextLevel) ??
    skillBuckets[0];
  const currentSelections = currentBucket?.skillSelections ?? [];

  const updateCurrentBucketSelections = (next: SkillSelectionEntry[]) => {
    setSkillBuckets((prev) =>
      prev.map((bucket) =>
        bucket.level === nextLevel
          ? { ...bucket, skillSelections: next }
          : bucket
      )
    );
  };

  const pruneInvalidSelections = (nextAttributes: Record<Attribute, number>) => {
    if (!selectedClassData || !character || !skillsData) return;
    const tempBuckets = skillBuckets.map((bucket) =>
      bucket.level === nextLevel
        ? { ...bucket, skillSelections: currentSelections }
        : bucket
    );
    const invalid = getInvalidSelectionsForLevel({
      buckets: tempBuckets,
      level: nextLevel,
      gameClass: selectedClassData,
      raceId: character.race_id as RaceId,
      attributes: nextAttributes,
      skillEntities: skillsData,
    });
    if (invalid.length === 0) return;
    const invalidSet = new Set(
      invalid.map((item) => `${item.skillId}:${item.tier}`)
    );
    updateCurrentBucketSelections(
      currentSelections.filter(
        (selection) =>
          !invalidSet.has(`${selection.skillId}:${selection.tier}`)
      )
    );
  };

  const updateAttributeIncreases = (
    attr: Attribute,
    newValue: number,
    baseAttributes: Record<Attribute, number>
  ) => {
    const increase = newValue - (baseAttributes[attr] ?? 0);
    const nextIncreases: Partial<Record<Attribute, number>> = {
      ...levelIncreases,
    };

    if (increase > 0) {
      nextIncreases[attr] = increase;
    } else {
      delete nextIncreases[attr];
    }

    const used = Object.values(nextIncreases).reduce(
      (sum, value) => sum + (value ?? 0),
      0
    );
    setLevelIncreases(nextIncreases);
    setUsedPoints(used);
  };

  const handleAttributeChange = (
    attr: Attribute,
    newValue: number,
    _poolDelta: number
  ) => {
    if (!character) return;
    const nextAttributes = { ...attributes, [attr]: newValue };
    setAttributes(nextAttributes);
    updateAttributeIncreases(attr, newValue, character.attributes);
    pruneInvalidSelections(nextAttributes);
  };

  const handleAddSkill = (
    skillId: SkillId,
    tier: number,
    spendType: SkillPointType
  ) => {
    const exists = currentSelections.some(
      (s) => s.skillId === skillId && s.tier === tier
    );
    if (exists) return;
    updateCurrentBucketSelections([
      ...currentSelections,
      { skillId, tier, spendType },
    ]);
  };

  const handleRemoveSkill = (skillId: SkillId, tier: number) => {
    updateCurrentBucketSelections(
      currentSelections.filter(
        (s) => !(s.skillId === skillId && s.tier === tier)
      )
    );
  };

  const skillPool =
    selectedClassData && character
      ? getSkillPointPoolForLevel(
          selectedClassData,
          character.race_id as RaceId,
          nextLevel
        )
      : { core: 0, utility: 0, human: 0 };

  const skillUsed = getSkillPointUsageForLevel(currentSelections);
  const skillRemaining = {
    core: skillPool.core - skillUsed.core,
    utility: skillPool.utility - skillUsed.utility,
    human: skillPool.human - skillUsed.human,
  };

  const acquiredSkills = useMemo(
    () =>
      selectedClassData && character && skillsData
        ? getAcquiredSkillSelectionsUpToLevel(
            skillBuckets,
            skillsData,
            selectedClassData.id,
            character.race_id as RaceId,
            nextLevel
          )
        : [],
    [
      character,
      nextLevel,
      selectedClassData,
      skillBuckets,
      skillsData,
    ]
  );

  const acquiredThisLevel = useMemo(() => {
    if (!skillsData || !selectedClassData || !character) return [];
    return acquiredSkills.filter(
      (selection) =>
        selection.acquiredAtLevel === nextLevel &&
        (selection.source === 'race' || selection.source === 'class')
    );
  }, [acquiredSkills, character, nextLevel, selectedClassData, skillsData]);

  const acquiredThisLevelSet = useMemo(() => {
    return new Set(
      acquiredThisLevel.map((selection) => `${selection.skillId}:${selection.tier}`)
    );
  }, [acquiredThisLevel]);


  const skillValidation =
    selectedClassData && character && skillsData
      ? validateLevelSkillSelections({
          buckets: skillBuckets,
          level: nextLevel,
          gameClass: selectedClassData,
          raceId: character.race_id as RaceId,
          attributes,
          skillEntities: skillsData,
        })
      : null;

  const canLevelUp =
    !!selectedClassData &&
    !!selectedRaceData &&
    !!nextLevelData &&
    canEditCharacter &&
    (skillValidation?.isValid ?? false) &&
    (!hasAbilityPointThisLevel || usedPoints > 0) &&
    !saving;
  const attributesReady = Object.keys(attributes).length > 0;
  const hasUnspentAbilityPoint = hasAbilityPointThisLevel && usedPoints === 0;

  const attributeNames = attributeLabels[language];
  const hasSkillPoints =
    skillPool.core + skillPool.utility + skillPool.human > 0;

  const nextBaseStats = useMemo(
    () =>
      selectedClassData
        ? getBaseDerivedStats(selectedClassData, attributes, nextLevel)
        : null,
    [selectedClassData, attributes, nextLevel]
  );

  const currentBaseStats = useMemo(
    () =>
      selectedClassData && character
        ? getBaseDerivedStats(
            selectedClassData,
            character.attributes,
            currentLevel
          )
        : null,
    [selectedClassData, character, currentLevel]
  );

  const hpGain = Math.max(
    0,
    (nextBaseStats?.hp ?? 0) - (currentBaseStats?.hp ?? 0)
  );

  const hasSkillTier = (skillId: SkillId, tier: number): boolean =>
    acquiredSkills.some(
      (selection) =>
        selection.skillId === skillId &&
        selection.tier >= tier &&
        selection.acquiredAtLevel <= nextLevel
    );

  const getPrereqLabel = (prereq: {
    type: 'level' | 'attribute' | 'skill';
    minimum?: number;
    attribute?: Attribute;
    skillId?: SkillId;
    tier?: number;
  }): { label: string; met: boolean } => {
    if (prereq.type === 'level') {
      return {
        label: `Level ${prereq.minimum ?? 0}`,
        met: nextLevel >= (prereq.minimum ?? 0),
      };
    }
    if (prereq.type === 'attribute' && prereq.attribute) {
      const min = prereq.minimum ?? 0;
      const current = attributes[prereq.attribute] ?? 0;
      return {
        label: `${attributeNames[prereq.attribute]} ${min}`,
        met: current >= min,
      };
    }
    if (prereq.type === 'skill' && prereq.skillId && prereq.tier) {
      const skillName = getSkillName(prereq.skillId);
      return {
        label: `${skillName} Tier ${prereq.tier}`,
        met: hasSkillTier(prereq.skillId, prereq.tier),
      };
    }
    return { label: 'Unknown requirement', met: false };
  };

  const handleSave = async () => {
    if (!character || !selectedClassData || !selectedRaceData) return;
    setSaving(true);
    setError(null);

    const nextBuckets = skillBuckets.map((bucket) =>
      bucket.level === nextLevel
        ? { ...bucket, attributeIncreases: levelIncreases }
        : bucket
    );

    const progression: CharacterProgression = { buckets: nextBuckets };
    const updatedAttributes = applyAttributeIncreases(
      character.attributes,
      levelIncreases
    );

    try {
      const result = await updateCharacter({
        level: nextLevel,
        attributes: updatedAttributes,
        progression,
      });
      if (result?.error) {
        setError(result.error.message ?? 'Failed to level up.');
        toast.error(result.error.message ?? 'Failed to level up.');
        return;
      }
      navigate(`/character/${character.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to level up.');
    } finally {
      setSaving(false);
    }
  };

  const dataLoading = skillsData === null;

  return (
    <LoadingErrorWrapper loading={isLoading || dataLoading} error={hasError}>
      {!character ? (
        <p className="p-4 text-red-600">Character not found.</p>
      ) : !canEditCharacter ? (
        <p className="p-4 text-red-600">You do not have permission.</p>
      ) : (
        <div className="max-w-6xl mx-auto p-4">
          <LevelUpHeader
            title={ui.levelUp}
            cancelLabel={ui.cancel}
            onCancel={() => navigate(-1)}
            currentLevel={currentLevel}
            nextLevel={nextLevel}
            classId={getClassNameById(character.class_id, language)}
            raceId={getRaceNameById(character.race_id, language)}
            showMissingProgression={!nextLevelData}
            rightContent={
              selectedClassData &&
              attributesReady && (
                <LevelUpStatsPanel nextStats={nextBaseStats} hpGain={hpGain} />
              )
            }
          />

          {hasAbilityPointThisLevel && (
            <div className="section-gap panel p-4">
              <AttributePointSection
                hasAbilityPoint={hasAbilityPointThisLevel}
                hasUnspent={hasUnspentAbilityPoint}
                attributesReady={attributesReady}
                attributes={attributes}
                baseline={character.attributes}
                usedPoints={usedPoints}
                onChange={handleAttributeChange}
                selectedClassData={selectedClassData}
              />
            </div>
          )}

          {hasSkillPoints && skillsData && (
            <div className="section-gap panel p-4 text-sm text-gray-700">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <h3 className="section-title">{ui.skills}</h3>
                <div className="text-xs text-(--muted)">
                  <span className="font-semibold">Pool:</span> Core{' '}
                  {skillRemaining.core}, Utility {skillRemaining.utility}
                  {character.race_id === 'Human' && (
                    <>
                      , Human {skillRemaining.human}
                    </>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-4 text-xs text-(--muted) mb-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showAcquiredSkills}
                    onChange={(e) => setShowAcquiredSkills(e.target.checked)}
                  />
                  {ui.showAcquired ?? 'Show acquired'}
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showLockedSkills}
                    onChange={(e) => setShowLockedSkills(e.target.checked)}
                  />
                  {ui.showLocked ?? 'Show locked'}
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showIneligibleSkills}
                    onChange={(e) => setShowIneligibleSkills(e.target.checked)}
                  />
                  {ui.showIneligible ?? 'Show ineligible'}
                </label>
              </div>

              <SkillsPanel
                skills={skillsData}
                showAcquired={showAcquiredSkills}
                acquiredThisLevel={acquiredThisLevelSet}
                showLocked={showLockedSkills}
                showIneligible={showIneligibleSkills}
                skillRemaining={skillRemaining}
                currentSelections={currentSelections}
                getTierAvailability={(skill, tierNumber) =>
                  selectedClassData && character
                    ? getSkillTierAvailability({
                        skill,
                        tier: skill.tiers.find((t) => t.tier === tierNumber)!,
                        attributes,
                        classId: selectedClassData.id,
                        raceId: character.race_id as RaceId,
                        level: nextLevel,
                        pool: skillRemaining,
                        acquired: acquiredSkills,
                        allowSameLevelForPrereqs: true,
                      })
                    : { status: 'ineligible', reasons: [], canAfford: false }
                }
                getPrereqLabels={(skill, tierNumber) =>
                  (skill.tiers.find((t) => t.tier === tierNumber)?.prerequisites ?? [])
                    .map((prereq) => getPrereqLabel(prereq))
                }
                getPointRequirement={(skill, tierNumber, availability) =>
                  availability.status === 'available' && !availability.canAfford
                    ? skill.skillPointType === 'core'
                      ? ui.requiresCorePoint ?? 'Requires a core skill point'
                      : skill.skillPointType === 'utility'
                      ? ui.requiresUtilityPoint ?? 'Requires a utility skill point'
                      : ui.requiresHumanPoint ?? 'Requires a human skill point'
                    : null
                }
                getSpendOptions={(skill) => {
                  const canUseHumanPoint =
                    character?.race_id === 'Human' && skillRemaining.human > 0;
                  if (skill.skillPointType === 'core') {
                    return [
                      'core',
                      ...(canUseHumanPoint ? (['human'] as SkillPointType[]) : []),
                    ];
                  }
                  if (skill.skillPointType === 'utility') {
                    return [
                      'utility',
                      ...(canUseHumanPoint ? (['human'] as SkillPointType[]) : []),
                    ];
                  }
                  return canUseHumanPoint ? ['human'] : [];
                }}
                getDefaultSpendType={(tierKey, skill) =>
                  spendTypeByTier[tierKey] ??
                  (skill.skillPointType !== 'human' &&
                  skillRemaining[skill.skillPointType] > 0
                    ? skill.skillPointType
                    : skillRemaining.human > 0
                    ? 'human'
                    : skill.skillPointType)
                }
                onSpendTypeChange={(key, value) =>
                  setSpendTypeByTier((prev) => ({ ...prev, [key]: value }))
                }
                onAdd={(skillId, tier, spendType) =>
                  handleAddSkill(skillId, tier, spendType)
                }
                onRemove={(skillId, tier) => handleRemoveSkill(skillId, tier)}
              />

              {skillValidation && !skillValidation.isValid && (
                <div className="mt-4 text-xs text-red-600 space-y-1">
                  {skillValidation.errors.map((err, idx) => (
                    <div key={idx}>{err}</div>
                  ))}
                </div>
              )}
            </div>
          )}

          {error && <div className="sr-only">{error}</div>}

          <div className="section-gap flex justify-end gap-2">
            <Button variant="outline" onClick={() => navigate(-1)}>
              {ui.cancel}
            </Button>
            <Button onClick={handleSave} disabled={!canLevelUp}>
              {ui.levelUp}
            </Button>
          </div>
        </div>
      )}
    </LoadingErrorWrapper>
  );
}
