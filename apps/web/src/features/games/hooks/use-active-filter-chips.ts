import type { Genre, Platform } from '@only-must/shared';
import { useQuery } from '@tanstack/react-query';

import { useGamesNavigate, useGamesSearch } from '@/features/games/hooks/use-games-search.ts';
import { usePlaytimeBounds } from '@/features/games/hooks/use-playtime-bounds.ts';
import { buildFilterChips } from '@/features/games/utils/games-filter.utils.ts';
import type { FilterChipItem } from '@/features/games/utils/games-filter.utils.ts';
import { genresQueryOptions } from '@/features/genres/queries/genres.query.ts';
import { platformsQueryOptions } from '@/features/platforms/queries/platforms.query';

export type { FilterChipItem };

export function useActiveFilterChips(): Array<FilterChipItem> {
  const search = useGamesSearch();
  const navigate = useGamesNavigate();
  const { data: platforms } = useQuery(platformsQueryOptions());
  const { data: genres } = useQuery(genresQueryOptions());
  const { min: minPlaytime, max: maxPlaytime } = usePlaytimeBounds();

  const platformMap = Object.fromEntries(
    (platforms?.data ?? []).map((p: Platform) => [p.id, p.name]),
  );
  const genreMap = Object.fromEntries((genres?.data ?? []).map((g: Genre) => [g.id, g.name]));

  return buildFilterChips(
    search,
    platformMap,
    genreMap,
    { min: minPlaytime, max: maxPlaytime },
    (updater) => void navigate({ search: updater }),
  );
}
