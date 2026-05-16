import { useIsFetching } from '@tanstack/react-query';

import { gamesQueryOptions } from '@/features/games/queries/games.query.ts';

export function useIsGamesFetching(): boolean {
  return useIsFetching({ queryKey: gamesQueryOptions().queryKey.slice(0, 1) }) > 0;
}
