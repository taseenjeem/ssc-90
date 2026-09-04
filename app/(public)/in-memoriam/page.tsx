import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Flower2, School, User } from "lucide-react";

export const revalidate = 3600;

export const metadata = {
  title: "শ্রদ্ধাঞ্জলি | এসএসসি ব্যাচ ৯০",
  description: "প্রয়াত বন্ধুদের স্মরণে শ্রদ্ধা জানাই",
};

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
                className="bg-white/70 backdrop-blur-sm border border-slate-200 rounded-2xl overflow-hidden shadow-sm grayscale hover:grayscale-0 transition-all duration-500 group"
              >
                {/* Photo */}
                <div className="relative h-52 bg-slate-100">
                  {member.profilePicture ? (
                    <Image
                      src={member.profilePicture}
                      alt={member.banglaFullName}
                      fill
                      className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <User className="w-20 h-20 text-slate-300" />
                    </div>
                  )}
                  {/* Floral badge */}
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-white/90 text-slate-600 border-slate-200 text-xs gap-1">
                      <Flower2 className="w-3 h-3" /> চিরস্মরণীয়
                    </Badge>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 text-center">
                  <h2 className="font-bold text-slate-800 text-lg">{member.banglaFullName}</h2>
                  <p className="text-slate-500 text-sm">{member.engFullName}</p>
                  <div className="flex items-center justify-center gap-1.5 mt-2 text-xs text-slate-400">
                    <School className="w-3.5 h-3.5" />
                    <span>{member.schoolName}</span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <p className="text-xs text-slate-400 italic">
                      "তোমাদের স্মৃতি আমাদের হৃদয়ে অমলিন।"
                    </p>
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
