import { Skeleton } from "@/components/ui/skeleton";

export default function InitiativesLoading() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Skeleton */}
      <div className="bg-gradient-to-br from-slate-900 to-emerald-950 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center flex flex-col items-center space-y-4">
          <Skeleton className="h-7 w-32 bg-white/10 rounded-full" />
          <Skeleton className="h-10 sm:h-12 w-64 bg-white/10 rounded-xl" />
          <Skeleton className="h-5 w-80 max-w-full bg-white/10 rounded-lg" />
          <Skeleton className="h-7 w-36 bg-white/10 rounded-full" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm flex flex-col"
            >
              <Skeleton className="h-52 w-full" />
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-20 rounded-md" />
                    <Skeleton className="h-5 w-24 rounded-md" />
                  </div>
                  <Skeleton className="h-6 w-5/6 rounded-lg" />
                  <Skeleton className="h-4 w-full rounded-md" />
                  <Skeleton className="h-4 w-3/4 rounded-md" />
                </div>
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Skeleton className="h-4 w-28 rounded-md" />
                  <Skeleton className="h-8 w-20 rounded-xl" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
