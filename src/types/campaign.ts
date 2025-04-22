export interface Campaign {
  id: string;
  name: string;
  description: string;
  imageUrl?: string; // Optional image shown on dashboard
  createdAt: string; // ISO date string
  updatedAt?: string;

  // Optional fields to be populated from joins:
  dmName?: string; // Resolved via users table
  playerNames?: string[]; // Optional, for display purposes
}
