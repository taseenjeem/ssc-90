import { prisma } from "@/lib/prisma";
import AdminMembersClient from "@/components/admin/AdminMembersClient";
import AdminNav from "@/components/admin/AdminNav";

export const revalidate = 60;

export default async function AdminMembersPage() {
  const members = await prisma.profile.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen">
      <AdminNav title="সদস্য তালিকা" subtitle={`${members.length} জন নিবন্ধিত`} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminMembersClient members={members} />
      </div>
    </div>
  );
}
