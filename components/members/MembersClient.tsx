"use client";

import { useState, useMemo } from "react";
import { Profile } from "@prisma/client";
import MemberCard from "@/components/members/MemberCard";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MembersClientProps {
  members: Profile[];
  schools?: string[];
  bloodGroups?: string[];
}

export default function MembersClient({ members }: MembersClientProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return members;

    return members.filter((m) => {
      return (
        m.banglaFullName.toLowerCase().includes(q) ||
        m.engFullName.toLowerCase().includes(q) ||
        m.nickName.toLowerCase().includes(q) ||
        m.schoolName.toLowerCase().includes(q) ||
        m.profession.toLowerCase().includes(q) ||
        m.personalMobile.includes(q)
      );
    });
  }, [members, query]);

  return (
    <>
      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-5 mb-8">
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

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
          <p>
            <strong className="text-slate-800 font-semibold">
              {filtered.length}
            </strong>{" "}
            জন সদস্য প্রদর্শিত হচ্ছে (মোট {members.length} জন)
          </p>
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-rose-600 hover:text-rose-700 font-semibold hover:underline"
            >
              অনুসন্ধান মুছুন
            </button>
          )}
        </div>
      </div>

      {/* Member Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <AnimatePresence>
            {filtered.map((member, i) => (
              <motion.div
                key={member.id}
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
            অনুসন্ধানের বানান পরিবর্তন করে আবার চেষ্টা করুন।
          </p>
          {query && (
            <button
              onClick={() => setQuery("")}
              className="mt-4 px-4 py-2 bg-rose-50 text-rose-700 text-xs font-semibold rounded-xl hover:bg-rose-100 transition-colors"
            >
              সকল সদস্য দেখান
            </button>
          )}
        </div>
      )}
    </>
  );
}
