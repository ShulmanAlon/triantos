import { ReactNode } from 'react';
import { Button } from '@/components/ui/Button';

type ConfirmModalProps = {
  open: boolean;
  title: string;
  description: ReactNode;
  confirmLabel: string;
  confirmVariant?: 'outline' | 'destructive' | 'primary';
  onCancel: () => void;
  onConfirm: () => void;
};

export const ConfirmModal = ({
  open,
  title,
  description,
  confirmLabel,
  confirmVariant = 'outline',
  onCancel,
  onConfirm,
}: ConfirmModalProps) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow max-w-sm w-full space-y-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-(--muted)">{description}</p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant={confirmVariant} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};
