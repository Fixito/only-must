import { useQuery } from '@tanstack/react-query';

import { gamesDurationRangeQueryOptions } from '@/features/games/queries/games.query.ts';
import {
  MIN_PLAYTIME_FALLBACK,
  PLAYTIME_FALLBACK,
} from '@/features/games/utils/games-filter.utils.ts';

export function usePlaytimeBounds() {
  const { data: durationRange } = useQuery(gamesDurationRangeQueryOptions());
  return {
    min: durationRange?.minMainStoryHours ?? MIN_PLAYTIME_FALLBACK,
    max: durationRange?.maxMainStoryHours ?? PLAYTIME_FALLBACK,
  };
}
