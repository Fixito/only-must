export const endpoints = {
  games: '/games',
  game: (slug: string) => `/games/${encodeURIComponent(slug)}`,
  platforms: '/platforms',
} as const;
