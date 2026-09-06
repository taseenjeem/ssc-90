"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Profile } from "@prisma/client";
import { deleteMember } from "@/actions/members";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { toast } from "sonner";
import {
  MoreVertical,
  Trash2,
  Search,
  Droplets,
  Pencil,
} from "lucide-react";
import EditMemberDialog from "./EditMemberDialog";
import CreateMemberDialog from "./CreateMemberDialog";
import Link from "next/link";

interface AdminMembersClientProps {
  members: Profile[];
}

export default function AdminMembersClient({
  members,
}: AdminMembersClientProps) {
  const router = useRouter();
  const [membersList, setMembersList] = useState<Profile[]>(members);
  const [editingMember, setEditingMember] = useState<Profile | null>(null);
  const [query, setQuery] = useState("");
  const [, startTransition] = useTransition();

  useEffect(() => {
    setMembersList(members);
  }, [members]);

  const filtered = membersList.filter((m) => {
    const q = query.toLowerCase();
    return (
      !q ||
      m.banglaFullName.toLowerCase().includes(q) ||
      m.engFullName.toLowerCase().includes(q) ||
      m.personalMobile.includes(q) ||
      m.nickName.toLowerCase().includes(q) ||
      m.schoolName.toLowerCase().includes(q)
    );
  });

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`"${name}" কে মুছে ফেলতে চান?`)) return;
    startTransition(async () => {
      await deleteMember(id);
      setMembersList((prev) => prev.filter((m) => m.id !== id));
      toast.success("সদস্য মুছে ফেলা হয়েছে।");
      router.refresh();
    });
  };

  const handleEditSuccess = (updated: Profile) => {
    setMembersList((prev) =>
      prev.map((m) => (m.id === updated.id ? updated : m)),
    );
    router.refresh();
  };

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="নাম, ডাকনাম, স্কুল বা মোবাইল দিয়ে খুঁজুন..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 rounded-xl border-slate-200"
          />
        </div>
        <div className="flex gap-2">
          <CreateMemberDialog onDone={() => router.refresh()} />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="text-xs text-slate-500 pl-4">ছবি</TableHead>
              <TableHead className="text-xs text-slate-500">নাম</TableHead>
              <TableHead className="text-xs text-slate-500 hidden sm:table-cell">
                স্কুল
              </TableHead>
              <TableHead className="text-xs text-slate-500">
                রক্তের গ্রুপ
              </TableHead>
              <TableHead className="text-xs text-slate-500 hidden md:table-cell">
                মোবাইল
              </TableHead>
              <TableHead className="text-xs text-slate-500 text-right pr-4">
                একশন
              </TableHead>
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
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Link
                      href={`/members/${member.id}`}
                      className="hover:underline"
                    >
                      <p className="font-semibold text-slate-900 text-sm">
                        {member.banglaFullName}
                      </p>
                    </Link>
                    {member.isDeceased && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-medium">
                        প্রয়াত
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">
                    {member.nickName} • {member.engFullName}
                  </p>
                </TableCell>
                <TableCell className="hidden sm:table-cell text-sm text-slate-600">
                  {member.schoolName}
                </TableCell>
                <TableCell>
                  <Badge className="bg-red-50 text-red-700 border border-red-100 text-xs gap-1">
                    <Droplets className="w-3 h-3" /> {member.bloodGroup}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell text-sm text-slate-600">
                  {member.personalMobile}
                </TableCell>
                <TableCell className="text-right pr-4">
                  <div className="flex items-center justify-end gap-1.5">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-8 h-8 p-0 text-slate-400 hover:text-slate-600"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem
                          onClick={() => setEditingMember(member)}
                          className="text-slate-700 cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5 mr-2 text-rose-500" />{" "}
                          তথ্য সম্পাদনা
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleDelete(member.id, member.banglaFullName)
                          }
                          className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-2" /> মুছে ফেলুন
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-sm">
            কোনো সদস্য পাওয়া যায়নি।
          </div>
        )}
      </div>

      {/* Edit Member Modal */}
      <EditMemberDialog
        member={editingMember}
        open={Boolean(editingMember)}
        onOpenChange={(open) => {
          if (!open) setEditingMember(null);
        }}
        onSuccess={handleEditSuccess}
      />
    </>
  );
}
