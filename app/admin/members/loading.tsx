import { Skeleton } from "@/components/ui/skeleton";

export default function AdminMembersLoading() {
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Actions bar skeleton */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
          <Skeleton className="h-10 w-72 rounded-xl" />
          <Skeleton className="h-10 w-44 rounded-xl" />
        </div>

        {/* Table skeleton */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-4 space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100">
            <Skeleton className="h-5 w-24 rounded-md" />
            <Skeleton className="h-5 w-32 rounded-md" />
            <Skeleton className="h-5 w-28 rounded-md" />
            <Skeleton className="h-5 w-20 rounded-md" />
          </div>
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0"
            >
              <div className="flex items-center gap-3 w-1/4">
                <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-28 rounded-md" />
                  <Skeleton className="h-3 w-16 rounded-md" />
                </div>
              </div>
              <Skeleton className="h-4 w-36 rounded-md" />
              <Skeleton className="h-5 w-12 rounded-full" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-16 rounded-lg" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
