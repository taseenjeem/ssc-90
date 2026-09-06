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
import { Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getShimmerDataUrl } from "@/lib/imageShimmer";
import { formatBanglaDate } from "@/lib/utils";

interface FeaturedGalleryProps {
  items: GalleryItem[];
}

export default function FeaturedGallery({ items }: FeaturedGalleryProps) {
  const [index, setIndex] = useState(-1);

  if (!items || items.length === 0) return null;

  const slides = items.map((item) => ({
    src: item.imageUrl,
    title: item.title,
    description: item.description ?? undefined,
  }));

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="group relative overflow-hidden rounded-2xl cursor-pointer bg-slate-200 aspect-4/3 shadow-md hover:shadow-xl transition-all duration-300"
            onClick={() => setIndex(i)}
          >
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              quality={85}
              placeholder="blur"
              blurDataURL={getShimmerDataUrl(600, 450)}
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <p className="text-white font-semibold text-sm line-clamp-1">{item.title}</p>
              {item.eventDate && (
                <div className="flex items-center gap-1 mt-1">
                  <Calendar className="w-3 h-3 text-rose-300" />
                  <span className="text-xs text-slate-300">{formatBanglaDate(item.eventDate)}</span>
                </div>
              )}
              <Badge className="mt-1 text-xs bg-rose-600/80 text-white border-0">
                {item.category}
              </Badge>
            </div>
          </motion.div>
        ))}
      </div>

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
