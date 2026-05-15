import type { GamesQuery } from '@only-must/shared';

export const MIN_PLAYTIME_FALLBACK = 0;
export const PLAYTIME_FALLBACK = 250;

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
