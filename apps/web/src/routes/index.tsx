import type { Genre, Platform } from '@only-must/shared';
import { GamesQuerySchema } from '@only-must/shared';
import { useIsFetching, useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

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
import { gamesQueryOptions } from '@/features/games/queries/games.query.ts';
import { genresQueryOptions } from '@/features/genres/queries/genres.query.ts';
import { platformsQueryOptions } from '@/features/platforms/queries/platforms.query';
import { getPaginationItems } from '@/lib/pagination';
import { queryClient } from '@/router.tsx';

const currentYear = new Date().getFullYear();
const minYear = 1995;

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

function clampRange(
  [min, max]: [number, number],
  minLimit: number,
  maxLimit: number,
): [number, number] {
  const clampedMin = Math.max(minLimit, Math.min(min, maxLimit));
  const clampedMax = Math.max(minLimit, Math.min(max, maxLimit));

  return [Math.min(clampedMin, clampedMax), Math.max(clampedMin, clampedMax)];
}

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
  const search = Route.useSearch();
  const [value, setValue] = useState<[number, number]>(
    clampRange(
      [search.releaseYearMin ?? minYear, search.releaseYearMax ?? currentYear],
      minYear,
      currentYear,
    ),
  );
  const navigate = Route.useNavigate();
  const isFetching = useIsFetching({ queryKey: gamesQueryOptions().queryKey.slice(0, 1) }) > 0;
  const platformMap = Object.fromEntries(
    (platforms?.data ?? []).map((p: Platform) => [p.id, p.name]),
  );
  const genreMap = Object.fromEntries((genres?.data ?? []).map((g: Genre) => [g.id, g.name]));

  const commit = (next: [number, number]) => {
    const safe = clampRange(next, minYear, currentYear);

    void navigate({
      search: (prev) => ({
        ...prev,
        releaseYearMin: safe[0],
        releaseYearMax: safe[1],
        page: 1,
      }),
    });
  };

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

  const gamesFilterPanelProps = {
    search: {
      platforms: search.platforms,
      genres: search.genres,
      ...(search.releaseYearMin !== undefined && {
        releaseYearMin: search.releaseYearMin,
      }),
      ...(search.releaseYearMax !== undefined && {
        releaseYearMax: search.releaseYearMax,
      }),
      ...(search.search !== undefined && { search: search.search }),
    },
    platforms: platforms ?? [],
    genres: genres ?? [],
    minYear,
    currentYear,
    value,
    setValue,
    commit,
    clampRange,
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

  useEffect(() => {
    setValue(
      clampRange(
        [search.releaseYearMin ?? minYear, search.releaseYearMax ?? currentYear],
        minYear,
        currentYear,
      ),
    );
  }, [search.releaseYearMin, search.releaseYearMax]);

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
        <GamesFilterPanel {...gamesFilterPanelProps} />
      </MobileFiltersSheet>

      <div className="container gap-6 lg:grid lg:grid-cols-[16rem_1fr]">
        <DesktopFiltersSidebar>
          <GamesFilterPanel {...gamesFilterPanelProps} />
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
                search.releaseYearMax,
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
