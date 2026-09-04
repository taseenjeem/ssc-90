"use client";

import { useState, useMemo } from "react";
import { Profile } from "@prisma/client";
import MemberCard from "@/components/members/MemberCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MembersClientProps {
  members: Profile[];
  schools: string[];
  bloodGroups: string[];
}

export default function MembersClient({ members, schools, bloodGroups }: MembersClientProps) {
  const [query, setQuery] = useState("");
  const [school, setSchool] = useState("all");
  const [bloodGroup, setBloodGroup] = useState("all");

  const filtered = useMemo(() => {
    return members.filter((m) => {
      const q = query.toLowerCase();
      const matchQuery =
        !q ||
        m.banglaFullName.toLowerCase().includes(q) ||
        m.engFullName.toLowerCase().includes(q) ||
        m.nickName.toLowerCase().includes(q);
      const matchSchool = school === "all" || m.schoolName === school;
      const matchBlood = bloodGroup === "all" || m.bloodGroup === bloodGroup;
      return matchQuery && matchSchool && matchBlood;
    });
  }, [members, query, school, bloodGroup]);

  return (
    <>
      {/* Filter Controls */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-8">
        <div className="flex items-center gap-2 mb-3">
          <SlidersHorizontal className="w-4 h-4 text-rose-600" />
          <span className="text-sm font-semibold text-slate-700">ফিল্টার ও অনুসন্ধান</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="নাম বা ডাকনাম দিয়ে খুঁজুন..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9 border-slate-200 focus:border-rose-400 focus:ring-rose-400 rounded-xl"
            />
          </div>

          <Select value={school} onValueChange={(val) => setSchool(val ?? "all")}>
            <SelectTrigger className="border-slate-200 rounded-xl">
              <SelectValue placeholder="স্কুল বাছুন" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">সকল স্কুল</SelectItem>
              {schools.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={bloodGroup} onValueChange={(val) => setBloodGroup(val ?? "all")}>
            <SelectTrigger className="border-slate-200 rounded-xl">
              <SelectValue placeholder="রক্তের গ্রুপ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">সকল গ্রুপ</SelectItem>
              {bloodGroups.map((bg) => (
                <SelectItem key={bg} value={bg}>
                  {bg}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p className="text-xs text-slate-400 mt-2">
          {filtered.length} জন সদস্য পাওয়া গেছে
        </p>
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
        <div className="text-center py-20 text-slate-400">
          <Search className="w-12 h-12 mx-auto mb-4 text-slate-300" />
          <p className="text-lg font-medium">কোনো সদস্য পাওয়া যায়নি</p>
          <p className="text-sm mt-1">অনুসন্ধানের শর্ত পরিবর্তন করে আবার চেষ্টা করুন</p>
        </div>
      )}
    </>
  );
}
