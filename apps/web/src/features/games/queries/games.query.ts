import type { GamesQuery } from '@only-must/shared';
import { keepPreviousData, queryOptions } from '@tanstack/react-query';

import { getGames } from '@/features/games/api/games.api.ts';

export function gamesQueryOptions(params?: GamesQuery) {
  return queryOptions({
    queryKey: ['games', params],
    queryFn: () => getGames(params),
    placeholderData: keepPreviousData,
  });
}
