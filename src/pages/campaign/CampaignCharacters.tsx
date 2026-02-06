import { useMemo } from 'react';
import { CharacterPreview } from '@/types/characters';
import { CampaignInterface } from '@/types/campaign';
import { User } from '@/types/users';
import { USER_ROLES } from '@/config/userRoles';
import { ImageWithPlaceholder } from '@/components/ImageWithPlaceholder';
import { Button } from '@/components/ui/Button';
import { getCharacterBlurImage, getCharacterImage } from '@/utils/imageUtils';
import { ClassId } from '@/types/gameClass';

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
  const visibleCharacters = useMemo(() => {
    if (!user) return [];
    const isAdmin = user.role === USER_ROLES.ADMIN;
    const isDM = campaign.owner_id === user.id;
    return characters.filter((char) => {
      const isOwner = char.user_id === user.id;
      return char.visible || isOwner || isAdmin || isDM;
    });
  }, [characters, user, campaign.owner_id]);

  return (
    <>
      <div className="flex justify-between items-center pt-4 pb-3">
        <h2 className="text-2xl font-semibold">Characters</h2>
        <Button variant="outline" onClick={onCreate}>
          + New Character
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleCharacters.map((char) => (
          <CharacterCard key={char.id} character={char} onSelect={onSelect} />
        ))}
      </div>
    </>
  );
};

type CharacterCardProps = {
  character: CharacterPreview;
  onSelect: (characterId: string) => void;
};

const CharacterCard = ({ character, onSelect }: CharacterCardProps) => (
  <div
    onClick={() => onSelect(character.id)}
    className="cursor-pointer card p-4 transition hover:-translate-y-0.5"
  >
    <div className="rounded-xl overflow-hidden border border-black/5 bg-white/80">
      <ImageWithPlaceholder
        src={getCharacterImage(character.image_url, character.class_id as ClassId)}
        blurSrc={getCharacterBlurImage(character.class_id as ClassId)}
        alt={character.name}
      />
    </div>
    <p className="text-xs italic text-(--muted) mt-2">
      Owner: {character.owner_username}
    </p>
    <h3 className="text-lg font-bold">{character.name}</h3>
    <p className="text-sm text-(--muted)">{character.player_name}</p>
    <p className="text-sm text-(--muted)">
      {character.class_id} • {character.race_id} • Level {character.level}
    </p>
    {!character.visible && (
      <div className="absolute text-4xl top-2 right-2 text-gray-500">
        👁️‍🗨️
      </div>
    )}
  </div>
);
