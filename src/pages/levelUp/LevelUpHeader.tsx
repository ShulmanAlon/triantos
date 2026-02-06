import { Button } from '@/components/ui/Button';
import { ReactNode } from 'react';

type LevelUpHeaderProps = {
  title: string;
  cancelLabel: string;
  onCancel: () => void;
  currentLevel: number;
  nextLevel: number;
  classId: string;
  raceId: string;
  showMissingProgression: boolean;
  rightContent?: ReactNode;
};

export const LevelUpHeader = ({
  title,
  cancelLabel,
  onCancel,
  currentLevel,
  nextLevel,
  classId,
  raceId,
  showMissingProgression,
  rightContent,
}: LevelUpHeaderProps) => (
  <>
    <div className="flex items-center justify-between mb-4">
      <div>
        <p className="chip">{title}</p>
        <h2 className="text-2xl font-bold mt-2">{title}</h2>
      </div>
      <Button variant="outline" onClick={onCancel}>
        {cancelLabel}
      </Button>
    </div>

    {showMissingProgression && (
      <div className="mb-4 text-sm text-red-600">
        No class progression data found for level {nextLevel}.
      </div>
    )}

    <div className="mb-4 grid gap-4 lg:grid-cols-[1.2fr_0.8fr] items-stretch">
      <div className="text-base text-gray-800 panel p-3 flex flex-col justify-between">
        <div>
          <span className="font-semibold">Level:</span> {currentLevel} → {nextLevel}
        </div>
        <div>
          <span className="font-semibold">Class:</span> {classId}
        </div>
        <div>
          <span className="font-semibold">Race:</span> {raceId}
        </div>
      </div>
      {rightContent && <div className="h-full">{rightContent}</div>}
    </div>
  </>
);
