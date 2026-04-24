import type { GamesQuery } from '@only-must/shared';

import { queryClient } from '@/router';

import { gamesQueryOptions } from './games/use-games.ts';

export function prefetchGamesPage(search: GamesQuery, page: number) {
  return queryClient.prefetchQuery(
    gamesQueryOptions({
      ...search,
      page,
    }),
  );
}
