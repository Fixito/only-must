import { ChevronDownIcon } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button.tsx';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible.tsx';
import { useGamesNavigate } from '@/features/games/hooks/use-games-search.ts';
import { toggleFilterValue } from '@/features/games/utils/games-filter.utils.ts';

const VISIBLE_COUNT = 5;

interface FacetMultiSelectProps {
  label: string;
  options: Array<{ id: string; name: string }>;
  value?: Array<string>;
  param: 'platforms' | 'genres';
}

interface FacetOptionProps {
  opt: { id: string; name: string };
  checked: boolean;
  onChange: () => void;
}

function FacetOption({ opt, checked, onChange }: FacetOptionProps) {
  return (
    <label className="flex items-center gap-2">
      <input type="checkbox" checked={checked} aria-label={opt.name} onChange={onChange} />
      <span>{opt.name}</span>
    </label>
  );
}

export function FacetMultiSelect({ label, options, value = [], param }: FacetMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const visible = options.slice(0, VISIBLE_COUNT);
  const hidden = options.slice(VISIBLE_COUNT);
  const navigate = useGamesNavigate();

  function handleToggle(id: string) {
    void navigate({ search: toggleFilterValue(param, id) });
  }

  return (
    <div className="mbs-4 border-t pbs-4">
      <fieldset>
        <legend className="text-foreground text-xs font-medium tracking-widest uppercase">
          {label}
        </legend>

        <div className="mbs-4 space-y-1">
          {visible.map((opt) => (
            <FacetOption
              key={opt.id}
              opt={opt}
              checked={value.includes(opt.id)}
              onChange={() => handleToggle(opt.id)}
            />
          ))}

          {hidden.length > 0 && (
            <Collapsible open={open} onOpenChange={setOpen}>
              <CollapsibleContent>
                <div className="space-y-1">
                  {hidden.map((opt) => (
                    <FacetOption
                      key={opt.id}
                      opt={opt}
                      checked={value.includes(opt.id)}
                      onChange={() => handleToggle(opt.id)}
                    />
                  ))}
                </div>
              </CollapsibleContent>

              <CollapsibleTrigger
                render={
                  <Button
                    variant="ghost"
                    className="text-muted-foreground mbs-2 h-auto gap-1 p-0 text-xs"
                  >
                    <ChevronDownIcon
                      className={`size-3 transition-transform ${open ? 'rotate-180' : ''}`}
                    />
                    {open ? 'Show less' : `${hidden.length} more...`}
                  </Button>
                }
              ></CollapsibleTrigger>
            </Collapsible>
          )}
        </div>
      </fieldset>
    </div>
  );
}
