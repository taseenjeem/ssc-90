"use client";

import { useState, useTransition, useRef } from "react";
import { Initiative } from "@prisma/client";
import { createInitiative, updateInitiative, deleteInitiative } from "@/actions/initiatives";
import { getSignedUploadUrl } from "@/actions/storage";
import { useMediaQuery } from "@/hooks/use-media-query";
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
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  Edit,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  UploadCloud,
  X,
  Sparkles,
  Loader2,
  ImageIcon,
} from "lucide-react";
import Image from "next/image";

const BUCKET = process.env.NEXT_PUBLIC_STORAGE_BUCKET_INITIATIVES || "initiatives";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://pzowrpnbbymuvfnwuqhh.supabase.co";

export default function AdminInitiativesClient({ initiatives }: { initiatives: Initiative[] }) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  // Selected initiative for editing (null means create new)
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");
  const [impact, setImpact] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [newUrlInput, setNewUrlInput] = useState("");

  // Upload state
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setDate("");
    setLocation("");
    setBudget("");
    setImpact("");
    setImages([]);
    setNewUrlInput("");
  };

  const openCreateModal = () => {
    resetForm();
    setOpen(true);
  };

  const openEditModal = (init: Initiative) => {
    setEditingId(init.id);
    setTitle(init.title);
    setDescription(init.description);
    setDate(init.date);
    setLocation(init.location);
    setBudget(init.budget || "");
    setImpact(init.impact || "");
    setImages(Array.isArray(init.images) ? init.images : []);
    setNewUrlInput("");
    setOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    let successCount = 0;

    for (const file of files) {
      try {
        const ext = file.name.split(".").pop() || "jpg";
        const path = `initiatives/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const signedRes = await getSignedUploadUrl(BUCKET, path);

        if ("error" in signedRes || !signedRes.signedUrl) {
          toast.error(`${file.name} এর আপলোড লিঙ্ক পাওয়া যায়নি`);
          continue;
        }

        const putRes = await fetch(signedRes.signedUrl, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type },
        });

        if (putRes.ok) {
          const finalUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${signedRes.path}`;
          setImages((prev) => [...prev, finalUrl]);
          successCount++;
        } else {
          toast.error(`${file.name} আপলোড ব্যর্থ হয়েছে`);
        }
      } catch {
        toast.error(`${file.name} আপলোড করতে ত্রুটি হয়েছে`);
      }
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (successCount > 0) {
      toast.success(`${successCount}টি ছবি সফলভাবে আপলোড হয়েছে!`);
    }
  };

  const handleAddUrl = () => {
    if (!newUrlInput.trim()) return;
    setImages((prev) => [...prev, newUrlInput.trim()]);
    setNewUrlInput("");
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("date", date);
    formData.append("location", location);
    if (budget.trim()) formData.append("budget", budget.trim());
    if (impact.trim()) formData.append("impact", impact.trim());
    formData.append("images", images.join(","));

    startTransition(async () => {
      if (editingId) {
        const res = await updateInitiative(editingId, formData);
        if (res.success) {
          toast.success("উদ্যোগ সফলভাবে আপডেট হয়েছে!");
          setOpen(false);
          resetForm();
        } else {
          toast.error("আপডেট ব্যর্থ হয়েছে। তথ্য যাচাই করুন।");
        }
      } else {
        const res = await createInitiative(formData);
        if (res.success) {
          toast.success("উদ্যোগ সফলভাবে যোগ হয়েছে!");
          setOpen(false);
          resetForm();
        } else {
          toast.error("যোগ করা ব্যর্থ হয়েছে। তথ্য যাচাই করুন।");
        }
      }
    });
  };

  const handleDelete = (id: string, itemTitle: string) => {
    if (!confirm(`"${itemTitle}" মুছে ফেলতে চান?`)) return;
    startTransition(async () => {
      await deleteInitiative(id);
      toast.success("উদ্যোগ মুছে ফেলা হয়েছে।");
    });
  };

  const triggerButton = (
    <Button
      onClick={openCreateModal}
      className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm"
    >
      <Plus className="w-4 h-4 mr-2" /> নতুন উদ্যোগ যোগ করুন
    </Button>
  );

  const headerContent = (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
        <Sparkles className="w-5 h-5 text-emerald-600" />
      </div>
      <div>
        <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
          {editingId ? "উদ্যোগ সম্পাদনা করুন" : "নতুন উদ্যোগ যোগ করুন"}
        </h2>
        <p className="text-xs text-slate-500">
          বন্ধুদের কল্যাণমূলক ও সামাজিক উদ্যোগের তথ্য সংরক্ষণ করুন
        </p>
      </div>
    </div>
  );

  const formBody = (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div>
        <label className="text-xs font-semibold text-slate-700 mb-1 block">
          শিরোনাম *
        </label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="rounded-xl text-base sm:text-sm h-11"
          placeholder="যেমন: বন্যা দুর্গতদের ত্রাণ বিতরণ"
        />
      </div>

      {/* Description */}
      <div>
        <label className="text-xs font-semibold text-slate-700 mb-1 block">
          বিবরণ *
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={3}
          className="w-full rounded-xl border border-slate-200 p-3 text-base sm:text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed"
          placeholder="উদ্যোগের পটভূমি, কার্যক্রম ও লক্ষ্য সম্পর্কে লিখুন..."
        />
      </div>

      {/* Date & Location */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-emerald-600" /> তারিখ *
          </label>
          <Input
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="rounded-xl text-base sm:text-sm h-11"
            placeholder="যেমন: জানুয়ারি ২০২৪"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" /> স্থান *
          </label>
          <Input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            className="rounded-xl text-base sm:text-sm h-11"
            placeholder="যেমন: সিলেট, বাংলাদেশ"
          />
        </div>
      </div>

      {/* Budget & Impact */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> বাজেট (ঐচ্ছিক)
          </label>
          <Input
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="rounded-xl text-base sm:text-sm h-11"
            placeholder="যেমন: ২,৫০,০০০ টাকা"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-emerald-600" /> প্রভাব / ফলাফল (ঐচ্ছিক)
          </label>
          <Input
            value={impact}
            onChange={(e) => setImpact(e.target.value)}
            className="rounded-xl text-base sm:text-sm h-11"
            placeholder="যেমন: ৬০০+ পরিবার উপকৃত"
          />
        </div>
      </div>

      {/* Photo Upload Section */}
      <div className="pt-2 border-t border-slate-100">
        <label className="text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
          <ImageIcon className="w-4 h-4 text-emerald-600" /> উদ্যোগের ছবি সমূহ
        </label>

        {/* Drop/Upload Area */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-emerald-200 hover:border-emerald-400 bg-emerald-50/40 hover:bg-emerald-50/80 transition-colors rounded-2xl p-4 text-center cursor-pointer mb-3"
        >
          {uploading ? (
            <div className="flex items-center justify-center gap-2 text-emerald-700 font-semibold text-sm py-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>ছবি আপলোড হচ্ছে...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <UploadCloud className="w-7 h-7 text-emerald-600 mb-1" />
              <p className="text-xs sm:text-sm font-semibold text-slate-700">
                ক্লিক করে ছবি আপলোড করুন
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                JPG, PNG, WebP · এক বা একাধিক ছবি বাছাই করতে পারেন
              </p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/jpg"
            multiple
            className="hidden"
            onChange={handleFileUpload}
            disabled={uploading}
          />
        </div>

        {/* Images Grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mb-3 max-h-48 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-100">
            {images.map((url, i) => (
              <div
                key={i}
                className="relative aspect-square rounded-lg overflow-hidden bg-slate-200 group border border-slate-200 shadow-xs"
              >
                <Image
                  src={url}
                  alt={`Initiative photo ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="120px"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(i)}
                  className="absolute top-1 right-1 bg-black/70 hover:bg-black text-white rounded-full p-1 transition-opacity opacity-90"
                  title="ছবি মুছে ফেলুন"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* URL input fallback */}
        <div className="flex gap-2">
          <Input
            value={newUrlInput}
            onChange={(e) => setNewUrlInput(e.target.value)}
            placeholder="অথবা সরাসরি ছবির লিঙ্ক (URL) দিন..."
            className="rounded-xl text-base sm:text-sm h-10 flex-1"
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleAddUrl}
            className="rounded-xl border-slate-200 text-xs font-semibold px-3 h-10"
          >
            যোগ করুন
          </Button>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-3">
        <Button
          type="submit"
          disabled={pending || uploading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold h-11 shadow-md shadow-emerald-200 transition-all active:scale-[0.98]"
        >
          {pending ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> সংরক্ষণ হচ্ছে...
            </span>
          ) : editingId ? (
            "উদ্যোগ আপডেট করুন"
          ) : (
            "উদ্যোগ সংরক্ষণ করুন"
          )}
        </Button>
      </div>
    </form>
  );

  return (
    <>
      {/* Action Toolbar */}
      <div className="flex justify-end mb-6">
        {isDesktop ? (
          <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
            <DialogTrigger asChild>{triggerButton}</DialogTrigger>
            <DialogContent className="w-[96vw] sm:max-w-2xl md:max-w-3xl max-h-[92vh] flex flex-col p-0 overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-2xl">
              <DialogHeader className="px-6 py-4 border-b border-slate-100 bg-slate-50/80 shrink-0">
                <DialogTitle className="sr-only">
                  {editingId ? "উদ্যোগ সম্পাদনা করুন" : "নতুন উদ্যোগ যোগ করুন"}
                </DialogTitle>
                {headerContent}
              </DialogHeader>
              <div className="p-6 overflow-y-auto">{formBody}</div>
            </DialogContent>
          </Dialog>
        ) : (
          <Drawer open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
            <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
            <DrawerContent className="max-h-[92vh] flex flex-col p-0 rounded-t-3xl bg-white">
              <DrawerHeader className="px-5 pt-3 pb-3 border-b border-slate-100 text-left shrink-0">
                <DrawerTitle className="sr-only">
                  {editingId ? "উদ্যোগ সম্পাদনা করুন" : "নতুন উদ্যোগ যোগ করুন"}
                </DrawerTitle>
                {headerContent}
              </DrawerHeader>
              <div className="p-5 overflow-y-auto">{formBody}</div>
            </DrawerContent>
          </Drawer>
        )}
      </div>

      {/* Initiatives List */}
      <div className="space-y-4">
        {initiatives.map((initiative) => (
          <div
            key={initiative.id}
            className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-start justify-between gap-4"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                  {initiative.title}
                </h3>
                {Array.isArray(initiative.images) && initiative.images.length > 0 && (
                  <span className="text-[11px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" />
                    {initiative.images.length}টি ছবি
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-600 line-clamp-2 mb-3 leading-relaxed">
                {initiative.description}
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-500">
                <span className="flex items-center gap-1 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  {initiative.date}
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  {initiative.location}
                </span>
                {initiative.budget && (
                  <span className="flex items-center gap-1 font-medium text-slate-600">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                    {initiative.budget}
                  </span>
                )}
                {initiative.impact && (
                  <span className="flex items-center gap-1 font-medium text-emerald-700">
                    <Users className="w-3.5 h-3.5 text-emerald-600" />
                    {initiative.impact}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 self-end sm:self-start shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 w-full sm:w-auto justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => openEditModal(initiative)}
                className="rounded-xl border-slate-200 text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 hover:border-emerald-200 gap-1.5 text-xs font-semibold h-9 px-3"
              >
                <Edit className="w-3.5 h-3.5" />
                সম্পাদনা
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(initiative.id, initiative.title)}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl h-9 px-2.5"
                title="মুছে ফেলুন"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}

        {initiatives.length === 0 && (
          <div className="text-center py-20 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
            <Sparkles className="w-10 h-10 mx-auto mb-2 text-emerald-400/50" />
            <p className="text-base font-semibold text-slate-600">কোনো উদ্যোগ যোগ করা হয়নি</p>
            <p className="text-xs text-slate-400 mt-0.5">
              উপরের বোতামে ক্লিক করে নতুন উদ্যোগ যোগ করুন।
            </p>
          </div>
        )}
      </div>
    </>
  );
}
