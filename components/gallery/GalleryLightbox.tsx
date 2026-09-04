"use client";

import { useState } from "react";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

const CATEGORIES = ["সব", "পুনর্মিলনী", "স্কুল জীবন", "ট্যুর ও আড্ডা", "স্মারক"];

interface GalleryLightboxProps {
  items: GalleryItem[];
}

export default function GalleryLightbox({ items }: GalleryLightboxProps) {
  const [activeCategory, setActiveCategory] = useState("সব");
  const [index, setIndex] = useState(-1);

  const filtered = activeCategory === "সব" ? items : items.filter((i) => i.category === activeCategory);

  const slides = filtered.map((item) => ({
    src: item.imageUrl,
    title: item.title,
    description: item.description ?? undefined,
  }));

  return (
    <>
      {/* Category Tabs */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-8">
        <TabsList className="flex-wrap h-auto gap-1 bg-slate-100 p-1 rounded-xl">
          {CATEGORIES.map((cat) => (
            <TabsTrigger
              key={cat}
              value={cat}
              className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-rose-700 data-[state=active]:shadow-sm text-slate-600 font-medium"
            >
              {cat}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((item, i) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
            className="group relative overflow-hidden rounded-2xl cursor-pointer bg-slate-200 aspect-square shadow hover:shadow-lg transition-all duration-300"
            onClick={() => setIndex(i)}
          >
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <p className="text-white font-semibold text-sm line-clamp-1">{item.title}</p>
              <div className="flex items-center justify-between mt-1">
                {item.eventDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-rose-300" />
                    <span className="text-xs text-slate-300">{item.eventDate}</span>
                  </div>
                )}
                <Badge className="text-[10px] bg-rose-600/80 text-white border-0 px-1.5 py-0">
                  {item.category}
                </Badge>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-slate-400">
          <p className="text-lg">এই বিভাগে কোনো ছবি নেই।</p>
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
