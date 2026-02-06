import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AttributeAllocator } from '@/components/CharacterCreator/AttributeAllocatorView';
import { Button } from '@/components/ui/Button';
import { LoadingErrorWrapper } from '@/components/LoadingErrorWrapper';
import { useLanguage } from '@/context/LanguageContext';
import { allSkills } from '@/data/skills/allSkills';
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
import { useToast } from '@/context/ToastContext';

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
    if (!selectedClassData || !character) return;
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
      skillEntities: allSkills,
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

  const acquiredSkills =
    selectedClassData && character
      ? getAcquiredSkillSelectionsUpToLevel(
          skillBuckets,
          allSkills,
          selectedClassData.id,
          character.race_id as RaceId,
          nextLevel
        )
      : [];

  const skillValidation =
    selectedClassData && character
      ? validateLevelSkillSelections({
          buckets: skillBuckets,
          level: nextLevel,
          gameClass: selectedClassData,
          raceId: character.race_id as RaceId,
          attributes,
          skillEntities: allSkills,
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

  return (
    <LoadingErrorWrapper loading={isLoading} error={hasError}>
      {!character ? (
        <p className="p-4 text-red-600">Character not found.</p>
      ) : !canEditCharacter ? (
        <p className="p-4 text-red-600">You do not have permission.</p>
      ) : (
        <div className="max-w-3xl mx-auto p-4 card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="chip">{ui.levelUp}</p>
              <h2 className="text-2xl font-bold mt-2">{ui.levelUp}</h2>
            </div>
            <Button variant="outline" onClick={() => navigate(-1)}>
              {ui.cancel}
            </Button>
          </div>

          {!nextLevelData && (
            <div className="mb-4 text-sm text-red-600">
              No class progression data found for level {nextLevel}.
            </div>
          )}

          <div className="mb-4 text-sm text-gray-700 panel p-3">
            <div>
              {ui.level}: {currentLevel} → {nextLevel}
            </div>
            <div>
              {ui.class}: {character.class_id}
            </div>
            <div>
              {ui.race}: {character.race_id}
            </div>
          </div>

          {hasAbilityPointThisLevel ? (
            <>
              <div className="text-sm text-gray-700 mb-2">
                Attribute point available.
              </div>
              {Object.keys(attributes).length > 0 ? (
                <AttributeAllocator
                  attributes={attributes}
                  baseline={character.attributes}
                  pool={0}
                  isLevelUpMode={true}
                  usedPoints={usedPoints}
                  hasAbilityPointThisLevel={hasAbilityPointThisLevel}
                  showNextCost={false}
                  onChange={handleAttributeChange}
                  selectedClassData={selectedClassData}
                />
              ) : (
                <div className="text-sm text-gray-600">Loading attributes…</div>
              )}
              {hasUnspentAbilityPoint && (
                <div className="mt-2 text-xs text-red-600">
                  You must spend the available attribute point to level up.
                </div>
              )}
            </>
          ) : (
            <div className="text-sm text-gray-600 mb-4 panel p-3">
              No attribute points available at this level.
            </div>
          )}

          {selectedClassData && attributesReady && (
            <div className="panel p-3 mt-4 space-y-2 text-sm text-gray-700">
              <p>
                <strong>HP:</strong>{' '}
                {getBaseDerivedStats(selectedClassData, attributes, nextLevel)?.hp}
              </p>
              <p className="text-xs text-gray-600">
                +{Math.max(
                  0,
                  (getBaseDerivedStats(
                    selectedClassData,
                    attributes,
                    nextLevel
                  )?.hp ?? 0) -
                    (getBaseDerivedStats(
                      selectedClassData,
                      character.attributes,
                      currentLevel
                    )?.hp ?? 0)
                )}{' '}
                HP this level
              </p>
              <p>
                <strong>Base Attack Bonus:</strong>{' '}
                {
                  getBaseDerivedStats(selectedClassData, attributes, nextLevel)
                    ?.baseAttackBonus
                }
              </p>
              <p>
                <strong>Spells:</strong>{' '}
                {Object.entries(
                  getBaseDerivedStats(selectedClassData, attributes, nextLevel)
                    ?.spellSlots ?? {}
                )
                  .map(([lvl, slots]) => `Lvl ${lvl}: ${slots}`)
                  .join(', ') || 'None'}
              </p>
            </div>
          )}

          {skillPool.core + skillPool.utility + skillPool.human > 0 && (
            <div className="mb-6 mt-6 panel p-4 text-sm text-gray-700">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                {ui.skills}
              </h3>
              <div className="flex flex-wrap gap-4 text-xs text-gray-600 mb-4">
                <div>
                  <span className="font-semibold">Pool:</span> Core{' '}
                  {skillRemaining.core}, Utility {skillRemaining.utility}, Human{' '}
                  {skillRemaining.human}
                </div>
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

              <div className="space-y-3">
                {allSkills
                  .slice()
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((skill) => {
                    const tierRows = skill.tiers
                      .map((tier) => {
                        const tierKey = `${skill.id}:${tier.tier}`;
                        const availability =
                          selectedClassData && character
                            ? getSkillTierAvailability({
                                skill,
                                tier,
                                attributes,
                                classId: selectedClassData.id,
                                raceId: character.race_id as RaceId,
                                level: nextLevel,
                                pool: skillRemaining,
                                acquired: acquiredSkills,
                                allowSameLevelForPrereqs: true,
                              })
                            : {
                                status: 'ineligible',
                                reasons: [],
                                canAfford: false,
                              };

                        const isAffordable = availability.canAfford;
                        const affordableStatus =
                          availability.status === 'available' && !isAffordable
                            ? 'locked'
                            : availability.status;

                        const isSelected = currentSelections.some(
                          (s) =>
                            s.skillId === skill.id && s.tier === tier.tier
                        );

                        if (
                          affordableStatus === 'acquired' &&
                          !showAcquiredSkills &&
                          !isSelected
                        ) {
                          return null;
                        }
                        if (affordableStatus === 'locked' && !showLockedSkills) {
                          return null;
                        }
                        if (
                          affordableStatus === 'ineligible' &&
                          !showIneligibleSkills
                        ) {
                          return null;
                        }

                        const canUseHumanPoint =
                          character.race_id === 'Human' &&
                          skillRemaining.human > 0;
                        const spendOptions: SkillPointType[] =
                          skill.skillPointType === 'core'
                            ? [
                                'core',
                                ...(canUseHumanPoint
                                  ? (['human'] as SkillPointType[])
                                  : []),
                              ]
                            : skill.skillPointType === 'utility'
                            ? [
                                'utility',
                                ...(canUseHumanPoint
                                  ? (['human'] as SkillPointType[])
                                  : []),
                              ]
                            : canUseHumanPoint
                            ? ['human']
                            : [];

                        const defaultSpendType =
                          spendTypeByTier[tierKey] ??
                          (skill.skillPointType !== 'human' &&
                          skillRemaining[skill.skillPointType] > 0
                            ? skill.skillPointType
                            : skillRemaining.human > 0
                            ? 'human'
                            : skill.skillPointType);

                        const canUseSpendType =
                          defaultSpendType === 'core'
                            ? skillRemaining.core > 0
                            : defaultSpendType === 'utility'
                            ? skillRemaining.utility > 0
                            : skillRemaining.human > 0;

                        const statusLabel =
                          affordableStatus === 'available'
                            ? 'Available'
                            : affordableStatus === 'locked'
                            ? 'Locked'
                            : affordableStatus === 'ineligible'
                            ? 'Ineligible'
                            : 'Acquired';

                        const prereqLabels = (tier.prerequisites ?? []).map(
                          (prereq) => getPrereqLabel(prereq)
                        );
                        const pointRequirement =
                          affordableStatus === 'locked' &&
                          availability.status === 'available'
                            ? skill.skillPointType === 'core'
                              ? ui.requiresCorePoint ??
                                'Requires a core skill point'
                              : skill.skillPointType === 'utility'
                              ? ui.requiresUtilityPoint ??
                                'Requires a utility skill point'
                              : ui.requiresHumanPoint ??
                                'Requires a human skill point'
                            : null;

                        return (
                          <div
                            key={tierKey}
                            className="flex items-start justify-between gap-4 border rounded-xl p-3 bg-white/80"
                          >
                            <div>
                              <div className="font-medium text-gray-800">
                                Tier {tier.tier}
                              </div>
                              {(tier.deltaDescription ?? tier.description) && (
                                <div className="text-xs text-gray-600">
                                  {tier.deltaDescription ?? tier.description}
                                </div>
                              )}
                              <div className="text-xs text-gray-500 mt-1">
                                {statusLabel}
                                {availability.reasons.length > 0
                                  ? ` (${availability.reasons.join(', ')})`
                                  : ''}
                              </div>
                              {pointRequirement && (
                                <div className="mt-2 text-xs text-red-600">
                                  {pointRequirement}
                                </div>
                              )}
                              {affordableStatus === 'locked' &&
                                prereqLabels.length > 0 && (
                                  <div className="mt-2 text-xs text-gray-600">
                                    <div className="font-semibold">
                                      {ui.requirements ?? 'Requirements'}:
                                    </div>
                                    <ul className="list-disc list-inside">
                                      {prereqLabels.map((req, idx) => (
                                        <li
                                          key={idx}
                                          className={
                                            req.met
                                              ? 'text-green-600'
                                              : 'text-red-600'
                                          }
                                        >
                                          {req.label}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                              {isSelected ? (
                                <Button
                                  variant="outline"
                                  onClick={() =>
                                    handleRemoveSkill(skill.id, tier.tier)
                                  }
                                >
                                  Remove
                                </Button>
                              ) : affordableStatus === 'available' ? (
                                <>
                                  <select
                                    className="border border-gray-300 rounded-md px-2 py-1 text-xs"
                                    value={defaultSpendType}
                                    onChange={(e) =>
                                      setSpendTypeByTier((prev) => ({
                                        ...prev,
                                        [tierKey]: e.target.value as SkillPointType,
                                      }))
                                    }
                                  >
                                    {spendOptions.map((opt) => {
                                      const disabled =
                                        (opt === 'core' &&
                                          skillRemaining.core <= 0) ||
                                        (opt === 'utility' &&
                                          skillRemaining.utility <= 0) ||
                                        (opt === 'human' &&
                                          skillRemaining.human <= 0);
                                      return (
                                        <option
                                          key={opt}
                                          value={opt}
                                          disabled={disabled}
                                        >
                                          {opt}
                                        </option>
                                      );
                                    })}
                                  </select>
                                  <Button
                                    onClick={() =>
                                      handleAddSkill(
                                        skill.id,
                                        tier.tier,
                                        defaultSpendType
                                      )
                                    }
                                    disabled={!availability.canAfford || !canUseSpendType}
                                  >
                                    Add
                                  </Button>
                                </>
                              ) : (
                                <span className="text-xs text-gray-400">—</span>
                              )}
                            </div>
                          </div>
                        );
                      })
                      .filter(Boolean);

                    if (tierRows.length === 0) return null;

                    return (
                      <div key={skill.id} className="space-y-2">
                        <div className="text-sm font-semibold text-gray-800">
                          {skill.name}
                        </div>
                        <div className="space-y-2">{tierRows}</div>
                      </div>
                    );
                  })}
              </div>

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

          <div className="flex justify-end gap-2">
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
