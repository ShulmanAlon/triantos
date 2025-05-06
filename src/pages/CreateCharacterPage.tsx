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
import { getBaseDerivedStats } from '@/utils/derived/getBasederivedStats';
import { getRaceById, getBaseAttributesByRaceId } from '@/utils/raceUtils';
import { ClassId } from '@/types/gameClass';
import { RaceId } from '@/types/race';
import { ImageWithPlaceholder } from '@/components/ImageWithPlaceholder';
import { getCharacterImage, getCharacterBlurImage } from '@/utils/imageUtils';
import ImageUrlModal from '@/components/ImageUrlModal';
import { TABLES } from '@/config/dbTables';

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

  const handleAttributeChange = (
    attr: Attribute,
    newValue: number,
    poolDelta: number
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
  const hasPlayerName = playerName.trim() !== '';
  const spentAllPoints = pool === 0;
  const meetsRequirements = selectedClassData?.primaryAttributes
    ? Object.entries(selectedClassData.primaryAttributes).every(
        ([attr, min]) => attributes[attr as Attribute] >= min
      )
    : true;

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
        (insertError?.message ?? null) || (upsertError?.message ?? null)
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

  useEffect(() => {
    if (creationStep === 'attributes' && spentAllPoints) {
      setCreationStep('skills'); // skills stub for future
    }
  }, [attributes, creationStep, spentAllPoints]);

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
      {/* Attribute allocator */}
      {['attributes', 'skills'].includes(creationStep) && (
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
      )}
      {/* Derived Stats - HP, BAB, Spells */}
      {selectedClassData && (
        <div className="border-t pt-4 mt-4 space-y-2 text-sm text-gray-700">
          <p>
            <strong>HP:</strong> {derivedStats?.hp}
          </p>
          <p>
            <strong>Base Attack Bonus:</strong> {derivedStats?.baseAttackBonus}
          </p>
          <p>
            <strong>Spells:</strong>{' '}
            {Object.entries(derivedStats?.spellSlots ?? {})
              .map(([lvl, slots]) => `Lvl ${lvl}: ${slots}`)
              .join(', ') || 'None'}
          </p>
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
        <Button variant="outline" onClick={handleCancel}>
          {ui.cancel}
        </Button>
        <Button disabled={!canFinishCharacter || saving} onClick={handleCreate}>
          {ui.finishCreation}
        </Button>
      </div>
    </div>
  );
}
