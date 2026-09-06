import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Flower2, School, User, Calendar, ArrowRight } from "lucide-react";
import { getShimmerDataUrl } from "@/lib/imageShimmer";

export const revalidate = 60;

export const metadata = {
  title: "শ্রদ্ধাঞ্জলি | এসএসসি ব্যাচ ৯০",
  description: "প্রয়াত বন্ধুদের স্মরণে শ্রদ্ধা জানাই",
};

function formatBanglaDate(dateStr: string) {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString("bn-BD", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  } catch {
    // fallback to original string
  }
  return dateStr;
}

export default async function InMemoriamPage() {
  const departed = await prisma.profile.findMany({
    where: { isDeceased: true },
    orderBy: { banglaFullName: "asc" },
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-5">
            <Flower2 className="w-4 h-4 text-slate-400" />
            <span className="text-white/80 text-sm">চির স্মরণে</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">শ্রদ্ধাঞ্জলি</h1>
          <p className="text-slate-300 text-lg max-w-xl mx-auto">
            যারা চলে গেছেন কিন্তু হৃদয়ে বেঁচে আছেন চিরকাল
          </p>
          <div className="w-24 h-0.5 bg-slate-500 mx-auto mt-6" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {departed.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <Flower2 className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <p>সকলে সুস্থ ও দীর্ঘজীবী হোন।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {departed.map((member) => (
              <div
                key={member.id}
                className="bg-white/70 backdrop-blur-sm border border-slate-200 rounded-2xl overflow-hidden shadow-sm grayscale hover:grayscale-0 transition-all duration-500 group flex flex-col hover:shadow-md"
              >
                {/* Photo */}
                <Link href={`/members/${member.id}`} className="relative aspect-square w-full bg-slate-100 block overflow-hidden">
                  {member.profilePicture ? (
                    <Image
                      src={member.profilePicture}
                      alt={member.banglaFullName}
                      fill
                      className="object-cover opacity-85 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      quality={85}
                      placeholder="blur"
                      blurDataURL={getShimmerDataUrl(350, 350)}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <User className="w-20 h-20 text-slate-300" />
                    </div>
                  )}
                  {/* Floral badge */}
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-white/90 text-slate-600 border-slate-200 text-xs gap-1 shadow-xs">
                      <Flower2 className="w-3 h-3 text-slate-500" /> চিরস্মরণীয়
                    </Badge>
                  </div>
                </Link>

                {/* Info */}
                <div className="p-4 text-center flex-1 flex flex-col justify-between">
                  <div>
                    <Link href={`/members/${member.id}`} className="hover:text-rose-600 transition-colors">
                      <h2 className="font-bold text-slate-800 text-lg">{member.banglaFullName}</h2>
                    </Link>
                    <p className="text-slate-500 text-sm">{member.engFullName}</p>
                    <div className="flex items-center justify-center gap-1.5 mt-2 text-xs text-slate-400">
                      <School className="w-3.5 h-3.5 text-slate-400" />
                      <span>{member.schoolName}</span>
                    </div>

                    {member.deceasedDate && (
                      <div className="inline-flex items-center gap-1.5 bg-slate-100/90 text-slate-700 border border-slate-200/80 rounded-full px-3 py-1 mt-2.5 text-xs font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>ইন্তেকাল: {formatBanglaDate(member.deceasedDate)}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-2.5">
                    <p className="text-xs text-slate-400 italic">
                      &ldquo;তোমাদের স্মৃতি আমাদের হৃদয়ে অমলিন।&rdquo;
                    </p>
                    <Link
                      href={`/members/${member.id}`}
                      className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-rose-600 text-white text-xs font-semibold transition-colors duration-200 shadow-xs"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>প্রোফাইল ও স্মৃতিচারণ দেখুন</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
