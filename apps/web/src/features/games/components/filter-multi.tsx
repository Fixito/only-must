// features/games/components/filter-multi.tsx

import { useNavigate } from '@tanstack/react-router';

interface FilterMultiProps {
  label: string;
  options: Array<{ id: string; name: string }>;
  value?: Array<string>;
  param: 'platforms' | 'genres';
}

export function FilterMulti({ label, options, value = [], param }: FilterMultiProps) {
  const navigate = useNavigate();

  const toggle = (id: string) => {
    void navigate({
      from: '/',
      search: (prev) => {
        const current = prev[param] ?? [];

        const currentSet = new Set(current);
        if (currentSet.has(id)) {
          currentSet.delete(id);
        } else {
          currentSet.add(id);
        }
        const next = Array.from(currentSet).sort();

        return {
          ...prev,
          [param]: next.length ? next : undefined,
          page: 1,
        };
      },
    });
  };

  return (
    <fieldset>
      <legend className="text-muted-foreground mbe-4 text-xs font-medium tracking-widest uppercase">
        {label}
      </legend>

      <div className="mbs-3 space-y-1">
        {options.map((opt) => {
          const checked = value.includes(opt.id);

          return (
            <label key={opt.id} className="flex items-center gap-2">
              <input type="checkbox" checked={checked} onChange={() => toggle(opt.id)} />
              <span>{opt.name}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
