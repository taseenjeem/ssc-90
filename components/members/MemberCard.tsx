import Link from "next/link";
import Image from "next/image";
import { Profile } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { School, Droplets, ArrowRight, User, Flower2, Calendar } from "lucide-react";
import { getShimmerDataUrl } from "@/lib/imageShimmer";
import { formatBanglaDate, cn } from "@/lib/utils";

interface MemberCardProps {
  member: Profile;
}

const BLOOD_COLORS: Record<string, string> = {
  "A+": "bg-red-50 text-red-700 border-red-200",
  "A-": "bg-red-50 text-red-700 border-red-200",
  "B+": "bg-orange-50 text-orange-700 border-orange-200",
  "B-": "bg-orange-50 text-orange-700 border-orange-200",
  "O+": "bg-rose-50 text-rose-700 border-rose-200",
  "O-": "bg-rose-50 text-rose-700 border-rose-200",
  "AB+": "bg-purple-50 text-purple-700 border-purple-200",
  "AB-": "bg-purple-50 text-purple-700 border-purple-200",
};

export default function MemberCard({ member }: MemberCardProps) {
  const isDeceased = member.isDeceased;

  return (
    <div
      className={cn(
        "group backdrop-blur-md rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col",
        isDeceased
          ? "bg-slate-50/95 border border-slate-300/80 hover:border-slate-400"
          : "bg-white/90 border border-slate-200/80 hover:border-rose-300"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "relative aspect-square w-full flex items-center justify-center overflow-hidden transition-colors",
          isDeceased
            ? "bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200"
            : "bg-gradient-to-br from-rose-50 to-slate-100"
        )}
      >
        {member.profilePicture ? (
          <Image
            src={member.profilePicture}
            alt={member.banglaFullName}
            fill
            className={cn(
              "object-cover transition-all duration-500 group-hover:scale-105",
              isDeceased && "grayscale contrast-110 group-hover:grayscale-0"
            )}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            quality={85}
            placeholder="blur"
            blurDataURL={getShimmerDataUrl(300, 300)}
          />
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div
              className={cn(
                "w-20 h-20 rounded-full flex items-center justify-center",
                isDeceased ? "bg-slate-300 text-slate-500" : "bg-slate-200 text-slate-400"
              )}
            >
              <User className="w-10 h-10" />
            </div>
          </div>
        )}

        {/* Subtle Overlay for Deceased */}
        {isDeceased && (
          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300 pointer-events-none" />
        )}

        {/* Deceased / Memoriam badge */}
        {isDeceased && (
          <div className="absolute top-3 left-3 z-10">
            <Badge className="bg-slate-900/90 text-white border-0 text-[11px] backdrop-blur-md px-2.5 py-0.5 flex items-center gap-1 shadow-sm font-medium">
              <Flower2 className="w-3 h-3 text-slate-300" />
              প্রয়াত
            </Badge>
          </div>
        )}

        {/* Blood group badge */}
        <div className="absolute top-3 right-3 z-10">
          <Badge
            className={cn(
              "text-xs font-bold border shadow-xs",
              isDeceased
                ? "bg-slate-100 text-slate-700 border-slate-300"
                : BLOOD_COLORS[member.bloodGroup] ?? "bg-slate-50 text-slate-700 border-slate-200"
            )}
          >
            <Droplets className={cn("w-3 h-3 mr-1", isDeceased ? "text-slate-500" : "text-rose-600")} />
            {member.bloodGroup}
          </Badge>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-bold text-slate-900 text-base leading-tight">
          {member.banglaFullName}
          {member.nickName && (
            <span
              className={cn(
                "font-normal text-sm ml-1",
                isDeceased ? "text-slate-500" : "text-rose-500"
              )}
            >
              ({member.nickName})
            </span>
          )}
        </h3>
        <p className="text-xs text-slate-400 mt-0.5 mb-2">
          {member.engFullName}
        </p>

        {isDeceased && member.deceasedDate && (
          <div className="inline-flex items-center gap-1 text-[11px] text-slate-600 font-medium bg-slate-200/70 border border-slate-300/60 rounded-md px-2 py-0.5 mb-2.5 self-start">
            <Calendar className="w-3 h-3 text-slate-500" />
            <span>ইন্তেকাল: {formatBanglaDate(member.deceasedDate)}</span>
          </div>
        )}

        <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-3">
          <School className={cn("w-3.5 h-3.5 flex-shrink-0", isDeceased ? "text-slate-400" : "text-rose-500")} />
          <span className="line-clamp-1">{member.schoolName}</span>
        </div>

        <Button
          asChild
          size="sm"
          className={cn(
            "mt-auto w-full rounded-xl text-sm font-medium transition-colors",
            isDeceased
              ? "bg-slate-800 hover:bg-slate-900 text-white"
              : "bg-rose-600 hover:bg-rose-700 text-white"
          )}
        >
          <Link href={`/members/${member.id}`}>
            {isDeceased ? "স্মৃতি ও প্রোফাইল" : "সম্পূর্ণ প্রোফাইল"}{" "}
            <ArrowRight className="ml-1 w-3.5 h-3.5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
