import { useEffect, useState } from 'react';
import AttributeRow from '../components/CharacterCreator/AttributeRow';
import { Attribute, AttributeState } from '../types/attributes';
import { races } from '../data/races';
import { TOTAL_STARTING_POINTS, ARRGS_BASELINE } from '../config/constants';
import { calculateDerivedStats } from '../utils/derivedStats';
import { GameClass } from '../types/gameClass';
import { CLASSES } from '../data/classes';
import { getPointCostChange } from '../utils/attributeUtils';
import { XP_TABLE } from '../config/progression';
import { getModifier } from '../utils/modifier';

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
      <h2 className="text-2xl font-bold mb-4">Character Creator</h2>
      {!isCharacterFinished && (
        <>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Character Name</label>
            <input
              type="text"
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
              className="border px-2 py-1 rounded w-full"
              disabled={isCharacterFinished}
            />
          </div>

          <div className="mb-6">
            <label className="block mb-1 font-medium">Player Name</label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="border px-2 py-1 rounded w-full"
              disabled={isCharacterFinished}
            />
          </div>

          {/* Class */}
          <div className="mb-6">
            <label className="block mb-1 font-medium">Class</label>
            <select
              className="border rounded px-2 py-1 w-full"
              value={selectedClass}
              disabled={isLevelUpMode || isCharacterFinished}
              onChange={(e) => {
                const newClass = e.target.value;
                handleClassChange(newClass);
              }}
            >
              <option value="" disabled hidden>
                Select Class
              </option>{' '}
              {CLASSES.map((cls) => (
                <option key={cls.name} value={cls.name}>
                  {cls.name}
                </option>
              ))}
            </select>

            {selectedClassData && (
              <div className="mt-2 text-sm text-gray-700">
                {/* Class description */}
                {!isLevelUpMode && !isCharacterFinished ? (
                  <p className="mb-1 font-semibold">
                    {selectedClassData.description}
                  </p>
                ) : (
                  <details className="text-sm mt-2">
                    <summary className="cursor-pointer text-gray-500">
                      View class description
                    </summary>
                    <p>{selectedClassData?.description}</p>
                  </details>
                )}

                {/* Class special abilities */}
                <ul className="mt-1 text-gray-500 list-disc pl-5">
                  {selectedClassData.specialAbilities.map((ability) => (
                    <li key={ability}>{ability}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Race */}
          <div className="mb-6">
            <label className="block mb-1 font-medium">Race</label>
            <select
              className="border rounded px-2 py-1 w-full"
              value={selectedRace}
              disabled={
                creationStep === 'class' || isLevelUpMode || isCharacterFinished
              }
              onChange={(e) => {
                handleRaceChange(e.target.value);
              }}
            >
              <option value="" disabled hidden>
                Select Race
              </option>{' '}
              {races.map((race) => (
                <option key={race.name} value={race.name}>
                  {race.name}
                </option>
              ))}
            </select>

            <div className="mt-2 text-sm text-gray-700">
              {/* Race description */}
              {!isLevelUpMode && !isCharacterFinished ? (
                <p className="text-sm mt-2">{selectedRaceData?.description}</p>
              ) : (
                <details className="text-sm mt-2">
                  <summary className="cursor-pointer text-gray-500">
                    View race description
                  </summary>
                  <p>{selectedRaceData?.description}</p>
                </details>
              )}

              {/* Race special abilities */}
              <ul className="mt-2 text-gray-500 list-disc pl-5">
                {selectedRaceData?.specialAbilities?.map((ability) => (
                  <li key={ability}>{ability}</li>
                ))}
              </ul>

              {/* Race restrictions */}
              {selectedRaceData?.restrictions &&
                selectedRaceData.restrictions.length > 0 && (
                  <p className="mt-1 text-red-500 text-sm">
                    Restrictions: {selectedRaceData.restrictions.join(', ')}
                  </p>
                )}
            </div>
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
            <div>
              <h3 className="text-xl font-semibold mt-8 mb-2">Attributes</h3>

              {/* Ability points pool */}
              {!isLevelUpMode && (
                <div className="mt-4 text-right text-sm">
                  Points remaining: <strong>{pool}</strong>
                </div>
              )}
              {isLevelUpMode && hasAbilityPointThisLevel && (
                <div className="bg-green-50 border rounded p-4 mt-4 text-sm">
                  <strong>Level-up unlocked!</strong> You can increase{' '}
                  <em>one</em> attribute by 1 point.
                </div>
              )}

              {/* Attribute headers */}
              <table className="w-full table-fixed border-separate border-spacing-y-1">
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', paddingBottom: '0.5rem' }}>
                      Attribute
                    </th>
                    <th
                      style={{ textAlign: 'center', paddingBottom: '0.5rem' }}
                    >
                      Race Base
                    </th>
                    <th
                      style={{ textAlign: 'center', paddingBottom: '0.5rem' }}
                    >
                      Current
                    </th>
                    <th
                      style={{ textAlign: 'center', paddingBottom: '0.5rem' }}
                    >
                      Modifier
                    </th>
                    <th
                      style={{ textAlign: 'center', paddingBottom: '0.5rem' }}
                    >
                      Next Cost
                    </th>
                  </tr>
                </thead>

                {/* Attribute rows */}
                <tbody>
                  {Object.keys(attributes).map((attr) => {
                    const typedAttr = attr as Attribute;
                    const raceBase = effectiveBaseline[typedAttr];

                    return (
                      <AttributeRow
                        key={attr}
                        attr={typedAttr}
                        value={attributes[typedAttr]}
                        baseline={raceBase}
                        pool={pool}
                        onChange={handleAttributeChange}
                        isLevelUpMode={isLevelUpMode}
                        usedPoints={usedPoints}
                        hasAbilityPointThisLevel={hasAbilityPointThisLevel}
                      />
                    );
                  })}
                </tbody>
              </table>

              {/* HP */}
              {derived && (
                <div className="mt-6 p-4 border rounded bg-gray-50 text-sm">
                  <h3 className="font-semibold mb-2">Derived Stats</h3>
                  <p>
                    Total HP: <strong>{derived.hp}</strong>
                  </p>
                  <p>Attack Bonus: {derived.attackBonus ?? '—'}</p>

                  {derived.spellSlots && (
                    <div>
                      <p className="mt-2">Spell Slots:</p>
                      <ul className="ml-4 list-disc">
                        {Object.entries(derived.spellSlots).map(
                          ([lvl, count]) => (
                            <li key={lvl}>
                              Level {lvl}: {count} slot{count > 1 ? 's' : ''}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Character sheet, character finished creation / level up */}
      {isCharacterFinished && derived && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h2 className="text-xl font-bold mb-1">{characterName}</h2>
          <p className="text-sm text-gray-600 mb-4">Player: {playerName}</p>
          <p>Class: {selectedClass}</p>
          <p>Race: {selectedRace}</p>
          <p>Level: {level}</p>
          <p>
            XP needed for level {level + 1}: {XP_TABLE[level]}
          </p>

          <div className="mt-4 border rounded p-3 bg-white/70 shadow-sm w-fit">
            <h3 className="font-semibold mb-2">Stats</h3>
            <table className="text-sm">
              <tbody>
                {Object.entries(attributes).map(([attr, value]) => {
                  const mod = getModifier(value);
                  return (
                    <tr key={attr}>
                      <td className="pr-4 font-medium">{attr.toUpperCase()}</td>
                      <td className="pr-4 text-right">{value}</td>
                      <td className="text-gray-500 text-right w-10">
                        ({mod >= 0 ? '+' : ''}
                        {mod})
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold">Data</h3>
            <p>HP: {derived.hp}</p>
            <p>Attack Bonus: {derived.attackBonus ?? '—'}</p>
            {derived.spellSlots && (
              <div>
                <p>Spell Slots:</p>
                <ul className="ml-4 list-disc">
                  {Object.entries(derived.spellSlots).map(([lvl, slots]) => (
                    <li key={lvl}>
                      Level {lvl}: {slots}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <button
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
            onClick={() => setLevel((prev) => prev + 1)}
          >
            Level Up
          </button>

          {level > 1 && (
            <button
              className="ml-2 px-4 py-2 bg-red-600 text-white rounded"
              onClick={() => handleLevelDown()}
            >
              Level Down
            </button>
          )}
        </div>
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
