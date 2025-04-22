// import { useEffect, useState } from 'react';
// import { Attribute, AttributeMap } from '../types/attributes';
// import { races } from '../data/races/index';
// import { TOTAL_STARTING_POINTS, ARRGS_BASELINE } from '../config/constants';
// import { calculateDerivedStats } from '../utils/derivedStats';
// import { ClassId } from '../types/gameClass';
// import { classes } from '../data/classes';
// import { getPointCostChange } from '../utils/attributeUtils';
// import { CharacterNameForm } from '../components/CharacterCreator/CharacterNameFormView';
// import { ClassSelector } from '../components/CharacterCreator/ClassSelectorView';
// import { RaceSelector } from '../components/CharacterCreator/RaceSelectorView';
// import { AttributeAllocator } from '../components/CharacterCreator/AttributeAllocatorView';
// import { CharacterSheetView } from '../components/CharacterSheet/CharacterSheetView';
// import { RaceId } from '../types/race';
// import { useLanguage } from '../context/LanguageContext';
// import { uiLabels } from '../i18n/ui';
// import { getBaseAttributesByRaceId, getRaceById } from '../utils/raceUtils';
// import { getClassById, getClassLevelDataById } from '../utils/classUtils';
// import { Button } from '../components/ui/Button';

// const initialAttributes: AttributeMap = { ...ARRGS_BASELINE };

// type Mode = 'create' | 'levelup';
// type CreationStep = 'class' | 'race' | 'attributes' | 'skills' | 'final';

// interface CharacterCreatorProps {
//   mode: Mode;
// }

// export const CharacterCreator = ({ mode }: CharacterCreatorProps) => {
//   const isLevelUpMode = mode === 'levelup';
//   const [creationStep, setCreationStep] = useState<CreationStep>('class');
//   const [characterName, setCharacterName] = useState('');
//   const [playerName, setPlayerName] = useState('');
//   const [selectedRaceId, setSelectedRaceId] = useState<RaceId | undefined>();
//   const [selectedClassId, setSelectedClassId] = useState<ClassId | undefined>();
//   const [level, setLevel] = useState(1);
//   const [usedPoints, setUsedPoints] = useState(0);
//   const [isCharacterFinished, setIsCharacterFinished] = useState(false);
//   const selectedClassData = getClassById(selectedClassId);
//   const currentLevelData = getClassLevelDataById(selectedClassId, level);
//   const hasAbilityPointThisLevel = !!currentLevelData?.abilityPoint;
//   const selectedRaceData = getRaceById(selectedRaceId);
//   const effectiveBaseline = selectedRaceData?.baseStats ?? ARRGS_BASELINE;
//   const [attributes, setAttributes] = useState<AttributeMap>(initialAttributes);
//   const [pool, setPool] = useState<number>(TOTAL_STARTING_POINTS);
//   const handleAttributeChange = (
//     attr: Attribute,
//     newValue: number,
//     poolDelta: number
//   ) => {
//     setAttributes((prev) => ({ ...prev, [attr]: newValue }));

//     if (isLevelUpMode && hasAbilityPointThisLevel && poolDelta > 0) {
//       setUsedPoints((prev) => prev + 1);
//     } else {
//       setPool((prev) => prev + poolDelta);
//     }
//   };
//   const derived = selectedClassData
//     ? calculateDerivedStats(selectedClassData, attributes, level)
//     : null;
//   const allowedRacesId =
//     selectedClassData?.allowedRaces ?? races.map((r) => r.id);
//   const { language } = useLanguage();
//   const ui = uiLabels[language];
//   const hasName = characterName.trim() !== '';
//   const hasPlayerName = playerName.trim() !== '';
//   const spentAllPoints = usedPoints === TOTAL_STARTING_POINTS;
//   const meetsRequirements = selectedClassData?.primaryAttributes
//     ? Object.entries(selectedClassData.primaryAttributes).every(
//         ([attr, min]) => attributes[attr as Attribute] >= min
//       )
//     : true;

//   const canFinishCharacter =
//     creationStep === 'skills' &&
//     !isCharacterFinished &&
//     hasName &&
//     hasPlayerName &&
//     spentAllPoints &&
//     meetsRequirements;

//   function handleClassChange(newClassId: ClassId | undefined) {
//     if (!newClassId) return;
//     setSelectedClassId(newClassId);
//     setSelectedRaceId(undefined);
//     resetAttributes();
//     // resetSkills(); // for later
//     setCreationStep('race');
//   }

//   function handleRaceChange(newRaceId: RaceId | undefined) {
//     setSelectedRaceId(newRaceId);
//     resetAttributes(newRaceId);
//     // resetSkills(); // for later
//     setCreationStep('attributes');
//   }

