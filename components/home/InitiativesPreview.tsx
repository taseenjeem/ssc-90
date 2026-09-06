import Link from "next/link";
import Image from "next/image";
import { Initiative } from "@prisma/client";
import { MapPin, Calendar, Users, ArrowRight, HandHeart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getShimmerDataUrl } from "@/lib/imageShimmer";

import { formatBanglaDate } from "@/lib/utils";

interface InitiativesPreviewProps {
  initiatives: Initiative[];
}

export default function InitiativesPreview({ initiatives }: InitiativesPreviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {initiatives.map((initiative) => {
        const hasImage = Array.isArray(initiative.images) && initiative.images.length > 0;
        const coverImage = hasImage ? initiative.images[0] : null;

        return (
          <div
            key={initiative.id}
            className="group bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
          >
            {/* Cover image or illustrated header */}
            {coverImage ? (
              <div className="relative h-48 bg-slate-100 overflow-hidden">
                <Image
                  src={coverImage}
                  alt={initiative.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  quality={85}
                  placeholder="blur"
                  blurDataURL={getShimmerDataUrl(600, 300)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                {initiative.images.length > 1 && (
                  <Badge className="absolute top-3 right-3 bg-black/60 text-white border-0 text-[11px] backdrop-blur-sm">
                    +{initiative.images.length - 1} ছবি
                  </Badge>
                )}
              </div>
            ) : (
              <div className="h-28 bg-gradient-to-br from-emerald-600 to-teal-800 p-4 flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-white/10 backdrop-blur-sm">
                    <HandHeart className="w-5 h-5 text-emerald-200" />
                  </div>
                  <span className="text-xs font-semibold text-emerald-100">সমাজকল্যাণ উদ্যোগ</span>
                </div>
              </div>
            )}

            <div className="p-5 sm:p-6 flex-1 flex flex-col">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-bold text-slate-900 text-lg leading-snug line-clamp-2 group-hover:text-emerald-700 transition-colors">
                  {initiative.title}
                </h3>
              </div>

              <p className="text-slate-500 text-sm line-clamp-3 mb-4 leading-relaxed flex-1">
                {initiative.description}
              </p>

              <div className="space-y-2 py-3 border-t border-slate-100 mb-4 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span className="font-medium text-slate-600">{formatBanglaDate(initiative.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span className="line-clamp-1">{initiative.location}</span>
                </div>
                {initiative.impact && (
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span className="font-medium text-emerald-700">{initiative.impact}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between gap-2 mt-auto pt-2">
                {initiative.budget ? (
                  <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                    {initiative.budget}
                  </Badge>
                ) : (
                  <span />
                )}
                <Button
                  asChild
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold h-9 px-4 shadow-sm"
                >
                  <Link href={`/initiatives/${initiative.id}`}>
                    বিস্তারিত <ArrowRight className="ml-1 w-3.5 h-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
