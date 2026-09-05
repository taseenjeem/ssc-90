import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Heart } from "lucide-react";
import MemoriesClient from "@/components/memories/MemoriesClient";

export const revalidate = 60;

export const metadata = {
  title: "স্মৃতির দেয়াল | এসএসসি ব্যাচ ৯০",
  description: "বন্ধুদের উদ্দেশ্যে স্মৃতিবার্তা ও অনুভূতি শেয়ার করুন",
};

export default async function MemoriesPage() {
  const messages = await prisma.memoryMessage.findMany({
    where: { isApproved: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 to-amber-950 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-5">
            <Heart className="w-4 h-4 text-amber-400" />
            <span className="text-white/80 text-sm">বন্ধুর কথা</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">স্মৃতির দেয়াল</h1>
          <p className="text-amber-200 text-lg max-w-xl mx-auto">
            শেরপুরের স্কুল জীবনের পুরোনো স্মৃতি, হারানো বন্ধু, এবং সোনালী মুহূর্তের কথা লিখুন
          </p>
          <Badge className="mt-4 bg-amber-600/60 text-white border-0 text-sm px-3 py-1">
            {messages.length} টি স্মৃতিবার্তা
          </Badge>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <MemoriesClient messages={messages} />
      </div>
    </div>
  );
}
