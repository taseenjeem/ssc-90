import Link from "next/link";
import { Initiative } from "@prisma/client";
import { MapPin, Calendar, Users, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface InitiativesPreviewProps {
  initiatives: Initiative[];
}

export default function InitiativesPreview({ initiatives }: InitiativesPreviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {initiatives.map((initiative) => (
        <div
          key={initiative.id}
          className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col"
        >
          <h3 className="font-bold text-slate-900 text-lg mb-2 line-clamp-2">
            {initiative.title}
          </h3>
          <p className="text-slate-500 text-sm line-clamp-3 mb-4 flex-1">
            {initiative.description}
          </p>
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Calendar className="w-4 h-4 text-emerald-500" />
              <span>{initiative.date}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <MapPin className="w-4 h-4 text-emerald-500" />
              <span>{initiative.location}</span>
            </div>
            {initiative.impact && (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Users className="w-4 h-4 text-emerald-500" />
                <span>{initiative.impact}</span>
              </div>
            )}
          </div>
          {initiative.budget && (
            <Badge className="self-start bg-emerald-50 text-emerald-700 border border-emerald-200 mb-4">
              {initiative.budget}
            </Badge>
          )}
          <Button asChild variant="ghost" size="sm" className="self-start text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 p-0">
            <Link href={`/initiatives/${initiative.id}`}>
              বিস্তারিত দেখুন <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </Button>
        </div>
      ))}
    </div>
  );
}
