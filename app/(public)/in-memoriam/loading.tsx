import { Skeleton } from "@/components/ui/skeleton";

export default function InMemoriamLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200">
      {/* Header Skeleton */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center space-y-4">
          <Skeleton className="h-7 w-32 bg-white/10 rounded-full" />
          <Skeleton className="h-10 sm:h-12 w-64 bg-white/10 rounded-xl" />
          <Skeleton className="h-5 w-80 max-w-full bg-white/10 rounded-lg" />
          <div className="w-24 h-0.5 bg-slate-500 mx-auto mt-2" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col items-center text-center space-y-4 shadow-sm"
            >
              <Skeleton className="w-24 h-24 rounded-full" />
              <div className="space-y-2 w-full flex flex-col items-center">
                <Skeleton className="h-5 w-3/4 rounded-md" />
                <Skeleton className="h-4 w-1/2 rounded-md" />
              </div>
              <div className="w-full pt-3 border-t border-slate-100 space-y-2">
                <Skeleton className="h-3 w-4/5 mx-auto rounded-md" />
                <Skeleton className="h-3 w-3/5 mx-auto rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
