import { Card } from '@/components/ui/card.tsx';
import { Skeleton } from '@/components/ui/skeleton.tsx';

export default function GridPageSkeleton() {
  return (
    <>
      <div className="container py-12">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="mbs-2 h-4 w-2/4" />
      </div>

      <div className="container gap-6 md:grid-cols-[16rem_1fr] lg:grid">
        <aside>
          <div className="flex items-center justify-between py-4">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="size-4" />
          </div>
        </aside>

        <section className="pbs-4">
          <Skeleton className="h-4 w-24" />

          <div className="mbs-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

function CardSkeleton() {
  return (
    <Card className="grid grid-cols-[7rem_auto] gap-4 overflow-hidden p-0">
      <Skeleton className="h-full min-h-40 w-full rounded-none" />

      <div className="flex flex-col gap-3 py-4 ps-0 pe-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-14 w-full" />

        <div className="mt-auto flex items-center gap-2">
          <Skeleton className="size-6 rounded-none" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
    </Card>
  );
}
