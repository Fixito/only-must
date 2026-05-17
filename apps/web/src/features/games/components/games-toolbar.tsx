import { LayoutGrid, List } from 'lucide-react';

import { Button } from '@/components/ui/button.tsx';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx';
import { useGamesNavigate, useGamesSearch } from '@/features/games/hooks/use-games-search.ts';
import type { ViewMode } from '@/features/games/hooks/use-view-mode.ts';
import { DEFAULT_SORT, SORT_OPTIONS } from '@/features/games/utils/games-filter.utils.ts';

interface GamesToolbarProps {
  total: number;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  mobileFiltersSlot?: React.ReactNode;
}

export function GamesToolbar({
  total,
  viewMode,
  onViewModeChange,
  mobileFiltersSlot,
}: GamesToolbarProps) {
  const search = useGamesSearch();
  const navigate = useGamesNavigate();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-4">
      <div className="flex items-center gap-3">
        {/* Mobile filter trigger slot */}
        {mobileFiltersSlot}

        <p className="text-muted-foreground text-sm">
          {total} {total === 1 ? 'game' : 'games'}
          {search.search ? ` for "${search.search}"` : ''}
        </p>
      </div>

      <div className="flex items-center gap-2">
        {/* Sort */}
        <Select
          items={SORT_OPTIONS}
          value={search.sort ?? DEFAULT_SORT}
          onValueChange={(v) => {
            void navigate({
              search: (prev) => ({
                ...prev,
                page: 1,
                sort: v || undefined,
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
              {SORT_OPTIONS.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* View toggle */}
        <fieldset className="flex" aria-label="View mode">
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'outline'}
            size="sm"
            className="rounded-r-none"
            aria-pressed={viewMode === 'grid'}
            onClick={() => onViewModeChange('grid')}
          >
            <LayoutGrid className="size-4" aria-hidden="true" />
            <span className="sr-only">Grid view</span>
          </Button>
          <Button
            variant={viewMode === 'list' ? 'secondary' : 'outline'}
            size="sm"
            className="-ms-px rounded-l-none"
            aria-pressed={viewMode === 'list'}
            onClick={() => onViewModeChange('list')}
          >
            <List className="size-4" aria-hidden="true" />
            <span className="sr-only">List view</span>
          </Button>
        </fieldset>
      </div>
    </div>
  );
}
