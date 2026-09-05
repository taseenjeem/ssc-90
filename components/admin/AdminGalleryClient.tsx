"use client";

import { useState, useTransition, useRef, useCallback } from "react";
import { GalleryItem } from "@prisma/client";
import { createGalleryItem, deleteGalleryItem } from "@/actions/gallery";
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
import { getShimmerDataUrl } from "@/lib/imageShimmer";
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
import { Plus, Trash2, Star, UploadCloud, X, ImageIcon, CheckCircle2 } from "lucide-react";
import { getSignedUploadUrl } from "@/actions/storage";

const CATEGORIES = ["পুনর্মিলনী", "স্কুল জীবন", "ট্যুর ও আড্ডা", "স্মারক"];
const ACCEPTED = ["image/jpg", "image/jpeg", "image/png", "image/webp", "image/heic"];
const MAX_SIZE_MB = 10;
const BUCKET = process.env.NEXT_PUBLIC_STORAGE_BUCKET_GALLERY || "gallery";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://pzowrpnbbymuvfnwuqhh.supabase.co";

type FileEntry = {
  file: File;
  preview: string;
  status: "pending" | "uploading" | "done" | "error";
  publicUrl?: string;
  error?: string;
};

type FormState = {
  title: string;
  category: string;
  eventDate: string;
  description: string;
  featured: boolean;
};

