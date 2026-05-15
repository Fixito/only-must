import type { Genre, Platform } from '@only-must/shared';
import { useNavigate } from '@tanstack/react-router';

import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Label } from '@/components/ui/label.tsx';
import { Slider } from '@/components/ui/slider.tsx';
import { FilterMulti } from '@/features/games/components/filter-multi.tsx';

interface GamesFilterPanelProps {
  search: {
    platforms: Array<string>;
    genres: Array<string>;
    releaseYearMin?: number;
    releaseYearMax?: number;
    playtimeMin?: number;
    playtimeMax?: number;
    search?: string;
  };
  platforms: Array<Platform> | { data: Array<Platform> };
  genres: Array<Genre> | { data: Array<Genre> };
  minYear: number;
  currentYear: number;
  value: [number, number];
  minPlaytime: number;
  maxPlaytime: number;
  playtimeValue: [number, number];
  setValue: (value: [number, number]) => void;
  commit: (value: [number, number]) => void;
  setPlaytimeValue: (value: [number, number]) => void;
  commitPlaytime: (value: [number, number]) => void;
  clampRange: (value: [number, number], min: number, max: number) => [number, number];
}

export default function GamesFilterPanel({
  search,
  platforms,
  genres,
  minYear,
  currentYear,
  value,
  minPlaytime,
  maxPlaytime,
  playtimeValue,
  setValue,
  commit,
  setPlaytimeValue,
  commitPlaytime,
  clampRange,
}: GamesFilterPanelProps) {
  const navigate = useNavigate();

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
              disabled={
                !search.platforms.length &&
                !search.genres.length &&
                !search.releaseYearMin &&
                !search.releaseYearMax &&
                search.playtimeMin === undefined &&
                search.playtimeMax === undefined &&
                !search.search
              }
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
        options={Array.isArray(platforms) ? platforms : (platforms?.data ?? [])}
        value={search.platforms}
      />

      <FilterMulti
        label="Genres"
        param="genres"
        options={Array.isArray(genres) ? genres : (genres?.data ?? [])}
        value={search.genres}
      />
    </>
  );
}
