import React from 'react';
import { Race, RaceId } from '../../types/race';

interface RaceSelectorProps {
  raceOptions: Race[];
  selectedRaceId: RaceId | undefined;
  isDisabled: boolean;
  onChange: (value: RaceId | undefined) => void;
  description?: string;
  specialAbilities?: string[];
  restrictions?: string[];
  allowedRaces?: string[];
}

export const RaceSelector: React.FC<RaceSelectorProps> = ({
  raceOptions,
  selectedRaceId,
  isDisabled,
  onChange,
  description,
  specialAbilities = [],
  restrictions = [],
  allowedRaces,
}) => {
  return (
    <div className="mb-6">
      <label className="block mb-1 font-medium">Race</label>
      <select
        className="border rounded px-2 py-1 w-full"
        value={selectedRaceId}
        onChange={(e) => onChange(e.target.value as RaceId)}
        disabled={isDisabled}
      >
        <option value="" disabled hidden>
          Select Race
        </option>
        {raceOptions.map((race) => {
          const isAllowed = allowedRaces?.includes(race.name) ?? true;
          return (
            <option key={race.name} value={race.name} disabled={!isAllowed}>
              {race.name}
            </option>
          );
        })}
      </select>

      {description && (
        <p className="text-sm text-gray-600 mt-2 whitespace-pre-line">
          {description}
        </p>
      )}

      {specialAbilities?.length > 0 && (
        <ul className="text-sm text-gray-600 mt-2 list-disc ml-4">
          {specialAbilities.map((ability, index) => (
            <li key={index}>{ability}</li>
          ))}
        </ul>
      )}

      {restrictions?.length > 0 && (
        <div className="text-sm text-gray-600 mt-2">
          <p className="font-semibold mb-1">Restrictions:</p>
          <ul className="list-disc ml-4">
            {restrictions.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
