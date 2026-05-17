import { EARLIEST_RELEASE_YEAR, LATEST_RELEASE_YEAR } from '@only-must/shared';
import type { GamesQuery } from '@only-must/shared';

export const DEFAULT_SORT = 'metascore-desc' satisfies NonNullable<GamesQuery['sort']>;

export const SORT_OPTIONS: Array<{ label: string; value: NonNullable<GamesQuery['sort']> }> = [
  { label: 'Best rated', value: 'metascore-desc' },
  { label: 'Newest', value: 'release-desc' },
  { label: 'Oldest', value: 'release-asc' },
  { label: 'Shortest Duration', value: 'shortest-duration-asc' },
  { label: 'Longest Duration', value: 'longest-duration-desc' },
];

export const toggleFilterValue =
  (param: 'platforms' | 'genres', id: string) => (prev: GamesQuery) => {
    const currentSet = new Set(prev[param]);
    if (currentSet.has(id)) {
      currentSet.delete(id);
    } else {
      currentSet.add(id);
    }
    const next = Array.from(currentSet).toSorted();
    return { ...prev, [param]: next.length ? next : undefined, page: 1 };
  };

export const resetFilters = (prev: GamesQuery) => ({
  ...prev,
  platforms: undefined,
  genres: undefined,
  releaseYearMin: undefined,
  releaseYearMax: undefined,
  playtimeMin: undefined,
  playtimeMax: undefined,
  search: undefined,
  page: 1,
});

export const removeYearRange = (prev: GamesQuery) => ({
  ...prev,
  releaseYearMin: undefined,
  releaseYearMax: undefined,
  page: 1,
});

export const removePlaytimeRange = (prev: GamesQuery) => ({
  ...prev,
  playtimeMin: undefined,
  playtimeMax: undefined,
  page: 1,
});

export const commitYearRange =
  ([min, max]: [number, number]) =>
  (prev: GamesQuery): GamesQuery => {
    const isFullRange = min === EARLIEST_RELEASE_YEAR && max === LATEST_RELEASE_YEAR;
    return {
      ...prev,
      releaseYearMin: isFullRange ? undefined : min,
      releaseYearMax: isFullRange ? undefined : max,
      page: 1,
    };
  };

export const commitPlaytimeRange =
  ([min, max]: [number, number], bounds: { min: number; max: number }) =>
  (prev: GamesQuery): GamesQuery => {
    const isFullRange = min === bounds.min && max === bounds.max;
    return {
      ...prev,
      playtimeMin: isFullRange ? undefined : min,
      playtimeMax: isFullRange ? undefined : max,
      page: 1,
    };
  };

export function isFiltersActive(search: GamesQuery): boolean {
  return Boolean(
    search.search ||
    search.platforms?.length ||
    search.genres?.length ||
    search.releaseYearMin ||
    search.releaseYearMax ||
    search.playtimeMin !== undefined ||
    search.playtimeMax !== undefined,
  );
}

export function formatYearRangeLabel(min: number | undefined, max: number | undefined): string {
  if (min !== undefined && max !== undefined) return `${min}–${max}`;
  if (min !== undefined) return `${min}–`;
  if (max !== undefined) return `–${max}`;
  return '';
}

export function formatPlaytimeRangeLabel(
  min: number | undefined,
  max: number | undefined,
  fallbacks: { min: number; max: number },
): string {
  return `${min ?? fallbacks.min}h–${max ?? fallbacks.max}h`;
}

export interface FilterChipItem {
  key: string;
  label: string;
  onRemove: () => void;
}

type SearchUpdater = (prev: GamesQuery) => GamesQuery;

export function buildFilterChips(
  search: GamesQuery,
  platformMap: Record<string, string>,
  genreMap: Record<string, string>,
  playtimeBounds: { min: number; max: number },
  onNavigate: (updater: SearchUpdater) => void,
): Array<FilterChipItem> {
  const chips: Array<FilterChipItem> = [];

  for (const p of search.platforms) {
    chips.push({
      key: `platform-${p}`,
      label: platformMap[p] ?? p,
      onRemove: () => onNavigate(toggleFilterValue('platforms', p)),
    });
  }

  for (const g of search.genres) {
    chips.push({
      key: `genre-${g}`,
      label: genreMap[g] ?? g,
      onRemove: () => onNavigate(toggleFilterValue('genres', g)),
    });
  }

  if (search.releaseYearMin || search.releaseYearMax) {
    chips.push({
      key: 'year-range',
      label: formatYearRangeLabel(search.releaseYearMin, search.releaseYearMax),
      onRemove: () => onNavigate(removeYearRange),
    });
  }

  if (search.playtimeMin !== undefined || search.playtimeMax !== undefined) {
    chips.push({
      key: 'playtime-range',
      label: formatPlaytimeRangeLabel(search.playtimeMin, search.playtimeMax, playtimeBounds),
      onRemove: () => onNavigate(removePlaytimeRange),
    });
  }

  return chips;
}
