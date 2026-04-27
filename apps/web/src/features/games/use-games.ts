import type { GamesQuery } from '@only-must/shared';
import { useQuery } from '@tanstack/react-query';

import { gameQueryOptions } from '@/features/games/api/game.query.ts';
import { gamesQueryOptions } from '@/features/games/queries/games.query.ts';

export function useGames(params?: GamesQuery) {
  return useQuery(gamesQueryOptions(params));
}

export function useGame(slug: string) {
  return useQuery(gameQueryOptions(slug));
}
