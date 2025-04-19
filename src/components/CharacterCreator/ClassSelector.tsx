import React from 'react';
import { ClassId, GameClass } from '../../types/gameClass';
import { RaceId } from '../../types/race';
import { getRaceNameById } from '../../utils/raceUtils';
import { Attribute } from '../../types/attributes';

interface ClassSelectorProps {
  classOptions: GameClass[];
  selectedClassId: ClassId | undefined;
  isDisabled: boolean;
  onChange: (value: ClassId | undefined) => void;
  description?: string;
  specialAbilities?: string[];
  allowedRacesId: RaceId[];
  primaryAttributes?: Partial<Record<Attribute, number>>;
  currentAttributes?: Record<Attribute, number>;
}

export const ClassSelector: React.FC<ClassSelectorProps> = ({
  classOptions,
  selectedClassId,
  isDisabled,
  onChange,
  description,
  specialAbilities,
  allowedRacesId,
  primaryAttributes,
  currentAttributes,
}) => {
  return (
    <div className="mb-6 space-y-3">
      {/* Class Dropdown */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Class
        </label>
        <select
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          value={selectedClassId ?? ''}
          onChange={(e) => onChange(e.target.value as ClassId)}
          disabled={isDisabled}
        >
          <option value="" disabled hidden>
            Select Class
          </option>
          {classOptions.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.name}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      {description && (
        <p className="text-sm text-gray-700 whitespace-pre-line">
          {description}
        </p>
      )}

      {/* Special Abilities */}
      {specialAbilities && specialAbilities.length > 0 && (
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
          {specialAbilities.map((ability, index) => (
            <li key={index}>{ability}</li>
          ))}
        </ul>
      )}

      {/* Allowed Races */}
      {selectedClassId && allowedRacesId?.length > 0 && (
        <p className="text-sm text-gray-700">
          <strong>Allowed Races:</strong>{' '}
          {allowedRacesId.map((raceId) => getRaceNameById(raceId)).join(', ')}
        </p>
      )}

      {/* Attribute Requirements */}
      {primaryAttributes && Object.keys(primaryAttributes).length > 0 && (
        <div className="text-sm text-gray-700">
          <p className="font-semibold mb-1">Attribute Requirements:</p>
          <table className="border-collapse">
            <tbody>
              {Object.entries(primaryAttributes).map(([attr, min]) => {
                const current = currentAttributes?.[attr as Attribute];
                const isUnmet = current !== undefined && current < min;
                return (
                  <tr key={attr}>
                    <td
                      className={`pr-4 font-medium ${
                        isUnmet ? 'text-red-600' : 'text-green-600'
                      }`}
                    >
                      {attr.toUpperCase()}
                    </td>
                    <td
                      className={`text-right ${
                        isUnmet ? 'text-red-600' : 'text-green-600'
                      }`}
                    >
                      {min}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
