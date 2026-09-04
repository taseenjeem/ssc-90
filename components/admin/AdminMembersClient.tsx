"use client";

import { useState, useTransition } from "react";
import { Profile } from "@prisma/client";
import { createMember, deleteMember, bulkCreateMembers } from "@/actions/members";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { UserPlus, Upload, MoreVertical, Trash2, Search, Droplets } from "lucide-react";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const GENDER_OPTIONS = ["পুরুষ", "মহিলা"];
const MARITAL_OPTIONS = ["বিবাহিত", "অবিবাহিত", "অন্যান্য"];

interface AdminMembersClientProps {
  members: Profile[];
}

function MemberFormDialog({ onDone }: { onDone: () => void }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await createMember(formData);
      if (result.success) {
        toast.success("সদস্য সফলভাবে যোগ হয়েছে!");
        setOpen(false);
        onDone();
      } else {
        toast.error("তথ্য যাচাইকরণ ব্যর্থ হয়েছে।");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl">
          <UserPlus className="w-4 h-4 mr-2" /> নতুন সদস্য যোগ করুন
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>নতুন সদস্য যোগ করুন</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 mt-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">বাংলা নাম *</label>
              <Input name="banglaFullName" required className="rounded-lg text-sm" placeholder="মো: রফিকুল ইসলাম" />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">ইংরেজি নাম *</label>
              <Input name="engFullName" required className="rounded-lg text-sm" placeholder="Md. Rafiqul Islam" />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">ডাকনাম *</label>
              <Input name="nickName" required className="rounded-lg text-sm" placeholder="রফিক" />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">স্কুলের নাম *</label>
              <Input name="schoolName" required className="rounded-lg text-sm" placeholder="ঢাকা কলেজিয়েট স্কুল" />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">লিঙ্গ *</label>
              <Select name="gender" defaultValue="পুরুষ">
                <SelectTrigger className="rounded-lg text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>{GENDER_OPTIONS.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">রক্তের গ্রুপ *</label>
              <Select name="bloodGroup" defaultValue="O+">
                <SelectTrigger className="rounded-lg text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>{BLOOD_GROUPS.map((bg) => <SelectItem key={bg} value={bg}>{bg}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">বৈবাহিক অবস্থা *</label>
              <Select name="maritalStatus" defaultValue="বিবাহিত">
                <SelectTrigger className="rounded-lg text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>{MARITAL_OPTIONS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">সন্তানের সংখ্যা</label>
              <Input name="childrenCount" type="number" min="0" defaultValue="0" className="rounded-lg text-sm" />
            </div>
            <div className="col-span-2">
              <label className="text-xs text-slate-500 mb-1 block">পেশা *</label>
              <Input name="profession" required className="rounded-lg text-sm" placeholder="সরকারি চাকুরিজীবী, ব্যবসায়ী..." />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">বর্তমান ঠিকানা *</label>
              <Input name="currentAddress" required className="rounded-lg text-sm" placeholder="ঢাকা, বাংলাদেশ" />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">স্থায়ী ঠিকানা *</label>
              <Input name="permanentAddress" required className="rounded-lg text-sm" placeholder="নেত্রকোনা, ময়মনসিংহ" />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">মোবাইল *</label>
              <Input name="personalMobile" required className="rounded-lg text-sm" placeholder="01712345678" />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">বিকল্প মোবাইল *</label>
              <Input name="altMobile" required className="rounded-lg text-sm" placeholder="01812345678" />
            </div>
            <div className="col-span-2">
              <label className="text-xs text-slate-500 mb-1 block">প্রোফাইল ছবির URL</label>
              <Input name="profilePicture" className="rounded-lg text-sm" placeholder="https://..." />
            </div>
            <div className="col-span-2">
              <label className="text-xs text-slate-500 mb-1 block">স্কুলের ছবির URL (১৯৯০ সাল)</label>
              <Input name="thenPhoto" className="rounded-lg text-sm" placeholder="https://..." />
            </div>
            <div className="col-span-2">
              <label className="text-xs text-slate-500 mb-1 block">স্মৃতিচারণ / আত্মকথা</label>
              <textarea name="aboutMe" rows={3} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-rose-400" placeholder="স্কুল জীবনের স্মৃতি..." />
            </div>
          </div>
          <Button type="submit" disabled={pending} className="w-full bg-rose-600 hover:bg-rose-700 text-white rounded-xl">
            {pending ? "সংরক্ষণ হচ্ছে..." : "সদস্য যোগ করুন"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminMembersClient({ members }: AdminMembersClientProps) {
  const [query, setQuery] = useState("");
  const [, startTransition] = useTransition();

  const filtered = members.filter((m) => {
    const q = query.toLowerCase();
    return !q || m.banglaFullName.toLowerCase().includes(q) || m.engFullName.toLowerCase().includes(q) || m.personalMobile.includes(q);
  });

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`"${name}" কে মুছে ফেলতে চান?`)) return;
    startTransition(async () => {
      await deleteMember(id);
      toast.success("সদস্য মুছে ফেলা হয়েছে।");
    });
  };

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    const result = await bulkCreateMembers(formData);
    if (result.success) {
      toast.success(`${result.count} জন সদস্য সফলভাবে আমদানি হয়েছে!`);
    } else {
      toast.error(result.message ?? "আমদানি ব্যর্থ হয়েছে।");
    }
  };

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="নাম বা মোবাইল দিয়ে খুঁজুন..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 rounded-xl border-slate-200"
          />
        </div>
        <div className="flex gap-2">
          <MemberFormDialog onDone={() => {}} />
          <label className="cursor-pointer">
            <Button variant="outline" className="rounded-xl border-slate-200 gap-2" asChild>
              <span>
                <Upload className="w-4 h-4" /> Excel আমদানি
                <input type="file" accept=".xlsx,.csv" onChange={handleBulkUpload} className="hidden" />
              </span>
            </Button>
          </label>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="text-xs text-slate-500 pl-4">ছবি</TableHead>
              <TableHead className="text-xs text-slate-500">নাম</TableHead>
              <TableHead className="text-xs text-slate-500 hidden sm:table-cell">স্কুল</TableHead>
              <TableHead className="text-xs text-slate-500">রক্তের গ্রুপ</TableHead>
              <TableHead className="text-xs text-slate-500 hidden md:table-cell">মোবাইল</TableHead>
              <TableHead className="text-xs text-slate-500 text-right pr-4">একশন</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((member) => (
              <TableRow key={member.id} className="hover:bg-slate-50/50">
                <TableCell className="pl-4">
                  <Avatar className="w-9 h-9">
                    <AvatarImage src={member.profilePicture ?? undefined} />
                    <AvatarFallback className="bg-rose-100 text-rose-700 text-xs font-bold">
                      {member.nickName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell>
                  <p className="font-semibold text-slate-900 text-sm">{member.banglaFullName}</p>
                  <p className="text-xs text-slate-400">{member.nickName}</p>
                </TableCell>
                <TableCell className="hidden sm:table-cell text-sm text-slate-600">{member.schoolName}</TableCell>
                <TableCell>
                  <Badge className="bg-red-50 text-red-700 border border-red-100 text-xs gap-1">
                    <Droplets className="w-3 h-3" /> {member.bloodGroup}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell text-sm text-slate-600">{member.personalMobile}</TableCell>
                <TableCell className="text-right pr-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleDelete(member.id, member.banglaFullName)}
                        className="text-red-600 focus:text-red-600 focus:bg-red-50"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-2" /> মুছে ফেলুন
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-sm">কোনো সদস্য পাওয়া যায়নি।</div>
        )}
      </div>
    </>
  );
}
