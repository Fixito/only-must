export const endpoints = {
  games: '/games',
  game: (slug: string) => `/games/${encodeURIComponent(slug)}`,
  gamesDurationRange: '/games/duration-range',
  platforms: '/platforms',
  genres: '/genres',
} as const;
