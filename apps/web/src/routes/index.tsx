import { GamesQuerySchema } from '@only-must/shared';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';

import { DashboardLayout } from '@/components/dashboard-layout.tsx';
import DesktopFiltersSidebar from '@/components/desktop-filters-sidebar';
import Error from '@/components/error.tsx';
import GameCard from '@/components/game-card.tsx';
import { default as CardsGridSkeleton } from '@/components/grid-page-skeleton';
import MobileFiltersSheet from '@/components/mobile-filters-sheet.tsx';
import ActiveFilterChips from '@/features/games/components/active-filter-chips.tsx';
import EmptyState from '@/features/games/components/empty-state.tsx';
import { GameList } from '@/features/games/components/game-list.tsx';
import GamesFilterPanel from '@/features/games/components/games-filters-panel.tsx';
import GamesPagination from '@/features/games/components/games-pagination.tsx';
import { GamesToolbar } from '@/features/games/components/games-toolbar.tsx';
import { useViewMode } from '@/features/games/hooks/use-view-mode.ts';
import {
  gamesDurationRangeQueryOptions,
  gamesQueryOptions,
} from '@/features/games/queries/games.query.ts';
import { isDurationSort, isFiltersActive } from '@/features/games/utils/games-filter.utils.ts';
import { genresQueryOptions } from '@/features/genres/queries/genres.query.ts';
import { platformsQueryOptions } from '@/features/platforms/queries/platforms.query';
import { getViewModeServFn } from '@/lib/view-mode.ts';
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
    const [[gamesData], viewMode] = await Promise.all([
      Promise.all([
        queryClient.ensureQueryData(gamesQueryOptions(deps)),
        queryClient.prefetchQuery(platformsQueryOptions()),
        queryClient.prefetchQuery(genresQueryOptions()),
        queryClient.prefetchQuery(gamesDurationRangeQueryOptions()),
      ]),
      getViewModeServFn(),
    ]);
    return { ...gamesData, viewMode };
  },
  pendingComponent: () => <CardsGridSkeleton />,
  component: App,
  errorComponent: ({ error, reset }) => <Error error={error} reset={reset} />,
});

function App() {
  const {
    data,
    meta: { page, total, totalPages, hasNext, hasPrev },
    viewMode: initialViewMode,
  } = Route.useLoaderData();
  const search = Route.useSearch();
  const { mode: viewMode, setMode: setViewMode } = useViewMode(initialViewMode);

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

  const pageOffset = (page - 1) * 24;

  return (
    <div className="container py-8">
      <header className="mbe-6">
        <h1 className="text-foreground text-2xl font-semibold lg:text-3xl">
          Must Play Games of All Time
        </h1>
        <p className="text-muted-foreground mbs-1 text-base">
          Find your next game for any platform. Filter by platform, genre, or release year.
        </p>
      </header>

      <DashboardLayout
        sidebar={
          <DesktopFiltersSidebar>
            <GamesFilterPanel />
          </DesktopFiltersSidebar>
        }
      >
        <GamesToolbar
          total={total}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          mobileFiltersSlot={
            <MobileFiltersSheet>
              <GamesFilterPanel />
            </MobileFiltersSheet>
          }
        />

        <ActiveFilterChips />

        {data.length === 0 ? (
          <EmptyState hasFilters={isFiltersActive(search)} />
        ) : viewMode === 'list' ? (
          <div className="mbs-4">
            <GameList
              games={data}
              pageOffset={pageOffset}
              showDuration={isDurationSort(search.sort)}
            />
          </div>
        ) : (
          <div className="mbs-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.map((game, index) => (
              <GameCard
                key={game.id}
                game={game}
                index={pageOffset + index}
                showDuration={isDurationSort(search.sort)}
              />
            ))}
          </div>
        )}

        <GamesPagination page={page} totalPages={totalPages} hasNext={hasNext} hasPrev={hasPrev} />
      </DashboardLayout>
    </div>
  );
}
