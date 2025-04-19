import React from 'react';
import { Attribute } from '../../types/attributes';
import { getModifier } from '../../utils/modifier';
import { XP_TABLE } from '../../config/progression';
import { DerivedStats } from '../../utils/derivedStats';
import { ClassId } from '../../types/gameClass';
import { getClassNameById } from '../../utils/classUtils';
import { RaceId } from '../../types/race';
import { getRaceNameById } from '../../utils/raceUtils';

interface CharacterSheetProps {
  characterName: string;
  playerName: string;
  selectedClassId: ClassId | undefined;
  selectedRaceId: RaceId | undefined;
  level: number;
  attributes: Record<Attribute, number>;
  derived: DerivedStats | null;
  onLevelUp: () => void;
  onLevelDown: () => void;
}

export const CharacterSheet: React.FC<CharacterSheetProps> = ({
  characterName,
  playerName,
  selectedClassId = undefined,
  selectedRaceId = undefined,
  level,
  attributes,
  derived,
  onLevelUp,
  onLevelDown,
}) => {
  if (!derived) return null;

  return (
    <div className="mt-6 p-4 border rounded bg-gray-50 w-fit">
      <h2 className="text-2xl font-bold mb-4">Character Sheet</h2>
      <h2 className="text-xl font-bold mb-1">{characterName}</h2>
      <p className="text-sm text-gray-600 mb-4">Player: {playerName}</p>
      <p>
        Class:{' '}
        {selectedClassId ? getClassNameById(selectedClassId) : 'Select Class'}
      </p>
      <p>
        Race: {selectedRaceId ? getRaceNameById(selectedRaceId) : 'Select Race'}
      </p>
      <p>Level: {level}</p>
      <p>
        XP needed for level {level + 1}: {XP_TABLE[level]}
      </p>

      <div className="mt-4 border rounded p-3 bg-white/70 shadow-sm">
        <h3 className="font-semibold mb-2">Attributes</h3>
        <table className="text-sm">
          <thead>
            <tr>
              <th className="text-left px-1"></th>
              <th className="text-left px-1">Value</th>
              <th className="text-left px-1">Mod</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(attributes).map(([attr, value]) => {
              const modifier = getModifier(value);
              return (
                <tr key={attr}>
                  <td className="pr-4 font-medium">{attr.toUpperCase()}</td>
                  <td className="pr-4 text-center">{value}</td>
                  <td className="text-gray-500 text-center w-10">
                    {modifier > 0 ? `+${modifier}` : modifier}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold">Stats</h3>
        <p>HP: {derived.hp}</p>
        <p>Base Attack Bonus: {derived.attackBonus ?? '—'}</p>

        {derived.spellSlots && (
          <div className="mt-4">
            <h4 className="font-semibold mb-1">Spell Slots</h4>
            <ul className="ml-4 list-disc text-sm text-gray-700">
              {Object.entries(derived.spellSlots).map(([level, slots]) => (
                <li key={level}>
                  Level {level}: {slots} slot{slots !== 1 ? 's' : ''}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <button
          className="px-4 py-2 bg-green-600 text-white rounded"
          onClick={onLevelUp}
        >
          Level Up
        </button>
        {level > 1 && (
          <button
            className="px-4 py-2 bg-red-600 text-white rounded"
            onClick={onLevelDown}
          >
            Level Down
          </button>
        )}
      </div>
    </div>
  );
};
