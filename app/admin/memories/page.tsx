import { prisma } from "@/lib/prisma";
import AdminMemoriesClient from "@/components/admin/AdminMemoriesClient";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const revalidate = 30;

export default async function AdminMemoriesPage() {
  const messages = await prisma.memoryMessage.findMany({
    where: { isApproved: false },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 border-b border-slate-800 py-4 px-6">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <Button asChild variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-slate-800">
            <Link href="/admin/dashboard"><ArrowLeft className="w-4 h-4 mr-1" /> ড্যাশবোর্ড</Link>
          </Button>
          <div>
            <h1 className="text-white font-bold">বার্তা অনুমোদন</h1>
            <p className="text-slate-400 text-xs">{messages.length} টি বার্তা অপেক্ষারত</p>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminMemoriesClient messages={messages} />
      </div>
    </div>
  );
}
