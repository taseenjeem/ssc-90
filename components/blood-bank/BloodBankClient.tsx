"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Droplets, MapPin, Phone, Search, Copy, Check, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return donors.filter((d) => {
      const matchBlood = !selected || d.bloodGroup === selected;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        d.banglaFullName.toLowerCase().includes(q) ||
        d.nickName.toLowerCase().includes(q) ||
        d.currentAddress.toLowerCase().includes(q);
      return matchBlood && matchQuery;
    });
  }, [donors, selected, searchQuery]);

  const handleCopyMobile = (donor: Donor) => {
    navigator.clipboard.writeText(donor.personalMobile);
    setCopiedId(donor.id);
    toast.success(`${donor.banglaFullName} এর মোবাইল নম্বর কপি করা হয়েছে!`);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <>
      {/* Search & Group Filters Bar */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-sm p-5 mb-8">
        <div className="relative mb-5">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="রক্তদাতা বা এলাকার নাম (যেমন: ঢাকা, ধানমন্ডি, রফিক) দিয়ে খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 rounded-xl border-slate-200 text-sm focus:ring-rose-400 focus:border-rose-400"
          />
        </div>

        {/* Blood Group Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelected(null)}
            className={cn(
              "px-4 py-2 rounded-xl font-bold text-xs sm:text-sm border transition-all",
              !selected
                ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
            )}
          >
            সকল গ্রুপ ({donors.length})
          </button>
          {BLOOD_GROUPS.map((bg) => {
            const colors = BLOOD_COLORS[bg];
            const count = donors.filter((d) => d.bloodGroup === bg).length;
            const isSelected = selected === bg;
            return (
              <button
                key={bg}
                onClick={() => setSelected(isSelected ? null : bg)}
                className={cn(
                  "px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm border transition-all flex items-center gap-1.5",
                  isSelected
                    ? `${colors.activeBg} ${colors.activeText} border-transparent shadow-md shadow-rose-900/20 scale-105`
                    : `${colors.bg} ${colors.text} border-current/20 hover:shadow-xs`
                )}
              >
                <Droplets className="w-3.5 h-3.5" />
                {bg}
                <span className="text-[11px] opacity-75">({count})</span>
              </button>
            );
          })}
        </div>

        {(searchQuery || selected) && (
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
            <span>
              ফিল্টারে <strong className="text-slate-800 font-semibold">{filtered.length}</strong> জন রক্তদাতা পাওয়া গেছে
            </span>
            <button
              onClick={() => {
                setSelected(null);
                setSearchQuery("");
              }}
              className="text-rose-600 hover:underline font-medium"
            >
              ফিল্টার মুছুন
            </button>
          </div>
        )}
      </div>

      {/* Donor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((donor) => {
          const colors = BLOOD_COLORS[donor.bloodGroup] ?? { bg: "bg-slate-50", text: "text-slate-700" };
          const isCopied = copiedId === donor.id;

          return (
            <div
              key={donor.id}
              className="flex items-center gap-4 bg-white/90 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-xl hover:border-red-200/80 hover:-translate-y-0.5 transition-all duration-300"
            >
              {/* Blood Badge */}
              <div className={cn("w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner", colors.bg)}>
                <div className="text-center">
                  <Droplets className={cn("w-4 h-4 mx-auto mb-0.5", colors.text)} />
                  <span className={cn("text-base font-black leading-tight", colors.text)}>{donor.bloodGroup}</span>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <Link
                  href={`/members/${donor.id}`}
                  className="group/name inline-block hover:underline focus:outline-none"
                  title="প্রোফাইল দেখুন"
                >
                  <p className="font-bold text-slate-900 group-hover/name:text-rose-600 transition-colors text-base leading-tight">
                    {donor.banglaFullName}
                    {donor.nickName && (
                      <span className="text-rose-500 font-normal text-xs sm:text-sm ml-1.5">
                        ({donor.nickName})
                      </span>
                    )}
                  </p>
                </Link>
                <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                  <span className="truncate">{donor.currentAddress}</span>
                </div>
                <p className="text-xs font-mono text-slate-400 mt-1">{donor.personalMobile}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyMobile(donor)}
                  className="rounded-xl border-slate-200 text-slate-600 hover:text-slate-900 h-9 w-9 p-0"
                  title="নম্বর কপি করুন"
                >
                  {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </Button>

                <Button
                  asChild
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold h-9 px-3.5 shadow-sm"
                >
                  <a href={`tel:${donor.personalMobile}`}>
                    <Phone className="w-3.5 h-3.5 mr-1" />
                    কল
                  </a>
                </Button>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="col-span-full text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400">
            <Droplets className="w-12 h-12 mx-auto mb-3 text-rose-200" />
            <p className="text-base font-semibold text-slate-700">কোনো রক্তদাতা পাওয়া যায়নি</p>
            <p className="text-xs text-slate-400 mt-1">অন্য কোনো রক্তের গ্রুপ বা এলাকা দিয়ে অনুসন্ধান করুন।</p>
          </div>
        )}
      </div>
    </>
  );
}
