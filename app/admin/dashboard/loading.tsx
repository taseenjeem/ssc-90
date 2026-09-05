import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboardLoading() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Skeleton */}
      <div className="bg-slate-900 border-b border-slate-800 h-16 px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="w-9 h-9 rounded-xl bg-slate-800" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-32 bg-slate-800" />
            <Skeleton className="h-3 w-20 bg-slate-800" />
          </div>
        </div>
        <Skeleton className="h-8 w-24 bg-slate-800 rounded-lg" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Stat Cards Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 space-y-3 shadow-sm border border-slate-100"
            >
              <Skeleton className="w-10 h-10 rounded-xl" />
              <Skeleton className="h-8 w-16 rounded-md" />
              <Skeleton className="h-4 w-24 rounded-md" />
            </div>
          ))}
        </div>

        {/* Quick Actions Skeleton */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
          <Skeleton className="h-6 w-36 rounded-md" />
          <div className="flex flex-wrap gap-4 pt-2">
            <Skeleton className="h-12 w-48 rounded-xl" />
            <Skeleton className="h-12 w-44 rounded-xl" />
            <Skeleton className="h-12 w-52 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
