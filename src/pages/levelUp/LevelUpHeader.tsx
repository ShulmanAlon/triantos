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

    <div className="mb-4 grid gap-4 lg:grid-cols-2 items-stretch">
      <div className="panel p-4 text-sm text-gray-800 h-full">
        <div className="section-rule">
          <h3 className="section-title">Character Snapshot</h3>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-black/10 p-3">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-(--muted)">
              Current Level
            </div>
            <div className="text-lg font-bold">{currentLevel}</div>
          </div>
          <div className="rounded-lg border border-black/10 p-3">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-(--muted)">
              Next Level
            </div>
            <div className="text-lg font-bold">{nextLevel}</div>
          </div>
          <div className="rounded-lg border border-black/10 p-3">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-(--muted)">
              Class
            </div>
            <div className="font-semibold">{classId}</div>
          </div>
          <div className="rounded-lg border border-black/10 p-3">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-(--muted)">
              Race
            </div>
            <div className="font-semibold">{raceId}</div>
          </div>
        </div>
      </div>
      {rightContent && <div className="h-full">{rightContent}</div>}
    </div>
  </>
);
