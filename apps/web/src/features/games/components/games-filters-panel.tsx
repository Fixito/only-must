import { useNavigate, useSearch } from '@tanstack/react-router';
import { useId } from 'react';

import { Button } from '@/components/ui/button.tsx';
import { GenresFilter } from '@/features/games/components/genres-filter.tsx';
import { PlatformsFilter } from '@/features/games/components/platforms-filter.tsx';
import { RangeFilterField } from '@/features/games/components/range-filter-field.tsx';
import { usePlaytimeBounds } from '@/features/games/hooks/use-playtime-bounds.ts';
import { isFiltersActive, resetFilters } from '@/features/games/utils/games-filter.utils.ts';

const MIN_YEAR = 1995;
const CURRENT_YEAR = new Date().getFullYear();

export default function GamesFilterPanel() {
  const releaseYearRangeId = useId();
  const playtimeRangeId = useId();
  const search = useSearch({ from: '/' });
  const navigate = useNavigate({ from: '/' });
  const { min: minPlaytime, max: maxPlaytime } = usePlaytimeBounds();

  return (
    <>
      <div className="flex items-center justify-between border-b py-3">
        <span className="text-foreground text-sm font-medium">Filters</span>
        <Button
          variant="ghost"
          size="sm"
          disabled={!isFiltersActive(search)}
          className="disabled:cursor-not-allowed"
          onClick={() => void navigate({ search: resetFilters })}
        >
          Reset
        </Button>
      </div>

      <div className="pbs-4">
        <fieldset>
          <legend className="text-foreground text-xs font-medium tracking-widest uppercase">
            Release Year
          </legend>

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
          <legend className="text-foreground text-xs font-medium tracking-widest uppercase">
            Playtime
          </legend>

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
            formatValue={(v) => `${v} h`}
          />
        </fieldset>
      </div>

      <PlatformsFilter />

      <GenresFilter />
    </>
  );
}
