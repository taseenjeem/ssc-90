import { prisma } from "@/lib/prisma";
import AdminGalleryClient from "@/components/admin/AdminGalleryClient";
import AdminNav from "@/components/admin/AdminNav";

export const revalidate = 60;

export default async function AdminGalleryPage() {
  const items = await prisma.galleryItem.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="min-h-screen">
      <AdminNav title="গ্যালারি ব্যবস্থাপনা" subtitle={`${items.length}টি ছবি`} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminGalleryClient items={items} />
      </div>
    </div>
  );
}
