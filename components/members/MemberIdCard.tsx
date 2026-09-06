"use client";

import { useRef, useState } from "react";
import { Profile } from "@prisma/client";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Download,
  GraduationCap,
  Droplets,
  School,
  Flower2,
  User,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { formatBanglaDate } from "@/lib/utils";

interface MemberIdCardProps {
  member: Profile;
}

export default function MemberIdCard({ member }: MemberIdCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!cardRef.current || downloading) return;
    setDownloading(true);

    try {
      // Ensure all images inside cardRef are fully loaded and decoded before capture
      const imgElements = cardRef.current.querySelectorAll("img");
      for (const img of Array.from(imgElements)) {
        if (!img.complete) {
          await new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        }
        if ("decode" in img) {
          try {
            await img.decode();
          } catch {
            // ignore decode error and proceed
          }
        }
      }

      // Convert card element to high-resolution PNG with cache-busting
      const dataUrl = await toPng(cardRef.current, {
        quality: 1.0,
        pixelRatio: 3,
        cacheBust: true,
      });

      const safeName = (
        member.engFullName ||
        member.banglaFullName ||
        member.nickName ||
        "member"
      )
        .replace(/[^\w\u0980-\u09FF]/g, "_")
        .slice(0, 30);

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `SSC90_Sherpur_ID_${safeName}.png`;
      link.click();
      toast.success("ডিজিটাল আইডি কার্ড সফলভাবে ডাউনলোড হয়েছে!");
    } catch (err) {
      console.error("ID Card download error:", err);
      toast.error("কার্ড ডাউনলোড ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-base text-slate-700">
          ডিজিটাল আইডি কার্ড
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Printable Card */}
        <div
          ref={cardRef}
          key={`card-canvas-${member.id}`}
          className="relative bg-gradient-to-br from-slate-900 via-rose-950 to-slate-900 rounded-xl p-5 overflow-hidden text-left"
          style={{ minWidth: 280 }}
        >
          {/* Gold border accent */}
          <div className="absolute inset-0 rounded-xl border-2 border-yellow-400/40 pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400 rounded-t-xl" />
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400 rounded-b-xl" />

          {/* Header */}
          <div className="flex items-center justify-between mb-4 relative">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-rose-500 to-red-600 p-1.5 rounded-lg shadow-sm shrink-0">
                <GraduationCap className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white text-xs font-bold tracking-tight">
                  এসএসসি ব্যাচ ১৯৯০
                </p>
                <p className="text-yellow-400 text-[10px] font-medium">
                  শেরপুর জেলা · Alumni Card
                </p>
              </div>
            </div>
            <div className="bg-white/10 px-2 py-0.5 rounded border border-white/15 text-[10px] font-semibold text-yellow-300 tracking-wider">
              শেরপুর
            </div>
          </div>

          {/* Member Info */}
          <div className="flex gap-3 relative">
            <div className="w-16 h-20 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0 border-2 border-yellow-400/40 relative shadow-inner">
              {member.profilePicture ? (
                /* Native img with explicit crossOrigin, key, and cache-busting prevents image proxy overlap */
                <img
                  key={`id-card-photo-${member.id}-${member.profilePicture}`}
                  src={member.profilePicture}
                  alt={member.banglaFullName}
                  crossOrigin="anonymous"
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-[10px] text-center p-1 bg-slate-800">
                  <User className="w-6 h-6 text-slate-500 mb-0.5" />
                  <span>ছবি নেই</span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <p className="text-white font-bold text-sm truncate">
                  {member.banglaFullName}
                </p>
                {member.nickName && (
                  <span className="text-rose-300 text-xs font-normal">
                    ({member.nickName})
                  </span>
                )}
              </div>
              <p className="text-slate-400 text-[11px] mt-0.5 truncate">
                {member.engFullName}
              </p>
              <div className="flex items-center gap-1.5 mt-2">
                <Droplets className="w-3 h-3 text-rose-400 shrink-0" />
                <span className="text-rose-300 text-xs font-bold">
                  {member.bloodGroup}
                </span>
                <span className="text-slate-500 text-[10px]">•</span>
                <span className="text-slate-300 text-[10px]">রক্তের গ্রুপ</span>
              </div>
              <div className="flex items-start gap-1 mt-1">
                <School className="w-3 h-3 text-slate-400 mt-0.5 flex-shrink-0" />
                <span className="text-slate-300 text-[10px] line-clamp-1">
                  {member.schoolName}
                </span>
              </div>
              {member.isDeceased && (
                <div className="flex items-center gap-1 mt-1.5 text-[10px] text-yellow-300 font-medium bg-black/50 rounded px-1.5 py-0.5 self-start border border-yellow-400/30">
                  <Flower2 className="w-2.5 h-2.5 text-yellow-400 shrink-0" />
                  <span className="truncate">
                    প্রয়াত{" "}
                    {member.deceasedDate
                      ? `• ইন্তেকাল: ${formatBanglaDate(member.deceasedDate)}`
                      : ""}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between relative text-[10px]">
            <span className="text-slate-400 font-mono">
              ID: {member.id.slice(0, 8).toUpperCase()}
            </span>
            <span className="text-yellow-400 font-bold tracking-wide">
              শেরপুর জেলা · SSC 1990
            </span>
          </div>
        </div>

        <Button
          onClick={handleDownload}
          disabled={downloading}
          className="w-full mt-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-medium transition-all"
          size="sm"
        >
          {downloading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              আইডি কার্ড তৈরি হচ্ছে...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              ডিজিটাল আইডি কার্ড ডাউনলোড
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
