import { queryOptions } from '@tanstack/react-query';

import { getPlatforms } from '@/features/platforms/api/platforms.api';

export function platformsQueryOptions() {
  return queryOptions({
    queryKey: ['platforms'],
    queryFn: () => getPlatforms(),
    staleTime: Infinity,
  });
}
