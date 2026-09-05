"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { getShimmerDataUrl } from "@/lib/imageShimmer";

interface InitiativeLightboxProps {
  images: string[];
  title: string;
}

export default function InitiativeLightbox({ images, title }: InitiativeLightboxProps) {
  const [index, setIndex] = useState(-1);
  const slides = images.map((src) => ({ src, title }));

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {images.map((src, i) => (
          <div
            key={i}
            className="relative aspect-square rounded-xl overflow-hidden cursor-pointer bg-slate-100 hover:opacity-90 transition-opacity shadow-sm"
            onClick={() => setIndex(i)}
          >
            <Image
              src={src}
              alt={`${title} - ${i + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, 33vw"
              quality={85}
              placeholder="blur"
              blurDataURL={getShimmerDataUrl(300, 300)}
            />
          </div>
        ))}
      </div>
      <Lightbox
        slides={slides}
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        plugins={[Fullscreen, Thumbnails, Zoom]}
      />
    </>
  );
}
