import { GamesQuerySchema } from '@only-must/shared';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';

import DesktopFiltersSidebar from '@/components/desktop-filters-sidebar';
import Error from '@/components/error.tsx';
import GameCard from '@/components/game-card.tsx';
import { default as CardsGridSkeleton } from '@/components/grid-page-skeleton';
import MobileFiltersSheet from '@/components/mobile-filters-sheet.tsx';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx';
import ActiveFilterChips from '@/features/games/components/active-filter-chips.tsx';
import EmptyState from '@/features/games/components/empty-state.tsx';
import GamesFilterPanel from '@/features/games/components/games-filters-panel.tsx';
import GamesPagination from '@/features/games/components/games-pagination.tsx';
import {
  gamesDurationRangeQueryOptions,
  gamesQueryOptions,
} from '@/features/games/queries/games.query.ts';
import {
  DEFAULT_SORT,
  isDurationSort,
  isFiltersActive,
  SORT_OPTIONS,
} from '@/features/games/utils/games-filter.utils.ts';
import { genresQueryOptions } from '@/features/genres/queries/genres.query.ts';
import { platformsQueryOptions } from '@/features/platforms/queries/platforms.query';
import { queryClient } from '@/router.tsx';

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'Must Play Games of All Time | OnlyMust' },
      {
        name: 'description',
        content:
          'Find your next game for any platform. Filter by platform, genre, or release year. OnlyMust curates the best games across all platforms and genres to help you find your next must play game.',
      },
    ],
  }),
  validateSearch: GamesQuerySchema,
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => {
    const [gamesData] = await Promise.all([
      queryClient.ensureQueryData(gamesQueryOptions(deps)),
      queryClient.prefetchQuery(platformsQueryOptions()),
      queryClient.prefetchQuery(genresQueryOptions()),
      queryClient.prefetchQuery(gamesDurationRangeQueryOptions()),
    ]);
    return gamesData;
  },
  pendingComponent: () => <CardsGridSkeleton />,
  component: App,
  errorComponent: ({ error, reset }) => <Error error={error} reset={reset} />,
});

function App() {
  const {
    data,
    meta: { page, total, totalPages, hasNext, hasPrev },
  } = Route.useLoaderData();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  useEffect(() => {
    if (hasNext) {
      void queryClient.prefetchQuery(
        gamesQueryOptions({
          ...search,
          page: page + 1,
        }),
      );
    }
  }, [page, search, hasNext]);

  return (
    <>
      <div className="container py-12">
        <h1 className="text-foreground text-2xl font-semibold lg:text-3xl">
          Must Play Games of All Time
        </h1>

        <p className="text-muted-foreground mbs-2 text-base">
          Find your next game for any platform. Filter by platform, genre, or release year.
        </p>
      </div>

      <MobileFiltersSheet>
        <GamesFilterPanel />
      </MobileFiltersSheet>

      <div className="container gap-6 lg:grid lg:grid-cols-[16rem_1fr]">
        <DesktopFiltersSidebar>
          <GamesFilterPanel />
        </DesktopFiltersSidebar>

        <section className="pbs-4">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <p className="text-muted-foreground text-sm font-light">
              {total} results {search.search && `for "${search.search}"`}
            </p>

            <ActiveFilterChips />

            <div>
              <Select
                items={SORT_OPTIONS}
                value={search.sort ?? DEFAULT_SORT}
                onValueChange={(v) => {
                  void navigate({
                    search: (prev) => ({
                      ...prev,
                      page: 1,
                      sort: v || undefined,
                    }),
                  });
                }}
              >
                <SelectTrigger aria-label="Sort by" className="w-45">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>

                <SelectContent alignItemWithTrigger={false}>
                  <SelectGroup>
                    <SelectLabel>Sort by</SelectLabel>
                    {SORT_OPTIONS.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          {data.length === 0 ? (
            <EmptyState hasFilters={isFiltersActive(search)} />
          ) : (
            <div className="mbs-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {data.map((game, index) => (
                <GameCard
                  key={game.id}
                  game={game}
                  index={index}
                  showDuration={isDurationSort(search.sort)}
                />
              ))}
            </div>
          )}

          <GamesPagination
            page={page}
            totalPages={totalPages}
            hasNext={hasNext}
            hasPrev={hasPrev}
          />
        </section>
      </div>
    </>
  );
}
