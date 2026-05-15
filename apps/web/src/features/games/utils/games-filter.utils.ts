import type { GamesQuery } from '@only-must/shared';

export const MIN_PLAYTIME_FALLBACK = 0;
export const PLAYTIME_FALLBACK = 250;

export const DEFAULT_SORT = 'metascore-desc' satisfies NonNullable<GamesQuery['sort']>;

export const SORT_OPTIONS: Array<{ label: string; value: NonNullable<GamesQuery['sort']> }> = [
  { label: 'Best rated', value: 'metascore-desc' },
  { label: 'Newest', value: 'release-desc' },
  { label: 'Oldest', value: 'release-asc' },
  { label: 'Shortest Duration', value: 'shortest-duration-asc' },
  { label: 'Longest Duration', value: 'longest-duration-desc' },
];

export function isFiltersActive(search: GamesQuery): boolean {
  return Boolean(
    search.search ||
    search.platforms.length ||
    search.genres.length ||
    search.releaseYearMin ||
    search.releaseYearMax ||
    search.playtimeMin !== undefined ||
    search.playtimeMax !== undefined,
  );
}
