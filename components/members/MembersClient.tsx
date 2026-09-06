"use client";

import { useState, useMemo } from "react";
import { Profile } from "@prisma/client";
import MemberCard from "@/components/members/MemberCard";
import { Input } from "@/components/ui/input";
import { Search, X, Flower2, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface MembersClientProps {
  members: Profile[];
  schools?: string[];
  bloodGroups?: string[];
}

export default function MembersClient({ members }: MembersClientProps) {
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "living" | "deceased">("all");

  const deceasedCount = useMemo(
    () => members.filter((m) => m.isDeceased).length,
    [members]
  );
  const livingCount = members.length - deceasedCount;

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();

    return members.filter((m) => {
      // Filter by deceased / living
      if (filterType === "living" && m.isDeceased) return false;
      if (filterType === "deceased" && !m.isDeceased) return false;

      // Filter by search query
      if (!q) return true;
      return (
        m.banglaFullName.toLowerCase().includes(q) ||
        m.engFullName.toLowerCase().includes(q) ||
        m.nickName.toLowerCase().includes(q) ||
        m.schoolName.toLowerCase().includes(q) ||
        m.profession.toLowerCase().includes(q) ||
        m.personalMobile.includes(q)
      );
    });
  }, [members, query, filterType]);

  return (
    <>
      {/* Search and Filters Bar */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-sm p-4 sm:p-5 mb-8">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="নাম, ডাকনাম, স্কুল, পেশা বা মোবাইল নম্বর দিয়ে খুঁজুন..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-10 border-slate-200 focus:border-rose-400 focus:ring-rose-400 rounded-xl h-11 text-base sm:text-sm"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              title="অনুসন্ধান মুছুন"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-none">
            <button
              type="button"
              onClick={() => setFilterType("all")}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all",
                filterType === "all"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              সকল বন্ধু ({members.length})
            </button>

            <button
              type="button"
              onClick={() => setFilterType("living")}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all",
                filterType === "living"
                  ? "bg-rose-600 text-white shadow-xs"
                  : "bg-rose-50 text-rose-700 hover:bg-rose-100"
              )}
            >
              বর্তমান বন্ধু ({livingCount})
            </button>

            {deceasedCount > 0 && (
              <button
                type="button"
                onClick={() => setFilterType("deceased")}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all",
                  filterType === "deceased"
                    ? "bg-slate-800 text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                )}
              >
                <Flower2 className="w-3.5 h-3.5 text-slate-400" />
                প্রয়াত বন্ধু ({deceasedCount})
              </button>
            )}
          </div>

          <div className="text-xs text-slate-500">
            <span>
              প্রদর্শিত হচ্ছে{" "}
              <strong className="text-slate-800 font-semibold">
                {filtered.length}
              </strong>{" "}
              জন
            </span>
            {query && (
              <button
                onClick={() => setQuery("")}
                className="text-rose-600 hover:text-rose-700 font-semibold hover:underline ml-2"
              >
                রিসেট
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Member Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <AnimatePresence>
            {filtered.map((member, i) => (
              <motion.div
                key={member.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.4) }}
              >
                <MemberCard member={member} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400">
          <Search className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <p className="text-base font-semibold text-slate-700">
            কোনো সদস্য পাওয়া যায়নি
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {query
              ? `"${query}" দিয়ে কোনো ফলাফল খুঁজে পাওয়া যায়নি`
              : "এই ফিল্টারে বর্তমানে কোনো সদস্য নেই"}
          </p>
          {(query || filterType !== "all") && (
            <button
              onClick={() => {
                setQuery("");
                setFilterType("all");
              }}
              className="mt-3 text-xs text-rose-600 hover:text-rose-700 font-semibold underline"
            >
              সকল ফিল্টার রিসেট করুন
            </button>
          )}
        </div>
      )}
    </>
  );
}
