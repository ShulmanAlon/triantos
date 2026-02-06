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
    <header className="w-full flex items-center gap-6 px-6 py-3 mt-4 mb-4 card min-h-16">
      <div className="flex-1 flex items-center">
        <span className="text-xl font-semibold tracking-tight text-(--ink)">
          Triantos
        </span>
      </div>
      <div className="flex-1 text-center text-sm text-(--muted)">
        <span
          className={
            session ? 'font-medium text-(--ink)' : 'italic text-gray-500'
          }
        >
          {displayName}
        </span>
      </div>
      <div className="flex-1 flex items-center justify-end gap-3">
        <LanguageSelector />
        {session && <LogoutButton />}
      </div>
    </header>
  );
};
