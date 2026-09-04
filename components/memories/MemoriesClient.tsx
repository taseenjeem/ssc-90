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
import { toast } from "sonner";
import { PenLine, School, User, MessageSquare, Send, Clock, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

const initialState: MemoryFormState = { success: false, message: "" };

interface MemoriesClientProps {
  messages: MemoryMessage[];
}

export default function MemoriesClient({ messages }: MemoriesClientProps) {
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

  return (
    <>
      {/* FAB / Submit button */}
      <div className="flex justify-end mb-8">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              size="lg"
              className="bg-amber-600 hover:bg-amber-700 text-white rounded-2xl shadow-lg shadow-amber-200 px-6 font-semibold"
            >
              <PenLine className="w-4 h-4 mr-2" />
              স্মৃতি লিখুন
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg">স্মৃতিবার্তা লিখুন</DialogTitle>
            </DialogHeader>
            <form action={formAction} className="space-y-4 mt-2">
              <div>
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2 mb-1.5">
                  <User className="w-3.5 h-3.5" /> আপনার নাম *
                </label>
                <Input
                  name="senderName"
                  placeholder="আপনার পূর্ণ নাম লিখুন"
                  className="rounded-xl border-slate-200"
                  required
                />
                {state.errors?.senderName && (
                  <p className="text-xs text-red-500 mt-1">{state.errors.senderName[0]}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2 mb-1.5">
                  <School className="w-3.5 h-3.5" /> স্কুলের নাম (ঐচ্ছিক)
                </label>
                <Input
                  name="schoolName"
                  placeholder="আপনার স্কুলের নাম"
                  className="rounded-xl border-slate-200"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2 mb-1.5">
                  <MessageSquare className="w-3.5 h-3.5" /> বার্তা *
                </label>
                <textarea
                  name="message"
                  placeholder="আপনার স্মৃতি, অনুভূতি বা বন্ধুদের উদ্দেশ্যে বার্তা লিখুন..."
                  rows={5}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent resize-none"
                  required
                />
                {state.errors?.message && (
                  <p className="text-xs text-red-500 mt-1">{state.errors.message[0]}</p>
                )}
              </div>
              <Button
                type="submit"
                disabled={pending}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold"
              >
                <Send className="w-4 h-4 mr-2" />
                {pending ? "পাঠানো হচ্ছে..." : "বার্তা পাঠান"}
              </Button>
              <p className="text-xs text-slate-400 text-center">
                অ্যাডমিনের অনুমোদনের পর বার্তাটি প্রদর্শিত হবে।
              </p>
            </form>
          </DialogContent>
        </Dialog>
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
