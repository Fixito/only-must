import { useNavigate } from '@tanstack/react-router';
import { ChevronDownIcon } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button.tsx';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible.tsx';

const VISIBLE_COUNT = 5;

interface FilterMultiProps {
  label: string;
  options: Array<{ id: string; name: string }>;
  value?: Array<string>;
  param: 'platforms' | 'genres';
}

export function FilterMulti({ label, options, value = [], param }: FilterMultiProps) {
  const [open, setOpen] = useState(false);
  const visible = options.slice(0, VISIBLE_COUNT);
  const hidden = options.slice(VISIBLE_COUNT);
  const navigate = useNavigate();

  const toggle = (id: string) => {
    void navigate({
      from: '/',
      search: (prev) => {
        const current = prev[param];

        const currentSet = new Set(current);

        if (currentSet.has(id)) {
          currentSet.delete(id);
        } else {
          currentSet.add(id);
        }
        const next = Array.from(currentSet).toSorted();

        return {
          ...prev,
          [param]: next.length ? next : undefined,
          page: 1,
        };
      },
    });
  };

  return (
    <div className="mbs-4 border-t pbs-4">
      <fieldset>
        <legend className="text-foreground text-xs font-medium tracking-widest uppercase">
          {label}
        </legend>

        <div className="mbs-4 space-y-1">
          {visible.map((opt) => {
            const checked = value.includes(opt.id);

            return (
              <label key={opt.id} className="flex items-center gap-2">
                <input type="checkbox" checked={checked} onChange={() => toggle(opt.id)} />
                <span>{opt.name}</span>
              </label>
            );
          })}

          {hidden.length > 0 && (
            <Collapsible open={open} onOpenChange={setOpen}>
              <CollapsibleContent>
                <div className="space-y-1">
                  {hidden.map((opt) => {
                    const checked = value.includes(opt.id);
                    return (
                      <label key={opt.id} className="flex items-center gap-2">
                        <input type="checkbox" checked={checked} onChange={() => toggle(opt.id)} />
                        <span>{opt.name}</span>
                      </label>
                    );
                  })}
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
