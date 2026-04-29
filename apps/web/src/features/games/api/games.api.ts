import type { GamesQuery } from '@only-must/shared';
import { GameWithRelationsResponseSchema, GetGamesResponseSchema } from '@only-must/shared';
import axios from 'axios';

export async function getGames(params?: GamesQuery) {
  const res = await axios.get('http://localhost:5000/api/v1/games', { params });
  const parsed = GetGamesResponseSchema.parse(res.data);
  return parsed;
}

export async function getGameBySlug(slug: string) {
  const res = await axios.get(`http://localhost:5000/api/v1/games/${slug}`);
  const parsed = GameWithRelationsResponseSchema.parse(res.data);

  return parsed;
}
