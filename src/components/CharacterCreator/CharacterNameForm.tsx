import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { uiLabels } from '../../i18n/ui';

interface CharacterNameFormProps {
  characterName: string;
  playerName: string;
  isCharacterFinished: boolean;
  onCharacterNameChange: (value: string) => void;
  onPlayerNameChange: (value: string) => void;
}

export const CharacterNameForm: React.FC<CharacterNameFormProps> = ({
  characterName,
  playerName,
  isCharacterFinished,
  onCharacterNameChange,
  onPlayerNameChange,
}) => {
  const { language } = useLanguage();
  const ui = uiLabels[language];
  return (
    <div className="mb-6 space-y-4">
      {/* Character Name */}
      <div>
        <label className="block text-sm font-semibold mb-1 text-gray-700">
          {ui.characterName}
        </label>
        <input
          type="text"
          value={characterName}
          onChange={(e) => onCharacterNameChange(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          disabled={isCharacterFinished}
        />
      </div>

      {/* Player Name */}
      <div>
        <label className="block text-sm font-semibold mb-1 text-gray-700">
          {ui.playerName}
        </label>
        <input
          type="text"
          value={playerName}
          onChange={(e) => onPlayerNameChange(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          disabled={isCharacterFinished}
        />
      </div>
    </div>
  );
};
