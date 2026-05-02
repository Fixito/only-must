import { Skeleton } from '@/components/ui/skeleton.tsx';

export default function GameDetailSkeleton() {
  return (
    <div className="container py-12">
      <div>
        <Skeleton className="h-10 w-1/2" />

        <div className="mbs-4 flex flex-col items-start gap-4 sm:flex-row">
          <Skeleton className="h-64 w-full max-w-44" />

          <div className="w-72">
            <div className="space-y-4">
              <div className="bg-card p-4 shadow-sm">
                <div className="flex flex-wrap items-center gap-1">
                  <strong className="text-foreground rounded-md font-semibold">Platforms:</strong>

                  <div className="flex flex-wrap gap-1">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-5 w-16 rounded-full" />
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <strong className="text-foreground rounded-md font-semibold">
                      Initial release date:
                    </strong>
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                </div>
              </div>

              <div className="bg-card p-4 shadow-sm">
                <div className="flex items-center gap-1">
                  <strong className="text-foreground rounded-md font-semibold">Developer:</strong>
                  <Skeleton className="h-4 w-1/3" />
                </div>
              </div>

              <div className="bg-card p-4 shadow-sm">
                <div className="flex items-center gap-1">
                  <strong className="text-foreground rounded-md font-semibold">Genre:</strong>
                  <Skeleton className="h-4 w-1/3" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start gap-2 p-4">
            <span className="font-semibold tracking-widest uppercase">Metascore</span>

            <div className="flex gap-4">
              <Skeleton className="size-16" />
              <Skeleton className="size-16" />
            </div>
          </div>
        </div>
      </div>

      <div className="mbs-8">
        <Skeleton className="h-7 w-48" />

        <div className="mbs-4 space-y-2">
          <Skeleton className="h-4 w-full max-w-prose" />
          <Skeleton className="h-4 w-full max-w-prose" />
          <Skeleton className="h-4 w-3/4 max-w-prose" />
        </div>
      </div>
    </div>
  );
}
