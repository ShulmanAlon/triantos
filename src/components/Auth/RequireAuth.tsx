import { Navigate } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import { JSX } from 'react';

export const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { session, isLoading } = useSession();

  if (isLoading) {
    return (
      <p className="text-center mt-10 text-gray-600">Loading session...</p>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
