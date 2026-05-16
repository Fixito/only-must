import FilterChip from '@/features/games/components/filter-chip.tsx';
import { useActiveFilterChips } from '@/features/games/hooks/use-active-filter-chips.ts';

export default function ActiveFilterChips() {
  const chips = useActiveFilterChips();

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map(({ key, label, onRemove }) => (
        <FilterChip key={key} label={label} onRemove={onRemove} />
      ))}
    </div>
  );
}
