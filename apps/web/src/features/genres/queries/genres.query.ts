import { queryOptions } from '@tanstack/react-query';

import { getGenres } from '@/features/genres/api/genres.api.ts';

export function genresQueryOptions() {
  return queryOptions({
    queryKey: ['genres'],
    queryFn: () => getGenres(),
    staleTime: Infinity,
  });
}
