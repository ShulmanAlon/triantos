import React from 'react';

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
  return (
    <div className="mb-6">
      <div className="mb-4">
        <label className="block mb-1 font-medium">Character Name</label>
        <input
          type="text"
          value={characterName}
          onChange={(e) => onCharacterNameChange(e.target.value)}
          className="border px-2 py-1 rounded w-full"
          disabled={isCharacterFinished}
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Player Name</label>
        <input
          type="text"
          value={playerName}
          onChange={(e) => onPlayerNameChange(e.target.value)}
          className="border px-2 py-1 rounded w-full"
          disabled={isCharacterFinished}
        />
      </div>
    </div>
  );
};
