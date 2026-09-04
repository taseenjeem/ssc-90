import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowRight, Users, School, HandHeart, BookOpen, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import FeaturedGallery from "@/components/home/FeaturedGallery";
import MetricCounter from "@/components/home/MetricCounter";
import InitiativesPreview from "@/components/home/InitiativesPreview";

export const revalidate = 3600; // revalidate every hour

async function getStats() {
  const [memberCount, schoolCount, initiativeCount, memoryCount] = await Promise.all([
    prisma.profile.count(),
    prisma.profile.groupBy({ by: ["schoolName"] }).then((r) => r.length),
    prisma.initiative.count(),
    prisma.memoryMessage.count({ where: { isApproved: true } }),
  ]);
  return { memberCount, schoolCount, initiativeCount, memoryCount };
}

async function getFeaturedGallery() {
  return prisma.galleryItem.findMany({
    where: { featured: true },
    orderBy: { createdAt: "desc" },
    take: 6,
  });
}

async function getRecentInitiatives() {
  return prisma.initiative.findMany({
    orderBy: { createdAt: "desc" },
    take: 3,
  });
}

const metrics = [
  { iconType: "users" as const, label: "নিবন্ধিত সদস্য", key: "memberCount", color: "text-rose-600" },
  { iconType: "school" as const, label: "প্রতিনিধিত্বকারী স্কুল", key: "schoolCount", color: "text-blue-600" },
  { iconType: "initiatives" as const, label: "সামাজিক উদ্যোগ", key: "initiativeCount", color: "text-emerald-600" },
  { iconType: "memories" as const, label: "স্মৃতি সংরক্ষিত", key: "memoryCount", color: "text-amber-600" },
];

export default async function HomePage() {
  const [stats, featured, initiatives] = await Promise.all([
    getStats(),
    getFeaturedGallery(),
    getRecentInitiatives(),
  ]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-rose-950 to-slate-900">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-rose-500 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-red-500 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-orange-400 rounded-full blur-3xl animate-pulse delay-500" />
        </div>

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto">
          <div className="mb-6 inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5">
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
            <span className="text-white/80 text-sm font-medium">SSC Batch 1990 · এক অনন্য বন্ধন</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            তিন দশকের বন্ধুত্ব,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400">
              স্মৃতির আঙিনায় চিরন্তন
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            ১৯৯০ সালের এসএসসি ব্যাচের সকল বন্ধুদের একত্রিত করার এই প্ল্যাটফর্মে আপনাকে স্বাগতম।
            স্মৃতিচারণ করুন, যোগাযোগ রাখুন, একসাথে এগিয়ে যান।
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-900/40 px-8 py-3 text-base font-semibold rounded-xl transition-all duration-300 hover:scale-105"
            >
              <Link href="/members">
                সদস্য ডিরেক্টরি খুঁজুন
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white/30 text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm px-8 py-3 text-base font-semibold rounded-xl transition-all duration-300 hover:scale-105"
            >
              <Link href="/gallery">
                পুনর্মিলনী গ্যালারি
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center pt-1.5">
            <div className="w-1.5 h-3 bg-white/60 rounded-full animate-scroll-down" />
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((m) => (
              <MetricCounter
                key={m.key}
                iconType={m.iconType}
                label={m.label}
                value={stats[m.key as keyof typeof stats]}
                color={m.color}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Gallery */}
      {featured.length > 0 && (
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <Badge className="bg-rose-100 text-rose-700 border-0 mb-3">বিশেষ মুহূর্ত</Badge>
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">স্মরণীয় মুহূর্তসমূহ</h2>
                <p className="text-slate-500 mt-2">পুনর্মিলনী ও বিশেষ অনুষ্ঠানের স্মৃতি</p>
              </div>
              <Link
                href="/gallery"
                className="hidden sm:flex items-center gap-1 text-rose-600 font-medium hover:text-rose-700 transition-colors"
              >
                সব দেখুন <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <FeaturedGallery items={featured} />
          </div>
        </section>
      )}

      {/* Recent Initiatives */}
      {initiatives.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <Badge className="bg-emerald-100 text-emerald-700 border-0 mb-3">সামাজিক দায়বদ্ধতা</Badge>
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">সাম্প্রতিক উদ্যোগ</h2>
                <p className="text-slate-500 mt-2">বন্ধুরা মিলে সমাজের জন্য কাজ করছে</p>
              </div>
              <Link
                href="/initiatives"
                className="hidden sm:flex items-center gap-1 text-emerald-600 font-medium hover:text-emerald-700 transition-colors"
              >
                সব দেখুন <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <InitiativesPreview initiatives={initiatives} />
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="py-20 bg-gradient-to-r from-rose-600 to-red-700">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            আপনি কি ব্যাচের সদস্য?
          </h2>
          <p className="text-rose-100 text-lg mb-8 max-w-2xl mx-auto">
            আপনার তথ্য যোগ করুন এবং পুরোনো বন্ধুদের সাথে আবার সংযুক্ত হন।
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-rose-700 hover:bg-rose-50 font-semibold px-8 py-3 rounded-xl shadow-lg transition-all hover:scale-105"
            >
              <Link href="/members">সদস্য ডিরেক্টরি দেখুন</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white/50 text-white hover:bg-white/10 font-semibold px-8 py-3 rounded-xl transition-all hover:scale-105"
            >
              <Link href="/memories">স্মৃতি শেয়ার করুন</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
