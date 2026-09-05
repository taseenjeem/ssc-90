import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Skeleton */}
      <section className="min-h-[70vh] bg-gradient-to-br from-slate-900 via-rose-950 to-slate-900 flex flex-col items-center justify-center px-4 py-16">
        <div className="max-w-4xl w-full flex flex-col items-center text-center space-y-6">
          <Skeleton className="h-8 w-64 bg-white/10 rounded-full" />
          <Skeleton className="h-16 w-3/4 max-w-xl bg-white/10 rounded-2xl" />
          <Skeleton className="h-12 w-1/2 max-w-md bg-white/10 rounded-xl" />
          <Skeleton className="h-6 w-5/6 max-w-lg bg-white/10 rounded-lg" />
          <div className="flex flex-wrap gap-2 justify-center pt-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-7 w-20 bg-white/10 rounded-full" />
            ))}
          </div>
          <div className="flex gap-4 pt-4">
            <Skeleton className="h-12 w-40 bg-white/20 rounded-xl" />
            <Skeleton className="h-12 w-36 bg-white/10 rounded-xl" />
          </div>
        </div>
      </section>

      {/* Metrics Skeleton */}
      <section className="py-12 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-slate-50 border border-slate-100 rounded-2xl p-6 flex flex-col items-center space-y-3"
              >
                <Skeleton className="h-12 w-12 rounded-2xl" />
                <Skeleton className="h-8 w-20 rounded-lg" />
                <Skeleton className="h-4 w-28 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content cards Skeleton */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div className="space-y-2">
            <Skeleton className="h-6 w-28 rounded-full" />
            <Skeleton className="h-8 w-56 rounded-lg" />
          </div>
          <Skeleton className="h-5 w-20 rounded-md" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white border border-slate-100 rounded-2xl p-4 space-y-4 shadow-sm"
            >
              <Skeleton className="h-48 w-full rounded-xl" />
              <Skeleton className="h-6 w-3/4 rounded-md" />
              <Skeleton className="h-4 w-1/2 rounded-md" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
