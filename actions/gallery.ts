"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const gallerySchema = z.object({
  title: z.string().min(1, "শিরোনাম আবশ্যক"),
  description: z.string().nullable().optional(),
  imageUrl: z.string().min(1, "ছবির URL প্রয়োজন"),
  eventDate: z.string().nullable().optional(),
  category: z.string().min(1, "ক্যাটাগরি বাছুন"),
  featured: z.boolean().default(false),
});

export async function createGalleryItem(formData: FormData) {
  const descVal = formData.get("description");
  const dateVal = formData.get("eventDate");

  const raw = {
    title: formData.get("title"),
    description: typeof descVal === "string" && descVal.trim() !== "" ? descVal.trim() : null,
    imageUrl: formData.get("imageUrl"),
    eventDate: typeof dateVal === "string" && dateVal.trim() !== "" ? dateVal.trim() : null,
    category: formData.get("category"),
    featured: formData.get("featured") === "true",
  };

  const parsed = gallerySchema.safeParse(raw);
  if (!parsed.success) return { success: false, errors: parsed.error.flatten().fieldErrors };

  await prisma.galleryItem.create({ data: parsed.data });
  revalidatePath("/gallery");
  revalidatePath("/");
  revalidatePath("/admin/gallery");
  return { success: true };
}

export async function updateGalleryItem(id: string, formData: FormData) {
  const descVal = formData.get("description");
  const dateVal = formData.get("eventDate");

  const raw = {
    title: formData.get("title"),
    description: typeof descVal === "string" && descVal.trim() !== "" ? descVal.trim() : null,
    imageUrl: formData.get("imageUrl"),
    eventDate: typeof dateVal === "string" && dateVal.trim() !== "" ? dateVal.trim() : null,
    category: formData.get("category"),
    featured: formData.get("featured") === "true",
  };

  const parsed = gallerySchema.safeParse(raw);
  if (!parsed.success) return { success: false, errors: parsed.error.flatten().fieldErrors };

  const updated = await prisma.galleryItem.update({
    where: { id },
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      imageUrl: parsed.data.imageUrl,
      eventDate: parsed.data.eventDate,
      category: parsed.data.category,
      featured: parsed.data.featured,
    },
  });

  revalidatePath("/gallery");
  revalidatePath("/");
  revalidatePath("/admin/gallery");
  return { success: true, item: updated };
}

export async function toggleFeaturedGalleryItem(id: string) {
  const current = await prisma.galleryItem.findUnique({
    where: { id },
    select: { featured: true },
  });
  if (!current) return { success: false, message: "ছবি পাওয়া যায়নি।" };

  const updated = await prisma.galleryItem.update({
    where: { id },
    data: { featured: !current.featured },
  });

  revalidatePath("/gallery");
  revalidatePath("/");
  revalidatePath("/admin/gallery");
  return { success: true, featured: updated.featured };
}

export async function deleteGalleryItem(id: string) {
  await prisma.galleryItem.delete({ where: { id } });
  revalidatePath("/gallery");
  revalidatePath("/");
  revalidatePath("/admin/gallery");
  return { success: true };
}
