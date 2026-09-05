"use client";

import { useState } from "react";
import Image from "next/image";
import { Profile } from "@prisma/client";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { User, ZoomIn, X } from "lucide-react";

interface AvatarZoomDialogProps {
  member: Profile;
}

export default function AvatarZoomDialog({ member }: AvatarZoomDialogProps) {
  return (
    <Dialog>
      <DialogTrigger
        nativeButton={false}
        render={
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-xl cursor-pointer group overflow-hidden bg-slate-200 flex-shrink-0">
            {member.profilePicture ? (
              <Image
                src={member.profilePicture}
                alt={member.banglaFullName}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-14 h-14 text-slate-400" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <ZoomIn className="w-8 h-8 text-white" />
            </div>
          </div>
        }
      />
      <DialogContent className="w-[92vw] sm:max-w-md p-3 bg-slate-950/95 backdrop-blur-md border border-slate-800 rounded-3xl shadow-2xl text-white">
        <DialogTitle className="sr-only">
          {member.banglaFullName} - প্রোফাইল ছবি
        </DialogTitle>
        {member.profilePicture ? (
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-black/40">
            <Image
              src={member.profilePicture}
              alt={member.banglaFullName}
              fill
              className="object-contain"
            />
          </div>
        ) : (
          <div className="aspect-square flex items-center justify-center bg-slate-900 rounded-2xl">
            <User className="w-24 h-24 text-slate-600" />
          </div>
        )}
        <div className="text-center pt-2 pb-1">
          <p className="font-bold text-white text-base">{member.banglaFullName}</p>
          {member.nickName && (
            <p className="text-xs text-rose-300 font-medium">({member.nickName})</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

