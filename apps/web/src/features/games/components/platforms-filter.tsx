import { useQuery } from '@tanstack/react-query';

import { FacetMultiSelect } from '@/features/games/components/facet-multi-select.tsx';
import { useGamesSearch } from '@/features/games/hooks/use-games-search.ts';
import { platformsQueryOptions } from '@/features/platforms/queries/platforms.query';

export function PlatformsFilter() {
  const { data } = useQuery(platformsQueryOptions());
  const search = useGamesSearch();

  return (
    <FacetMultiSelect
      label="Platforms"
      param="platforms"
      options={data?.data ?? []}
      value={search.platforms}
    />
  );
}
