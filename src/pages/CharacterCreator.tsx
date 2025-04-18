import { useEffect, useState } from 'react';
import { Attribute, AttributeState } from '../types/attributes';
import { races } from '../data/races';
import { TOTAL_STARTING_POINTS, ARRGS_BASELINE } from '../config/constants';
import { calculateDerivedStats } from '../utils/derivedStats';
import { GameClass } from '../types/gameClass';
import { CLASSES } from '../data/classes';
import { getPointCostChange } from '../utils/attributeUtils';
import { CharacterNameForm } from '../components/CharacterCreator/CharacterNameForm';
import { ClassSelector } from '../components/CharacterCreator/ClassSelector';
import { RaceSelector } from '../components/CharacterCreator/RaceSelector';
import { AttributeAllocator } from '../components/CharacterCreator/AttributeAllocator';
import { CharacterSheet } from '../components/CharacterCreator/CharacterSheet';

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
  const [selectedRace, setSelectedRace] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [level, setLevel] = useState(1);
  const [usedPoints, setUsedPoints] = useState(0);
  const [isCharacterFinished, setIsCharacterFinished] = useState(false);
  const selectedClassData: GameClass | undefined = CLASSES.find(
    (c) => c.name === selectedClass
  );
  const currentLevelData = selectedClassData?.progression.find(
    (l) => l.level === level
  );
  const hasAbilityPointThisLevel = !!currentLevelData?.abilityPoint;
  const selectedRaceData = races.find((r) => r.name === selectedRace);
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

  function handleClassChange(newClass: string) {
    setSelectedClass(newClass);
    setSelectedRace('');
    resetAttributes();
    setUsedPoints(0);
    // resetSkills(); // for later
    setCreationStep('race');
  }

  function handleRaceChange(newRace: string) {
    setSelectedRace(newRace);
    resetAttributes(newRace);
    setUsedPoints(0);
    // resetSkills(); // for later
    setCreationStep('attributes');
  }

  function resetAttributes(raceName: string = 'human') {
    const raceData = races.find((r) => r.name === raceName);
    const base = raceData?.baseStats ?? ARRGS_BASELINE;
    setAttributes({ ...base });
    setPool(TOTAL_STARTING_POINTS);
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

  const derived = selectedClassData
    ? calculateDerivedStats(selectedClassData, attributes, level)
    : null;

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
              classOptions={CLASSES}
              selectedClass={selectedClass}
              isDisabled={isLevelUpMode || isCharacterFinished}
              onChange={handleClassChange}
              description={
                isCharacterFinished || !isLevelUpMode
                  ? selectedClassData?.description
                  : undefined
              }
              specialAbilities={
                isCharacterFinished || !isLevelUpMode
                  ? selectedClassData?.specialAbilities
                  : undefined
              }
            />
          </div>

          {/* Race */}
          <div className="mb-6">
            <RaceSelector
              raceOptions={races}
              selectedRace={selectedRace}
              isDisabled={
                creationStep === 'class' || isLevelUpMode || isCharacterFinished
              }
              onChange={handleRaceChange}
              description={
                isCharacterFinished || !isLevelUpMode
                  ? selectedRaceData?.description
                  : undefined
              }
              specialAbilities={
                isCharacterFinished || !isLevelUpMode
                  ? selectedRaceData?.specialAbilities
                  : undefined
              }
              restrictions={
                isCharacterFinished || !isLevelUpMode
                  ? selectedRaceData?.restrictions
                  : undefined
              }
            />
          </div>

          {/* Level */}
          <div className="mb-6">
            <label className="block mb-1 font-medium">Level</label>
            <select
              className="border rounded px-2 py-1 w-full"
              value={level}
              onChange={(e) => setLevel(parseInt(e.target.value))}
            >
              {Array.from({ length: 18 }, (_, i) => i + 1).map((lvl) => (
                <option key={lvl} value={lvl}>
                  Level {lvl}
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
            />
          )}
        </>
      )}

      {/* Character sheet, character finished creation / level up */}
      {isCharacterFinished && derived && (
        <CharacterSheet
          characterName={characterName}
          playerName={playerName}
          selectedClass={selectedClass}
          selectedRace={selectedRace}
          level={level}
          attributes={attributes}
          derived={derived}
          onLevelUp={() => setLevel((prev) => prev + 1)}
          onLevelDown={handleLevelDown}
        />
      )}

      {/* Finish character creation button */}
      {creationStep === 'skills' && !isCharacterFinished && (
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          disabled={!characterName || !playerName}
          onClick={() => setIsCharacterFinished(true)}
        >
          Finish Character Creation
        </button>
      )}
    </div>
  );
};

export default CharacterCreator;
