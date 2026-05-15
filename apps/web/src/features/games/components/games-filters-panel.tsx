import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearch } from '@tanstack/react-router';

import { Button } from '@/components/ui/button.tsx';
import { FilterMulti } from '@/features/games/components/filter-multi.tsx';
import { RangeFilterField } from '@/features/games/components/range-filter-field.tsx';
import { gamesDurationRangeQueryOptions } from '@/features/games/queries/games.query.ts';
import {
  isFiltersActive,
  MIN_PLAYTIME_FALLBACK,
  PLAYTIME_FALLBACK,
} from '@/features/games/utils/games-filter.utils.ts';
import { genresQueryOptions } from '@/features/genres/queries/genres.query.ts';
import { platformsQueryOptions } from '@/features/platforms/queries/platforms.query';

const MIN_YEAR = 1995;
const CURRENT_YEAR = new Date().getFullYear();

export default function GamesFilterPanel() {
  const search = useSearch({ from: '/' });
  const navigate = useNavigate({ from: '/' });
  const { data: platformsResponse } = useQuery(platformsQueryOptions());
  const { data: genresResponse } = useQuery(genresQueryOptions());
  const { data: durationRange } = useQuery(gamesDurationRangeQueryOptions());

  const maxPlaytime = durationRange?.maxMainStoryHours ?? PLAYTIME_FALLBACK;
  const minPlaytime = durationRange?.minMainStoryHours ?? MIN_PLAYTIME_FALLBACK;
  const platforms = platformsResponse?.data ?? [];
  const genres = genresResponse?.data ?? [];

  return (
    <>
      <div className="pbs-4">
        <fieldset>
          <div className="flex items-center justify-between">
            <legend className="text-foreground text-xs font-medium tracking-widest uppercase">
              Release Year
            </legend>

            <Button
              variant="ghost"
              disabled={!isFiltersActive(search)}
              className="disabled:cursor-not-allowed"
              onClick={() =>
                navigate({
                  to: '.',
                  search: {
                    platforms: undefined,
                    genres: undefined,
                    releaseYearMin: undefined,
                    releaseYearMax: undefined,
                    playtimeMin: undefined,
                    playtimeMax: undefined,
                    search: undefined,
                  },
                })
              }
            >
              Reset filters
            </Button>
          </div>

          <RangeFilterField
            id="release-year-range"
            label="Release year range"
            min={MIN_YEAR}
            max={CURRENT_YEAR}
            urlMin={search.releaseYearMin}
            urlMax={search.releaseYearMax}
            onCommit={([min, max]) =>
              void navigate({
                search: (prev) => ({
                  ...prev,
                  releaseYearMin: min,
                  releaseYearMax: max,
                  page: 1,
                }),
              })
            }
          />
        </fieldset>
      </div>

      <div className="mbs-4 border-t pbs-4">
        <fieldset>
          <div className="flex items-center justify-between">
            <legend className="text-foreground text-xs font-medium tracking-widest uppercase">
              Playtime
            </legend>
          </div>

          <RangeFilterField
            id="playtime-range"
            label="Playtime range"
            min={minPlaytime}
            max={maxPlaytime}
            urlMin={search.playtimeMin}
            urlMax={search.playtimeMax}
            onCommit={([min, max]) => {
              const isFullRange = min === minPlaytime && max === maxPlaytime;
              void navigate({
                search: (prev) => ({
                  ...prev,
                  playtimeMin: isFullRange ? undefined : min,
                  playtimeMax: isFullRange ? undefined : max,
                  page: 1,
                }),
              });
            }}
            formatValue={(v) => `${v}h`}
          />
        </fieldset>
      </div>

      <FilterMulti
        label="Platforms"
        param="platforms"
        options={platforms}
        value={search.platforms}
      />

      <FilterMulti label="Genres" param="genres" options={genres} value={search.genres} />
    </>
  );
}
