import { queryOptions } from '@tanstack/react-query';

import { getGameBySlug } from '@/features/games/api/games.api.ts';

export function gameQueryOptions(slug: string) {
  return queryOptions({
    queryKey: ['game', slug],
    queryFn: () => getGameBySlug(slug),
  });
}
