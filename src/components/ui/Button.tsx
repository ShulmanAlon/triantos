import React from 'react';

export type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'outline' | 'destructive';
};

export function Button({
  children,
  onClick,
  disabled = false,
  className = '',
  type = 'button',
  variant = 'primary',
}: ButtonProps) {
  const baseClasses =
    'rounded-lg px-4 py-2 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--accent)/40 focus-visible:ring-offset-2 active:translate-y-[1px]';
  const variantClasses = {
    primary:
      'bg-(--accent) text-white hover:bg-(--accent-dark) shadow-[0_6px_12px_rgba(48,115,106,0.22)] border border-(--accent-dark)/20',
    outline:
      'border border-black/10 text-(--ink) bg-black/7 hover:bg-black/11',
    destructive:
      'bg-(--warn) text-white hover:bg-[#6f160a] shadow-[0_6px_12px_rgba(138,30,14,0.24)] border border-[#6f160a]/30',
  }[variant];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={`${baseClasses} ${variantClasses} ${
        disabled ? 'opacity-50 cursor-not-allowed hover:bg-transparent' : ''
      } ${className}`}
      data-testid="button"
    >
      {children}
    </button>
  );
}
