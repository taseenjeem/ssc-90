"use client";

import { useState } from "react";
import { Droplets, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

const BLOOD_COLORS: Record<string, { bg: string; text: string; activeBg: string; activeText: string }> = {
  "A+":  { bg: "bg-red-50",    text: "text-red-700",    activeBg: "bg-red-600",    activeText: "text-white" },
  "A-":  { bg: "bg-red-50",    text: "text-red-700",    activeBg: "bg-red-600",    activeText: "text-white" },
  "B+":  { bg: "bg-orange-50", text: "text-orange-700", activeBg: "bg-orange-600", activeText: "text-white" },
  "B-":  { bg: "bg-orange-50", text: "text-orange-700", activeBg: "bg-orange-600", activeText: "text-white" },
  "O+":  { bg: "bg-rose-50",   text: "text-rose-700",   activeBg: "bg-rose-600",   activeText: "text-white" },
  "O-":  { bg: "bg-rose-50",   text: "text-rose-700",   activeBg: "bg-rose-600",   activeText: "text-white" },
  "AB+": { bg: "bg-purple-50", text: "text-purple-700", activeBg: "bg-purple-600", activeText: "text-white" },
  "AB-": { bg: "bg-purple-50", text: "text-purple-700", activeBg: "bg-purple-600", activeText: "text-white" },
};

interface Donor {
  id: string;
  banglaFullName: string;
  nickName: string;
  bloodGroup: string;
  currentAddress: string;
  personalMobile: string;
}

export default function BloodBankClient({ donors }: { donors: Donor[] }) {
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = selected ? donors.filter((d) => d.bloodGroup === selected) : donors;

  return (
    <>
      {/* Blood Group Pills */}
      <div className="flex flex-wrap gap-3 mb-8">
        <button
          onClick={() => setSelected(null)}
          className={cn(
            "px-4 py-2 rounded-full font-semibold text-sm border transition-all",
            !selected
              ? "bg-slate-800 text-white border-slate-800"
              : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
          )}
        >
          সকল গ্রুপ
        </button>
        {BLOOD_GROUPS.map((bg) => {
          const colors = BLOOD_COLORS[bg];
          const count = donors.filter((d) => d.bloodGroup === bg).length;
          return (
            <button
              key={bg}
              onClick={() => setSelected(selected === bg ? null : bg)}
              className={cn(
                "px-4 py-2 rounded-full font-bold text-sm border transition-all flex items-center gap-1.5",
                selected === bg
                  ? `${colors.activeBg} ${colors.activeText} border-transparent shadow-md`
                  : `${colors.bg} ${colors.text} border-current/20 hover:shadow-sm`
              )}
            >
              <Droplets className="w-3.5 h-3.5" />
              {bg}
              <span className="text-[10px] opacity-70">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Donor Cards */}
      <div className="space-y-3">
        {filtered.map((donor) => {
          const colors = BLOOD_COLORS[donor.bloodGroup] ?? { bg: "bg-slate-50", text: "text-slate-700" };
          return (
            <div
              key={donor.id}
              className="flex items-center gap-4 bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Blood Badge */}
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0", colors.bg)}>
                <div className="text-center">
                  <Droplets className={cn("w-4 h-4 mx-auto", colors.text)} />
                  <span className={cn("text-sm font-black leading-tight", colors.text)}>{donor.bloodGroup}</span>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-900">
                  {donor.banglaFullName}
                  <span className="text-rose-500 font-normal text-sm ml-1.5">({donor.nickName})</span>
                </p>
                <div className="flex items-center gap-1.5 mt-1 text-sm text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>{donor.currentAddress}</span>
                </div>
              </div>

              {/* Call Button */}
              <Button
                asChild
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white rounded-xl flex-shrink-0"
              >
                <a href={`tel:${donor.personalMobile}`}>
                  <Phone className="w-3.5 h-3.5 mr-1.5" />
                  কল করুন
                </a>
              </Button>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <Droplets className="w-12 h-12 mx-auto mb-3 text-slate-200" />
            <p>এই রক্তের গ্রুপের কোনো দাতা পাওয়া যায়নি।</p>
          </div>
        )}
      </div>
    </>
  );
}
