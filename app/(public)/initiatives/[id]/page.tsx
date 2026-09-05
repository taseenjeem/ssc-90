import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Users, Banknote, ArrowLeft } from "lucide-react";
import InitiativeLightbox from "@/components/initiatives/InitiativeLightbox";
import { getShimmerDataUrl } from "@/lib/imageShimmer";

export const revalidate = 3600;

export default async function InitiativeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const initiative = await prisma.initiative.findUnique({ where: { id } });
  if (!initiative) notFound();

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Back Button */}
      <div className="bg-white border-b border-slate-100 py-3 px-4">
        <div className="max-w-5xl mx-auto">
          <Button asChild variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
            <Link href="/initiatives">
              <ArrowLeft className="w-4 h-4 mr-1.5" /> সকল উদ্যোগ
            </Link>
          </Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Hero */}
        {initiative.images.length > 0 && (
          <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden mb-8 shadow-lg">
            <Image
              src={initiative.images[0]}
              alt={initiative.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 1024px"
              quality={85}
              placeholder="blur"
              blurDataURL={getShimmerDataUrl(1024, 384)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">{initiative.title}</h1>

        {/* Meta */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 gap-1">
            <Calendar className="w-3.5 h-3.5" /> {initiative.date}
          </Badge>
          <Badge className="bg-slate-100 text-slate-600 border border-slate-200 gap-1">
            <MapPin className="w-3.5 h-3.5" /> {initiative.location}
          </Badge>
          {initiative.impact && (
            <Badge className="bg-blue-50 text-blue-700 border border-blue-200 gap-1">
              <Users className="w-3.5 h-3.5" /> {initiative.impact}
            </Badge>
          )}
          {initiative.budget && (
            <Badge className="bg-amber-50 text-amber-700 border border-amber-200 gap-1">
              <Banknote className="w-3.5 h-3.5" /> {initiative.budget}
            </Badge>
          )}
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-8">
          <p className="text-slate-700 leading-relaxed whitespace-pre-line">{initiative.description}</p>
        </div>

        {/* Photo Gallery */}
        {initiative.images.length > 1 && (
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4">ছবির সংকলন</h2>
            <InitiativeLightbox images={initiative.images} title={initiative.title} />
          </div>
        )}
      </div>
    </div>
  );
}
