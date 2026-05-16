import { useQuery } from '@tanstack/react-query';
import { useSearch } from '@tanstack/react-router';

import { FacetMultiSelect } from '@/features/games/components/facet-multi-select.tsx';
import { platformsQueryOptions } from '@/features/platforms/queries/platforms.query';

export function PlatformsFilter() {
  const { data } = useQuery(platformsQueryOptions());
  const search = useSearch({ from: '/' });

  return (
    <FacetMultiSelect
      label="Platforms"
      param="platforms"
      options={data?.data ?? []}
      value={search.platforms}
    />
  );
}
