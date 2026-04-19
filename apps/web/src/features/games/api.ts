import { GetGamesResponseSchema } from '@only-must/shared';
import axios from 'axios';

export async function getGames(params?: { page?: number }) {
  const res = await axios.get('http://localhost:5000/api/v1/games', { params });
  const parsed = GetGamesResponseSchema.parse(res.data);
  return parsed.data;
}
