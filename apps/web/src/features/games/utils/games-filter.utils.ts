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
  if (min && max) return `${min}–${max}`;
  if (min) return `${min}–`;
  return `–${max}`;
}

export function formatPlaytimeRangeLabel(
  min: number | undefined,
  max: number | undefined,
  fallbacks: { min: number; max: number },
): string {
  return `${min ?? fallbacks.min}h–${max ?? fallbacks.max}h`;
}
