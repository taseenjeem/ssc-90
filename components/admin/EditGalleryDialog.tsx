"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { GalleryItem } from "@prisma/client";
import { updateGalleryItem } from "@/actions/gallery";
import { getSignedUploadUrl } from "@/actions/storage";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Image from "next/image";
import {
  Pencil,
  UploadCloud,
  X,
  ImageIcon,
  Calendar,
  Star,
  Check,
  Loader2,
  RefreshCw,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { formatBanglaDate } from "@/lib/utils";

const CATEGORIES = ["পুনর্মিলনী", "স্কুল জীবন", "ট্যুর ও আড্ডা", "স্মারক"];
const ACCEPTED = ["image/jpg", "image/jpeg", "image/png", "image/webp", "image/heic"];
const MAX_SIZE_MB = 10;
const BUCKET = process.env.NEXT_PUBLIC_STORAGE_BUCKET_GALLERY || "gallery";
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://pzowrpnbbymuvfnwuqhh.supabase.co";

interface EditGalleryDialogProps {
  item: GalleryItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (updated: GalleryItem) => void;
}

export default function EditGalleryDialog({
  item,
  open,
  onOpenChange,
  onSuccess,
}: EditGalleryDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [pending, startTransition] = useTransition();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("পুনর্মিলনী");
  const [eventDate, setEventDate] = useState("");
  const [description, setDescription] = useState("");
  const [featured, setFeatured] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  // New replacement image state
  const [newFile, setNewFile] = useState<File | null>(null);
  const [newPreview, setNewPreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state when item changes
  useEffect(() => {
    if (item) {
      setTitle(item.title || "");
      setCategory(item.category || "পুনর্মিলনী");
      setEventDate(item.eventDate || "");
      setDescription(item.description || "");
      setFeatured(item.featured || false);
      setImageUrl(item.imageUrl || "");
      setNewFile(null);
      if (newPreview) {
        URL.revokeObjectURL(newPreview);
        setNewPreview(null);
      }
    }
  }, [item]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED.includes(file.type) && !file.name.toLowerCase().endsWith(".heic")) {
      toast.error(`"${file.name}" — অসমর্থিত ছবির ফরম্যাট`);
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`"${file.name}" — সর্বোচ্চ ${MAX_SIZE_MB} MB এর বেশি`);
      return;
    }

    if (newPreview) {
      URL.revokeObjectURL(newPreview);
    }

    setNewFile(file);
    setNewPreview(URL.createObjectURL(file));
    e.target.value = "";
  };

  const handleRevertPhoto = () => {
    if (newPreview) {
      URL.revokeObjectURL(newPreview);
    }
    setNewFile(null);
    setNewPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;

    if (!title.trim()) {
      toast.error("ছবির শিরোনাম লিখুন");
      return;
    }

    startTransition(async () => {
      let finalImageUrl = imageUrl;

      // 1. If a new image was chosen, upload it to Supabase Storage
      if (newFile) {
        setUploadingImage(true);
        const ext = newFile.name.split(".").pop() ?? "webp";
        const storagePath = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        const uploadResult = await getSignedUploadUrl(BUCKET, storagePath);
        if ("error" in uploadResult) {
          toast.error(`ছবি আপলোড ব্যর্থ: ${uploadResult.error}`);
          setUploadingImage(false);
          return;
        }

        const res = await fetch(uploadResult.signedUrl, {
          method: "PUT",
          headers: { "Content-Type": newFile.type || "application/octet-stream" },
          body: newFile,
        });

        if (!res.ok) {
          toast.error("সুপাবেস স্টোরেজে নতুন ছবি সেভ করা যায়নি।");
          setUploadingImage(false);
          return;
        }

        finalImageUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${uploadResult.path}`;
        setUploadingImage(false);
      }

      // 2. Submit updated metadata to Server Action
      const fd = new FormData();
      fd.append("title", title.trim());
      fd.append("category", category);
      fd.append("eventDate", eventDate.trim());
      fd.append("description", description.trim());
      fd.append("imageUrl", finalImageUrl);
      if (featured) fd.append("featured", "true");

      const result = await updateGalleryItem(item.id, fd);

      if (!result.success) {
        toast.error("তথ্য আপডেট করা সম্ভব হয়নি।");
        return;
      }

      toast.success("ছবির তথ্য সফলভাবে আপডেট হয়েছে!");
      if (result.item && onSuccess) {
        onSuccess(result.item);
      }
      onOpenChange(false);
    });
  };

  if (!item) return null;

  const displayImage = newPreview || imageUrl;

  const modalHeaderContent = (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 shrink-0">
        <Pencil className="w-5 h-5 text-blue-600" />
      </div>
      <div>
        <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
          ছবির বিস্তারিত সম্পাদনা করুন
        </h2>
        <p className="text-xs text-slate-500">
          শিরোনাম, ক্যাটাগরি, তারিখ, বিবরণ ও ছবি পরিবর্তন করতে পারবেন
        </p>
      </div>
    </div>
  );

  const formBody = (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* ── Photo Preview & Replacement Area ───────────────────── */}
      <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-32 h-32 sm:w-36 sm:h-36 shrink-0 rounded-2xl overflow-hidden border-2 border-white shadow-md bg-slate-200 group">
            {displayImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={displayImage}
                alt={title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                <ImageIcon className="w-8 h-8" />
              </div>
            )}

            {newPreview && (
              <div className="absolute top-1.5 left-1.5 bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow">
                নতুন ছবি
              </div>
            )}

            {uploadingImage && (
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white text-xs gap-1">
                <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
                <span>আপলোড হচ্ছে…</span>
              </div>
            )}
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2 w-full">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="text-sm font-semibold text-slate-800">
                ছবি পরিবর্তন / প্রতিস্থাপন
              </span>
              {newPreview && (
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
                  পরিবর্তন প্রক্রিয়াধীন
                </Badge>
              )}
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              যদি এই ছবির জায়গায় নতুন কোনো ছবি দিতে চান, তবে নিচে ক্লিক করে নতুন ছবি সিলেক্ট করুন। (JPG, PNG, WebP)
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-xl border-blue-200 bg-blue-50/60 text-blue-700 hover:bg-blue-100 hover:text-blue-800 text-xs font-semibold h-9"
              >
                <UploadCloud className="w-4 h-4 mr-1.5" />
                {newPreview ? "অন্য ছবি বেছে নিন" : "নতুন ছবি নির্বাচন করুন"}
              </Button>

              {newPreview && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRevertPhoto}
                  className="rounded-xl text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 h-9"
                >
                  <RefreshCw className="w-3.5 h-3.5 mr-1" />
                  আগের ছবিতে ফিরুন
                </Button>
              )}

              {imageUrl && !newPreview && (
                <a
                  href={imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 px-2 py-1.5 rounded-lg hover:bg-slate-200/50 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  মূল ছবি দেখুন
                </a>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp,.heic,image/jpg,image/jpeg,image/png,image/webp,image/heic"
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Metadata Form Inputs ───────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Title */}
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-700 mb-1.5 block">
            ছবির শিরোনাম <span className="text-red-500">*</span>
          </label>
          <Input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-xl text-base sm:text-sm h-11 border-slate-200 focus:border-blue-500"
            placeholder="ছবির একটি সুন্দর শিরোনাম লিখুন..."
          />
        </div>

        {/* Category */}
        <div>
          <label className="text-xs font-semibold text-slate-700 mb-1.5 block">
            ক্যাটাগরি <span className="text-red-500">*</span>
          </label>
          <Select value={category} onValueChange={(v) => setCategory(v ?? category)}>
            <SelectTrigger className="rounded-xl text-base sm:text-sm h-11 border-slate-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Event Date */}
        <div>
          <label className="text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-600" /> অনুষ্ঠানের তারিখ
            </span>
            {eventDate && (
              <span className="text-[11px] text-blue-600 font-normal">
                {formatBanglaDate(eventDate)}
              </span>
            )}
          </label>
          <Input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="rounded-xl text-base sm:text-sm h-11 border-slate-200 focus:border-blue-500"
          />
        </div>

        {/* Description */}
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-700 mb-1.5 block">
            ছবির বিস্তারিত স্মৃতি বা বিবরণ
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl border border-slate-200 p-3 text-base sm:text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="ছবি সম্পর্কে বিস্তারিত তথ্য, স্থান বা বন্ধুদের স্মৃতি লিখুন..."
          />
        </div>
      </div>

      {/* ── Featured Toggle Box ───────────────────────────────── */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0 mt-0.5">
            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
          </div>
          <div>
            <label
              htmlFor="edit-featured"
              className="text-sm font-semibold text-slate-900 cursor-pointer block"
            >
              হোমপেজে হাইলাইট / ফিচারড হিসেবে প্রদর্শন
            </label>
            <p className="text-xs text-slate-500 mt-0.5">
              অন করলে ছবিটি ওয়েবসাইটের হোমপেজে বিশেষভাবে প্রদর্শিত হবে
            </p>
          </div>
        </div>

        <input
          type="checkbox"
          id="edit-featured"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
          className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
        />
      </div>

      {/* ── Buttons ───────────────────────────────────────────── */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
          className="rounded-xl h-11 px-5 text-slate-600 hover:bg-slate-100"
          disabled={pending || uploadingImage}
        >
          বাতিল
        </Button>
        <Button
          type="submit"
          disabled={pending || uploadingImage}
          className="rounded-xl h-11 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-200 transition-all active:scale-[0.98]"
        >
          {pending || uploadingImage ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              সংরক্ষণ করা হচ্ছে…
            </>
          ) : (
            <>
              <Check className="w-4 h-4 mr-1.5" />
              পরিবর্তন সংরক্ষণ করুন
            </>
          )}
        </Button>
      </div>
    </form>
  );

  return isDesktop ? (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[96vw] sm:max-w-2xl md:max-w-3xl max-h-[92vh] flex flex-col p-0 overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-2xl">
        <DialogHeader className="px-6 py-4 border-b border-slate-100 bg-slate-50/80 shrink-0">
          <DialogTitle className="sr-only">ছবির বিস্তারিত সম্পাদনা করুন</DialogTitle>
          {modalHeaderContent}
        </DialogHeader>
        <div className="p-6 overflow-y-auto">{formBody}</div>
      </DialogContent>
    </Dialog>
  ) : (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[92vh] flex flex-col p-0 rounded-t-3xl bg-white">
        <DrawerHeader className="px-5 pt-3 pb-3 border-b border-slate-100 text-left shrink-0">
          <DrawerTitle className="sr-only">ছবির বিস্তারিত সম্পাদনা করুন</DrawerTitle>
          {modalHeaderContent}
        </DrawerHeader>
        <div className="p-5 overflow-y-auto">{formBody}</div>
      </DrawerContent>
    </Drawer>
  );
}
