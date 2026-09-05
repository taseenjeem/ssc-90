import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Compass, Home, Users, Droplets } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 bg-slate-50">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto text-rose-600 shadow-inner">
          <Compass className="w-10 h-10 animate-spin" style={{ animationDuration: "12s" }} />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full">
            ৪০৪ ত্রুটি
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 pt-2">
            পৃষ্ঠাটি খুঁজে পাওয়া যায়নি
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            আপনি যে পাতাটি খুঁজছেন তা হয়তো সরানো হয়েছে, নাম পরিবর্তন করা হয়েছে অথবা সাময়িকভাবে অনুপলব্ধ।
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-md">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              হোমে ফিরে যান
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-slate-200 rounded-xl">
            <Link href="/members">
              <Users className="w-4 h-4 mr-2 text-rose-600" />
              সদস্য ডিরেক্টরি
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
