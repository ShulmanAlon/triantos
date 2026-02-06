import { Button } from '@/components/ui/Button';

type LevelUpHeaderProps = {
  title: string;
  cancelLabel: string;
  onCancel: () => void;
  currentLevel: number;
  nextLevel: number;
  classId: string;
  raceId: string;
  showMissingProgression: boolean;
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

    <div className="mb-4 text-sm text-gray-700 panel p-3">
      <div>
        Level: {currentLevel} → {nextLevel}
      </div>
      <div>Class: {classId}</div>
      <div>Race: {raceId}</div>
    </div>
  </>
);
