import React from 'react';

export type ButtonProps = {
  children: React.ReactNode;
  onClick: () => void;
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
  const baseClasses = 'rounded px-4 py-2 font-semibold text-sm shadow-sm';
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-100',
    destructive: 'bg-red-600 text-white hover:bg-red-700',
  }[variant];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={`${baseClasses} ${variantClasses} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
      data-testid="button"
    >
      {children}
    </button>
  );
}
