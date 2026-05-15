import type { Genre, Platform } from '@only-must/shared';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearch } from '@tanstack/react-router';

import FilterChip from '@/features/games/components/filter-chip.tsx';
import { usePlaytimeBounds } from '@/features/games/hooks/use-playtime-bounds.ts';
import {
  removePlaytimeRange,
  removeYearRange,
  toggleFilterValue,
} from '@/features/games/utils/games-filter.utils.ts';
import { genresQueryOptions } from '@/features/genres/queries/genres.query.ts';
import { platformsQueryOptions } from '@/features/platforms/queries/platforms.query';

export default function ActiveFilterChips() {
  const search = useSearch({ from: '/' });
  const navigate = useNavigate({ from: '/' });
  const { data: platforms } = useQuery(platformsQueryOptions());
  const { data: genres } = useQuery(genresQueryOptions());
  const { min: minPlaytime, max: maxPlaytime } = usePlaytimeBounds();

  const platformMap = Object.fromEntries(
    (platforms?.data ?? []).map((p: Platform) => [p.id, p.name]),
  );
  const genreMap = Object.fromEntries((genres?.data ?? []).map((g: Genre) => [g.id, g.name]));

  return (
    <div className="flex flex-wrap items-center gap-2">
      {search.platforms.map((p) => (
        <FilterChip
          key={p}
          label={platformMap[p] ?? p}
          onRemove={() => void navigate({ search: toggleFilterValue('platforms', p) })}
        />
      ))}

      {search.genres.map((g) => (
        <FilterChip
          key={g}
          label={genreMap[g] ?? g}
          onRemove={() => void navigate({ search: toggleFilterValue('genres', g) })}
        />
      ))}

      {search.releaseYearMin && search.releaseYearMax && (
        <FilterChip
          label={`${search.releaseYearMin}-${search.releaseYearMax}`}
          onRemove={() => void navigate({ search: removeYearRange })}
        />
      )}

      {(search.playtimeMin !== undefined || search.playtimeMax !== undefined) && (
        <FilterChip
          label={`${search.playtimeMin ?? minPlaytime}h–${search.playtimeMax ?? maxPlaytime}h`}
          onRemove={() => void navigate({ search: removePlaytimeRange })}
        />
      )}
    </div>
  );
}
