import { Skeleton } from "@/components/ui/skeleton";

export default function GalleryLoading() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Skeleton */}
      <div className="bg-gradient-to-br from-slate-900 to-rose-950 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center flex flex-col items-center space-y-4">
          <Skeleton className="h-7 w-32 bg-white/10 rounded-full" />
          <Skeleton className="h-10 sm:h-12 w-64 bg-white/10 rounded-xl" />
          <Skeleton className="h-5 w-80 max-w-full bg-white/10 rounded-lg" />
          <Skeleton className="h-7 w-36 bg-white/10 rounded-full" />
        </div>
      </div>

      {/* Gallery Grid Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            "aspect-square",
            "aspect-[4/5]",
            "aspect-[16/10]",
            "aspect-square",
            "aspect-[4/3]",
            "aspect-square",
            "aspect-[3/4]",
            "aspect-square",
          ].map((aspect, i) => (
            <div
              key={i}
              className={`rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-sm relative group`}
            >
              <Skeleton className={`w-full ${aspect}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
