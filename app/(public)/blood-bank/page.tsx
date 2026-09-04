import { prisma } from "@/lib/prisma";
import BloodBankClient from "@/components/blood-bank/BloodBankClient";
import { Droplets } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const revalidate = 3600;

export const metadata = {
  title: "রক্তদান ব্যাংক | এসএসসি ব্যাচ ৯০",
  description: "জরুরি রক্তের প্রয়োজনে সরাসরি ব্যাচের সদস্যদের সাথে যোগাযোগ করুন",
};

export default async function BloodBankPage() {
  const donors = await prisma.profile.findMany({
    where: { isDeceased: false },
    select: {
      id: true,
      banglaFullName: true,
      nickName: true,
      bloodGroup: true,
      currentAddress: true,
      personalMobile: true,
    },
    orderBy: { bloodGroup: "asc" },
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-red-900 to-rose-950 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-5">
            <Droplets className="w-4 h-4 text-red-300" />
            <span className="text-white/80 text-sm">জরুরি সেবা</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">রক্তদান ব্যাংক</h1>
          <p className="text-red-200 text-lg max-w-xl mx-auto">
            জরুরি মুহূর্তে আপনার পাশে থাকতে প্রস্তুত ব্যাচের বন্ধুরা
          </p>
          <Badge className="mt-4 bg-red-600/60 text-white border-0 text-sm px-3 py-1">
            {donors.length} জন সম্ভাব্য রক্তদাতা
          </Badge>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <BloodBankClient donors={donors} />
      </div>
    </div>
  );
}
