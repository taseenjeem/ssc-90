import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MemberIdCard from "@/components/members/MemberIdCard";
import ThenNowSlider from "@/components/members/ThenNowSlider";
import AvatarZoomDialog from "@/components/members/AvatarZoomDialog";
import {
  School,
  Droplets,
  Phone,
  MapPin,
  Briefcase,
  Heart,
  Users,
  User,
  PhoneCall,
  MessageCircle,
  Flower2,
  Calendar,
} from "lucide-react";
import { formatBanglaDate } from "@/lib/utils";

export const revalidate = 60;

export default async function MemberProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const member = await prisma.profile.findUnique({ where: { id } });
  if (!member) notFound();

  const fields = [
    { label: "স্কুলের নাম", value: member.schoolName, icon: School },
    { label: "রক্তের গ্রুপ", value: member.bloodGroup, icon: Droplets },
    { label: "পেশা", value: member.profession, icon: Briefcase },
    { label: "বৈবাহিক অবস্থা", value: member.maritalStatus, icon: Heart },
    {
      label: "সন্তান সংখ্যা",
      value:
        member.childrenCount !== null ? `${member.childrenCount} জন` : "০ জন",
      icon: Users,
    },
    { label: "লিঙ্গ", value: member.gender, icon: User },
    ...(member.isDeceased
      ? [
          {
            label: "ইন্তেকালের তারিখ",
            value: member.deceasedDate
              ? formatBanglaDate(member.deceasedDate)
              : "তারিখ সংরক্ষিত নেই",
            icon: Calendar,
          },
        ]
      : []),
    { label: "বর্তমান ঠিকানা", value: member.currentAddress, icon: MapPin },
    { label: "স্থায়ী ঠিকানা", value: member.permanentAddress, icon: MapPin },
    ...(!member.isDeceased && member.personalMobile
      ? [
          {
            label: "মোবাইল",
            value: member.personalMobile,
            icon: Phone,
            isPhone: true,
          },
        ]
      : []),
    ...(!member.isDeceased && member.altMobile
      ? [
          {
            label: "বিকল্প মোবাইল",
            value: member.altMobile,
            icon: Phone,
            isPhone: true,
          },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-rose-950 to-slate-900 py-12 px-4 sm:px-6"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20">
        {/* Main Card */}
        <Card className="shadow-xl border-0 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-rose-600 to-red-700 h-28" />
          <CardContent className="pt-0 pb-8 px-6 sm:px-8">
            <div className="flex flex-col sm:flex-row gap-6 -mt-14 items-start">
              {/* Avatar */}
              <AvatarZoomDialog member={member} />

              {/* Name & basic info */}
              <div className="sm:mt-16 flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                    {member.banglaFullName}
                  </h1>
                  {member.isDeceased && (
                    <Badge className="bg-slate-900 text-slate-100 border-0 gap-1.5 text-xs py-1 px-3 font-semibold shadow-sm">
                      <Flower2 className="w-3.5 h-3.5 text-rose-400" />
                      প্রয়াত বন্ধু {member.deceasedDate ? `• ইন্তেকাল: ${formatBanglaDate(member.deceasedDate)}` : ""}
                    </Badge>
                  )}
                  <Badge className="bg-rose-100 text-rose-700 border-rose-200 border font-bold">
                    <Droplets className="w-3 h-3 mr-1" />
                    {member.bloodGroup}
                  </Badge>
                </div>
                <p className="text-slate-500 mt-1">
                  {member.engFullName} · {member.nickName}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <School className="w-4 h-4 text-rose-400" />
                  <span className="text-sm text-slate-600">
                    {member.schoolName}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Briefcase className="w-4 h-4 text-rose-400" />
                  <span className="text-sm text-slate-600">
                    {member.profession}
                  </span>
                </div>

                {/* Quick actions for living members */}
                {!member.isDeceased && member.personalMobile && (
                  <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-slate-100">
                    <Button
                      asChild
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold h-9 px-4 shadow-sm"
                    >
                      <a href={`tel:${member.personalMobile}`}>
                        <PhoneCall className="w-3.5 h-3.5 mr-1.5" />
                        কল করুন
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Deceased Memorial Banner */}
            {member.isDeceased && (
              <div className="mt-6 p-4 sm:p-5 bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 flex items-start gap-4 shadow-md">
                <div className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 text-slate-300">
                  <Flower2 className="w-6 h-6 text-rose-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-base font-bold text-white">
                      চিরস্মরণীয় বন্ধু
                    </h3>
                    {member.deceasedDate && (
                      <span className="text-xs text-rose-300 font-semibold bg-rose-950/80 border border-rose-800/80 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
                        <Calendar className="w-3.5 h-3.5 text-rose-400" />
                        ইন্তেকাল: {formatBanglaDate(member.deceasedDate)}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 mt-2 italic leading-relaxed">
                    &ldquo;আমাদের বন্ধু আজ আমাদের মাঝে নেই, কিন্তু তাঁর অমলিন স্মৃতি চিরদিন বেঁচে থাকবে আমাদের হৃদয়ে। মহান আল্লাহ তায়ালা তাঁকে জান্নাতুল ফিরদাউস নসিব করুন।&rdquo;
                  </p>
                </div>
              </div>
            )}

            {/* About Me */}
            {member.aboutMe && (
              <div className="mt-6 p-4 bg-rose-50 rounded-xl border border-rose-100">
                <p className="text-sm text-rose-900 leading-relaxed italic">
                  "{member.aboutMe}"
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Detail Fields */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-slate-700">
                  ব্যক্তিগত তথ্য
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="divide-y divide-slate-50">
                  {fields.map((f) => (
                    <div key={f.label} className="flex items-start py-3 gap-3">
                      <f.icon className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-400 mb-0.5">
                          {f.label}
                        </p>
                        {f.isPhone ? (
                          <a
                            href={`tel:${f.value}`}
                            className="text-sm font-medium text-rose-600 hover:underline"
                          >
                            {f.value}
                          </a>
                        ) : (
                          <p className="text-sm font-medium text-slate-800">
                            {f.value}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Then & Now */}
            {member.thenPhoto && (
              <Card className="border-0 shadow-md overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-slate-700">
                    তখন ও এখন
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ThenNowSlider
                    thenSrc={member.thenPhoto}
                    nowSrc={member.profilePicture ?? null}
                    name={member.banglaFullName}
                  />
                </CardContent>
              </Card>
            )}

            {/* ID Card */}
            <MemberIdCard member={member} />
          </div>
        </div>
      </div>
    </div>
  );
}
