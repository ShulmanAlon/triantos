export type UserRole = 'admin' | 'player';

export type User = {
  id: string;
  username: string;
  role: UserRole;
};
