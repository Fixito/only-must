import { useQuery } from '@tanstack/react-query';
import { useSearch } from '@tanstack/react-router';

import { FilterMulti } from '@/features/games/components/filter-multi.tsx';
import { platformsQueryOptions } from '@/features/platforms/queries/platforms.query';

export function PlatformsFilter() {
  const { data } = useQuery(platformsQueryOptions());
  const search = useSearch({ from: '/' });

  return (
    <FilterMulti
      label="Platforms"
      param="platforms"
      options={data?.data ?? []}
      value={search.platforms}
    />
  );
}
