import { Funnel } from 'lucide-react';

import { Button } from '@/components/ui/button.tsx';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet.tsx';

export default function MobileFiltersSheet({ children }: { children: React.ReactNode }) {
  return (
    <div className="lg:hidden">
      <Sheet>
        <SheetTrigger
          render={
            <Button variant="outline">
              <Funnel data-icon="inline-start" />
              Filters
            </Button>
          }
        />

        <SheetContent>
          <SheetHeader>
            <SheetTitle className="sr-only">Filters</SheetTitle>
          </SheetHeader>

          <div className="no-scrollbar overflow-y-auto px-4">{children}</div>

          <SheetFooter>
            <SheetClose render={<Button variant="outline">Close</Button>} />
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
