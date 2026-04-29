import type { GamesQuery } from '@only-must/shared';
import { GameWithRelationsResponseSchema, GetGamesResponseSchema } from '@only-must/shared';

import { apiClient } from '@/lib/api/client.ts';
import { endpoints } from '@/lib/api/endpoints.ts';

export async function getGames(params?: GamesQuery) {
  const res = await apiClient.get(endpoints.games, { params });
  const parsed = GetGamesResponseSchema.parse(res.data);
  return parsed;
}

export async function getGameBySlug(slug: string) {
  const res = await apiClient.get(endpoints.game(slug));
  const parsed = GameWithRelationsResponseSchema.parse(res.data);

  return parsed;
}
