import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HandHeart, MapPin, Calendar, Users, ArrowRight } from "lucide-react";

export const revalidate = 3600;

export const metadata = {
  title: "সামাজিক উদ্যোগ | এসএসসি ব্যাচ ৯০",
  description: "এসএসসি ব্যাচ ৯০ এর মানবকল্যাণমূলক কার্যক্রম",
};

export default async function InitiativesPage() {
  const initiatives = await prisma.initiative.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 to-emerald-950 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-5">
            <HandHeart className="w-4 h-4 text-emerald-400" />
            <span className="text-white/80 text-sm">সমাজের জন্য</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">সামাজিক উদ্যোগ</h1>
          <p className="text-emerald-200 text-lg max-w-xl mx-auto">
            বন্ধুরা মিলে সমাজের পাশে দাঁড়ানোর গল্প
          </p>
          <Badge className="mt-4 bg-emerald-600/60 text-white border-0 text-sm px-3 py-1">
            {initiatives.length} টি উদ্যোগ সম্পন্ন
          </Badge>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {initiatives.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <HandHeart className="w-12 h-12 mx-auto mb-4 text-slate-200" />
            <p>কোনো উদ্যোগ এখনো যোগ হয়নি।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {initiatives.map((initiative) => (
              <div
                key={initiative.id}
                className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col"
              >
                {/* Cover image */}
                {initiative.images.length > 0 && (
                  <div className="relative h-44 bg-slate-100 overflow-hidden">
                    <Image
                      src={initiative.images[0]}
                      alt={initiative.title}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-5 flex-1 flex flex-col">
                  <h2 className="font-bold text-slate-900 text-base mb-2 line-clamp-2">
                    {initiative.title}
                  </h2>
                  <p className="text-slate-500 text-sm line-clamp-3 mb-4 flex-1">
                    {initiative.description}
                  </p>
                  <div className="space-y-1.5 mb-4">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{initiative.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{initiative.location}</span>
                    </div>
                    {initiative.impact && (
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Users className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{initiative.impact}</span>
                      </div>
                    )}
                  </div>
                  {initiative.budget && (
                    <Badge className="self-start bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs mb-3">
                      {initiative.budget}
                    </Badge>
                  )}
                  <Button asChild size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl mt-auto">
                    <Link href={`/initiatives/${initiative.id}`}>
                      বিস্তারিত দেখুন <ArrowRight className="ml-1 w-3.5 h-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
