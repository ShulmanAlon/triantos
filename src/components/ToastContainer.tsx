import { useToast } from '@/context/ToastContext';

export function ToastContainer() {
  const { toasts, dismiss } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((toast) => (
        <button
          key={toast.id}
          onClick={() => dismiss(toast.id)}
          className={`rounded-xl px-4 py-3 text-sm shadow-lg text-left border ${
            toast.variant === 'error'
              ? 'bg-red-50 border-red-200 text-red-800'
              : 'bg-white/90 border-black/10 text-(--ink)'
          }`}
        >
          {toast.message}
        </button>
      ))}
    </div>
  );
}
