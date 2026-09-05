"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Images,
  HandHeart,
  MessageSquare,
  ExternalLink,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";
import { cn } from "@/lib/utils";

interface AdminNavProps {
  title?: string;
  subtitle?: string;
}

const adminNavItems = [
  { href: "/admin/dashboard", label: "ড্যাশবোর্ড", icon: LayoutDashboard },
  { href: "/admin/members", label: "সদস্য তালিকা", icon: Users },
  { href: "/admin/gallery", label: "গ্যালারি", icon: Images },
  { href: "/admin/initiatives", label: "উদ্যোগ", icon: HandHeart },
  { href: "/admin/memories", label: "স্মৃতিবার্তা", icon: MessageSquare },
];

export default function AdminNav({ title, subtitle }: AdminNavProps) {
  const pathname = usePathname();

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar */}
        <div className="flex items-center justify-between h-16 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <Link href="/admin/dashboard" className="flex items-center gap-2.5 group">
              <div className="bg-gradient-to-br from-rose-500 to-red-600 p-2 rounded-xl text-white shadow-md group-hover:shadow-rose-500/30 transition-shadow">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold text-base leading-none">এসএসসি ব্যাচ ৯০</span>
                  <span className="text-[10px] bg-rose-500/20 text-rose-300 font-semibold px-2 py-0.5 rounded-full border border-rose-500/30">
                    অ্যাডমিন প্যানেল
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">ম্যানেজমেন্ট কন্ট্রোল সেন্টার</p>
              </div>
            </Link>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-medium rounded-xl h-9"
            >
              <Link href="/" target="_blank">
                <ExternalLink className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                ওয়েবসাইট দেখুন
              </Link>
            </Button>
            <AdminLogoutButton />
          </div>
        </div>

        {/* Navigation tabs & page context */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2.5 gap-2 overflow-x-auto no-scrollbar">
          {/* Tabs */}
          <nav className="flex items-center gap-1">
            {adminNavItems.map((item) => {
              const isActive =
                item.href === "/admin/dashboard"
                  ? pathname === "/admin/dashboard"
                  : pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap",
                    isActive
                      ? "bg-rose-600 text-white shadow-sm shadow-rose-900/40"
                      : "text-slate-300 hover:text-white hover:bg-slate-800"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Page context label */}
          {title && (
            <div className="hidden lg:flex items-center gap-2 text-right">
              <div>
                <span className="text-white text-xs font-bold">{title}</span>
                {subtitle && <span className="text-slate-400 text-xs ml-1.5 font-normal">({subtitle})</span>}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
