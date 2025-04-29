import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { uiLabels } from '@/i18n/ui';
import { LabeledInput } from '../ui/LabeledInput';

interface CharacterNameFormProps {
  characterName: string;
  playerName: string;
  onCharacterNameChange: (value: string) => void;
  onPlayerNameChange: (value: string) => void;
}

export const CharacterNameForm: React.FC<CharacterNameFormProps> = ({
  characterName,
  playerName,
  onCharacterNameChange,
  onPlayerNameChange,
}) => {
  const { language } = useLanguage();
  const ui = uiLabels[language];
  return (
    <div className="mb-6 space-y-4">
      {/* Character Name */}
      <LabeledInput
        label={ui.characterName}
        value={characterName}
        onChange={onCharacterNameChange}
      />

      {/* Player Name */}
      <LabeledInput
        label={ui.playerName}
        value={playerName}
        onChange={onPlayerNameChange}
      />
    </div>
  );
};
