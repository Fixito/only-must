export const endpoints = {
  games: '/games',
  game: (slug: string) => `/games/${encodeURIComponent(slug)}`,
  platforms: '/platforms',
  genres: '/genres',
} as const;
