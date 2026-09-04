"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const gallerySchema = z.object({
  title: z.string().min(1, "শিরোনাম আবশ্যক"),
  description: z.string().optional(),
  imageUrl: z.string().url("সঠিক ছবির URL দিন"),
  eventDate: z.string().optional(),
  category: z.string().min(1, "ক্যাটাগরি বাছুন"),
  featured: z.boolean().default(false),
});

export async function createGalleryItem(formData: FormData) {
  const raw = {
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    imageUrl: formData.get("imageUrl"),
    eventDate: formData.get("eventDate") || undefined,
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

export async function deleteGalleryItem(id: string) {
  await prisma.galleryItem.delete({ where: { id } });
  revalidatePath("/gallery");
  revalidatePath("/");
  revalidatePath("/admin/gallery");
  return { success: true };
}
