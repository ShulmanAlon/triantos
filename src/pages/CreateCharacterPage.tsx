import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AttributeAllocator } from '@/components/CharacterCreator/AttributeAllocatorView';
import { CharacterNameForm } from '@/components/CharacterCreator/CharacterNameFormView';
import { ClassSelector } from '@/components/CharacterCreator/ClassSelectorView';
import { RaceSelector } from '@/components/CharacterCreator/RaceSelectorView';
import { Button } from '@/components/ui/Button';
import { ARRGS_BASELINE, TOTAL_STARTING_POINTS } from '@/config/constants';
import { useLanguage } from '@/context/LanguageContext';
import { classes } from '@/data/classes';
import { races } from '@/data/races';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { uiLabels } from '@/i18n/ui';
import { supabase } from '@/lib/supabaseClient';
import { AttributeMap, Attribute } from '@/types/attributes';
import { getClassById, getClassLevelDataById } from '@/utils/classUtils';
import { getBaseDerivedStats } from '@/utils/derived/getBaseDerivedStats';
import { getRaceById, getBaseAttributesByRaceId } from '@/utils/raceUtils';
import { ClassId } from '@/types/gameClass';
import { RaceId } from '@/types/race';
import { ImageWithPlaceholder } from '@/components/ImageWithPlaceholder';
import { getCharacterImage, getCharacterBlurImage } from '@/utils/imageUtils';
import ImageUrlModal from '@/components/ImageUrlModal';
import { TABLES } from '@/config/dbTables';
import { allSkills } from '@/data/skills/allSkills';
import {
  getAcquiredSkillSelectionsUpToLevel,
  getSkillPointPoolForLevel,
  getSkillPointUsageForLevel,
  getSkillTierAvailability,
  validateLevelSkillSelections,
} from '@/utils/skills/skillProgression';
import { LevelUpBucket, SkillSelectionEntry } from '@/types/characters';
import { SkillPointType } from '@/types/skills';
import { attributeLabels } from '@/i18n/attributes';

type CreationStep = 'class' | 'race' | 'attributes' | 'skills';

const initialAttributes: AttributeMap = { ...ARRGS_BASELINE };