export default function AdminGalleryClient({ items }: { items: GalleryItem[] }) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FormState>({
    title: "",
    category: "পুনর্মিলনী",
    eventDate: "",
    description: "",
    featured: false,
  });
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    const entries: FileEntry[] = [];
    for (const f of selected) {
      if (!ACCEPTED.includes(f.type) && !f.name.toLowerCase().endsWith(".heic")) {
        toast.error(`"${f.name}" — অসমর্থিত ফরম্যাট`);
        continue;
      }
      if (f.size > MAX_SIZE_MB * 1024 * 1024) {
        toast.error(`"${f.name}" — সর্বোচ্চ ${MAX_SIZE_MB} MB এর বেশি`);
        continue;
      }
      entries.push({
        file: f,
        preview: URL.createObjectURL(f),
        status: "pending",
      });
    }
    setFiles((prev) => [...prev, ...entries]);
    // reset input so same files can be re-selected
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const copy = [...prev];
      URL.revokeObjectURL(copy[index].preview);
      copy.splice(index, 1);
      return copy;
    });
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const dt = e.dataTransfer;
    const synthetic = { target: { files: dt.files, value: "" } } as unknown as React.ChangeEvent<HTMLInputElement>;
    handleFileChange(synthetic);
  }, []);

  const uploadAll = async (): Promise<FileEntry[]> => {
    const updated = [...files];
    for (let i = 0; i < updated.length; i++) {
      if (updated[i].status === "done") continue;
      updated[i] = { ...updated[i], status: "uploading" };
      setFiles([...updated]);

      const f = updated[i].file;
      const ext = f.name.split(".").pop() ?? "webp";
      const storagePath = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      // 1. Get a signed upload URL from the server (uses service role key)
      const result = await getSignedUploadUrl(BUCKET, storagePath);

      if ("error" in result) {
        // Show the actual error so it's visible (e.g. missing service role key)
        toast.error(`আপলোড ব্যর্থ: ${result.error}`, { duration: 6000 });
        updated[i] = { ...updated[i], status: "error", error: result.error };
        setFiles([...updated]);
        continue;
      }

      // 2. Upload the file directly to Supabase using the signed URL
      const uploadRes = await fetch(result.signedUrl, {
        method: "PUT",
        headers: { "Content-Type": f.type || "application/octet-stream" },
        body: f,
      });

      if (!uploadRes.ok) {
        const msg = await uploadRes.text().catch(() => uploadRes.statusText);
        updated[i] = { ...updated[i], status: "error", error: msg };
      } else {
        // 3. Build the public URL from the confirmed path
        const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${result.path}`;
        updated[i] = { ...updated[i], status: "done", publicUrl };
      }
      setFiles([...updated]);
    }
    return updated;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      toast.error("অন্তত একটি ছবি বেছে নিন।");
      return;
    }
    setSaving(true);

    const uploaded = await uploadAll();
    const successes = uploaded.filter((u) => u.status === "done" && u.publicUrl);
    const failures = uploaded.filter((u) => u.status === "error");

    if (failures.length > 0) {
      toast.error(`${failures.length}টি ছবি আপলোড ব্যর্থ হয়েছে।`);
    }

    if (successes.length === 0) {
      setSaving(false);
      return;
    }

    // Save each successfully uploaded image to DB
    await Promise.all(
      successes.map(async (entry, idx) => {
        const fd = new FormData();
        fd.append("title", successes.length === 1 ? form.title : `${form.title} (${idx + 1})`);
        fd.append("imageUrl", entry.publicUrl!);
        fd.append("category", form.category);
        fd.append("eventDate", form.eventDate);
        fd.append("description", form.description);
        if (form.featured) fd.append("featured", "true");
        await createGalleryItem(fd);
      })
    );

    toast.success(`${successes.length}টি ছবি সফলভাবে যোগ হয়েছে!`);
    setSaving(false);
    setFiles([]);
    setForm({ title: "", category: "পুনর্মিলনী", eventDate: "", description: "", featured: false });
    setOpen(false);
  };

  const handleDelete = (id: string) => {
    if (!confirm("ছবিটি মুছে ফেলতে চান?")) return;
    startTransition(async () => {
      await deleteGalleryItem(id);
      toast.success("ছবি মুছে ফেলা হয়েছে।");
    });
  };

  const pendingCount = files.filter((f) => f.status === "pending").length;
  const doneCount = files.filter((f) => f.status === "done").length;

  const uploadTrigger = (
    <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm">
      <Plus className="w-4 h-4 mr-2" /> ছবি যোগ করুন
    </Button>
  );

  const uploadHeaderContent = (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 shrink-0">
        <ImageIcon className="w-5 h-5 text-blue-600" />
      </div>
      <div>
        <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">গ্যালারিতে ছবি যোগ করুন</h2>
        <p className="text-xs text-slate-500">একসাথে একাধিক স্মৃতি ও ছবি আপলোড করতে পারবেন</p>
      </div>
    </div>
  );

  const uploadFormBody = (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* ── Drop zone ─────────────────────────────────────────── */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/40 transition-colors"
      >
        <UploadCloud className="w-8 h-8 mx-auto mb-2 text-blue-500" />
        <p className="text-sm text-slate-700 font-semibold">
          এখানে ছবি টেনে আনুন অথবা ক্লিক করে বাছাই করুন
        </p>
        <p className="text-xs text-slate-400 mt-1">
          JPG · JPEG · PNG · WebP · HEIC — সর্বোচ্চ 10 MB প্রতিটি — একসাথে একাধিক বেছে নিন
        </p>
        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp,.heic,image/jpg,image/jpeg,image/png,image/webp,image/heic"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* ── File preview grid ─────────────────────────────────── */}
      {files.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>{files.length}টি ছবি নির্বাচিত</span>
            {doneCount > 0 && <span className="text-green-600 font-medium">{doneCount}টি আপলোড সম্পন্ন</span>}
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-52 overflow-y-auto pr-1">
            {files.map((entry, i) => (
              <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 group border border-slate-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={entry.preview} alt="" className="w-full h-full object-cover" />
                {/* status overlay */}
                {entry.status === "uploading" && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                {entry.status === "done" && (
                  <div className="absolute inset-0 bg-green-600/40 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                )}
                {entry.status === "error" && (
                  <div className="absolute inset-0 bg-red-600/60 flex items-center justify-center">
                    <X className="w-5 h-5 text-white" />
                  </div>
                )}
                {/* remove button */}
                {entry.status === "pending" && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                    className="absolute top-1 right-1 bg-black/70 hover:bg-black text-white rounded-full p-1 opacity-90 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
            {/* Add more button */}
            <div
              onClick={() => inputRef.current?.click()}
              className="aspect-square rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-colors"
            >
              <Plus className="w-5 h-5 text-slate-400" />
              <span className="text-[11px] text-slate-500 font-medium mt-0.5">আরও</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Metadata ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-600 mb-1 block">শিরোনাম *</label>
          <Input
            required
            value={form.title}
            onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
            className="rounded-xl text-base sm:text-sm h-11"
            placeholder="যেমন: পুনর্মিলনী ২০২৪"
          />
          {files.length > 1 && (
            <p className="text-[11px] text-slate-400 mt-1">
              একাধিক ছবির ক্ষেত্রে শিরোনামে স্বয়ংক্রিয়ভাবে (1), (2)… যোগ হবে
            </p>
          )}
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600 mb-1 block">ক্যাটাগরি *</label>
          <Select value={form.category} onValueChange={(v) => setForm((s) => ({ ...s, category: v ?? s.category }))}>
            <SelectTrigger className="rounded-xl text-base sm:text-sm h-11"><SelectValue /></SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600 mb-1 block">তারিখ</label>
          <Input
            value={form.eventDate}
            onChange={(e) => setForm((s) => ({ ...s, eventDate: e.target.value }))}
            className="rounded-xl text-base sm:text-sm h-11"
            placeholder="যেমন: ১৫ জানুয়ারি, ২০২৪"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-600 mb-1 block">বিবরণ</label>
          <textarea
            rows={2}
            value={form.description}
            onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
            className="w-full rounded-xl border border-slate-200 p-3 text-base sm:text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="ছবির বিস্তারিত বা স্মৃতি..."
          />
        </div>
      </div>

      <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
        <input
          type="checkbox"
          id="featured"
          checked={form.featured}
          onChange={(e) => setForm((s) => ({ ...s, featured: e.target.checked }))}
          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
        />
        <label htmlFor="featured" className="text-sm font-medium text-slate-700 cursor-pointer">
          হোমপেজে হাইলাইট / ফিচারড হিসেবে দেখান
        </label>
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          disabled={saving || files.length === 0}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold h-11 shadow-md shadow-blue-200 transition-all active:scale-[0.98]"
        >
          {saving
            ? `আপলোড হচ্ছে… (${doneCount}/${files.length})`
            : files.length > 0
            ? `${files.length}টি ছবি আপলোড করুন`
            : "ছবি আপলোড করুন"}
        </Button>
      </div>
    </form>
  );

  return (
    <>
      {/* Header row */}
      <div className="flex justify-end mb-6">
        {isDesktop ? (
          <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setFiles([]); } }}>
            <DialogTrigger asChild>{uploadTrigger}</DialogTrigger>
            <DialogContent className="w-[96vw] sm:max-w-2xl md:max-w-3xl max-h-[92vh] flex flex-col p-0 overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-2xl">
              <DialogHeader className="px-6 py-4 border-b border-slate-100 bg-slate-50/80 shrink-0">
                <DialogTitle className="sr-only">ছবি আপলোড করুন</DialogTitle>
                {uploadHeaderContent}
              </DialogHeader>
              <div className="p-6 overflow-y-auto">{uploadFormBody}</div>
            </DialogContent>
          </Dialog>
        ) : (
          <Drawer open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setFiles([]); } }}>
            <DrawerTrigger asChild>{uploadTrigger}</DrawerTrigger>
            <DrawerContent className="max-h-[92vh] flex flex-col p-0 rounded-t-3xl bg-white">
              <DrawerHeader className="px-5 pt-3 pb-3 border-b border-slate-100 text-left shrink-0">
                <DrawerTitle className="sr-only">ছবি আপলোড করুন</DrawerTitle>
                {uploadHeaderContent}
              </DrawerHeader>
              <div className="p-5 overflow-y-auto">{uploadFormBody}</div>
            </DrawerContent>
          </Drawer>
        )}
      </div>

      {/* ── Gallery grid ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {items.map((item) => (
          <div key={item.id} className="group relative bg-slate-100 rounded-xl overflow-hidden shadow-sm aspect-square">
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px"
              quality={80}
              placeholder="blur"
              blurDataURL={getShimmerDataUrl(200, 200)}
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
              <div className="flex justify-between items-start">
                {item.featured && <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />}
                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={pending}
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
        <div className="text-center py-20 text-slate-400 flex flex-col items-center gap-2">
          <ImageIcon className="w-10 h-10 text-slate-300" />
          <p>কোনো ছবি যোগ হয়নি।</p>
        </div>
      )}
    </>
  );
}
