"use client";

import { useActionState, useState } from "react";
import { MemoryMessage } from "@prisma/client";
import { submitMemory, MemoryFormState } from "@/actions/memories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import { toast } from "sonner";
import { PenLine, School, User, MessageSquare, Send, Clock, Sparkles, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

const initialState: MemoryFormState = { success: false, message: "" };

interface MemoriesClientProps {
  messages: MemoryMessage[];
}

export default function MemoriesClient({ messages }: MemoriesClientProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(submitMemory, initialState);

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      setOpen(false);
    } else if (state.message && !state.success && state.message !== "") {
      // only show error if there's an actual error
    }
  }, [state]);

  const formBody = (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="text-xs sm:text-sm font-semibold text-slate-700 flex items-center gap-1.5 mb-1.5">
          <User className="w-4 h-4 text-amber-600" /> আপনার নাম *
        </label>
        <Input
          name="senderName"
          placeholder="আপনার পূর্ণ নাম লিখুন"
          className="rounded-xl border-slate-200 text-base sm:text-sm h-11"
          required
        />
        {state.errors?.senderName && (
          <p className="text-xs text-red-500 mt-1">{state.errors.senderName[0]}</p>
        )}
      </div>

      <div>
        <label className="text-xs sm:text-sm font-semibold text-slate-700 flex items-center gap-1.5 mb-1.5">
          <School className="w-4 h-4 text-amber-600" /> স্কুলের নাম (ঐচ্ছিক)
        </label>
        <Input
          name="schoolName"
          placeholder="যেমন: ঢাকা কলেজিয়েট স্কুল"
          className="rounded-xl border-slate-200 text-base sm:text-sm h-11"
        />
      </div>

      <div>
        <label className="text-xs sm:text-sm font-semibold text-slate-700 flex items-center gap-1.5 mb-1.5">
          <MessageSquare className="w-4 h-4 text-amber-600" /> আপনার বার্তা বা স্মৃতি *
        </label>
        <textarea
          name="message"
          placeholder="স্কুল জীবনের কোনো মধুর স্মৃতি, বন্ধুদের সাথে আড্ডা বা বন্ধুদের উদ্দেশ্যে যেকোনো বার্তা লিখুন..."
          rows={5}
          className="w-full rounded-xl border border-slate-200 p-3 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none leading-relaxed"
          required
        />
        {state.errors?.message && (
          <p className="text-xs text-red-500 mt-1">{state.errors.message[0]}</p>
        )}
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          disabled={pending}
          className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-xl font-bold h-11 shadow-md shadow-amber-200/50 transition-all active:scale-[0.98]"
        >
          <Send className="w-4 h-4 mr-2" />
          {pending ? "পাঠানো হচ্ছে..." : "স্মৃতিবার্তা পাঠান"}
        </Button>
      </div>

      <p className="text-xs text-slate-400 text-center flex items-center justify-center gap-1">
        <Sparkles className="w-3 h-3 text-amber-500" />
        অ্যাডমিনের অনুমোদনের পর স্মৃতিটি দেয়ালে প্রকাশিত হবে।
      </p>
    </form>
  );

  const headerContent = (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
        <Heart className="w-5 h-5 fill-amber-500/30 text-amber-600" />
      </div>
      <div>
        <h2 className="text-lg font-bold text-slate-900 leading-tight">স্মৃতিবার্তা লিখুন</h2>
        <p className="text-xs text-slate-500">স্কুল জীবনের অনুভূতি ও স্মৃতি বন্ধুদের সাথে শেয়ার করুন</p>
      </div>
    </div>
  );

  const triggerButton = (
    <Button
      size="lg"
      className="bg-amber-600 hover:bg-amber-700 text-white rounded-2xl shadow-lg shadow-amber-200 px-6 font-semibold"
    >
      <PenLine className="w-4 h-4 mr-2" />
      স্মৃতি লিখুন
    </Button>
  );

  return (
    <>
      {/* FAB / Submit button */}
      <div className="flex justify-end mb-8">
        {isDesktop ? (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{triggerButton}</DialogTrigger>
            <DialogContent className="w-[96vw] sm:max-w-lg p-0 overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-2xl">
              <DialogHeader className="px-6 py-4 border-b border-slate-100 bg-slate-50/80">
                <DialogTitle className="sr-only">স্মৃতিবার্তা লিখুন</DialogTitle>
                {headerContent}
              </DialogHeader>
              <div className="p-6">{formBody}</div>
            </DialogContent>
          </Dialog>
        ) : (
          <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
            <DrawerContent className="max-h-[92vh] flex flex-col p-0 rounded-t-3xl bg-white">
              <DrawerHeader className="px-5 pt-3 pb-3 border-b border-slate-100 text-left">
                <DrawerTitle className="sr-only">স্মৃতিবার্তা লিখুন</DrawerTitle>
                {headerContent}
              </DrawerHeader>
              <div className="p-5 overflow-y-auto">{formBody}</div>
            </DrawerContent>
          </Drawer>
        )}
      </div>

      {/* Messages Grid */}
      {messages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {messages.map((msg, i) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-white border border-amber-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">{msg.senderName}</p>
                  {msg.schoolName && (
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <School className="w-3 h-3" /> {msg.schoolName}
                    </p>
                  )}
                </div>
              </div>
              <p className="text-slate-700 text-sm leading-relaxed italic">"{msg.message}"</p>
              <div className="flex items-center gap-1 mt-3 text-xs text-slate-400">
                <Clock className="w-3 h-3" />
                <span>{new Date(msg.createdAt).toLocaleDateString("bn-BD")}</span>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-slate-400">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 text-slate-200" />
          <p className="text-lg font-medium">এখনো কোনো স্মৃতিবার্তা নেই</p>
          <p className="text-sm mt-1">প্রথম স্মৃতিবার্তা লিখুন!</p>
        </div>
      )}
    </>
  );
}