//   function resetAttributes(raceId?: RaceId | undefined) {
//     setUsedPoints(0);
//     const baseAttrs = getBaseAttributesByRaceId(raceId) ?? ARRGS_BASELINE;
//     setAttributes({ ...baseAttrs });
//   }

//   function handleLevelDown() {
//     if (level > 1) {
//       setLevel(level - 1);
//       // TODO: remove 1 attribute point if granted this level
//       // TODO: remove new skills (when added)
//       setUsedPoints(0);
//     }
//   }

//   useEffect(() => {
//     if (!isLevelUpMode && creationStep === 'attributes') {
//       const totalSpent = Object.keys(attributes).reduce((sum, attr) => {
//         const typedAttr = attr as Attribute;
//         const cost = getPointCostChange(
//           effectiveBaseline[typedAttr],
//           attributes[typedAttr],
//           effectiveBaseline[typedAttr]
//         );
//         return sum + cost;
//       }, 0);

//       if (totalSpent === TOTAL_STARTING_POINTS) {
//         setCreationStep('skills');
//       }
//     }
//   }, [attributes, creationStep, isLevelUpMode, effectiveBaseline]);

//   return (
//     <div className="max-w-2xl mx-auto p-4">
//       {!isCharacterFinished && (
//         <>
//           <h2 className="text-2xl font-bold mb-4">{ui.characterCreator}</h2>

//           {/* Character name and player name forms */}
//           <CharacterNameForm
//             characterName={characterName}
//             playerName={playerName}
//             isCharacterFinished={isCharacterFinished}
//             onCharacterNameChange={setCharacterName}
//             onPlayerNameChange={setPlayerName}
//           />

//           {/* Class */}
//           <div className="mb-6">
//             <ClassSelector
//               classOptions={classes}
//               selectedClassId={selectedClassId}
//               isDisabled={isLevelUpMode || isCharacterFinished}
//               onChange={handleClassChange}
//               currentAttributes={attributes}
//             />
//           </div>

//           {/* Race */}
//           <div className="mb-6">
//             <RaceSelector
//               raceOptions={races}
//               selectedRaceId={selectedRaceId}
//               isDisabled={
//                 creationStep === 'class' || isLevelUpMode || isCharacterFinished
//               }
//               onChange={handleRaceChange}
//               allowedRacesId={allowedRacesId}
//             />
//           </div>

//           {/* Level */}
//           <div className="mb-6">
//             <label className="block mb-1 text-sm font-semibold text-gray-700">
//               {ui.level}
//             </label>
//             <select
//               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               value={level}
//               onChange={(e) => setLevel(parseInt(e.target.value))}
//             >
//               {Array.from({ length: 18 }, (_, i) => i + 1).map((lvl) => (
//                 <option key={lvl} value={lvl}>
//                   {ui.level} {lvl}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Attributes */}
//           {!['class', 'race'].includes(creationStep) && (
//             <AttributeAllocator
//               attributes={attributes}
//               baseline={effectiveBaseline}
//               pool={pool}
//               isLevelUpMode={isLevelUpMode}
//               usedPoints={usedPoints}
//               hasAbilityPointThisLevel={hasAbilityPointThisLevel}
//               onChange={handleAttributeChange}
//               selectedClassData={selectedClassData}
//             />
//           )}
//         </>
//       )}

//       {/* Character sheet, character finished creation / level up */}
//       {isCharacterFinished && derived && (
//         <CharacterSheetView
//           characterName={characterName}
//           playerName={playerName}
//           selectedClassId={selectedClassId}
//           selectedRaceId={selectedRaceId}
//           level={level}
//           attributes={attributes}
//           derived={derived}
//           onLevelUp={() => setLevel((prev) => prev + 1)}
//           onLevelDown={handleLevelDown}
//         />
//       )}

//       {/* Finish character creation button */}
//       {!canFinishCharacter && (
//         <ul className="text-sm text-red-600 mt-2 list-disc pl-5 space-y-1">
//           {!hasName && <li>Character name is required</li>}
//           {!hasPlayerName && <li>Player name is required</li>}
//           {!spentAllPoints && <li>All attribute points must be spent</li>}
//           {!meetsRequirements && (
//             <li>Primary attribute requirements not met</li>
//           )}
//         </ul>
//       )}
//       {creationStep === 'skills' && !isCharacterFinished && (
//         <Button
//           disabled={!canFinishCharacter}
//           onClick={() => {
//             setIsCharacterFinished(true);
//           }}
//         >
//           {ui.finishCreation}
//         </Button>
//       )}
//     </div>
//   );
// };

// export default CharacterCreator;

// TODO delete this after refactor done
