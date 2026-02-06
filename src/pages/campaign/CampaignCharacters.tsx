import { useMemo } from 'react';
import { CharacterPreview } from '@/types/characters';
import { CampaignInterface } from '@/types/campaign';
import { User } from '@/types/users';
import { USER_ROLES } from '@/config/userRoles';
import { ImageWithPlaceholder } from '@/components/ImageWithPlaceholder';
import { Button } from '@/components/ui/Button';
import { getCharacterBlurImage, getCharacterImage } from '@/utils/imageUtils';
import { ClassId } from '@/types/gameClass';
import { getClassNameById } from '@/utils/classUtils';
import { getRaceNameById } from '@/utils/raceUtils';
import { useLanguage } from '@/context/LanguageContext';

type CampaignCharactersProps = {
  campaign: CampaignInterface;
  characters: CharacterPreview[];
  user: User | null;
  onSelect: (characterId: string) => void;
  onCreate: () => void;
};

export const CampaignCharacters = ({
  campaign,
  characters,
  user,
  onSelect,
  onCreate,
}: CampaignCharactersProps) => {
  const { language } = useLanguage();
  const visibleCharacters = useMemo(() => {
    if (!user) return [];
    const isAdmin = user.role === USER_ROLES.ADMIN;
    const isDM = campaign.owner_id === user.id;
    const filtered = characters.filter((char) => {
      const isOwner = char.user_id === user.id;
      return char.visible || isOwner || isAdmin || isDM;
    });

    const getCreatedAt = (char: CharacterPreview) => {
      if (!char.created_at) return Number.MAX_SAFE_INTEGER;
      const time = new Date(char.created_at).getTime();
      return Number.isNaN(time) ? Number.MAX_SAFE_INTEGER : time;
    };

    return [...filtered].sort((a, b) => {
      const aOwner = a.user_id === user.id;
      const bOwner = b.user_id === user.id;
      if (aOwner !== bOwner) return aOwner ? -1 : 1;

      if (!aOwner && !bOwner) {
        const aName = (a.owner_username ?? '').toLowerCase();
        const bName = (b.owner_username ?? '').toLowerCase();
        if (aName !== bName) return aName.localeCompare(bName);
      }

      return getCreatedAt(a) - getCreatedAt(b);
    });
  }, [characters, user, campaign.owner_id]);

  return (
    <>
      <div className="flex justify-between items-center pt-4 pb-3">
        <div>
          <h2 className="text-2xl font-semibold">Characters</h2>
          <p className="text-xs text-(--muted)">
            {visibleCharacters.length} total
          </p>
        </div>
        <Button variant="outline" onClick={onCreate}>
          New Character
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {visibleCharacters.map((char) => (
          <CharacterCard
            key={char.id}
            character={char}
            onSelect={onSelect}
            language={language}
          />
        ))}
      </div>
    </>
  );
};

type CharacterCardProps = {
  character: CharacterPreview;
  onSelect: (characterId: string) => void;
  language: ReturnType<typeof useLanguage>['language'];
};

const CharacterCard = ({ character, onSelect, language }: CharacterCardProps) => (
  <div
    onClick={() => onSelect(character.id)}
    className="cursor-pointer card p-3 transition hover:-translate-y-0.5 hover:border-(--accent)/30"
  >
    <div className="rounded-xl overflow-hidden border border-black/5 bg-white/80">
      <ImageWithPlaceholder
        src={getCharacterImage(character.image_url, character.class_id as ClassId)}
        blurSrc={getCharacterBlurImage(character.class_id as ClassId)}
        alt={character.name}
        className="w-full aspect-square"
      />
    </div>
    <div className="mt-2 space-y-1">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-lg font-bold">{character.name}</h3>
        {!character.visible && (
          <span className="text-[10px] uppercase tracking-wide font-semibold text-(--muted) border border-black/10 rounded-full px-2 py-0.5">
            Hidden
          </span>
        )}
      </div>
      <p className="text-xs italic text-(--muted)">
        Owner: {character.owner_username}
      </p>
      <p className="text-sm text-(--muted)">{character.player_name}</p>
      {!character.visible && (
        <p className="text-xs text-(--muted)">Hidden from other players</p>
      )}
      <div className="text-sm text-(--muted)">
        {getClassNameById(character.class_id as ClassId, language)} •{' '}
        {getRaceNameById(character.race_id, language)} • Level {character.level}
      </div>
    </div>
  </div>
);
