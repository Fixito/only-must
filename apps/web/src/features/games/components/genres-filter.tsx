import { useQuery } from '@tanstack/react-query';
import { useSearch } from '@tanstack/react-router';

import { FacetMultiSelect } from '@/features/games/components/facet-multi-select.tsx';
import { genresQueryOptions } from '@/features/genres/queries/genres.query.ts';

export function GenresFilter() {
  const { data } = useQuery(genresQueryOptions());
  const search = useSearch({ from: '/' });

  return (
    <FacetMultiSelect
      label="Genres"
      param="genres"
      options={data?.data ?? []}
      value={search.genres}
    />
  );
}
