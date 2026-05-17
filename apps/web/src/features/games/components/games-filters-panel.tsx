import { EARLIEST_RELEASE_YEAR, LATEST_RELEASE_YEAR } from '@only-must/shared';
import { useId } from 'react';

import { Button } from '@/components/ui/button.tsx';
import { GenresFilter } from '@/features/games/components/genres-filter.tsx';
import { PlatformsFilter } from '@/features/games/components/platforms-filter.tsx';
import { RangeFilterField } from '@/features/games/components/range-filter-field.tsx';
import { useGamesNavigate, useGamesSearch } from '@/features/games/hooks/use-games-search.ts';
import { usePlaytimeBounds } from '@/features/games/hooks/use-playtime-bounds.ts';
import {
  commitPlaytimeRange,
  commitYearRange,
  isFiltersActive,
  resetFilters,
} from '@/features/games/utils/games-filter.utils.ts';

export default function GamesFilterPanel() {
  const releaseYearRangeId = useId();
  const playtimeRangeId = useId();
  const search = useGamesSearch();
  const navigate = useGamesNavigate();
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
            min={EARLIEST_RELEASE_YEAR}
            max={LATEST_RELEASE_YEAR}
            urlMin={search.releaseYearMin}
            urlMax={search.releaseYearMax}
            onCommit={([min, max]) => void navigate({ search: commitYearRange([min, max]) })}
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
            onCommit={([min, max]) =>
              void navigate({
                search: commitPlaytimeRange([min, max], { min: minPlaytime, max: maxPlaytime }),
              })
            }
            formatValue={(v) => `${v} h`}
          />
        </fieldset>
      </div>

      <PlatformsFilter />

      <GenresFilter />
    </>
  );
}
