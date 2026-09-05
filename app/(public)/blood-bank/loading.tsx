import { Skeleton } from "@/components/ui/skeleton";

export default function BloodBankLoading() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Skeleton */}
      <div className="bg-gradient-to-br from-red-900 to-rose-950 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center flex flex-col items-center space-y-4">
          <Skeleton className="h-7 w-32 bg-white/10 rounded-full" />
          <Skeleton className="h-10 sm:h-12 w-64 bg-white/10 rounded-xl" />
          <Skeleton className="h-5 w-96 max-w-full bg-white/10 rounded-lg" />
          <Skeleton className="h-7 w-44 bg-white/10 rounded-full" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Search Bar Skeleton */}
        <div className="max-w-xl mx-auto">
          <Skeleton className="h-12 w-full rounded-2xl shadow-sm" />
        </div>

        {/* Blood Groups Pill Filter Skeleton */}
        <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
          {["সব", "A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((g) => (
            <Skeleton key={g} className="h-10 w-16 rounded-xl" />
          ))}
        </div>

        {/* Donor Cards Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <Skeleton className="w-12 h-12 rounded-xl bg-red-50" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-3/4 rounded-md" />
                <Skeleton className="h-4 w-1/2 rounded-md" />
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <Skeleton className="h-4 w-1/3 rounded-md" />
                <Skeleton className="h-9 w-24 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
