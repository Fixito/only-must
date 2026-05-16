import { useQuery } from '@tanstack/react-query';

import { gamesDurationRangeQueryOptions } from '@/features/games/queries/games.query.ts';

// Fallback bounds (hours) shown while duration range is loading.
// The route loader prefetches this data, so the fallback is rarely visible.
const LOADING_MIN_HOURS = 0;
const LOADING_MAX_HOURS = 250;

export function usePlaytimeBounds() {
  const { data: durationRange } = useQuery(gamesDurationRangeQueryOptions());
  return {
    min: durationRange?.minMainStoryHours ?? LOADING_MIN_HOURS,
    max: durationRange?.maxMainStoryHours ?? LOADING_MAX_HOURS,
  };
}
