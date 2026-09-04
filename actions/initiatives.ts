"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const initiativeSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.string().min(1),
  location: z.string().min(1),
  images: z.array(z.string()).default([]),
  budget: z.string().optional(),
  impact: z.string().optional(),
});

export async function createInitiative(formData: FormData) {
  const imagesRaw = formData.get("images") as string;
  const images = imagesRaw ? imagesRaw.split(",").map((s) => s.trim()).filter(Boolean) : [];

  const raw = {
    title: formData.get("title"),
    description: formData.get("description"),
    date: formData.get("date"),
    location: formData.get("location"),
    images,
    budget: formData.get("budget") || undefined,
    impact: formData.get("impact") || undefined,
  };

  const parsed = initiativeSchema.safeParse(raw);
  if (!parsed.success) return { success: false, errors: parsed.error.flatten().fieldErrors };

  await prisma.initiative.create({ data: parsed.data });
  revalidatePath("/initiatives");
  revalidatePath("/");
  revalidatePath("/admin/initiatives");
  return { success: true };
}

export async function updateInitiative(id: string, formData: FormData) {
  const imagesRaw = formData.get("images") as string;
  const images = imagesRaw ? imagesRaw.split(",").map((s) => s.trim()).filter(Boolean) : [];

  const raw = {
    title: formData.get("title"),
    description: formData.get("description"),
    date: formData.get("date"),
    location: formData.get("location"),
    images,
    budget: formData.get("budget") || undefined,
    impact: formData.get("impact") || undefined,
  };

  const parsed = initiativeSchema.safeParse(raw);
  if (!parsed.success) return { success: false, errors: parsed.error.flatten().fieldErrors };

  await prisma.initiative.update({ where: { id }, data: parsed.data });
  revalidatePath("/initiatives");
  revalidatePath(`/initiatives/${id}`);
  revalidatePath("/admin/initiatives");
  return { success: true };
}

export async function deleteInitiative(id: string) {
  await prisma.initiative.delete({ where: { id } });
  revalidatePath("/initiatives");
  revalidatePath("/");
  revalidatePath("/admin/initiatives");
  return { success: true };
}
