import { ReactNode } from 'react';

interface LoadingErrorWrapperProps {
  loading: boolean;
  error: string | null;
  children: ReactNode;
}

export function LoadingErrorWrapper({
  loading,
  error,
  children,
}: LoadingErrorWrapperProps) {
  if (loading) {
    return <p className="p-4">Loading...</p>;
  }

  if (error) {
    return <p className="p-4 text-red-600">{error}</p>;
  }

  return <>{children}</>;
}
