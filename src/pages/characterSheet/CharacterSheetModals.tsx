import EditCharacterModal from '@/components/EditCharacterModal';
import { CharacterWithCampaign } from '@/types/characters';
import { ConfirmModal } from './ConfirmModal';

type CharacterSheetModalsProps = {
  canEdit: boolean;
  character: CharacterWithCampaign;
  showEditModal: boolean;
  showLevelDownModal: boolean;
  showDeleteModal: boolean;
  onEditClose: () => void;
  onEditSave: (updated: Partial<CharacterWithCampaign>) => Promise<void>;
  onLevelDownClose: () => void;
  onLevelDownConfirm: () => void;
  onDeleteClose: () => void;
  onDeleteConfirm: () => void;
};

export const CharacterSheetModals = ({
  canEdit,
  character,
  showEditModal,
  showLevelDownModal,
  showDeleteModal,
  onEditClose,
  onEditSave,
  onLevelDownClose,
  onLevelDownConfirm,
  onDeleteClose,
  onDeleteConfirm,
}: CharacterSheetModalsProps) => {
  const levelDownDescription = character
    ? `This will remove all level ${character.level} progression choices. Continue?`
    : 'This will remove the most recent level progression choices. Continue?';

  return (
    <>
      <EditCharacterModal
        open={showEditModal}
        character={character}
        onClose={onEditClose}
        onSave={onEditSave}
      />
      {canEdit && (
        <ConfirmModal
          open={showLevelDownModal}
          title="Level Down"
          description={levelDownDescription}
          confirmLabel="Level Down"
          confirmVariant="destructive"
          onCancel={onLevelDownClose}
          onConfirm={onLevelDownConfirm}
        />
      )}
      <ConfirmModal
        open={showDeleteModal}
        title="Delete Character"
        description="Are you sure you want to delete this character?"
        confirmLabel="Delete"
        confirmVariant="destructive"
        onCancel={onDeleteClose}
        onConfirm={onDeleteConfirm}
      />
    </>
  );
};
