"use client";

import { useTransition } from "react";
import { MemoryMessage } from "@prisma/client";
import { approveMemory, deleteMemory } from "@/actions/memories";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CheckCircle, Trash2, User, School, Clock } from "lucide-react";

export default function AdminMemoriesClient({ messages }: { messages: MemoryMessage[] }) {
  const [, startTransition] = useTransition();

  const handleApprove = (id: string) => {
    startTransition(async () => {
      await approveMemory(id);
      toast.success("বার্তা অনুমোদিত হয়েছে!");
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("বার্তাটি বাতিল করতে চান?")) return;
    startTransition(async () => {
      await deleteMemory(id);
      toast.success("বার্তা বাতিল হয়েছে।");
    });
  };

  if (messages.length === 0) {
    return (
      <div className="text-center py-20 text-slate-400">
        <CheckCircle className="w-12 h-12 mx-auto mb-4 text-emerald-300" />
        <p className="text-lg font-medium">কোনো অপেক্ষারত বার্তা নেই!</p>
        <p className="text-sm mt-1">সব বার্তা অনুমোদিত হয়েছে।</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((msg) => (
        <div key={msg.id} className="bg-white border border-amber-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                  <User className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">{msg.senderName}</p>
                  {msg.schoolName && (
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <School className="w-3 h-3" /> {msg.schoolName}
                    </p>
                  )}
                </div>
              </div>
              <p className="text-slate-700 text-sm leading-relaxed bg-slate-50 rounded-xl p-3 italic">
                "{msg.message}"
              </p>
              <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
                <Clock className="w-3 h-3" />
                <span>{new Date(msg.createdAt).toLocaleString("bn-BD")}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 flex-shrink-0">
              <Button
                onClick={() => handleApprove(msg.id)}
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs"
              >
                <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> অনুমোদন করুন
              </Button>
              <Button
                onClick={() => handleDelete(msg.id)}
                variant="outline"
                size="sm"
                className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl text-xs"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1.5" /> বাতিল করুন
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
