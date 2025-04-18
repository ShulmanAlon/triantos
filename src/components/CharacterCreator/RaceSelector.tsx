import React from 'react';
import { Race } from '../../types/race';

interface RaceSelectorProps {
  raceOptions: Race[];
  selectedRace: string;
  isDisabled: boolean;
  onChange: (value: string) => void;
  description?: string;
  specialAbilities?: string[];
  restrictions?: string[];
}

export const RaceSelector: React.FC<RaceSelectorProps> = ({
  raceOptions,
  selectedRace,
  isDisabled,
  onChange,
  description,
  specialAbilities = [],
  restrictions = [],
}) => {
  return (
    <div className="mb-6">
      <label className="block mb-1 font-medium">Race</label>
      <select
        className="border rounded px-2 py-1 w-full"
        value={selectedRace}
        onChange={(e) => onChange(e.target.value)}
        disabled={isDisabled}
      >
        <option value="" disabled hidden>
          Select Race
        </option>
        {raceOptions.map((race) => (
          <option key={race.name} value={race.name}>
            {race.name}
          </option>
        ))}
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
