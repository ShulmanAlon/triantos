import { useEffect, useState } from 'react';
import { Attribute, AttributeState } from '../types/attributes';
import { races } from '../data/races/index';
import { TOTAL_STARTING_POINTS, ARRGS_BASELINE } from '../config/constants';
import { calculateDerivedStats } from '../utils/derivedStats';
import { ClassId } from '../types/gameClass';
import { classes } from '../data/classes';
import { getPointCostChange } from '../utils/attributeUtils';
import { CharacterNameForm } from '../components/CharacterCreator/CharacterNameForm';
import { ClassSelector } from '../components/CharacterCreator/ClassSelector';
import { RaceSelector } from '../components/CharacterCreator/RaceSelector';
import { AttributeAllocator } from '../components/CharacterCreator/AttributeAllocator';
import { CharacterSheet } from '../components/CharacterCreator/CharacterSheet';
import { RaceId } from '../types/race';
import { useLanguage } from '../context/LanguageContext';
import { uiLabels } from '../i18n/ui';
import { getBaseAttributesByRaceId } from '../utils/raceUtils';

const initialAttributes: AttributeState = { ...ARRGS_BASELINE };

type Mode = 'create' | 'levelup';
type CreationStep = 'class' | 'race' | 'attributes' | 'skills' | 'final';

interface CharacterCreatorProps {
  mode: Mode;
}

