"use client";

import { useState, useTransition } from "react";
import { Initiative } from "@prisma/client";
import { createInitiative, deleteInitiative } from "@/actions/initiatives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Trash2, MapPin, Calendar } from "lucide-react";

export default function AdminInitiativesClient({ initiatives }: { initiatives: Initiative[] }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await createInitiative(formData);
      if (result.success) {
        toast.success("উদ্যোগ সফলভাবে যোগ হয়েছে!");
        setOpen(false);
      } else {
        toast.error("তথ্য সঠিক নয়।");
      }
    });
  };

  const handleDelete = (id: string, title: string) => {
    if (!confirm(`"${title}" মুছে ফেলতে চান?`)) return;
    startTransition(async () => {
      await deleteInitiative(id);
      toast.success("উদ্যোগ মুছে ফেলা হয়েছে।");
    });
  };

  return (
    <>
      <div className="flex justify-end mb-6">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">
              <Plus className="w-4 h-4 mr-2" /> নতুন উদ্যোগ যোগ করুন
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>নতুন উদ্যোগ যোগ করুন</DialogTitle></DialogHeader>
            <form onSubmit={handleAdd} className="space-y-3 mt-2">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">শিরোনাম *</label>
                <Input name="title" required className="rounded-lg text-sm" placeholder="বন্যা দুর্গতদের ত্রাণ বিতরণ" />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">বিবরণ *</label>
                <textarea name="description" required rows={4} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-400" placeholder="উদ্যোগের বিস্তারিত বিবরণ..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">তারিখ *</label>
                  <Input name="date" required className="rounded-lg text-sm" placeholder="জানুয়ারি ২০২৪" />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">স্থান *</label>
                  <Input name="location" required className="rounded-lg text-sm" placeholder="সিলেট, বাংলাদেশ" />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">বাজেট</label>
                  <Input name="budget" className="rounded-lg text-sm" placeholder="২,৫০,০০০ টাকা" />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">প্রভাব</label>
                  <Input name="impact" className="rounded-lg text-sm" placeholder="৬০০+ পরিবার" />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">ছবির URL সমূহ (কমা দিয়ে আলাদা করুন)</label>
                <textarea name="images" rows={2} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-400" placeholder="https://..., https://..." />
              </div>
              <Button type="submit" disabled={pending} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">
                {pending ? "যোগ হচ্ছে..." : "উদ্যোগ যোগ করুন"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {initiatives.map((initiative) => (
          <div key={initiative.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-slate-900 mb-1">{initiative.title}</h3>
              <p className="text-sm text-slate-500 line-clamp-2 mb-2">{initiative.description}</p>
              <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{initiative.date}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{initiative.location}</span>
                {initiative.impact && <span>{initiative.impact}</span>}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(initiative.id, initiative.title)}
              className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl flex-shrink-0"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
        {initiatives.length === 0 && <div className="text-center py-20 text-slate-400">কোনো উদ্যোগ যোগ হয়নি।</div>}
      </div>
    </>
  );
}
