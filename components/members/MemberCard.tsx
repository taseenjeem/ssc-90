import Link from "next/link";
import Image from "next/image";
import { Profile } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { School, Droplets, ArrowRight, User } from "lucide-react";

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
  return (
    <div className="group bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col">
      {/* Avatar */}
      <div className="relative h-44 bg-gradient-to-br from-rose-50 to-slate-100 flex items-center justify-center overflow-hidden">
        {member.profilePicture ? (
          <Image
            src={member.profilePicture}
            alt={member.banglaFullName}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center">
              <User className="w-10 h-10 text-slate-400" />
            </div>
          </div>
        )}
        {/* Deceased / Memoriam badge */}
        {member.isDeceased && (
          <div className="absolute top-3 left-3 z-10">
            <Badge className="bg-slate-900/80 text-white border-0 text-[10px] backdrop-blur-sm px-2 py-0.5">
              প্রয়াত
            </Badge>
          </div>
        )}

        {/* Blood group badge */}
        <div className="absolute top-3 right-3 z-10">
          <Badge
            className={`text-xs font-bold border shadow-xs ${BLOOD_COLORS[member.bloodGroup] ?? "bg-slate-50 text-slate-700 border-slate-200"}`}
          >
            <Droplets className="w-3 h-3 mr-1" />
            {member.bloodGroup}
          </Badge>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-bold text-slate-900 text-base leading-tight">
          {member.banglaFullName}
          {member.nickName && (
            <span className="text-rose-500 font-normal text-sm ml-1">
              ({member.nickName})
            </span>
          )}
        </h3>
        <p className="text-xs text-slate-400 mt-0.5 mb-3">
          {member.engFullName}
        </p>

        <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-2">
          <School className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
          <span className="line-clamp-1">{member.schoolName}</span>
        </div>

        <Button
          asChild
          size="sm"
          className="mt-auto w-full bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-medium"
        >
          <Link href={`/members/${member.id}`}>
            সম্পূর্ণ প্রোফাইল <ArrowRight className="ml-1 w-3.5 h-3.5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
