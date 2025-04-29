import { useSession } from '@/hooks/useSession';
import { LanguageSelector } from '../LanguageSelector';
import { LogoutButton } from '../Auth/LogoutButton';
import { useCurrentUser } from '@/hooks/useCurrentUser';

export const Header = () => {
  const { session } = useSession();
  const user = useCurrentUser();

  const displayName = session
    ? user
      ? `${user.username} (${user.role})`
      : 'Loading...'
    : 'Not signed in';

  return (
    <header className="w-full flex justify-between items-center px-4 py-2 border-b bg-white mb-4 shadow-sm">
      <div className="text-sm text-gray-700">
        <span className={session ? 'font-medium' : 'italic text-gray-500'}>
          {displayName}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <LanguageSelector />
        {session && <LogoutButton />}
      </div>
    </header>
  );
};
