import { ReactNode, useEffect, useState } from 'react';

interface LoadingErrorWrapperProps {
  loading: boolean;
  error: string | null;
  children: ReactNode;
}

const LOADING_DELAY_MS = 150;

export function LoadingErrorWrapper({
  loading,
  error,
  children,
}: LoadingErrorWrapperProps) {
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    if (!loading) {
      setShowLoading(false);
      return;
    }
    const timer = setTimeout(() => setShowLoading(true), LOADING_DELAY_MS);
    return () => clearTimeout(timer);
  }, [loading]);

  if (loading && showLoading) {
    return <p className="p-4">Loading...</p>;
  }

  if (error) {
    return <p className="p-4 text-red-600">{error}</p>;
  }

  return <>{children}</>;
}
