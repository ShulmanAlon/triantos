import { ChangeEvent } from 'react';
import { Race, RaceId } from '@/types/race';
import { useLanguage } from '@/context/LanguageContext';
import { uiLabels } from '@/i18n/ui';
import {
  getRaceDescriptionById,
  getRaceNameById,
  getRaceRestrictionsById,
  getRaceSpecialAbilitiesById,
} from '@/utils/raceUtils';

interface RaceSelectorProps {
  raceOptions: Race[];
  selectedRaceId: RaceId | undefined;
  isDisabled: boolean;
  onChange: (value: RaceId | undefined) => void;
  allowedRacesId?: RaceId[];
}

export const RaceSelector: React.FC<RaceSelectorProps> = ({
  raceOptions,
  selectedRaceId,
  isDisabled,
  onChange,
  allowedRacesId,
}) => {
  const { language } = useLanguage();
  const ui = uiLabels[language];
  const description = getRaceDescriptionById(selectedRaceId, language);
  const specialAbilities = getRaceSpecialAbilitiesById(
    selectedRaceId,
    language
  );
  const restrictions = getRaceRestrictionsById(selectedRaceId, language);
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    onChange(value ? (value as RaceId) : undefined);
  };
  return (
    <div className="mb-6 space-y-3">
      {/* Race Dropdown */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          {ui.race}
        </label>
        <select
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          value={selectedRaceId ?? ''}
          onChange={handleChange}
          disabled={isDisabled}
        >
          <option value="" disabled hidden>
            {ui.selectRace}
          </option>
          {raceOptions.map((race) => {
            const isAllowed = allowedRacesId?.includes(race.id) ?? true;
            return (
              <option key={race.id} value={race.id} disabled={!isAllowed}>
                {getRaceNameById(race.id as RaceId, language)}
              </option>
            );
          })}
        </select>
      </div>

      {!isDisabled && selectedRaceId && (
        <div>
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
              <p className="font-semibold mb-1">{ui.restrictions}:</p>
              <ul className="list-disc list-inside space-y-1">
                {restrictions.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
