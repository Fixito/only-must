import { queryOptions, useQuery } from '@tanstack/react-query';

import { getGames } from './api';

export function gamesQueryOptions(params?: { page?: number }) {
  return queryOptions({
    queryKey: ['games', params],
    queryFn: () => getGames(params),
  });
}

export function useGames(params?: { page?: number }) {
  return useQuery(gamesQueryOptions(params));
}