export const CharacterCreator = ({ mode }: CharacterCreatorProps) => {
  const isLevelUpMode = mode === 'levelup';
  // const isLevelUpMode = true;
  const [creationStep, setCreationStep] = useState<CreationStep>('class');
  const [characterName, setCharacterName] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [selectedRaceId, setSelectedRaceId] = useState<RaceId | undefined>();
  const [selectedClassId, setSelectedClassId] = useState<ClassId | undefined>();
  const [level, setLevel] = useState(1);
  const [usedPoints, setUsedPoints] = useState(0);
  const [isCharacterFinished, setIsCharacterFinished] = useState(false);
  const selectedClassData = classes.find((cls) => cls.id === selectedClassId);
  const currentLevelData = selectedClassData?.progression.find(
    (l) => l.level === level
  );
  const hasAbilityPointThisLevel = !!currentLevelData?.abilityPoint;
  const selectedRaceData = races.find((r) => r.id === selectedRaceId);
  const effectiveBaseline = selectedRaceData?.baseStats ?? ARRGS_BASELINE;

  const [attributes, setAttributes] =
    useState<AttributeState>(initialAttributes);
  const [pool, setPool] = useState<number>(TOTAL_STARTING_POINTS);

  const handleAttributeChange = (
    attr: Attribute,
    newValue: number,
    poolDelta: number
  ) => {
    setAttributes((prev) => ({ ...prev, [attr]: newValue }));

    if (isLevelUpMode && hasAbilityPointThisLevel && poolDelta > 0) {
      setUsedPoints((prev) => prev + 1);
    } else {
      setPool((prev) => prev + poolDelta);
    }
  };

  const derived = selectedClassData
    ? calculateDerivedStats(selectedClassData, attributes, level)
    : null;

  const allowedRacesId =
    selectedClassData?.allowedRaces ?? races.map((r) => r.id);

  const { language } = useLanguage();
  const ui = uiLabels[language];

  function handleClassChange(newClassId: ClassId | undefined) {
    if (!newClassId) return;
    setSelectedClassId(newClassId);
    setSelectedRaceId(undefined);
    resetAttributes();
    setUsedPoints(0);
    // resetSkills(); // for later
    setCreationStep('race');
  }

  function handleRaceChange(newRaceId: RaceId | undefined) {
    setSelectedRaceId(newRaceId);
    resetAttributes(newRaceId);
    setUsedPoints(0);
    // resetSkills(); // for later
    setCreationStep('attributes');
  }

  function resetAttributes(raceId?: RaceId | undefined) {
    const baseAttrs = getBaseAttributesByRaceId(raceId) ?? ARRGS_BASELINE;
    setAttributes({ ...baseAttrs });
  }

  function handleLevelDown() {
    if (level > 1) {
      setLevel(level - 1);
      // TODO: remove 1 attribute point if granted this level
      // TODO: remove new skills (when added)
      setUsedPoints(0);
    }
  }

  useEffect(() => {
    if (!isLevelUpMode && creationStep === 'attributes') {
      const totalSpent = Object.keys(attributes).reduce((sum, attr) => {
        const typedAttr = attr as Attribute;
        const cost = getPointCostChange(
          effectiveBaseline[typedAttr],
          attributes[typedAttr],
          effectiveBaseline[typedAttr]
        );
        return sum + cost;
      }, 0);

      if (totalSpent === TOTAL_STARTING_POINTS) {
        setCreationStep('skills');
      }
    }
  }, [attributes, creationStep, isLevelUpMode, effectiveBaseline]);

  return (
    <div className="max-w-2xl mx-auto p-4">
      {!isCharacterFinished && (
        <>
          <h2 className="text-2xl font-bold mb-4">Character Creator</h2>

          {/* Character name and player name forms */}
          <CharacterNameForm
            characterName={characterName}
            playerName={playerName}
            isCharacterFinished={isCharacterFinished}
            onCharacterNameChange={setCharacterName}
            onPlayerNameChange={setPlayerName}
          />

          {/* Class */}
          <div className="mb-6">
            <ClassSelector
              classOptions={classes}
              selectedClassId={selectedClassId}
              isDisabled={isLevelUpMode || isCharacterFinished}
              onChange={handleClassChange}
              allowedRacesId={allowedRacesId}
              primaryAttributes={
                isCharacterFinished || !isLevelUpMode
                  ? selectedClassData?.primaryAttributes
                  : undefined
              }
              currentAttributes={attributes}
            />
          </div>

          {/* Race */}
          <div className="mb-6">
            <RaceSelector
              raceOptions={races}
              selectedRaceId={selectedRaceId}
              isDisabled={
                creationStep === 'class' || isLevelUpMode || isCharacterFinished
              }
              onChange={handleRaceChange}
              allowedRacesId={allowedRacesId}
            />
          </div>

          {/* Level */}
          <div className="mb-6">
            <label className="block mb-1 text-sm font-semibold text-gray-700">
              {ui.level}
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={level}
              onChange={(e) => setLevel(parseInt(e.target.value))}
            >
              {Array.from({ length: 18 }, (_, i) => i + 1).map((lvl) => (
                <option key={lvl} value={lvl}>
                  {ui.level} {lvl}
                </option>
              ))}
            </select>
          </div>

          {/* Attributes */}
          {!['class', 'race'].includes(creationStep) && (
            <AttributeAllocator
              attributes={attributes}
              baseline={effectiveBaseline}
              pool={pool}
              isLevelUpMode={isLevelUpMode}
              usedPoints={usedPoints}
              hasAbilityPointThisLevel={hasAbilityPointThisLevel}
              onChange={handleAttributeChange}
              selectedClassData={selectedClassData}
            />
          )}
        </>
      )}

      {/* Character sheet, character finished creation / level up */}
      {isCharacterFinished && derived && (
        <CharacterSheet
          characterName={characterName}
          playerName={playerName}
          selectedClassId={selectedClassId}
          selectedRaceId={selectedRaceId}
          level={level}
          attributes={attributes}
          derived={derived}
          onLevelUp={() => setLevel((prev) => prev + 1)}
          onLevelDown={handleLevelDown}
        />
      )}

      {creationStep === 'skills' && !isCharacterFinished && (
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          disabled={!characterName || !playerName}
          onClick={() => {
            const meetsPrimaryRequirements = Object.entries(
              selectedClassData?.primaryAttributes || {}
            ).every(
              ([attr, required]) => attributes[attr as Attribute] >= required
            );

            if (!meetsPrimaryRequirements) {
              alert(
                'You must meet the primary attribute requirements for this class.'
              );
              return;
            }

            setIsCharacterFinished(true);
          }}
        >
          {ui.finishCreation}
        </button>
      )}
    </div>
  );
};

export default CharacterCreator;
