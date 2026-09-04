"use client";

import { useState } from "react";
import Image from "next/image";
import { Profile } from "@prisma/client";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { User, ZoomIn } from "lucide-react";

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
      <DialogContent className="max-w-md p-2 bg-black border-0">
        {member.profilePicture ? (
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <Image
              src={member.profilePicture}
              alt={member.banglaFullName}
              fill
              className="object-contain"
            />
          </div>
        ) : (
          <div className="aspect-square flex items-center justify-center bg-slate-900 rounded-lg">
            <User className="w-24 h-24 text-slate-600" />
          </div>
        )}
        <p className="text-center text-white text-sm pb-2">{member.banglaFullName}</p>
      </DialogContent>
    </Dialog>
  );
}
