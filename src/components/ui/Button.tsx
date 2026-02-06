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
    'rounded-xl px-4 py-2 text-sm font-semibold transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--accent)/40 focus-visible:ring-offset-2';
  const variantClasses = {
    primary:
      'bg-(--accent) text-white hover:bg-(--accent-dark) shadow-[0_10px_18px_rgba(15,123,108,0.25)]',
    outline:
      'border border-black/10 text-(--ink) hover:bg-black/5 bg-white/70',
    destructive:
      'bg-(--warn) text-white hover:bg-[#8d2f1f] shadow-[0_10px_18px_rgba(179,64,42,0.2)]',
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
