import type { GamesQuery } from '@only-must/shared';
import { queryOptions, useQuery } from '@tanstack/react-query';

import { getGames } from './api';

export function gamesQueryOptions(params?: GamesQuery) {
  return queryOptions({
    queryKey: ['games', params],
    queryFn: () => getGames(params),
  });
}

export function useGames(params?: GamesQuery) {
  return useQuery(gamesQueryOptions(params));
}
