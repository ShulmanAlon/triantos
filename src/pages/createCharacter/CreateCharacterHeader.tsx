import { ReactNode } from 'react';

type CreateCharacterHeaderProps = {
  title: string;
  createdBy?: string | null;
  children?: ReactNode;
};

export const CreateCharacterHeader = ({
  title,
  createdBy,
  children,
}: CreateCharacterHeaderProps) => (
  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
    <div>
      <p className="chip">{title}</p>
      <h2 className="text-2xl font-bold mt-2">{title}</h2>
      <p className="text-xs italic text-(--muted)">
        Created by: {createdBy ?? 'Unknown'}
      </p>
    </div>
    {children}
  </div>
);
