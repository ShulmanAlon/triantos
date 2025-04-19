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
  allowedRacesId?: RaceId[];
}

export const RaceSelector: React.FC<RaceSelectorProps> = ({
  raceOptions,
  selectedRaceId,
  isDisabled,
  onChange,
  description,
  specialAbilities = [],
  restrictions = [],
  allowedRacesId,
}) => {
  return (
    <div className="mb-6 space-y-3">
      {/* Race Dropdown */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Race
        </label>
        <select
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          value={selectedRaceId ?? ''}
          onChange={(e) => onChange(e.target.value as RaceId)}
          disabled={isDisabled}
        >
          <option value="" disabled hidden>
            Select Race
          </option>
          {raceOptions.map((race) => {
            const isAllowed = allowedRacesId?.includes(race.id) ?? true;
            return (
              <option key={race.id} value={race.id} disabled={!isAllowed}>
                {race.name}
              </option>
            );
          })}
        </select>
      </div>

      {/* Description */}
      {description && (
        <p className="text-sm text-gray-700 whitespace-pre-line">
          {description}
        </p>
      )}

      {/* Special Abilities */}
      {specialAbilities?.length > 0 && (
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
          {specialAbilities.map((ability, index) => (
            <li key={index}>{ability}</li>
          ))}
        </ul>
      )}

      {/* Restrictions */}
      {restrictions?.length > 0 && (
        <div className="text-sm text-gray-700">
          <p className="font-semibold mb-1">Restrictions:</p>
          <ul className="list-disc list-inside space-y-1">
            {restrictions.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
