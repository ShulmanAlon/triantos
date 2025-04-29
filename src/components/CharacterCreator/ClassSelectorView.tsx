import React from 'react';
import { ClassId, GameClass } from '@/types/gameClass';
import { getRaceNameById } from '@/utils/raceUtils';
import { Attribute } from '@/types/attributes';
import { useLanguage } from '@/context/LanguageContext';
import { uiLabels } from '@/i18n/ui';
import { attributeLabels } from '@/i18n/attributes';
import { classDictionary } from '@/i18n/classes';
import {
  getAllowedRacesByClassId,
  getPrimaryAttributesByClassId,
} from '../../utils/classUtils';

interface ClassSelectorProps {
  classOptions: GameClass[];
  selectedClassId: ClassId | undefined;
  isDisabled: boolean;
  onChange: (value: ClassId | undefined) => void;
  currentAttributes?: Record<Attribute, number>;
}

export const ClassSelector: React.FC<ClassSelectorProps> = ({
  classOptions,
  selectedClassId,
  isDisabled,
  onChange,
  currentAttributes,
}) => {
  const { language } = useLanguage();
  const ui = uiLabels[language];
  const attributeNames = attributeLabels[language];
  const allowedRacesId = getAllowedRacesByClassId(selectedClassId);
  const primaryAttributes = getPrimaryAttributesByClassId(selectedClassId);
  const localized = selectedClassId
    ? classDictionary[selectedClassId]?.[language]
    : undefined;

  const classDescription = localized?.description;
  const specialAbilities = localized?.specialAbilities;

  return (
    <div className="mb-6 space-y-3">
      {/* Class Dropdown */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          {ui.class}
        </label>
        <select
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          value={selectedClassId ?? ''}
          onChange={(e) => onChange(e.target.value as ClassId)}
          disabled={isDisabled}
        >
          <option value="" disabled hidden>
            {ui.selectClass}
          </option>
          {classOptions.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {classDictionary[cls.id][language].name}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      {classDescription && (
        <p className="text-sm text-gray-700 whitespace-pre-line">
          {classDescription}
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
      {allowedRacesId && selectedClassId && allowedRacesId?.length > 0 && (
        <p className="text-sm text-gray-700">
          <strong>{ui.allowedRaces}:</strong>{' '}
          {allowedRacesId
            .map((raceId) => getRaceNameById(raceId, language))
            .join(', ')}
        </p>
      )}

      {/* Attribute Requirements */}
      {primaryAttributes && Object.keys(primaryAttributes).length > 0 && (
        <div className="text-sm text-gray-700">
          <p className="font-semibold mb-1">{ui.attributeRequirements}:</p>
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
                      {attributeNames[attr as Attribute]}
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
