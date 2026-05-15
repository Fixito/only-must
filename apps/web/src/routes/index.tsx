import type { Genre, Platform } from '@only-must/shared';
import { GamesQuerySchema } from '@only-must/shared';
import { useIsFetching, useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';

import DesktopFiltersSidebar from '@/components/desktop-filters-sidebar';
import Error from '@/components/error.tsx';
import GameCard from '@/components/game-card.tsx';
import { default as CardsGridSkeleton } from '@/components/grid-page-skeleton';
import MobileFiltersSheet from '@/components/mobile-filters-sheet.tsx';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx';
import EmptyState from '@/features/games/components/empty-state.tsx';
import FilterChip from '@/features/games/components/filter-chip.tsx';
import GamesFilterPanel from '@/features/games/components/games-filters-panel.tsx';
import {
  gamesDurationRangeQueryOptions,
  gamesQueryOptions,
} from '@/features/games/queries/games.query.ts';
import { genresQueryOptions } from '@/features/genres/queries/genres.query.ts';
import { platformsQueryOptions } from '@/features/platforms/queries/platforms.query';
import { getPaginationItems } from '@/lib/pagination';
import { queryClient } from '@/router.tsx';

const minPlaytimeFallback = 0;
const playtimeFallback = 250;

const items = [
  {
    label: 'Best rated',
    value: 'metascore-desc',
  },
  {
    label: 'Newest',
    value: 'release-desc',
  },
  {
    label: 'Oldest',
    value: 'release-asc',
  },
  {
    label: 'Shortest Duration',
    value: 'shortest-duration-asc',
  },
  {
    label: 'Longest Duration',
    value: 'longest-duration-desc',
  },
];

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
    await queryClient.prefetchQuery(platformsQueryOptions());
    await queryClient.prefetchQuery(genresQueryOptions());
    await queryClient.prefetchQuery(gamesDurationRangeQueryOptions());
    return await queryClient.ensureQueryData(gamesQueryOptions(deps));
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
  const { data: platforms } = useQuery(platformsQueryOptions());
  const { data: genres } = useQuery(genresQueryOptions());
  const { data: durationRange } = useQuery(gamesDurationRangeQueryOptions());
  const maxPlaytime = durationRange?.maxMainStoryHours ?? playtimeFallback;
  const minPlaytime = durationRange?.minMainStoryHours ?? minPlaytimeFallback;
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const isFetching = useIsFetching({ queryKey: gamesQueryOptions().queryKey.slice(0, 1) }) > 0;
  const platformMap = Object.fromEntries(
    (platforms?.data ?? []).map((p: Platform) => [p.id, p.name]),
  );
  const genreMap = Object.fromEntries((genres?.data ?? []).map((g: Genre) => [g.id, g.name]));

  const handleRemovePlatform = (platform: string) => {
    void navigate({
      search: (prev) => ({
        ...prev,
        platforms: prev.platforms.filter((p) => p !== platform),
        page: 1,
      }),
    });
  };

  const handleRemoveGenre = (genre: string) => {
    void navigate({
      search: (prev) => ({
        ...prev,
        genres: prev.genres.filter((g) => g !== genre),
        page: 1,
      }),
    });
  };

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

            <div className="flex flex-wrap items-center gap-2">
              {search.platforms.map((p) => (
                <FilterChip
                  key={p}
                  label={platformMap[p] ?? p}
                  onRemove={() => handleRemovePlatform(p)}
                />
              ))}

              {search.genres.map((g) => (
                <FilterChip
                  key={g}
                  label={genreMap[g] ?? g}
                  onRemove={() => handleRemoveGenre(g)}
                />
              ))}

              {search.releaseYearMin && search.releaseYearMax && (
                <FilterChip
                  label={`${search.releaseYearMin}-${search.releaseYearMax}`}
                  onRemove={() =>
                    navigate({
                      search: (prev) => ({
                        ...prev,
                        page: 1,
                        releaseYearMin: undefined,
                        releaseYearMax: undefined,
                      }),
                    })
                  }
                />
              )}

              {(search.playtimeMin !== undefined || search.playtimeMax !== undefined) && (
                <FilterChip
                  label={`${search.playtimeMin ?? minPlaytime}h–${search.playtimeMax ?? maxPlaytime}h`}
                  onRemove={() =>
                    navigate({
                      search: (prev) => ({
                        ...prev,
                        page: 1,
                        playtimeMin: undefined,
                        playtimeMax: undefined,
                      }),
                    })
                  }
                />
              )}
            </div>

            <div>
              <Select
                items={items}
                value={search.sort ?? 'metascore-desc'}
                onValueChange={(v) => {
                  void navigate({
                    search: (prev) => ({
                      ...prev,
                      page: 1,
                      sort: v as
                        | 'metascore-desc'
                        | 'release-asc'
                        | 'release-desc'
                        | 'shortest-duration-asc'
                        | 'longest-duration-desc'
                        | undefined,
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
                    {items.map((item) => (
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
            <EmptyState
              hasFilters={Boolean(
                search.search ||
                search.platforms.length ||
                search.genres.length ||
                search.releaseYearMin ||
                search.releaseYearMax ||
                search.playtimeMin !== undefined ||
                search.playtimeMax !== undefined,
              )}
            />
          ) : (
            <div className="mbs-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {data.map((game, index) => (
                <GameCard key={game.id} game={game} index={index} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mbs-8">
              <Pagination>
                <PaginationContent>
                  {hasPrev && (
                    <PaginationItem>
                      <PaginationPrevious
                        to="."
                        search={(prev) => ({
                          ...prev,
                          page: (prev.page ?? 1) - 1,
                        })}
                        preload="intent"
                        disabled={isFetching}
                      />
                    </PaginationItem>
                  )}

                  {getPaginationItems(page, totalPages).map((item, i) =>
                    item === 'ellipsis' ? (
                      <PaginationItem key={`ellipsis-${i}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={item}>
                        <PaginationLink
                          to="."
                          search={(prev) => ({ ...prev, page: item })}
                          isActive={page === item}
                          preload="intent"
                          disabled={isFetching}
                        >
                          {item}
                        </PaginationLink>
                      </PaginationItem>
                    ),
                  )}

                  {hasNext && (
                    <PaginationItem>
                      <PaginationNext
                        to="."
                        search={(prev) => ({
                          ...prev,
                          page: (prev.page ?? 1) + 1,
                        })}
                        preload="intent"
                        disabled={isFetching}
                      />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
