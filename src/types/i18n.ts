export const SUPPORTED_LANGUAGES = ['en', 'he'] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];
