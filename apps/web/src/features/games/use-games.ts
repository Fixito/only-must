import type { GamesQuery } from '@only-must/shared';
import { queryOptions, useQuery } from '@tanstack/react-query';

import { getGameBySlug, getGames } from './api';

export function gamesQueryOptions(params?: GamesQuery) {
  return queryOptions({
    queryKey: ['games', params],
    queryFn: () => getGames(params),
  });
}

export function gameQueryOptions(slug: string) {
  return queryOptions({
    queryKey: ['game', slug],
    queryFn: () => getGameBySlug(slug),
  });
}

export function useGames(params?: GamesQuery) {
  return useQuery(gamesQueryOptions(params));
}

export function useGame(slug: string) {
  return useQuery(gameQueryOptions(slug));
}
