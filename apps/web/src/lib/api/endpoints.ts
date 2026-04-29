export const endpoints = {
  games: '/games',
  game: (slug: string) => `/games/${slug}`,
  platforms: '/platforms',
} as const;
