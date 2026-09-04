import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Images } from "lucide-react";
import GalleryLightbox from "@/components/gallery/GalleryLightbox";

export const revalidate = 3600;

export const metadata = {
  title: "ফটো গ্যালারি | এসএসসি ব্যাচ ৯০",
  description: "পুনর্মিলনী, স্কুল জীবন ও বিশেষ মুহূর্তের ছবির সংগ্রহ",
};

export default async function GalleryPage() {
  const items = await prisma.galleryItem.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 to-rose-950 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-5">
            <Images className="w-4 h-4 text-rose-400" />
            <span className="text-white/80 text-sm">স্মৃতির আলোকচিত্র</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">ফটো গ্যালারি</h1>
          <p className="text-slate-300 text-lg">
            পুনর্মিলনী, স্কুল জীবন ও বিশেষ মুহূর্তের অবিস্মরণীয় স্মৃতিচিত্র
          </p>
          <Badge className="mt-4 bg-rose-600/60 text-white border-0 text-sm px-3 py-1">
            {items.length} টি ছবি সংগৃহীত
          </Badge>
        </div>
      </div>

      {/* Gallery Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <GalleryLightbox items={items} />
      </div>
    </div>
  );
}
