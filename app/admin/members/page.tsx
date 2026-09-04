import { prisma } from "@/lib/prisma";
import AdminMembersClient from "@/components/admin/AdminMembersClient";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const revalidate = 60;

export default async function AdminMembersPage() {
  const members = await prisma.profile.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 border-b border-slate-800 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Button asChild variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-slate-800">
            <Link href="/admin/dashboard"><ArrowLeft className="w-4 h-4 mr-1" /> ড্যাশবোর্ড</Link>
          </Button>
          <div>
            <h1 className="text-white font-bold">সদস্য ব্যবস্থাপনা</h1>
            <p className="text-slate-400 text-xs">{members.length} জন সদস্য নিবন্ধিত</p>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminMembersClient members={members} />
      </div>
    </div>
  );
}
