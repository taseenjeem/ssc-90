"use client";

import { useState } from "react";
import Image from "next/image";

interface ThenNowSliderProps {
  thenSrc: string;
  nowSrc: string | null;
  name: string;
}

export default function ThenNowSlider({ thenSrc, nowSrc, name }: ThenNowSliderProps) {
  const [showThen, setShowThen] = useState(true);

  return (
    <div className="space-y-3">
      {/* Toggle buttons */}
      <div className="flex rounded-xl overflow-hidden border border-slate-200 text-sm font-medium">
        <button
          onClick={() => setShowThen(true)}
          className={`flex-1 py-2 transition-all ${
            showThen ? "bg-rose-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50"
          }`}
        >
          ১৯৯০ সালে
        </button>
        <button
          onClick={() => setShowThen(false)}
          className={`flex-1 py-2 transition-all ${
            !showThen ? "bg-rose-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50"
          }`}
        >
          বর্তমানে
        </button>
      </div>

      {/* Photo */}
      <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-100">
        {showThen ? (
          <Image
            src={thenSrc}
            alt={`${name} - ১৯৯০ সালে`}
            fill
            className="object-cover"
            sizes="300px"
          />
        ) : nowSrc ? (
          <Image
            src={nowSrc}
            alt={`${name} - বর্তমান ছবি`}
            fill
            className="object-cover"
            sizes="300px"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400 text-sm">
            বর্তমান ছবি নেই
          </div>
        )}
        <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-full">
          {showThen ? "১৯৯০" : "বর্তমান"}
        </div>
      </div>
    </div>
  );
}
