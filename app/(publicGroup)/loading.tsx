import { Container } from "@/components/shared/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function PublicLoading() {
  return (
    <div className="animate-in fade-in duration-500">
      {/* Hero Skeleton */}
      <div className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white py-20 dark:from-neutral-900 dark:to-neutral-950">
        <Container className="text-center space-y-6">
          <Skeleton className="mx-auto h-12 w-3/4 max-w-xl rounded-lg" />
          <Skeleton className="mx-auto h-6 w-1/2 max-w-md" />
          <Skeleton className="mx-auto h-12 w-full max-w-lg rounded-xl" />
        </Container>
      </div>

      {/* Cards Skeleton */}
      <Container className="py-16">
        <Skeleton className="mx-auto mb-8 h-8 w-48" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3 rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
              <Skeleton className="aspect-[16/10] w-full rounded-lg" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <div className="flex justify-between">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-8 w-24 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
