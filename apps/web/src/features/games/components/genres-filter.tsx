import { useQuery } from '@tanstack/react-query';
import { useSearch } from '@tanstack/react-router';

import { FilterMulti } from '@/features/games/components/filter-multi.tsx';
import { genresQueryOptions } from '@/features/genres/queries/genres.query.ts';

export function GenresFilter() {
  const { data } = useQuery(genresQueryOptions());
  const search = useSearch({ from: '/' });

  return (
    <FilterMulti label="Genres" param="genres" options={data?.data ?? []} value={search.genres} />
  );
}
