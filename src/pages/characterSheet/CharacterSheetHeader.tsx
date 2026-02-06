import { Button } from '@/components/ui/Button';

type CharacterSheetHeaderProps = {
  canEdit: boolean;
  visible: boolean;
  onEdit: () => void;
  onBack: () => void;
  onToggleVisibility: () => void;
};

export const CharacterSheetHeader = ({
  canEdit,
  visible,
  onEdit,
  onBack,
  onToggleVisibility,
}: CharacterSheetHeaderProps) => (
  <div className="card p-4 flex flex-wrap gap-2 items-center justify-between">
    <div className="flex flex-wrap gap-2">
      {canEdit && (
        <Button variant="outline" onClick={onEdit}>
          Edit Character
        </Button>
      )}
      <Button variant="outline" onClick={onBack}>
        Back to Campaign
      </Button>
    </div>
    {canEdit && (
      <Button variant="outline" onClick={onToggleVisibility}>
        {visible ? 'Hide from other players' : 'Make visible to players'}
      </Button>
    )}
  </div>
);
