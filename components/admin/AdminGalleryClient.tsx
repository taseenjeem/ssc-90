"use client";

import { useState, useEffect, useTransition, useRef, useCallback, useMemo } from "react";
import { GalleryItem } from "@prisma/client";
import { createGalleryItem, deleteGalleryItem, toggleFeaturedGalleryItem } from "@/actions/gallery";
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
import {
  Plus,
  Trash2,
  Star,
  UploadCloud,
  X,
  ImageIcon,
  CheckCircle2,
  Calendar,
  Pencil,
  Search,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react";
import { getSignedUploadUrl } from "@/actions/storage";
import { formatBanglaDate } from "@/lib/utils";
import EditGalleryDialog from "@/components/admin/EditGalleryDialog";

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
  const [galleryList, setGalleryList] = useState<GalleryItem[]>(items);

  // Sync with incoming items
  useEffect(() => {
    setGalleryList(items);
  }, [items]);

  // Upload modal state
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

  // Edit modal state
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const handleOpenEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setEditModalOpen(true);
  };

  const handleEditSuccess = (updated: GalleryItem) => {
    setGalleryList((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
  };

  const handleToggleFeatured = async (e: React.MouseEvent, item: GalleryItem) => {
    e.stopPropagation();
    const newFeaturedStatus = !item.featured;

    // Optimistic UI update
    setGalleryList((prev) =>
      prev.map((it) => (it.id === item.id ? { ...it, featured: newFeaturedStatus } : it))
    );

    const result = await toggleFeaturedGalleryItem(item.id);
    if (result.success) {
      toast.success(
        result.featured
          ? `"${item.title}" হোমপেজে ফিচারড করা হয়েছে!`
          : `"${item.title}" ফিচারড থেকে সরানো হয়েছে।`
      );
    } else {
      // Revert on failure
      setGalleryList((prev) =>
        prev.map((it) => (it.id === item.id ? { ...it, featured: !newFeaturedStatus } : it))
      );
      toast.error(result.message || "ফিচারড স্ট্যাটাস পরিবর্তন ব্যর্থ হয়েছে।");
    }
  };

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

      const result = await getSignedUploadUrl(BUCKET, storagePath);

      if ("error" in result) {
        toast.error(`আপলোড ব্যর্থ: ${result.error}`, { duration: 6000 });
        updated[i] = { ...updated[i], status: "error", error: result.error };
        setFiles([...updated]);
        continue;
      }

      const uploadRes = await fetch(result.signedUrl, {
        method: "PUT",
        headers: { "Content-Type": f.type || "application/octet-stream" },
        body: f,
      });

      if (!uploadRes.ok) {
        const msg = await uploadRes.text().catch(() => uploadRes.statusText);
        updated[i] = { ...updated[i], status: "error", error: msg };
      } else {
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

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("ছবিটি চিরতরে মুছে ফেলতে চান?")) return;

    // Optimistic deletion
    setGalleryList((prev) => prev.filter((item) => item.id !== id));

    startTransition(async () => {
      const res = await deleteGalleryItem(id);
      if (res.success) {
        toast.success("ছবি মুছে ফেলা হয়েছে।");
      } else {
        toast.error("ছবি মোছা যায়নি।");
      }
    });
  };

  // Filter & search logic
  const filteredItems = useMemo(() => {
    return galleryList.filter((item) => {
      // Category filter
      if (selectedFilter === "featured" && !item.featured) return false;
      if (selectedFilter !== "all" && selectedFilter !== "featured" && item.category !== selectedFilter) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesCategory = item.category.toLowerCase().includes(query);
        const matchesDesc = item.description?.toLowerCase().includes(query) ?? false;
        const matchesDate = item.eventDate?.toLowerCase().includes(query) ?? false;
        return matchesTitle || matchesCategory || matchesDesc || matchesDate;
      }

      return true;
    });
  }, [galleryList, selectedFilter, searchQuery]);

  const featuredCount = useMemo(() => galleryList.filter((it) => it.featured).length, [galleryList]);

  const doneCount = files.filter((f) => f.status === "done").length;

  const uploadTrigger = (
    <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm h-11 px-4 font-semibold text-sm shrink-0">
      <Plus className="w-4 h-4 mr-1.5" /> নতুন ছবি যোগ করুন
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
          <label className="text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-blue-600" /> অনুষ্ঠানের তারিখ
          </label>
          <Input
            type="date"
            value={form.eventDate}
            onChange={(e) => setForm((s) => ({ ...s, eventDate: e.target.value }))}
            className="rounded-xl text-base sm:text-sm h-11"
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
      {/* ── Filter, Search and Add Row ──────────────────────────────────── */}
      <div className="space-y-4 mb-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ছবি খুঁজুন (শিরোনাম, বিবরণ, তারিখ)..."
              className="pl-9 pr-9 h-11 rounded-xl bg-white border-slate-200 text-sm focus:border-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Add Photo Button with Dialog or Drawer */}
          <div className="flex items-center gap-2 justify-end">
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
        </div>

        {/* Category & Featured Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedFilter("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedFilter === "all"
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            সকল ছবি ({galleryList.length})
          </button>

          <button
            onClick={() => setSelectedFilter("featured")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all ${
              selectedFilter === "featured"
                ? "bg-amber-500 text-white shadow-sm"
                : "bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200"
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-current" />
            ফিচার্ড ({featuredCount})
          </button>

          {CATEGORIES.map((cat) => {
            const count = galleryList.filter((it) => it.category === cat).length;
            const active = selectedFilter === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedFilter(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  active
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Gallery Grid with Enhanced Card Controls ───────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => handleOpenEdit(item)}
            className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200/80 flex flex-col cursor-pointer"
          >
            {/* Image Box */}
            <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 250px"
                quality={80}
                placeholder="blur"
                blurDataURL={getShimmerDataUrl(250, 250)}
              />

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 opacity-70 group-hover:opacity-90 transition-opacity" />

              {/* Top Quick Actions Bar */}
              <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
                {/* Featured Toggle Button */}
                <button
                  type="button"
                  title={item.featured ? "ফিচারড স্ট্যাটাস সরান" : "হোমপেজে ফিচার্ড করুন"}
                  onClick={(e) => handleToggleFeatured(e, item)}
                  className={`p-1.5 rounded-xl backdrop-blur-md transition-all active:scale-90 ${
                    item.featured
                      ? "bg-amber-500/90 text-white shadow-md shadow-amber-500/30"
                      : "bg-black/40 text-white/80 hover:text-amber-300 hover:bg-black/60"
                  }`}
                >
                  <Star className={`w-4 h-4 ${item.featured ? "fill-white" : ""}`} />
                </button>

                {/* Right Action Buttons (Edit + Delete) */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    title="সম্পাদনা করুন"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenEdit(item);
                    }}
                    className="p-1.5 rounded-xl bg-blue-600/90 hover:bg-blue-600 text-white backdrop-blur-md shadow-sm transition-all hover:scale-105 active:scale-95"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    title="ছবিটি মুছুন"
                    onClick={(e) => handleDelete(e, item.id)}
                    disabled={pending}
                    className="p-1.5 rounded-xl bg-red-600/80 hover:bg-red-600 text-white backdrop-blur-md shadow-sm transition-all hover:scale-105 active:scale-95"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Bottom Card Content Info */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white z-10">
                <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                  <Badge className="text-[10px] bg-white/25 hover:bg-white/30 text-white border-0 backdrop-blur-md px-2 py-0.5 rounded-md font-medium">
                    {item.category}
                  </Badge>
                  {item.eventDate && (
                    <span className="text-[10px] text-white/80 bg-black/30 backdrop-blur-sm px-1.5 py-0.5 rounded flex items-center gap-1">
                      <Calendar className="w-2.5 h-2.5" />
                      {formatBanglaDate(item.eventDate)}
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-white line-clamp-1 leading-snug drop-shadow-sm">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-[11px] text-white/80 line-clamp-1 mt-0.5">
                    {item.description}
                  </p>
                )}
              </div>

              {/* Edit Hint Pill on Hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-lg transform -translate-y-2 group-hover:translate-y-0 transition-transform">
                  <Pencil className="w-3 h-3 text-blue-400" />
                  এডিট করতে ক্লিক করুন
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Empty State ──────────────────────────────────────────────── */}
      {filteredItems.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200/80 p-8 flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
            <ImageIcon className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">কোনো ছবি পাওয়া যায়নি</h3>
            <p className="text-xs text-slate-500 mt-1">
              {searchQuery
                ? `"${searchQuery}" দিয়ে কোনো ফলাফল মেলেনি`
                : "এই ফিল্টারে বর্তমানে কোনো ছবি যুক্ত নেই"}
            </p>
          </div>
          {(searchQuery || selectedFilter !== "all") && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedFilter("all");
              }}
              className="rounded-xl text-xs mt-2"
            >
              সব ফিল্টার রিসেট করুন
            </Button>
          )}
        </div>
      )}

      {/* ── Global Edit Gallery Modal ─────────────────────────────────── */}
      <EditGalleryDialog
        item={editingItem}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        onSuccess={handleEditSuccess}
      />
    </>
  );
}
