"use client";

import { useState, useTransition } from "react";
import { GalleryItem } from "@prisma/client";
import { createGalleryItem, deleteGalleryItem } from "@/actions/gallery";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Image from "next/image";
import { Plus, Trash2, Star } from "lucide-react";

const CATEGORIES = ["পুনর্মিলনী", "স্কুল জীবন", "ট্যুর ও আড্ডা", "স্মারক"];

export default function AdminGalleryClient({ items }: { items: GalleryItem[] }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await createGalleryItem(formData);
      if (result.success) {
        toast.success("ছবি সফলভাবে যোগ হয়েছে!");
        setOpen(false);
      } else {
        toast.error("তথ্য সঠিক নয়।");
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("ছবিটি মুছে ফেলতে চান?")) return;
    startTransition(async () => {
      await deleteGalleryItem(id);
      toast.success("ছবি মুছে ফেলা হয়েছে।");
    });
  };

  return (
    <>
      <div className="flex justify-end mb-6">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
              <Plus className="w-4 h-4 mr-2" /> ছবি যোগ করুন
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>নতুন ছবি যোগ করুন</DialogTitle></DialogHeader>
            <form onSubmit={handleAdd} className="space-y-3 mt-2">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">শিরোনাম *</label>
                <Input name="title" required className="rounded-lg text-sm" placeholder="পুনর্মিলনী ২০২৪" />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">ছবির URL *</label>
                <Input name="imageUrl" required type="url" className="rounded-lg text-sm" placeholder="https://..." />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">ক্যাটাগরি *</label>
                <Select name="category" defaultValue="পুনর্মিলনী">
                  <SelectTrigger className="rounded-lg text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">তারিখ</label>
                <Input name="eventDate" className="rounded-lg text-sm" placeholder="১৫ জানুয়ারি, ২০২৪" />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">বিবরণ</label>
                <textarea name="description" rows={2} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="ছবির বিবরণ..." />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" name="featured" value="true" id="featured" className="rounded" />
                <label htmlFor="featured" className="text-sm text-slate-600">হোমপেজে হাইলাইট করুন</label>
              </div>
              <Button type="submit" disabled={pending} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                {pending ? "যোগ হচ্ছে..." : "ছবি যোগ করুন"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {items.map((item) => (
          <div key={item.id} className="group relative bg-slate-100 rounded-xl overflow-hidden shadow-sm aspect-square">
            <Image src={item.imageUrl} alt={item.title} fill className="object-cover" sizes="200px" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
              <div className="flex justify-between items-start">
                {item.featured && <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />}
                <button
                  onClick={() => handleDelete(item.id)}
                  className="ml-auto bg-red-600 text-white rounded-lg p-1 hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div>
                <p className="text-white text-xs font-semibold line-clamp-1">{item.title}</p>
                <Badge className="text-[10px] bg-white/20 text-white border-0 mt-0.5">{item.category}</Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
      {items.length === 0 && (
        <div className="text-center py-20 text-slate-400">কোনো ছবি যোগ হয়নি।</div>
      )}
    </>
  );
}
