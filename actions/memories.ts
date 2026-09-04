"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const memorySchema = z.object({
  senderName: z.string().min(2, "নাম কমপক্ষে ২ অক্ষরের হতে হবে"),
  schoolName: z.string().optional(),
  message: z.string().min(10, "বার্তা কমপক্ষে ১০ অক্ষরের হতে হবে").max(1000, "বার্তা ১০০০ অক্ষরের বেশি হতে পারবে না"),
});

export type MemoryFormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function submitMemory(
  _prev: MemoryFormState,
  formData: FormData
): Promise<MemoryFormState> {
  const raw = {
    senderName: formData.get("senderName") as string,
    schoolName: formData.get("schoolName") as string,
    message: formData.get("message") as string,
  };

  const parsed = memorySchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      message: "তথ্য যাচাইকরণ ব্যর্থ হয়েছে।",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  await prisma.memoryMessage.create({
    data: {
      senderName: parsed.data.senderName,
      schoolName: parsed.data.schoolName || null,
      message: parsed.data.message,
      isApproved: false,
    },
  });

  revalidatePath("/memories");

  return {
    success: true,
    message: "আপনার স্মৃতিবার্তা সফলভাবে জমা হয়েছে। অ্যাডমিনের অনুমোদনের পর এটি প্রদর্শিত হবে।",
  };
}

export async function approveMemory(id: string) {
  await prisma.memoryMessage.update({ where: { id }, data: { isApproved: true } });
  revalidatePath("/memories");
  revalidatePath("/admin/memories");
}

export async function deleteMemory(id: string) {
  await prisma.memoryMessage.delete({ where: { id } });
  revalidatePath("/memories");
  revalidatePath("/admin/memories");
}
