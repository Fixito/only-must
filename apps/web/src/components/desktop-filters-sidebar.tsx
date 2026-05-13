import { ChevronDownIcon } from 'lucide-react';

import { Button } from '@/components/ui/button.tsx';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible.tsx';

export default function DesktopFiltersSidebar({ children }: { children: React.ReactNode }) {
  return (
    <aside className="hidden lg:block">
      <Collapsible>
        <div className="py-4">
          <CollapsibleTrigger
            className="group"
            render={
              <Button
                variant="ghost"
                className="group-data-panel-open:bg-muted w-full justify-between text-sm font-medium"
              >
                Filters
                <ChevronDownIcon className="group-data-panel-open:rotate-180" />
              </Button>
            }
          ></CollapsibleTrigger>
        </div>

        <CollapsibleContent>
          <div className="border-t">{children}</div>
        </CollapsibleContent>
      </Collapsible>
    </aside>
  );
}
