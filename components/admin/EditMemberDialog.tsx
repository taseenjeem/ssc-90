"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { Profile } from "@prisma/client";
import { updateMember } from "@/actions/members";
import { getSignedUploadUrl } from "@/actions/storage";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { getShimmerDataUrl } from "@/lib/imageShimmer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Upload,
  X,
  Loader2,
  Check,
  User,
  Droplets,
  Briefcase,
  MapPin,
  Phone,
  School,
  Sparkles,
  Camera,
  Image as ImageIcon,
  Flame,
  Info,
  Calendar,
} from "lucide-react";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const GENDER_OPTIONS = ["পুরুষ", "মহিলা"];
const MARITAL_OPTIONS = ["বিবাহিত", "অবিবাহিত", "অন্যান্য"];
const BUCKET = process.env.NEXT_PUBLIC_STORAGE_BUCKET_MEMBERS || "members";
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://pzowrpnbbymuvfnwuqhh.supabase.co";

interface EditMemberDialogProps {
  member: Profile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (updated: Profile) => void;
}

export default function EditMemberDialog({
  member,
  open,
  onOpenChange,
  onSuccess,
}: EditMemberDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [pending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState("basic");

  // Form states
  const [banglaFullName, setBanglaFullName] = useState("");
  const [engFullName, setEngFullName] = useState("");
  const [nickName, setNickName] = useState("");
  const [gender, setGender] = useState("পুরুষ");
  const [bloodGroup, setBloodGroup] = useState("O+");
  const [schoolName, setSchoolName] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("বিবাহিত");
  const [childrenCount, setChildrenCount] = useState("0");
  const [profession, setProfession] = useState("");
  const [currentAddress, setCurrentAddress] = useState("");
  const [permanentAddress, setPermanentAddress] = useState("");
  const [personalMobile, setPersonalMobile] = useState("");
  const [altMobile, setAltMobile] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [thenPhoto, setThenPhoto] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [isDeceased, setIsDeceased] = useState(false);
  const [deceasedDate, setDeceasedDate] = useState("");

  // Uploading states
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingThenPhoto, setUploadingThenPhoto] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const thenPhotoInputRef = useRef<HTMLInputElement>(null);

  // Synchronize state when member changes
  useEffect(() => {
    if (member) {
      setBanglaFullName(member.banglaFullName || "");
      setEngFullName(member.engFullName || "");
      setNickName(member.nickName || "");
      setGender(member.gender || "পুরুষ");
      setBloodGroup(member.bloodGroup || "O+");
      setSchoolName(member.schoolName || "");
      setMaritalStatus(member.maritalStatus || "বিবাহিত");
      setChildrenCount(
        member.childrenCount !== null ? String(member.childrenCount) : "0",
      );
      setProfession(member.profession || "");
      setCurrentAddress(member.currentAddress || "");
      setPermanentAddress(member.permanentAddress || "");
      setPersonalMobile(member.personalMobile || "");
      setAltMobile(member.altMobile || "");
      setProfilePicture(member.profilePicture || "");
      setThenPhoto(member.thenPhoto || "");
      setAboutMe(member.aboutMe || "");
      setIsDeceased(Boolean(member.isDeceased));
      setDeceasedDate(
        member.deceasedDate ? member.deceasedDate.slice(0, 10) : "",
      );
      setActiveTab("basic");
    }
  }, [member]);

  // Handle direct file upload for either avatar or thenPhoto
  const handleFileUpload = async (file: File, type: "avatar" | "thenPhoto") => {
    if (!file) return;
    const allowed = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/jpg",
      "image/heic",
    ];
    if (
      !allowed.includes(file.type) &&
      !file.name.toLowerCase().endsWith(".heic")
    ) {
      toast.error("শুধুমাত্র ছবি ফাইল (JPG, PNG, WebP) আপলোড করা যাবে।");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("ছবির সাইজ সর্বোচ্চ 10MB হতে পারে।");
      return;
    }

    const setUploading =
      type === "avatar" ? setUploadingAvatar : setUploadingThenPhoto;
    setUploading(true);

    try {
      const ext = file.name.split(".").pop() ?? "webp";
      const storagePath = `${type}-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const res = await getSignedUploadUrl(BUCKET, storagePath);
      if ("error" in res) {
        toast.error(`আপলোড লিংক তৈরি ব্যর্থ: ${res.error}`);
        return;
      }

      const uploadRes = await fetch(res.signedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type || "application/octet-stream" },
        body: file,
      });

      if (!uploadRes.ok) {
        toast.error("ছবি আপলোড ব্যর্থ হয়েছে। আবার চেষ্টা করুন।");
        return;
      }

      const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${res.path}`;
      if (type === "avatar") {
        setProfilePicture(publicUrl);
      } else {
        setThenPhoto(publicUrl);
      }
      toast.success("ছবি আপলোড সম্পন্ন হয়েছে!");
    } catch (err) {
      console.error(err);
      toast.error("ছবি আপলোড করার সময় সমস্যা হয়েছে।");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!member) return;

    const formData = new FormData();
    formData.append("banglaFullName", banglaFullName);
    formData.append("engFullName", engFullName);
    formData.append("nickName", nickName);
    formData.append("gender", gender);
    formData.append("bloodGroup", bloodGroup);
    formData.append("schoolName", schoolName);
    formData.append("maritalStatus", maritalStatus);
    formData.append("childrenCount", childrenCount || "0");
    formData.append("profession", profession);
    formData.append("currentAddress", currentAddress);
    formData.append("permanentAddress", permanentAddress);
    formData.append("personalMobile", personalMobile);
    formData.append("altMobile", altMobile);
    formData.append("profilePicture", profilePicture);
    formData.append("thenPhoto", thenPhoto);
    formData.append("aboutMe", aboutMe);
    formData.append("isDeceased", String(isDeceased));
    formData.append("deceasedDate", isDeceased && deceasedDate ? deceasedDate : "");

    startTransition(async () => {
      const res = await updateMember(member.id, formData);
      if (res.success && res.member) {
        toast.success("সদস্য তথ্য সফলভাবে আপডেট হয়েছে!");
        onSuccess(res.member);
        onOpenChange(false);
      } else {
        toast.error(res.message || "তথ্য আপডেট করা যায়নি।");
      }
    });
  };

  // Header content rendered inside both DialogHeader and DrawerHeader
  const headerSnapshot = (
    <div className="flex items-center gap-3 text-left">
      <Avatar className="w-11 h-11 sm:w-12 sm:h-12 border-2 border-white shadow-sm ring-1 ring-slate-200 shrink-0">
        <AvatarImage src={profilePicture || undefined} />
        <AvatarFallback className="bg-rose-100 text-rose-700 font-bold text-sm sm:text-base">
          {nickName?.charAt(0) || "স"}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 truncate">
            {banglaFullName || member?.banglaFullName || "সদস্য তথ্য সম্পাদনা"}
          </h2>
          {nickName && (
            <Badge
              variant="secondary"
              className="bg-rose-50 text-rose-700 border-rose-100 text-[11px] font-semibold py-0"
            >
              {nickName}
            </Badge>
          )}
          {isDeceased && (
            <Badge className="bg-slate-700 text-white text-[10px] font-normal py-0">
              প্রয়াত
            </Badge>
          )}
        </div>
        <p className="text-xs text-slate-500 mt-0.5 truncate">
          {schoolName || member?.schoolName || "এসএসসি ব্যাচ ১৯৯০"} •{" "}
          {engFullName || member?.engFullName}
        </p>
      </div>
    </div>
  );

  // The inner form content with fully responsive tabs and fields
  const formContent = (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col flex-1 overflow-hidden"
    >
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex flex-col flex-1 overflow-hidden"
      >
        {/* Responsive Horizontal Scroll Tabs */}
        <div className="px-4 sm:px-6 pt-2 pb-2 border-b border-slate-100 bg-slate-50/50 shrink-0 overflow-x-auto scrollbar-none">
          <TabsList className="bg-slate-200/60 p-1 rounded-xl h-auto inline-flex min-w-full sm:min-w-0 sm:w-auto gap-1">
            <TabsTrigger
              value="basic"
              className="rounded-lg px-2.5 sm:px-3 py-1.5 text-xs font-medium whitespace-nowrap data-[state=active]:bg-white data-[state=active]:text-rose-700 data-[state=active]:shadow-sm flex items-center gap-1.5 shrink-0"
            >
              <User className="w-3.5 h-3.5 shrink-0" />
              <span>মৌলিক তথ্য</span>
            </TabsTrigger>

            <TabsTrigger
              value="contact"
              className="rounded-lg px-2.5 sm:px-3 py-1.5 text-xs font-medium whitespace-nowrap data-[state=active]:bg-white data-[state=active]:text-rose-700 data-[state=active]:shadow-sm flex items-center gap-1.5 shrink-0"
            >
              <Phone className="w-3.5 h-3.5 shrink-0" />
              <span>যোগাযোগ ও ঠিকানা</span>
            </TabsTrigger>

            <TabsTrigger
              value="career"
              className="rounded-lg px-2.5 sm:px-3 py-1.5 text-xs font-medium whitespace-nowrap data-[state=active]:bg-white data-[state=active]:text-rose-700 data-[state=active]:shadow-sm flex items-center gap-1.5 shrink-0"
            >
              <Briefcase className="w-3.5 h-3.5 shrink-0" />
              <span>পেশা ও পরিবার</span>
            </TabsTrigger>

            <TabsTrigger
              value="media"
              className="rounded-lg px-2.5 sm:px-3 py-1.5 text-xs font-medium whitespace-nowrap data-[state=active]:bg-white data-[state=active]:text-rose-700 data-[state=active]:shadow-sm flex items-center gap-1.5 shrink-0"
            >
              <Camera className="w-3.5 h-3.5 shrink-0" />
              <span>ছবি ও স্মরণিকা</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Scrollable Tab Panels */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 overscroll-contain">
          {/* TAB 1: BASIC INFORMATION */}
          <TabsContent
            value="basic"
            className="space-y-4 sm:space-y-5 m-0 focus-visible:outline-none"
          >
            <div className="bg-rose-50/60 border border-rose-100 rounded-xl p-3 flex items-start gap-2 text-rose-900 text-xs">
              <Info className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>
                নাম, ডাকনাম, স্কুল এবং রক্তের গ্রুপ সঠিকভাবে লিখুন। তারকা (*)
                চিহ্নিত ঘরগুলো আবশ্যক।
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">
                  বাংলা পূর্ণ নাম <span className="text-rose-600">*</span>
                </label>
                <Input
                  required
                  value={banglaFullName}
                  onChange={(e) => setBanglaFullName(e.target.value)}
                  className="rounded-xl border-slate-200 text-base sm:text-sm h-10 sm:h-10 focus:ring-rose-500"
                  placeholder="যেমন: মো: রফিকুল ইসলাম"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">
                  ইংরেজি পূর্ণ নাম <span className="text-rose-600">*</span>
                </label>
                <Input
                  required
                  value={engFullName}
                  onChange={(e) => setEngFullName(e.target.value)}
                  className="rounded-xl border-slate-200 text-base sm:text-sm h-10 sm:h-10 focus:ring-rose-500"
                  placeholder="যেমন: Md. Rafiqul Islam"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">
                  ডাকনাম <span className="text-rose-600">*</span>
                </label>
                <Input
                  required
                  value={nickName}
                  onChange={(e) => setNickName(e.target.value)}
                  className="rounded-xl border-slate-200 text-base sm:text-sm h-10 sm:h-10 focus:ring-rose-500"
                  placeholder="যেমন: রফিক"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">
                  এসএসসি ১৯৯০ এর স্কুল <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <School className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    required
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    className="rounded-xl border-slate-200 text-base sm:text-sm h-10 sm:h-10 pl-9.5 focus:ring-rose-500"
                    placeholder="স্কুলের নাম"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">
                  লিঙ্গ <span className="text-rose-600">*</span>
                </label>
                <Select value={gender} onValueChange={(v) => v && setGender(v)}>
                  <SelectTrigger className="w-full rounded-xl border-slate-200 text-base sm:text-sm h-10 sm:h-10 focus:ring-rose-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GENDER_OPTIONS.map((g) => (
                      <SelectItem key={g} value={g}>
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">
                  রক্তের গ্রুপ <span className="text-rose-600">*</span>
                </label>
                <Select
                  value={bloodGroup}
                  onValueChange={(v) => v && setBloodGroup(v)}
                >
                  <SelectTrigger className="w-full rounded-xl border-slate-200 text-base sm:text-sm h-10 sm:h-10 focus:ring-rose-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BLOOD_GROUPS.map((bg) => (
                      <SelectItem key={bg} value={bg}>
                        <span className="flex items-center gap-1.5 font-medium">
                          <Droplets className="w-3.5 h-3.5 text-rose-500" />{" "}
                          {bg}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          {/* TAB 2: CONTACT & ADDRESS */}
          <TabsContent
            value="contact"
            className="space-y-4 sm:space-y-5 m-0 focus-visible:outline-none"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">
                  মূল মোবাইল নম্বর <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    required
                    value={personalMobile}
                    onChange={(e) => setPersonalMobile(e.target.value)}
                    className="rounded-xl border-slate-200 text-base sm:text-sm h-10 sm:h-10 pl-9.5 focus:ring-rose-500"
                    placeholder="017XXXXXXXX"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">
                  বিকল্প মোবাইল / জরুরি নম্বর
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    value={altMobile}
                    onChange={(e) => setAltMobile(e.target.value)}
                    className="rounded-xl border-slate-200 text-base sm:text-sm h-10 sm:h-10 pl-9.5 focus:ring-rose-500"
                    placeholder="018XXXXXXXX"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-slate-700 mb-1 block">
                  বর্তমান ঠিকানা <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <Input
                    required
                    value={currentAddress}
                    onChange={(e) => setCurrentAddress(e.target.value)}
                    className="rounded-xl border-slate-200 text-base sm:text-sm h-10 sm:h-10 pl-9.5 focus:ring-rose-500"
                    placeholder="বর্তমান বাসস্থান, থানা ও জেলা"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-slate-700 mb-1 block">
                  স্থায়ী ঠিকানা <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <Input
                    required
                    value={permanentAddress}
                    onChange={(e) => setPermanentAddress(e.target.value)}
                    className="rounded-xl border-slate-200 text-base sm:text-sm h-10 sm:h-10 pl-9.5 focus:ring-rose-500"
                    placeholder="স্থায়ী ঠিকানা / পৈতৃক ভিটা"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* TAB 3: CAREER & FAMILY */}
          <TabsContent
            value="career"
            className="space-y-4 sm:space-y-5 m-0 focus-visible:outline-none"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">
                  বৈবাহিক অবস্থা <span className="text-rose-600">*</span>
                </label>
                <Select
                  value={maritalStatus}
                  onValueChange={(v) => v && setMaritalStatus(v)}
                >
                  <SelectTrigger className="w-full rounded-xl border-slate-200 text-base sm:text-sm h-10 sm:h-10 focus:ring-rose-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MARITAL_OPTIONS.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">
                  সন্তানের সংখ্যা
                </label>
                <Input
                  type="number"
                  min="0"
                  value={childrenCount}
                  onChange={(e) => setChildrenCount(e.target.value)}
                  className="rounded-xl border-slate-200 text-base sm:text-sm h-10 sm:h-10 focus:ring-rose-500"
                  placeholder="0"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-slate-700 mb-1 block">
                  পেশা ও পদবি <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    required
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    className="rounded-xl border-slate-200 text-base sm:text-sm h-10 sm:h-10 pl-9.5 focus:ring-rose-500"
                    placeholder="যেমন: সরকারি চাকুরিজীবী, ব্যবসায়ী, চিকিৎসক..."
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-slate-700 mb-1 block flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  স্কুল জীবনের স্মৃতিচারণ বা আত্মকথা
                </label>
                <textarea
                  rows={3}
                  value={aboutMe}
                  onChange={(e) => setAboutMe(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-base sm:text-sm resize-none focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                  placeholder="স্কুল জীবনের প্রিয় শিক্ষক, সহপাঠী ও সোনালী স্মৃতি কিংবা বন্ধুদের উদ্দেশ্যে বার্তা..."
                />
              </div>
            </div>
          </TabsContent>

          {/* TAB 4: PHOTOS & MEMORIAL */}
          <TabsContent
            value="media"
            className="space-y-4 sm:space-y-5 m-0 focus-visible:outline-none"
          >
            {/* Memorial Status Banner */}
            <div
              className={`p-3.5 sm:p-4 rounded-xl border transition-all ${
                isDeceased
                  ? "bg-slate-900 border-slate-800 text-white shadow-sm"
                  : "bg-slate-50 border-slate-200 text-slate-800"
              }`}
            >
              <label className="flex items-start justify-between gap-3 cursor-pointer select-none">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isDeceased
                        ? "bg-rose-600 text-white"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    <Flame className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold">
                      প্রয়াত বন্ধু স্মরণিকা স্ট্যাটাস
                    </p>
                    <p
                      className={`text-[11px] sm:text-xs mt-0.5 ${isDeceased ? "text-slate-300" : "text-slate-500"}`}
                    >
                      অন থাকলে শ্রদ্ধাঞ্জলি পাতা ও প্রোফাইলে বিশেষ স্মরণিকা ব্যাজ প্রদর্শিত হবে।
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isDeceased}
                  onChange={(e) => setIsDeceased(e.target.checked)}
                  className="w-5 h-5 rounded border-slate-400 text-rose-600 focus:ring-rose-500 cursor-pointer shrink-0 mt-1"
                />
              </label>

              {isDeceased && (
                <div className="mt-3.5 pt-3.5 border-t border-slate-700/80 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="text-xs font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-rose-400" />
                    ইন্তেকাল / মৃত্যুর তারিখ (ঐচ্ছিক)
                  </label>
                  <div className="relative">
                    <Input
                      type="date"
                      value={deceasedDate}
                      onChange={(e) => setDeceasedDate(e.target.value)}
                      className="w-full rounded-xl bg-slate-800 border-slate-700 text-white text-sm h-10 px-3 focus:ring-rose-500 focus:border-rose-500 [color-scheme:dark]"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    তারিখ সিলেক্ট করলে প্রোফাইল ও শ্রদ্ধাঞ্জলি পাতায় সুন্দরভাবে প্রদর্শিত হবে।
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Current Profile Picture Card */}
              <div className="bg-slate-50/80 p-3.5 sm:p-4 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-rose-600" /> বর্তমান
                    প্রোফাইল ছবি
                  </h4>

                  <div className="flex items-center gap-3 mt-2">
                    <Avatar className="w-14 h-14 sm:w-16 sm:h-16 border-2 border-white shadow-sm ring-1 ring-slate-200 shrink-0">
                      <AvatarImage src={profilePicture || undefined} />
                      <AvatarFallback className="bg-rose-100 text-rose-700 font-bold text-lg sm:text-xl">
                        {nickName.charAt(0) || "স"}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={uploadingAvatar}
                        onClick={() => avatarInputRef.current?.click()}
                        className="text-xs h-8 px-3 rounded-lg border-slate-300 bg-white hover:bg-slate-50 font-medium justify-center w-full"
                      >
                        {uploadingAvatar ? (
                          <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin text-rose-600" />
                        ) : (
                          <Upload className="w-3.5 h-3.5 mr-1.5 text-rose-600" />
                        )}
                        {uploadingAvatar ? "আপলোড হচ্ছে..." : "নতুন ছবি আপলোড"}
                      </Button>
                      <input
                        ref={avatarInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleFileUpload(f, "avatar");
                        }}
                      />

                      {profilePicture && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setProfilePicture("")}
                          className="text-[11px] h-6 px-1.5 text-red-600 hover:bg-red-50 rounded-md justify-start"
                        >
                          <X className="w-3 h-3 mr-1" /> ছবি সরিয়ে ফেলুন
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 1990 Then Photo Card */}
              <div className="bg-slate-50/80 p-3.5 sm:p-4 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-rose-600" /> ১৯৯০
                    সালের স্কুলের ছবি
                  </h4>

                  <div className="flex items-center gap-3 mt-2">
                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl border-2 border-white shadow-sm ring-1 ring-slate-200 overflow-hidden bg-slate-200 flex items-center justify-center shrink-0">
                      {thenPhoto ? (
                        <Image
                          src={thenPhoto}
                          alt="Then"
                          fill
                          className="object-cover"
                          sizes="64px"
                          placeholder="blur"
                          blurDataURL={getShimmerDataUrl(64, 64)}
                          unoptimized={thenPhoto.startsWith("blob:")}
                        />
                      ) : (
                        <ImageIcon className="w-6 h-6 sm:w-7 sm:h-7 text-slate-400" />
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={uploadingThenPhoto}
                        onClick={() => thenPhotoInputRef.current?.click()}
                        className="text-xs h-8 px-3 rounded-lg border-slate-300 bg-white hover:bg-slate-50 font-medium justify-center w-full"
                      >
                        {uploadingThenPhoto ? (
                          <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin text-rose-600" />
                        ) : (
                          <Upload className="w-3.5 h-3.5 mr-1.5 text-rose-600" />
                        )}
                        {uploadingThenPhoto
                          ? "আপলোড হচ্ছে..."
                          : "স্কুলের ছবি আপলোড"}
                      </Button>
                      <input
                        ref={thenPhotoInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleFileUpload(f, "thenPhoto");
                        }}
                      />

                      {thenPhoto && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setThenPhoto("")}
                          className="text-[11px] h-6 px-1.5 text-red-600 hover:bg-red-50 rounded-md justify-start"
                        >
                          <X className="w-3 h-3 mr-1" /> ছবি সরিয়ে ফেলুন
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>

      {/* Responsive Footer */}
      <div className="px-4 sm:px-6 py-3 border-t border-slate-100 bg-slate-50/90 shrink-0 flex items-center justify-between gap-3">
        <div className="text-xs text-slate-500 hidden sm:block">
          সকল ট্যাবের পরিবর্তন একসাথে সংরক্ষিত হবে
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-xl border-slate-200 text-xs h-9 px-3.5 sm:px-4 flex-1 sm:flex-none"
          >
            বাতিল
          </Button>
          <Button
            type="submit"
            disabled={pending || uploadingAvatar || uploadingThenPhoto}
            className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs h-9 px-4 sm:px-5 font-semibold shadow-sm shadow-rose-200 flex-1 sm:flex-none"
          >
            {pending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                সংরক্ষণ হচ্ছে...
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5 mr-1.5" />
                সংরক্ষণ করুন
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );

  // DESKTOP: Render Dialog Modal
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[96vw] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl max-h-[92vh] flex flex-col p-0 overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-2xl">
          <DialogHeader className="px-6 py-4 border-b border-slate-100 bg-slate-50/80 shrink-0">
            <DialogTitle className="sr-only">সদস্য তথ্য সম্পাদনা</DialogTitle>
            {headerSnapshot}
          </DialogHeader>
          {formContent}
        </DialogContent>
      </Dialog>
    );
  }

  // MOBILE: Render Bottom Drawer Sheet
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[92vh] flex flex-col p-0 overflow-hidden rounded-t-2xl bg-white border-t border-slate-200 shadow-2xl">
        <DrawerHeader className="px-4 py-3 border-b border-slate-100 bg-slate-50/80 shrink-0 text-left">
          <DrawerTitle className="sr-only">সদস্য তথ্য সম্পাদনা</DrawerTitle>
          {headerSnapshot}
        </DrawerHeader>
        {formContent}
      </DrawerContent>
    </Drawer>
  );
}
