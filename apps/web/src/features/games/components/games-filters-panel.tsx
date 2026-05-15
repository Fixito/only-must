import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Label } from '@/components/ui/label.tsx';
import { Slider } from '@/components/ui/slider.tsx';
import { FilterMulti } from '@/features/games/components/filter-multi.tsx';
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

function clampRange(
  [min, max]: [number, number],
  minLimit: number,
  maxLimit: number,
): [number, number] {
  const clampedMin = Math.max(minLimit, Math.min(min, maxLimit));
  const clampedMax = Math.max(minLimit, Math.min(max, maxLimit));
  return [Math.min(clampedMin, clampedMax), Math.max(clampedMin, clampedMax)];
}

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

  const [yearValue, setYearValue] = useState<[number, number]>(
    clampRange(
      [search.releaseYearMin ?? MIN_YEAR, search.releaseYearMax ?? CURRENT_YEAR],
      MIN_YEAR,
      CURRENT_YEAR,
    ),
  );

  const [playtimeValue, setPlaytimeValue] = useState<[number, number]>(
    clampRange(
      [search.playtimeMin ?? minPlaytime, search.playtimeMax ?? maxPlaytime],
      minPlaytime,
      maxPlaytime,
    ),
  );

  useEffect(() => {
    setYearValue(
      clampRange(
        [search.releaseYearMin ?? MIN_YEAR, search.releaseYearMax ?? CURRENT_YEAR],
        MIN_YEAR,
        CURRENT_YEAR,
      ),
    );
  }, [search.releaseYearMin, search.releaseYearMax]);

  useEffect(() => {
    setPlaytimeValue(
      clampRange(
        [search.playtimeMin ?? minPlaytime, search.playtimeMax ?? maxPlaytime],
        minPlaytime,
        maxPlaytime,
      ),
    );
  }, [search.playtimeMin, search.playtimeMax, minPlaytime, maxPlaytime]);

  const commit = (next: [number, number]) => {
    const safe = clampRange(next, MIN_YEAR, CURRENT_YEAR);
    void navigate({
      search: (prev) => ({
        ...prev,
        releaseYearMin: safe[0],
        releaseYearMax: safe[1],
        page: 1,
      }),
    });
  };

  const commitPlaytime = (next: [number, number]) => {
    const safe = clampRange(next, minPlaytime, maxPlaytime);
    const isFullRange = safe[0] === minPlaytime && safe[1] === maxPlaytime;
    void navigate({
      search: (prev) => ({
        ...prev,
        playtimeMin: isFullRange ? undefined : safe[0],
        playtimeMax: isFullRange ? undefined : safe[1],
        page: 1,
      }),
    });
  };

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

          <div className="mbs-4 w-full max-w-sm space-y-4">
            {/* Slider */}
            <Label htmlFor="release-year-range">
              <span className="sr-only">Release year range</span>

              <Slider
                name="release-year-range"
                id="release-year-range"
                min={MIN_YEAR}
                max={CURRENT_YEAR}
                step={1}
                value={yearValue}
                onValueChange={(val) => {
                  if (Array.isArray(val) && val.length === 2) {
                    setYearValue(clampRange([val[0], val[1]], MIN_YEAR, CURRENT_YEAR));
                  }
                }}
                onValueCommitted={(val) => {
                  if (Array.isArray(val) && val.length === 2) {
                    commit(clampRange([val[0], val[1]], MIN_YEAR, CURRENT_YEAR));
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
                value={yearValue[0]}
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
                value={yearValue[1]}
                tabIndex={-1}
                readOnly
                className="pointer-events-none field-sizing-content w-auto"
              />
            </div>
          </div>
        </fieldset>
      </div>

      <div className="mbs-4 border-t pbs-4">
        <fieldset>
          <div className="flex items-center justify-between">
            <legend className="text-foreground text-xs font-medium tracking-widest uppercase">
              Playtime
            </legend>
          </div>

          <div className="mbs-4 w-full max-w-sm space-y-4">
            {/* Slider */}
            <Label htmlFor="playtime-range">
              <span className="sr-only">Playtime range</span>

              <Slider
                name="playtime-range"
                id="playtime-range"
                min={minPlaytime}
                max={maxPlaytime}
                step={1}
                value={playtimeValue}
                onValueChange={(val) => {
                  if (Array.isArray(val) && val.length === 2) {
                    setPlaytimeValue(clampRange([val[0], val[1]], minPlaytime, maxPlaytime));
                  }
                }}
                onValueCommitted={(val) => {
                  if (Array.isArray(val) && val.length === 2) {
                    commitPlaytime(clampRange([val[0], val[1]], minPlaytime, maxPlaytime));
                  }
                }}
              />
            </Label>

            {/* Inputs */}
            <div className="mbs-4 flex items-center justify-between gap-2">
              {/* Min */}
              <label htmlFor="playtime-min" className="sr-only">
                Playtime min
              </label>

              <Input
                type="text"
                id="playtime-min"
                value={`${playtimeValue[0]}h`}
                tabIndex={-1}
                readOnly
                className="pointer-events-none field-sizing-content w-auto"
              />

              {/* Max */}
              <label htmlFor="playtime-max" className="sr-only">
                Playtime max
              </label>

              <Input
                type="text"
                id="playtime-max"
                value={`${playtimeValue[1]}h`}
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
        options={platforms}
        value={search.platforms}
      />

      <FilterMulti label="Genres" param="genres" options={genres} value={search.genres} />
    </>
  );
}
