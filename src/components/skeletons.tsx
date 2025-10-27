import { Skeleton } from '@/components/ui/skeleton';

export function ShelfHeaderSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-lg bg-card border p-8 md:p-12 min-h-[300px] flex flex-col justify-between">
      <Skeleton className="absolute inset-0 w-full h-full" />
      <div className="relative z-10">
        <Skeleton className="h-6 w-48 mb-4" />
        <Skeleton className="h-10 md:h-12 w-3/4" />
      </div>
      <div className="relative z-10 mt-4">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-2/3 mt-2" />
      </div>
    </div>
  );
}

export function BookGridSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <Skeleton className="h-10 w-full max-w-sm" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-[2/3] w-full rounded-lg" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
