import { prisma } from "@/lib/prisma";
import MembersClient from "@/components/members/MembersClient";
import { Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const revalidate = 3600;

export const metadata = {
  title: "সদস্য ডিরেক্টরি | এসএসসি ব্যাচ ৯০",
  description: "এসএসসি ব্যাচ ৯০ এর সকল নিবন্ধিত সদস্যদের তালিকা",
};

export default async function MembersPage() {
  const members = await prisma.profile.findMany({
    orderBy: { banglaFullName: "asc" },
    where: { isDeceased: false },
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 to-rose-950 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-5">
            <Users className="w-4 h-4 text-rose-400" />
            <span className="text-white/80 text-sm">সদস্য তালিকা</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">সদস্য ডিরেক্টরি</h1>
          <p className="text-slate-300 text-lg">
            শেরপুর জেলার এসএসসি ৯০ ব্যাচের সকল বন্ধুদের সাথে পুনরায় যোগাযোগ করুন
          </p>
          <Badge className="mt-4 bg-rose-600/60 text-white border-0 text-sm px-3 py-1">
            {members.length} জন সদস্য নিবন্ধিত
          </Badge>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <MembersClient members={members} />
      </div>
    </div>
  );
}
