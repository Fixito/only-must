import { queryOptions } from '@tanstack/react-query';

import { getGenres } from '@/features/genres/queries/api/genres.api';

export function genresQueryOptions() {
  return queryOptions({
    queryKey: ['genres'],
    queryFn: () => getGenres(),
    staleTime: Infinity,
  });
}
