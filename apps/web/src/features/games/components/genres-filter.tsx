import { useQuery } from '@tanstack/react-query';

import { FacetMultiSelect } from '@/features/games/components/facet-multi-select.tsx';
import { useGamesSearch } from '@/features/games/hooks/use-games-search.ts';
import { genresQueryOptions } from '@/features/genres/queries/genres.query.ts';

export function GenresFilter() {
  const { data } = useQuery(genresQueryOptions());
  const search = useGamesSearch();

  return (
    <FacetMultiSelect
      label="Genres"
      param="genres"
      options={data?.data ?? []}
      value={search.genres}
    />
  );
}
