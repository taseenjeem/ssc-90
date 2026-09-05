"use client";

import { motion } from "framer-motion";
import { Users, School, HandHeart, BookOpen } from "lucide-react";

export type MetricIconType = "users" | "school" | "initiatives" | "memories";

interface MetricCounterProps {
  iconType: MetricIconType;
  label: string;
  value: number;
  color: string;
}

const icons = {
  users: Users,
  school: School,
  initiatives: HandHeart,
  memories: BookOpen,
};

export default function MetricCounter({ iconType, label, value, color }: MetricCounterProps) {
  const Icon = icons[iconType] ?? Users;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/85 backdrop-blur-md border border-slate-200/80 hover:shadow-xl hover:border-rose-200 hover:-translate-y-1 transition-all duration-300"
    >
      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 shadow-xs mb-3">
        <Icon className={`w-7 h-7 ${color}`} />
      </div>
      <p className={`text-4xl font-bold ${color} mb-1`}>{value.toLocaleString("bn-BD")}</p>
      <p className="text-sm text-slate-600 font-medium">{label}</p>
    </motion.div>
  );
}
