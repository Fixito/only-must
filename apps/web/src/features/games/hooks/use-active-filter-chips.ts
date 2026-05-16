import type { Genre, Platform } from '@only-must/shared';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearch } from '@tanstack/react-router';

import { usePlaytimeBounds } from '@/features/games/hooks/use-playtime-bounds.ts';
import {
  removePlaytimeRange,
  removeYearRange,
  toggleFilterValue,
} from '@/features/games/utils/games-filter.utils.ts';
import { genresQueryOptions } from '@/features/genres/queries/genres.query.ts';
import { platformsQueryOptions } from '@/features/platforms/queries/platforms.query';

export interface FilterChipItem {
  key: string;
  label: string;
  onRemove: () => void;
}

export function useActiveFilterChips(): Array<FilterChipItem> {
  const search = useSearch({ from: '/' });
  const navigate = useNavigate({ from: '/' });
  const { data: platforms } = useQuery(platformsQueryOptions());
  const { data: genres } = useQuery(genresQueryOptions());
  const { min: minPlaytime, max: maxPlaytime } = usePlaytimeBounds();

  const platformMap = Object.fromEntries(
    (platforms?.data ?? []).map((p: Platform) => [p.id, p.name]),
  );
  const genreMap = Object.fromEntries((genres?.data ?? []).map((g: Genre) => [g.id, g.name]));

  const chips: Array<FilterChipItem> = [];

  for (const p of search.platforms) {
    chips.push({
      key: `platform-${p}`,
      label: platformMap[p] ?? p,
      onRemove: () => void navigate({ search: toggleFilterValue('platforms', p) }),
    });
  }

  for (const g of search.genres) {
    chips.push({
      key: `genre-${g}`,
      label: genreMap[g] ?? g,
      onRemove: () => void navigate({ search: toggleFilterValue('genres', g) }),
    });
  }

  if (search.releaseYearMin || search.releaseYearMax) {
    const label =
      search.releaseYearMin && search.releaseYearMax
        ? `${search.releaseYearMin}-${search.releaseYearMax}`
        : search.releaseYearMin
          ? `${search.releaseYearMin}-`
          : `-${search.releaseYearMax}`;
    chips.push({
      key: 'year-range',
      label,
      onRemove: () => void navigate({ search: removeYearRange }),
    });
  }

  if (search.playtimeMin !== undefined || search.playtimeMax !== undefined) {
    chips.push({
      key: 'playtime-range',
      label: `${search.playtimeMin ?? minPlaytime}h–${search.playtimeMax ?? maxPlaytime}h`,
      onRemove: () => void navigate({ search: removePlaytimeRange }),
    });
  }

  return chips;
}
