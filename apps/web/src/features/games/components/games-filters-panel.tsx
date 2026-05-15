import { useId } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearch } from '@tanstack/react-router';

import { Button } from '@/components/ui/button.tsx';
import { FilterMulti } from '@/features/games/components/filter-multi.tsx';
import { RangeFilterField } from '@/features/games/components/range-filter-field.tsx';
import { usePlaytimeBounds } from '@/features/games/hooks/use-playtime-bounds.ts';
import { isFiltersActive, resetFilters } from '@/features/games/utils/games-filter.utils.ts';
import { genresQueryOptions } from '@/features/genres/queries/genres.query.ts';
import { platformsQueryOptions } from '@/features/platforms/queries/platforms.query';

const MIN_YEAR = 1995;
const CURRENT_YEAR = new Date().getFullYear();

export default function GamesFilterPanel() {
  const releaseYearRangeId = useId();
  const playtimeRangeId = useId();
  const search = useSearch({ from: '/' });
  const navigate = useNavigate({ from: '/' });
  const { data: platformsResponse } = useQuery(platformsQueryOptions());
  const { data: genresResponse } = useQuery(genresQueryOptions());
  const { min: minPlaytime, max: maxPlaytime } = usePlaytimeBounds();
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
              onClick={() => void navigate({ search: resetFilters })}
            >
              Reset filters
            </Button>
          </div>

          <RangeFilterField
            id={releaseYearRangeId}
            label="Release year range"
            min={MIN_YEAR}
            max={CURRENT_YEAR}
            urlMin={search.releaseYearMin}
            urlMax={search.releaseYearMax}
            onCommit={([min, max]) => {
              const isFullRange = min === MIN_YEAR && max === CURRENT_YEAR;
              void navigate({
                search: (prev) => ({
                  ...prev,
                  releaseYearMin: isFullRange ? undefined : min,
                  releaseYearMax: isFullRange ? undefined : max,
                  page: 1,
                }),
              });
            }}
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
            id={playtimeRangeId}
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
