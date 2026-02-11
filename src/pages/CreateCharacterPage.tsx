import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import ImageUrlModal from '@/components/ImageUrlModal';
import { TABLES } from '@/config/dbTables';
import { SkillEntity } from '@/types/skills';
import { getSkillName } from '@/utils/domain/skills';
import {
  getAcquiredSkillSelectionsUpToLevel,
  getSkillPointPoolForLevel,
  getSkillPointUsageForLevel,
  getSkillTierAvailability,
  validateLevelSkillSelections,
} from '@/utils/skills/skillProgression';
import {
  CharacterProgression,
  EquipmentLoadouts,
  LevelUpBucket,
  SkillSelectionEntry,
} from '@/types/characters';
import { SkillPointType, SkillId } from '@/types/skills';
import { attributeLabels } from '@/i18n/attributes';
import { useToast } from '@/context/ToastContext';
import { CreateCharacterHeader } from '@/pages/createCharacter/CreateCharacterHeader';
import { CharacterImagePicker } from '@/pages/createCharacter/CharacterImagePicker';
import { DerivedStatsPanel } from '@/pages/createCharacter/DerivedStatsPanel';
import { CharacterSkillsPanel } from '@/pages/createCharacter/CharacterSkillsPanel';
import { AttributeAllocator } from '@/components/CharacterCreator/AttributeAllocatorView';

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
  const { toast } = useToast();
  const [skillBuckets, setSkillBuckets] = useState<LevelUpBucket[]>([
    { level: 1, skillSelections: [] },
  ]);
  const [showAcquiredSkills] = useState(true);
  const [showLockedSkills, setShowLockedSkills] = useState(false);
  const [showIneligibleSkills, setShowIneligibleSkills] = useState(false);
  const [spendTypeByTier, setSpendTypeByTier] = useState<
    Record<string, SkillPointType>
  >({});
  const [skillsData, setSkillsData] = useState<SkillEntity[] | null>(null);
  const skillsPanelRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    if (creationStep !== 'skills') return;
    if (!skillsPanelRef.current) return;
    skillsPanelRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [creationStep, skillsData]);

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
  const skills = skillsData ?? [];
  const racialSkillsAtLevel = selectedRaceId
    ? skills.flatMap((skill) => {
        const tiers = skill.tiers
          .filter((tier) =>
            tier.freeForRaces?.some(
              (grant) =>
                grant.raceId === selectedRaceId && grant.atLevel <= level,
            ),
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
    const progression: CharacterProgression = { buckets: skillBuckets };
    const equipment_loadouts: EquipmentLoadouts = {
      activeId: 'loadout-1',
      loadouts: [
        { id: 'loadout-1', name: 'Loadout 1', items: {} },
        { id: 'loadout-2', name: 'Loadout 2', items: {} },
        { id: 'loadout-3', name: 'Loadout 3', items: {} },
        { id: 'loadout-4', name: 'Loadout 4', items: {} },
      ],
    };

    const { error: insertError } = await supabase
      .from(TABLES.CHARACTERS)
      .insert({
        name: characterName,
        player_name: playerName || user.username,
        class_id: selectedClassId,
        race_id: selectedRaceId,
        level,
        attributes,
        progression,
        equipment_loadouts,
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
      const message =
        (insertError?.message ?? null) || (upsertError?.message ?? null);
      setError(message);
      if (message) toast.error(message);
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
    updateCurrentBucketSelections([]);
    setSpendTypeByTier({});
  };

  const currentBucket =
    skillBuckets.find((bucket) => bucket.level === level) ?? skillBuckets[0];
  const currentSelections = currentBucket?.skillSelections ?? [];

  const updateCurrentBucketSelections = (next: SkillSelectionEntry[]) => {
    setSkillBuckets((prev) =>
      prev.map((bucket) =>
        bucket.level === level ? { ...bucket, skillSelections: next } : bucket,
      ),
    );
  };

  const handleAddSkill = (
    skillId: SkillId,
    tier: number,
    spendType: SkillPointType,
  ) => {
    const exists = currentSelections.some(
      (s) => s.skillId === skillId && s.tier === tier,
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
        (s) => !(s.skillId === skillId && s.tier === tier),
      ),
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
    selectedClassData && selectedRaceId && skillsData
      ? getAcquiredSkillSelectionsUpToLevel(
          skillBuckets,
          skillsData,
          selectedClassData.id,
          selectedRaceId,
          level,
        )
      : [];

  const skillValidation =
    selectedClassData && selectedRaceId && skillsData
      ? validateLevelSkillSelections({
          buckets: skillBuckets,
          level,
          gameClass: selectedClassData,
          raceId: selectedRaceId,
          attributes,
          skillEntities: skillsData,
        })
      : null;

  const canFinishWithSkills =
    canFinishCharacter && (skillValidation?.isValid ?? false);

  const attributeNames = attributeLabels[language];
  const hasSkillTier = (skillId: SkillId, tier: number): boolean =>
    acquiredSkills.some(
      (selection) =>
        selection.skillId === skillId &&
        selection.tier >= tier &&
        selection.acquiredAtLevel <= level,
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
      const skillName = getSkillName(prereq.skillId);
      return {
        label: `${skillName} Tier ${prereq.tier}`,
        met: hasSkillTier(prereq.skillId, prereq.tier),
      };
    }
    return { label: 'Unknown requirement', met: false };
  };

  const stepLabels: Record<CreationStep, string> = {
    class: ui.class ?? 'Class',
    race: ui.race ?? 'Race',
    attributes: ui.attributes ?? 'Attributes',
    skills: ui.skills ?? 'Skills',
  };
  const steps: CreationStep[] = ['class', 'race', 'attributes', 'skills'];

  return (
    <div className="section-gap relative">
      <div className="card p-5">
        <CreateCharacterHeader
          title={ui.characterCreator}
          createdBy={user?.username}
        />
        <div className="flex flex-wrap gap-2 text-xs text-(--muted) mb-4">
          {steps.map((step, index) => (
            <div
              key={step}
              className={`px-3 py-1 rounded-full border ${
                creationStep === step
                  ? 'border-(--accent)/40 bg-(--accent)/10 text-(--ink) font-semibold'
                  : 'border-black/10'
              }`}
            >
              {index + 1}. {stepLabels[step]}
            </div>
          ))}
        </div>
        <div className="section-gap panel p-4 grid gap-4 lg:grid-cols-[1.4fr_0.6fr] items-start">
          <div>
            <CharacterNameForm
              characterName={characterName}
              playerName={playerName}
              onCharacterNameChange={setCharacterName}
              onPlayerNameChange={setPlayerName}
            />
          </div>

          <div className="flex justify-end">
            <CharacterImagePicker
              imageUrl={imageUrl}
              classId={selectedClassId}
              characterName={characterName}
              onEdit={() => setShowImageModal(true)}
            />
          </div>
        </div>
        {creationStep !== 'skills' && (
          <>
            <div className="section-gap grid gap-4 lg:grid-cols-2 items-start">
              {/* Class selection */}
              <div className="panel p-4">
                <h3 className="section-title mb-2">{ui.class}</h3>
                <ClassSelector
                  classOptions={classes}
                  selectedClassId={selectedClassId}
                  isDisabled={false}
                  onChange={handleClassChange}
                  currentAttributes={attributes}
                />
              </div>
              {/* Race selection */}
              <div className="panel p-4">
                <h3 className="section-title mb-2">{ui.race}</h3>
                <RaceSelector
                  raceOptions={races}
                  selectedRaceId={selectedRaceId}
                  isDisabled={creationStep === 'class'}
                  onChange={handleRaceChange}
                  allowedRacesId={allowedRacesId}
                />
              </div>
            </div>
            {selectedRaceId && racialSkillsAtLevel.length > 0 && (
              <div className="section-gap panel p-3">
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
            <div className="section-gap">
              <div className="panel p-4">
                <h3 className="section-title mb-2">{ui.attributes}</h3>
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
              </div>
            </div>
            {selectedClassData && (
              <div className="section-gap">
                <DerivedStatsPanel stats={derivedStats} />
              </div>
            )}
          </>
        )}
        {creationStep === 'skills' && !skillsData && (
          <div className="section-gap panel p-4 text-sm text-gray-700">
            Loading skills...
          </div>
        )}
        {creationStep === 'skills' && skillsData && (
          <div
            ref={skillsPanelRef}
            className="section-gap panel p-4 text-sm text-gray-700"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <h3 className="section-title">{ui.skills}</h3>
              <div className="text-xs text-(--muted)">
                <span className="font-semibold">Pool:</span> Core{' '}
                {skillRemaining.core}, Utility {skillRemaining.utility}
                {selectedRaceId === 'Human' && (
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

            <CharacterSkillsPanel
              skills={skills}
              skillRemaining={skillRemaining}
              currentSelections={currentSelections}
              showAcquired={showAcquiredSkills}
              showLocked={showLockedSkills}
              showIneligible={showIneligibleSkills}
              getAvailability={(skill, tierNumber) =>
                selectedClassData && selectedRaceId
                  ? getSkillTierAvailability({
                      skill,
                      tier: skill.tiers.find((t) => t.tier === tierNumber)!,
                      attributes,
                      classId: selectedClassData.id,
                      raceId: selectedRaceId,
                      level,
                      pool: skillRemaining,
                      acquired: acquiredSkills,
                      allowSameLevelForPrereqs: true,
                    })
                  : { status: 'ineligible', reasons: [], canAfford: false }
              }
              getPrereqLabels={(skill, tierNumber) =>
                (
                  skill.tiers.find((t) => t.tier === tierNumber)
                    ?.prerequisites ?? []
                ).map((prereq) => getPrereqLabel(prereq))
              }
              getPointRequirement={(skill, tierNumber, availability) =>
                availability.status === 'available' && !availability.canAfford
                  ? skill.skillPointType === 'core'
                    ? (ui.requiresCorePoint ?? 'Requires a core skill point')
                    : skill.skillPointType === 'utility'
                      ? (ui.requiresUtilityPoint ??
                        'Requires a utility skill point')
                      : (ui.requiresHumanPoint ??
                        'Requires a human skill point')
                  : null
              }
              getSpendOptions={(skill) => {
                const canUseHumanPoint =
                  selectedRaceId === 'Human' && skillRemaining.human > 0;
                if (skill.skillPointType === 'core') {
                  return [
                    'core',
                    ...(canUseHumanPoint
                      ? (['human'] as SkillPointType[])
                      : []),
                  ];
                }
                if (skill.skillPointType === 'utility') {
                  return [
                    'utility',
                    ...(canUseHumanPoint
                      ? (['human'] as SkillPointType[])
                      : []),
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
              onSpendTypeChange={(tierKey, value) =>
                setSpendTypeByTier((prev) => ({ ...prev, [tierKey]: value }))
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

        {/* { Modal for image URL input */}
        <ImageUrlModal
          isOpen={showImageModal}
          imageUrl={imageUrl || ''}
          setImageUrl={setImageUrl}
          onClose={() => setShowImageModal(false)}
          title="Set Character Image URL"
        />

        {/* Error & Actions */}
        {error && <div className="sr-only">{error}</div>}
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
    </div>
  );
}
