import React from 'react';
import { ClassId, GameClass } from '../../types/gameClass';

interface ClassSelectorProps {
  classOptions: GameClass[];
  selectedClassId: ClassId | undefined;
  isDisabled: boolean;
  onChange: (value: ClassId | undefined) => void;
  description?: string;
  specialAbilities?: string[];
}

export const ClassSelector: React.FC<ClassSelectorProps> = ({
  classOptions,
  selectedClassId,
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
        value={selectedClassId}
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
    </div>
  );
};
