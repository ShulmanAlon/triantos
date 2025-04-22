import { CharacterSheetView } from '../components/CharacterSheet/CharacterSheetView';
import { ClassId, GameClass } from '../types/gameClass';
import { RaceId } from '../types/race';
import { getClassById } from '../utils/classUtils';
import { calculateDerivedStats } from '../utils/derivedStats';

export const CharacterSheet = () => {
  // Temporary fake character data – we’ll use context or persistent state later
  const character = {
    name: 'Example Character',
    playerName: 'Player',
    level: 3,
    raceId: 'Human' as RaceId,
    classId: 'MagicUser' as ClassId,
    attributes: {
      str: 10,
      int: 18,
      wis: 12,
      dex: 10,
      con: 15,
      cha: 10,
    },
  };

  return (
    <CharacterSheetView
      characterName={character.name}
      playerName={character.playerName}
      selectedClassId={character.classId}
      selectedRaceId={character.raceId}
      level={character.level}
      attributes={character.attributes}
      onLevelUp={() => console.log('Level Up')}
      onLevelDown={() => console.log('Level Down')}
      derived={calculateDerivedStats(
        getClassById(character.classId as ClassId) as GameClass,
        character.attributes,
        character.level
      )}
    />
  );
};
