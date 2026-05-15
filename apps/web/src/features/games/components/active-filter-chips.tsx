import type { Genre, Platform } from '@only-must/shared';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearch } from '@tanstack/react-router';

import FilterChip from '@/features/games/components/filter-chip.tsx';
import { gamesDurationRangeQueryOptions } from '@/features/games/queries/games.query.ts';
import { genresQueryOptions } from '@/features/genres/queries/genres.query.ts';
import { platformsQueryOptions } from '@/features/platforms/queries/platforms.query';

const MIN_PLAYTIME_FALLBACK = 0;
const PLAYTIME_FALLBACK = 250;

export default function ActiveFilterChips() {
  const search = useSearch({ from: '/' });
  const navigate = useNavigate({ from: '/' });
  const { data: platforms } = useQuery(platformsQueryOptions());
  const { data: genres } = useQuery(genresQueryOptions());
  const { data: durationRange } = useQuery(gamesDurationRangeQueryOptions());

  const maxPlaytime = durationRange?.maxMainStoryHours ?? PLAYTIME_FALLBACK;
  const minPlaytime = durationRange?.minMainStoryHours ?? MIN_PLAYTIME_FALLBACK;

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

  return (
    <div className="flex flex-wrap items-center gap-2">
      {search.platforms.map((p) => (
        <FilterChip key={p} label={platformMap[p] ?? p} onRemove={() => handleRemovePlatform(p)} />
      ))}

      {search.genres.map((g) => (
        <FilterChip key={g} label={genreMap[g] ?? g} onRemove={() => handleRemoveGenre(g)} />
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
  );
}
