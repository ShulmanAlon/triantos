import { useSession } from '@/hooks/useSession';
import { LanguageSelector } from '../LanguageSelector';
import { LogoutButton } from '../Auth/LogoutButton';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { Button } from '../ui/Button';
import { finalStats } from '@/data/mockDataTests';

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
      <div>
        <Button //TODO remove after tests
          type="button"
          onClick={function (): void {
            console.log('final stats: ', finalStats);
          }}
        >
          Test
        </Button>
      </div>
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
