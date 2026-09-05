import { prisma } from "@/lib/prisma";
import AdminMemoriesClient from "@/components/admin/AdminMemoriesClient";
import AdminNav from "@/components/admin/AdminNav";

export const revalidate = 30;

export default async function AdminMemoriesPage() {
  const messages = await prisma.memoryMessage.findMany({
    where: { isApproved: false },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNav title="স্মৃতিবার্তা অনুমোদন" subtitle={`${messages.length}টি অপেক্ষারত`} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminMemoriesClient messages={messages} />
      </div>
    </div>
  );
}
