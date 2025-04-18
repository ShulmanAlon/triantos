import React from 'react';
import { GameClass } from '../../types/gameClass';

interface ClassSelectorProps {
  classOptions: GameClass[];
  selectedClass: string;
  isDisabled: boolean;
  onChange: (value: string) => void;
  description?: string;
  specialAbilities?: string[];
}

export const ClassSelector: React.FC<ClassSelectorProps> = ({
  classOptions,
  selectedClass,
  isDisabled,
  onChange,
  description,
  specialAbilities,
}) => {
  return (
    <div className="mb-6">
      <label className="block mb-1 font-medium">Class</label>
      <select
        className="border rounded px-2 py-1 w-full"
        value={selectedClass}
        onChange={(e) => onChange(e.target.value)}
        disabled={isDisabled}
      >
        <option value="" disabled hidden>
          Select Class
        </option>
        {classOptions.map((cls) => (
          <option key={cls.name} value={cls.name}>
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
    </div>
  );
};
