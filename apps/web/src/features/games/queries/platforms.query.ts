import { queryOptions } from '@tanstack/react-query';

import { getPlatforms } from '@/features/games/api/platforms.api.ts';

export function platformsQueryOptions() {
  return queryOptions({
    queryKey: ['platforms'],
    queryFn: () => getPlatforms(),
    staleTime: Infinity,
  });
}
