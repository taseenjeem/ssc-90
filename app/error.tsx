"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App Error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-slate-50">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto text-red-600 shadow-inner">
          <AlertCircle className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-3 py-1 rounded-full">
            অনাকাঙ্ক্ষিত সমস্যা
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 pt-2">
            কিছু একটা ভুল হয়েছে
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            তথ্য লোড করতে সমস্যা হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন অথবা কিছুক্ষণ পর প্রবেশ করুন।
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => reset()}
            className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-md"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            পুনরায় চেষ্টা করুন
          </Button>
          <Button asChild variant="outline" className="border-slate-200 rounded-xl">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              হোমে ফিরে যান
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
