"use client";

import { useRef } from "react";
import { Profile } from "@prisma/client";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, GraduationCap, Droplets, School } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { getShimmerDataUrl } from "@/lib/imageShimmer";

interface MemberIdCardProps {
  member: Profile;
}

export default function MemberIdCard({ member }: MemberIdCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1.0,
        pixelRatio: 3,
      });
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `SSC90_${member.nickName}.png`;
      link.click();
      toast.success("ডিজিটাল আইডি কার্ড ডাউনলোড হয়েছে!");
    } catch {
      toast.error("ডাউনলোড ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।");
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
          className="relative bg-gradient-to-br from-slate-900 via-rose-950 to-slate-900 rounded-xl p-5 overflow-hidden"
          style={{ minWidth: 280 }}
        >
          {/* Gold border accent */}
          <div className="absolute inset-0 rounded-xl border-2 border-yellow-400/40" />
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400 rounded-t-xl" />
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400 rounded-b-xl" />

          {/* Header */}
          <div className="flex items-center gap-2 mb-4 relative">
            <div className="bg-gradient-to-br from-rose-500 to-red-600 p-1.5 rounded-lg">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-white text-xs font-bold">এসএসসি ব্যাচ ৯০</p>
              <p className="text-yellow-400 text-[10px]">
                SSC Batch 1990 · Alumni Card
              </p>
            </div>
          </div>

          {/* Member Info */}
          <div className="flex gap-3 relative">
            <div className="w-16 h-20 rounded-lg overflow-hidden bg-slate-700 flex-shrink-0 border-2 border-yellow-400/40">
              {member.profilePicture ? (
                <Image
                  src={member.profilePicture}
                  alt={member.banglaFullName}
                  width={64}
                  height={80}
                  className="object-cover w-full h-full"
                  placeholder="blur"
                  blurDataURL={getShimmerDataUrl(64, 80)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs text-center">
                  ছবি নেই
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm line-clamp-2">
                {member.banglaFullName}
              </p>
              <p className="text-slate-400 text-[11px] mt-0.5">
                {member.engFullName}
              </p>
              <div className="flex items-center gap-1 mt-2">
                <Droplets className="w-3 h-3 text-rose-400" />
                <span className="text-rose-300 text-xs font-bold">
                  {member.bloodGroup}
                </span>
              </div>
              <div className="flex items-start gap-1 mt-1">
                <School className="w-3 h-3 text-slate-400 mt-0.5 flex-shrink-0" />
                <span className="text-slate-300 text-[10px] line-clamp-2">
                  {member.schoolName}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between relative">
            <span className="text-[10px] text-slate-500 font-mono">
              ID: {member.id.slice(0, 8).toUpperCase()}
            </span>
            <span className="text-[10px] text-yellow-400 font-bold">
              SSC 1990
            </span>
          </div>
        </div>

        <Button
          onClick={handleDownload}
          className="w-full mt-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-medium"
          size="sm"
        >
          <Download className="w-4 h-4 mr-2" />
          ডিজিটাল আইডি কার্ড ডাউনলোড
        </Button>
      </CardContent>
    </Card>
  );
}
