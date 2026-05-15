import { GetGenresResponseSchema } from '@only-must/shared';

import { apiClient } from '@/lib/api/client.ts';
import { endpoints } from '@/lib/api/endpoints.ts';

export async function getGenres() {
  const res = await apiClient.get(endpoints.genres);
  const parsed = GetGenresResponseSchema.parse(res.data);
  return parsed;
}