export default function CharacterCreatePage() {
  const { id: campaignId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useCurrentUser();
  const { language } = useLanguage();
  const ui = uiLabels[language];

  const [creationStep, setCreationStep] = useState<CreationStep>('class');
  const [characterName, setCharacterName] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [selectedClassId, setSelectedClassId] = useState<ClassId | undefined>();
  const [selectedRaceId, setSelectedRaceId] = useState<RaceId | undefined>();
  const [usedPoints, setUsedPoints] = useState(0);
  const [attributes, setAttributes] = useState<AttributeMap>(initialAttributes);
  const [pool, setPool] = useState(TOTAL_STARTING_POINTS);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [skillBuckets, setSkillBuckets] = useState<LevelUpBucket[]>([
    { level: 1, skillSelections: [] },
  ]);
  const [showLockedSkills, setShowLockedSkills] = useState(false);
  const [showIneligibleSkills, setShowIneligibleSkills] = useState(false);
  const [showAcquiredSkills, setShowAcquiredSkills] = useState(false);
  const [spendTypeByTier, setSpendTypeByTier] = useState<
    Record<string, SkillPointType>
  >({});

  const level = 1;
  const selectedClassData = getClassById(selectedClassId);
  const currentLevelData = getClassLevelDataById(selectedClassId, level);
  const hasAbilityPointThisLevel = !!currentLevelData?.abilityPoint;
  const selectedRaceData = getRaceById(selectedRaceId);
  const effectiveBaseline = selectedRaceData?.baseStats ?? ARRGS_BASELINE;
  const allowedRacesId =
    selectedClassData?.allowedRaces ?? races.map((r) => r.id);
  const derivedStats = selectedClassData
    ? getBaseDerivedStats(selectedClassData, attributes, level)
    : null;
  const racialSkillsAtLevel = selectedRaceId
    ? allSkills.flatMap((skill) => {
        const tiers = skill.tiers
          .filter((tier) =>
            tier.freeForRaces?.some(
              (grant) => grant.raceId === selectedRaceId && grant.atLevel <= level
            )
          )
          .map((tier) => ({ skill, tier }));
        return tiers.length > 0 ? tiers : [];
      })
    : [];

  const handleAttributeChange = (
    attr: Attribute,
    newValue: number,
    poolDelta: number,
  ) => {
    setAttributes((prev) => ({ ...prev, [attr]: newValue }));
    if (hasAbilityPointThisLevel && poolDelta > 0) {
      setUsedPoints((prev) => prev + 1);
    } else {
      setPool((prev) => prev + poolDelta);
    }
  };

  const handleClassChange = (classId: ClassId | undefined) => {
    setSelectedClassId(classId);
    setSelectedRaceId(undefined);
    resetAttributes();
    setCreationStep('race');
  };

  const handleRaceChange = (raceId: RaceId | undefined) => {
    setSelectedRaceId(raceId);
    resetAttributes(raceId);
    setCreationStep('attributes');
  };

  const resetAttributes = (raceId?: RaceId) => {
    setUsedPoints(0);
    const baseAttrs = getBaseAttributesByRaceId(raceId) ?? ARRGS_BASELINE;
    setAttributes({ ...baseAttrs });
    setPool(TOTAL_STARTING_POINTS);
  };

  const hasName = characterName.trim() !== '';
  const hasPlayerName = playerName.trim() !== '' || !!user?.username;
  const spentAllPoints = pool === 0;
  const meetsRequirements = selectedClassData?.primaryAttributes
    ? Object.entries(selectedClassData.primaryAttributes).every(
        ([attr, min]) => attributes[attr as Attribute] >= min,
      )
    : true;

  const canProceedToSkills =
    creationStep === 'attributes' &&
    hasName &&
    hasPlayerName &&
    spentAllPoints &&
    meetsRequirements;

  const canFinishCharacter =
    creationStep === 'skills' &&
    hasName &&
    hasPlayerName &&
    spentAllPoints &&
    meetsRequirements;

  const handleCreate = async () => {
    if (!user || !campaignId) return;
    setSaving(true);

    const { error: insertError } = await supabase
      .from(TABLES.CHARACTERS)
      .insert({
        name: characterName,
        player_name: playerName || user.username,
        class_id: selectedClassId,
        race_id: selectedRaceId,
        level,
        attributes,
        user_id: user.id,
        campaign_id: campaignId,
        image_url: imageUrl,
        visible: true,
        deleted: false,
      });

    const { error: upsertError } = await supabase
      .from(TABLES.CAMPAIGN_MEMBERS)
      .upsert([{ campaign_id: campaignId, user_id: user.id }], {
        onConflict: 'campaign_id, user_id',
      });

    if (insertError || upsertError) {
      setError(
        (insertError?.message ?? null) || (upsertError?.message ?? null),
      );
      setSaving(false);
      return;
    }

    navigate(`/campaign/${campaignId}`);
    setSaving(false);
  };

  const handleCancel = () => {
    navigate(`/campaign/${campaignId}`);
  };

  const handleNext = () => {
    setCreationStep('skills');
  };

  const handleBackToAttributes = () => {
    setCreationStep('attributes');
  };

  const currentBucket =
    skillBuckets.find((bucket) => bucket.level === level) ?? skillBuckets[0];
  const currentSelections = currentBucket?.skillSelections ?? [];

  const updateCurrentBucketSelections = (next: SkillSelectionEntry[]) => {
    setSkillBuckets((prev) =>
      prev.map((bucket) =>
        bucket.level === level
          ? { ...bucket, skillSelections: next }
          : bucket
      )
    );
  };

  const handleAddSkill = (skillId: string, tier: number, spendType: SkillPointType) => {
    const exists = currentSelections.some(
      (s) => s.skillId === skillId && s.tier === tier
    );
    if (exists) return;
    updateCurrentBucketSelections([
      ...currentSelections,
      { skillId, tier, spendType },
    ]);
  };

  const handleRemoveSkill = (skillId: string, tier: number) => {
    updateCurrentBucketSelections(
      currentSelections.filter(
        (s) => !(s.skillId === skillId && s.tier === tier)
      )
    );
  };

  const skillPool =
    selectedClassData && selectedRaceId
      ? getSkillPointPoolForLevel(selectedClassData, selectedRaceId, level)
      : { core: 0, utility: 0, human: 0 };
  const skillUsed = getSkillPointUsageForLevel(currentSelections);
  const skillRemaining = {
    core: skillPool.core - skillUsed.core,
    utility: skillPool.utility - skillUsed.utility,
    human: skillPool.human - skillUsed.human,
  };
  const acquiredSkills =
    selectedClassData && selectedRaceId
      ? getAcquiredSkillSelectionsUpToLevel(
          skillBuckets,
          allSkills,
          selectedClassData.id,
          selectedRaceId,
          level
        )
      : [];

  const skillValidation =
    selectedClassData && selectedRaceId
      ? validateLevelSkillSelections({
          buckets: skillBuckets,
          level,
          gameClass: selectedClassData,
          raceId: selectedRaceId,
          attributes,
          skillEntities: allSkills,
        })
      : null;

  const canFinishWithSkills =
    canFinishCharacter && (skillValidation?.isValid ?? false);

  const attributeNames = attributeLabels[language];
  const skillById = new Map(allSkills.map((skill) => [skill.id, skill]));
  const hasSkillTier = (skillId: string, tier: number): boolean =>
    acquiredSkills.some(
      (selection) =>
        selection.skillId === skillId &&
        selection.tier >= tier &&
        selection.acquiredAtLevel <= level
    );
  const getPrereqLabel = (prereq: {
    type: 'level' | 'attribute' | 'skill';
    minimum?: number;
    attribute?: Attribute;
    skillId?: string;
    tier?: number;
  }): { label: string; met: boolean } => {
    if (prereq.type === 'level') {
      return {
        label: `Level ${prereq.minimum ?? 0}`,
        met: level >= (prereq.minimum ?? 0),
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
      const skillName = skillById.get(prereq.skillId)?.name ?? prereq.skillId;
      return {
        label: `${skillName} Tier ${prereq.tier}`,
        met: hasSkillTier(prereq.skillId, prereq.tier),
      };
    }
    return { label: 'Unknown requirement', met: false };
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">{ui.characterCreator}</h2>
      <p className="text-xs italic text-gray-500">
        Created by: {user?.username}
      </p>
      <div className="flex gap-4 items-start">
        <div className="flex-1">
          {/* Character name and player name */}
          <CharacterNameForm
            characterName={characterName}
            playerName={playerName}
            onCharacterNameChange={setCharacterName}
            onPlayerNameChange={setPlayerName}
          />
        </div>

        {/* Image display & modal trigger */}
        <div className="w-40 shrink-0">
          <h3 className="text-sm font-medium mb-2">Character Image</h3>
          <div
            onClick={() => setShowImageModal(true)}
            className="relative cursor-pointer w-40 h-40 border rounded overflow-hidden shadow-sm bg-gray-100 group"
          >
            {imageUrl ? (
              <>
                <ImageWithPlaceholder
                  src={getCharacterImage(imageUrl, selectedClassId)}
                  blurSrc={getCharacterBlurImage(selectedClassId)}
                  alt={characterName}
                  className="w-full h-full object-cover"
                />
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-60 transition-opacity flex items-center justify-center">
                  <span className="text-white text-sm font-medium">Edit</span>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">
                + Add Image
              </div>
            )}
          </div>
        </div>
      </div>
      {creationStep !== 'skills' && (
        <>
          {/* Class selection */}
          <div className="mb-6">
            <ClassSelector
              classOptions={classes}
              selectedClassId={selectedClassId}
              isDisabled={false}
              onChange={handleClassChange}
              currentAttributes={attributes}
            />
          </div>
          {/* Race selection */}
          <div className="mb-6">
            <RaceSelector
              raceOptions={races}
              selectedRaceId={selectedRaceId}
              isDisabled={creationStep === 'class'}
              onChange={handleRaceChange}
              allowedRacesId={allowedRacesId}
            />
          </div>
          {selectedRaceId && racialSkillsAtLevel.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                {ui.racialAbilities ?? 'Racial Abilities'}
              </h3>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                {racialSkillsAtLevel.map(({ skill, tier }) => (
                  <li key={`${skill.id}-${tier.tier}`}>
                    <span className="font-medium">{skill.name}</span>
                    {tier.description ? ` — ${tier.description}` : ''}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* Attribute allocator */}
          <AttributeAllocator
            attributes={attributes}
            baseline={effectiveBaseline}
            pool={pool}
            isLevelUpMode={false}
            usedPoints={usedPoints}
            hasAbilityPointThisLevel={hasAbilityPointThisLevel}
            onChange={handleAttributeChange}
            selectedClassData={selectedClassData}
          />
          {/* Derived Stats - HP, BAB, Spells */}
          {selectedClassData && (
            <div className="border-t pt-4 mt-4 space-y-2 text-sm text-gray-700">
              <p>
                <strong>HP:</strong> {derivedStats?.hp}
              </p>
              <p>
                <strong>Base Attack Bonus:</strong>{' '}
                {derivedStats?.baseAttackBonus}
              </p>
              <p>
                <strong>Spells:</strong>{' '}
                {Object.entries(derivedStats?.spellSlots ?? {})
                  .map(([lvl, slots]) => `Lvl ${lvl}: ${slots}`)
                  .join(', ') || 'None'}
              </p>
            </div>
          )}
        </>
      )}
      {creationStep === 'skills' && (
        <div className="mb-6 border rounded-md p-4 bg-gray-50 text-sm text-gray-700">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            {ui.skills}
          </h3>
          <div className="flex flex-wrap gap-4 text-xs text-gray-600 mb-4">
            <div>
              <span className="font-semibold">Pool:</span>{' '}
              Core {skillRemaining.core}, Utility {skillRemaining.utility}, Human{' '}
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
                      selectedClassData && selectedRaceId
                        ? getSkillTierAvailability({
                            skill,
                            tier,
                            attributes,
                            classId: selectedClassData.id,
                            raceId: selectedRaceId,
                            level,
                            pool: skillRemaining,
                            acquired: acquiredSkills,
                            allowSameLevelForPrereqs: true,
                          })
                        : { status: 'ineligible', reasons: [], canAfford: false };

                    if (
                      availability.status === 'acquired' &&
                      !showAcquiredSkills
                    ) {
                      return null;
                    }
                    if (availability.status === 'locked' && !showLockedSkills) {
                      return null;
                    }
                    if (
                      availability.status === 'ineligible' &&
                      !showIneligibleSkills
                    ) {
                      return null;
                    }
                    if (availability.status === 'available') {
                      // default view: obtainable skills only
                      // no filter needed
                    }

                    const isSelected = currentSelections.some(
                      (s) => s.skillId === skill.id && s.tier === tier.tier
                    );

                    const spendOptions: SkillPointType[] =
                      skill.skillPointType === 'core'
                        ? ['core', 'human']
                        : skill.skillPointType === 'utility'
                        ? ['utility', 'human']
                        : ['human'];

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
                      availability.status === 'available'
                        ? 'Available'
                        : availability.status === 'locked'
                        ? 'Locked'
                        : availability.status === 'ineligible'
                        ? 'Ineligible'
                        : 'Acquired';

                    const prereqLabels = (tier.prerequisites ?? []).map(
                      (prereq) => getPrereqLabel(prereq)
                    );

                    return (
                      <div
                        key={tierKey}
                        className="flex items-start justify-between gap-4 border rounded-md p-3 bg-white"
                      >
                        <div>
                          <div className="font-medium text-gray-800">
                            Tier {tier.tier}
                          </div>
                          {tier.description && (
                            <div className="text-xs text-gray-600">
                              {tier.description}
                            </div>
                          )}
                          <div className="text-xs text-gray-500 mt-1">
                            {statusLabel}
                            {availability.reasons.length > 0
                              ? ` (${availability.reasons.join(', ')})`
                              : ''}
                          </div>
                          {availability.status === 'locked' &&
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
                                        req.met ? 'text-green-600' : 'text-red-600'
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
                          ) : availability.status === 'available' ? (
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
                                    (opt === 'core' && skillRemaining.core <= 0) ||
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

      {/* { Modal for image URL input */}
      <ImageUrlModal
        isOpen={showImageModal}
        imageUrl={imageUrl || ''}
        setImageUrl={setImageUrl}
        onClose={() => setShowImageModal(false)}
        title="Set Character Image URL"
      />

      {/* Error & Actions */}
      {error && <p className="text-red-600 mt-4">{error}</p>}
      <div className="flex justify-between items-center mt-8">
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCancel}>
            {ui.cancel}
          </Button>
          {creationStep === 'skills' && (
            <Button variant="outline" onClick={handleBackToAttributes}>
              {ui.attributes}
            </Button>
          )}
        </div>
        {creationStep === 'attributes' ? (
          <Button disabled={!canProceedToSkills} onClick={handleNext}>
            {ui.next ?? 'Next'}
          </Button>
        ) : (
          <Button
            disabled={!canFinishWithSkills || saving}
            onClick={handleCreate}
          >
            {ui.finishCreation}
          </Button>
        )}
      </div>
    </div>
  );
}
