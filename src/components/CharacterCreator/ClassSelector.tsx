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
    <div className="mb-6">
      <label className="block mb-1 font-medium">Class</label>
      <select
        className="border rounded px-2 py-1 w-full"
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

      {description && (
        <p className="text-sm text-gray-600 mt-2 whitespace-pre-line">
          {description}
        </p>
      )}
      {specialAbilities && specialAbilities.length > 0 && (
        <ul className="text-sm text-gray-600 mt-2 list-disc ml-4">
          {specialAbilities.map((ability, index) => (
            <li key={index}>{ability}</li>
          ))}
        </ul>
      )}
      {allowedRacesId?.length > 0 && (
        <p className="text-sm text-gray-600 mt-2">
          <strong>Allowed Races:</strong>{' '}
          {allowedRacesId.map((raceId) => getRaceNameById(raceId)).join(', ')}
        </p>
      )}
      {primaryAttributes && Object.keys(primaryAttributes).length > 0 && (
        <div className="text-sm text-gray-600 mt-2">
          <p className="font-semibold mb-1">Attribute Requirements:</p>
          <table className="w-fit text-sm border-collapse">
            <tbody>
              {Object.entries(primaryAttributes).map(([attr, min]) => {
                const current = currentAttributes?.[attr as Attribute];
                const isUnmet = current !== undefined && current < min;
                console.log(attr, 'is unmet ', isUnmet);
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
