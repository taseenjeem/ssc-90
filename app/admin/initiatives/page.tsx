import { prisma } from "@/lib/prisma";
import AdminInitiativesClient from "@/components/admin/AdminInitiativesClient";
import AdminNav from "@/components/admin/AdminNav";

export const revalidate = 60;

export default async function AdminInitiativesPage() {
  const initiatives = await prisma.initiative.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="min-h-screen">
      <AdminNav title="উদ্যোগ ব্যবস্থাপনা" subtitle={`${initiatives.length}টি উদ্যোগ`} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminInitiativesClient initiatives={initiatives} />
      </div>
    </div>
  );
}
