"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/", label: "হোম" },
  { href: "/members", label: "সদস্য" },
  { href: "/gallery", label: "গ্যালারি" },
  { href: "/initiatives", label: "উদ্যোগ" },
  { href: "/blood-bank", label: "রক্তদান" },
  { href: "/memories", label: "স্মৃতির দেয়াল" },
  { href: "/in-memoriam", label: "শ্রদ্ধাঞ্জলি" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-rose-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-br from-rose-500 to-red-600 p-2 rounded-xl shadow-md group-hover:shadow-rose-300 transition-all duration-300">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold text-rose-700">এসএসসি ব্যাচ ৯০</span>
              <span className="text-[10px] text-slate-500 font-medium">SSC Batch 1990</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
                  pathname === link.href
                    ? "bg-rose-50 text-rose-700 shadow-sm"
                    : "text-slate-600 hover:text-rose-600 hover:bg-rose-50/60"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden border-t border-rose-100 bg-white overflow-hidden"
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                    pathname === link.href
                      ? "bg-rose-50 text-rose-700"
                      : "text-slate-600 hover:bg-rose-50 hover:text-rose-600"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
