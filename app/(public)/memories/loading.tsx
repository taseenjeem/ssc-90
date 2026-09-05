import { Skeleton } from "@/components/ui/skeleton";

export default function MemoriesLoading() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Skeleton */}
      <div className="bg-gradient-to-br from-slate-900 to-amber-950 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center flex flex-col items-center space-y-4">
          <Skeleton className="h-7 w-32 bg-white/10 rounded-full" />
          <Skeleton className="h-10 sm:h-12 w-64 bg-white/10 rounded-xl" />
          <Skeleton className="h-5 w-80 max-w-full bg-white/10 rounded-lg" />
          <Skeleton className="h-7 w-36 bg-white/10 rounded-full" />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-32 rounded-md" />
          <Skeleton className="h-11 w-44 rounded-xl" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-amber-100/80 p-6 space-y-4 shadow-sm"
            >
              <Skeleton className="h-6 w-6 rounded-md bg-amber-100" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-5/6 rounded-md" />
                <Skeleton className="h-4 w-4/6 rounded-md" />
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-28 rounded-md" />
                  <Skeleton className="h-3 w-36 rounded-md" />
                </div>
                <Skeleton className="h-3 w-16 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
