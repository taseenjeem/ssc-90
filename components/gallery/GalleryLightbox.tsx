"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Lightbox from "yet-another-react-lightbox";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { GalleryItem } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Sparkles,
  Users,
  GraduationCap,
  Camera,
  Bookmark,
  ImageIcon,
} from "lucide-react";
import { getShimmerDataUrl } from "@/lib/imageShimmer";
import { cn } from "@/lib/utils";

const CATEGORY_META: Record<
  string,
  { label: string; icon: React.ComponentType<{ className?: string }> }
> = {
  সব: { label: "সকল ছবি", icon: Sparkles },
  পুনর্মিলনী: { label: "পুনর্মিলনী", icon: Users },
  "স্কুল জীবন": { label: "স্কুল জীবন", icon: GraduationCap },
  "ট্যুর ও আড্ডা": { label: "ট্যুর ও আড্ডা", icon: Camera },
  স্মারক: { label: "স্মারক", icon: Bookmark },
};

interface GalleryLightboxProps {
  items: GalleryItem[];
}

export default function GalleryLightbox({ items }: GalleryLightboxProps) {
  const [activeCategory, setActiveCategory] = useState("সব");
  const [index, setIndex] = useState(-1);

  const counts = useMemo(() => {
    const map: Record<string, number> = { সব: items.length };
    for (const cat of Object.keys(CATEGORY_META)) {
      if (cat !== "সব") {
        map[cat] = items.filter((item) => item.category === cat).length;
      }
    }
    return map;
  }, [items]);

  const filtered = useMemo(() => {
    if (activeCategory === "সব") return items;
    return items.filter((i) => i.category === activeCategory);
  }, [items, activeCategory]);

  const slides = filtered.map((item) => ({
    src: item.imageUrl,
    title: item.title,
    description: item.description ?? undefined,
  }));

  return (
    <>
      {/* ── Category Filter Bar ────────────────────────────────────────── */}
      <div className="mb-10">
        <div className="bg-white/85 backdrop-blur-md p-1.5 sm:p-2 rounded-2xl border border-slate-200/80 shadow-xs max-w-4xl mx-auto">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar sm:justify-center px-1 py-0.5">
            {Object.entries(CATEGORY_META).map(([cat, meta]) => {
              const Icon = meta.icon;
              const count = counts[cat] ?? 0;
              const isActive = activeCategory === cat;

              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl font-semibold text-xs sm:text-sm whitespace-nowrap transition-all duration-200 shrink-0",
                    isActive
                      ? "bg-gradient-to-r from-rose-600 via-rose-500 to-red-600 text-white shadow-md shadow-rose-900/25 scale-[1.02]"
                      : "text-slate-600 hover:text-slate-950 hover:bg-slate-100/80"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-4 h-4 transition-colors",
                      isActive ? "text-white" : "text-slate-400"
                    )}
                  />
                  <span>{meta.label}</span>
                  <span
                    className={cn(
                      "text-[11px] px-2 py-0.5 rounded-full font-bold transition-colors",
                      isActive
                        ? "bg-white/25 text-white"
                        : "bg-slate-100 text-slate-500"
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic status line */}
        <div className="flex items-center justify-between text-xs text-slate-500 mt-3 px-3 max-w-4xl mx-auto">
          <p>
            প্রদর্শিত হচ্ছে{" "}
            <strong className="text-slate-800 font-semibold">
              {filtered.length}
            </strong>{" "}
            টি ছবি
            {activeCategory !== "সব" && (
              <span className="text-rose-600 font-medium">
                {" "}
                ({activeCategory} ক্যাটাগরি)
              </span>
            )}
          </p>
          {activeCategory !== "সব" && (
            <button
              onClick={() => setActiveCategory("সব")}
              className="text-rose-600 hover:text-rose-700 font-semibold hover:underline"
            >
              সকল ছবি দেখুন
            </button>
          )}
        </div>
      </div>

      {/* ── Photo Grid ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((item, i) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, delay: i * 0.03 }}
            className="group relative overflow-hidden rounded-2xl cursor-pointer bg-slate-200 aspect-square shadow hover:shadow-xl transition-all duration-300 border border-slate-100"
            onClick={() => setIndex(i)}
          >
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              priority={i < 4}
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              quality={85}
              placeholder="blur"
              blurDataURL={getShimmerDataUrl(400, 400)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-3.5 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <p className="text-white font-semibold text-sm line-clamp-1">
                {item.title}
              </p>
              <div className="flex items-center justify-between mt-1.5">
                {item.eventDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-rose-300" />
                    <span className="text-xs text-slate-300">
                      {item.eventDate}
                    </span>
                  </div>
                )}
                <Badge className="text-[10px] bg-rose-600/90 text-white border-0 px-2 py-0.5 ml-auto">
                  {item.category}
                </Badge>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-3xl border border-dashed border-slate-200 max-w-md mx-auto p-6 space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto text-rose-500">
            <ImageIcon className="w-7 h-7" />
          </div>
          <p className="text-base font-bold text-slate-800">
            এই ক্যাটাগরিতে এখনো কোনো ছবি নেই
          </p>
          <p className="text-xs text-slate-500">
            অন্য কোনো ক্যাটাগরি নির্বাচন করুন অথবা সকল ছবি ব্রাউজ করুন।
          </p>
          <button
            onClick={() => setActiveCategory("সব")}
            className="mt-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl transition-all shadow-sm"
          >
            সকল ছবি দেখুন
          </button>
        </div>
      )}

      <Lightbox
        slides={slides}
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
      />
    </>
  );
}
