import type { Platform } from '@only-must/shared';
import { GamesQuerySchema } from '@only-must/shared';
import { useIsFetching, useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { ChevronDownIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import Error from '@/components/error.tsx';
import GameCard from '@/components/game-card.tsx';
import { default as CardsGridSkeleton } from '@/components/grid-page-skeleton';
import { Button } from '@/components/ui/button.tsx';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Label } from '@/components/ui/label.tsx';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Slider } from '@/components/ui/slider.tsx';
import EmptyState from '@/features/games/components/empty-state.tsx';
import FilterChip from '@/features/games/components/filter-chip.tsx';
import { FilterMulti } from '@/features/games/components/filter-multi.tsx';
import { gamesQueryOptions } from '@/features/games/queries/games.query.ts';
import { platformsQueryOptions } from '@/features/platforms/queries/platforms.query';
import { getPaginationItems } from '@/lib/pagination';
import { queryClient } from '@/router.tsx';

const currentYear = new Date().getFullYear();
const minYear = 1995;

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
  const search = Route.useSearch();
  const [value, setValue] = useState<[number, number]>(
    clampRange(
      [search.releaseYearMin ?? minYear, search.releaseYearMax ?? currentYear],
      minYear,
      currentYear,
    ),
  );
  const navigate = Route.useNavigate();
  const isFetching = useIsFetching() > 0;
  const platformMap = Object.fromEntries(
    (platforms?.data ?? []).map((p: Platform) => [p.id, p.name]),
  );

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

      <div className="container gap-6 md:grid-cols-[16rem_1fr] lg:grid">
        <aside>
          <Collapsible>
            <CollapsibleTrigger className="group w-full py-4">
              <Button
                variant="ghost"
                className="group-data-panel-open:bg-muted w-full justify-between text-sm font-medium"
              >
                Filters
                <ChevronDownIcon className="group-data-panel-open:rotate-180" />
              </Button>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <div className="border-t">
                <div className="pbs-4">
                  <fieldset>
                    <div className="flex items-center justify-between">
                      <legend className="text-foreground text-xs font-medium tracking-widest uppercase">
                        Release Year
                      </legend>

                      <Button
                        variant="ghost"
                        disabled={
                          !search.platforms.length &&
                          !search.releaseYearMin &&
                          !search.releaseYearMax &&
                          !search.search
                        }
                        className="disabled:cursor-not-allowed"
                        onClick={() =>
                          navigate({
                            search: {},
                          })
                        }
                      >
                        Reset filters
                      </Button>
                    </div>

                    <div className="mbs-4 w-full max-w-sm space-y-4">
                      {/* Slider */}
                      <Label htmlFor="release-year-range">
                        <span className="sr-only">Release year range</span>

                        <Slider
                          name="release-year-range"
                          id="release-year-range"
                          min={minYear}
                          max={currentYear}
                          step={1}
                          value={value}
                          onValueChange={(val) => {
                            if (Array.isArray(val) && val.length === 2) {
                              setValue(clampRange([val[0], val[1]], minYear, currentYear));
                            }
                          }}
                          onValueCommitted={(val) => {
                            if (Array.isArray(val) && val.length === 2) {
                              commit(clampRange([val[0], val[1]], minYear, currentYear));
                            }
                          }}
                        />
                      </Label>

                      {/* Inputs */}
                      <div className="mbs-4 flex items-center justify-between gap-2">
                        {/* Min */}
                        <label htmlFor="release-year-min" className="sr-only">
                          Release year min
                        </label>

                        <Input
                          type="number"
                          id="release-year-min"
                          value={value[0]}
                          tabIndex={-1}
                          readOnly
                          className="pointer-events-none field-sizing-content w-auto"
                        />

                        {/* Max */}
                        <label htmlFor="release-year-max" className="sr-only">
                          Release year max
                        </label>

                        <Input
                          type="number"
                          id="release-year-max"
                          value={value[1]}
                          tabIndex={-1}
                          readOnly
                          className="pointer-events-none field-sizing-content w-auto"
                        />
                      </div>
                    </div>
                  </fieldset>
                </div>

                <FilterMulti
                  label="Platforms"
                  param="platforms"
                  options={Array.isArray(platforms) ? platforms : (platforms?.data ?? [])}
                  value={search.platforms}
                />
              </div>
            </CollapsibleContent>
          </Collapsible>
        </aside>

        <section className="pbs-4">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground font-light">
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
          </div>

          {data.length === 0 ? (
            <EmptyState
              hasFilters={Boolean(
                search.search ||
                search.platforms.length ||
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
