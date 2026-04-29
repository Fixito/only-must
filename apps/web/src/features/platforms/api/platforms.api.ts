import { GetPlatformsResponseSchema } from '@only-must/shared';

import { apiClient } from '@/lib/api/client.ts';
import { endpoints } from '@/lib/api/endpoints.ts';

export async function getPlatforms() {
  const res = await apiClient.get(endpoints.platforms);
  const parsed = GetPlatformsResponseSchema.parse(res.data);
  return parsed;
}
