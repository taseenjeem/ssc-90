"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import * as XLSX from "xlsx";

const profileSchema = z.object({
  banglaFullName: z.string().min(1, "বাংলা নাম আবশ্যক"),
  engFullName: z.string().min(1, "ইংরেজি নাম আবশ্যক"),
  nickName: z.string().min(1, "ডাকনাম আবশ্যক"),
  gender: z.string().min(1, "লিঙ্গ আবশ্যক"),
  bloodGroup: z.string().min(1, "রক্তের গ্রুপ আবশ্যক"),
  schoolName: z.string().min(1, "স্কুলের নাম আবশ্যক"),
  maritalStatus: z.string().min(1, "বৈবাহিক অবস্থা আবশ্যক"),
  childrenCount: z.coerce.number().int().min(0).default(0),
  profession: z.string().min(1, "পেশা আবশ্যক"),
  currentAddress: z.string().min(1, "বর্তমান ঠিকানা আবশ্যক"),
  permanentAddress: z.string().min(1, "স্থায়ী ঠিকানা আবশ্যক"),
  personalMobile: z.string().min(1, "মোবাইল নম্বর আবশ্যক"),
  altMobile: z
    .string()
    .optional()
    .nullable()
    .transform((v) => v?.trim() || ""),
  profilePicture: z
    .string()
    .optional()
    .nullable()
    .transform((v) => (v?.trim() ? v.trim() : null)),
  thenPhoto: z
    .string()
    .optional()
    .nullable()
    .transform((v) => (v?.trim() ? v.trim() : null)),
  aboutMe: z
    .string()
    .optional()
    .nullable()
    .transform((v) => (v?.trim() ? v.trim() : null)),
  isDeceased: z.boolean().optional().default(false),
  deceasedDate: z
    .string()
    .optional()
    .nullable()
    .transform((v) => (v?.trim() ? v.trim() : null)),
});

export async function createMember(formData: FormData) {
  const raw = {
    banglaFullName: formData.get("banglaFullName"),
    engFullName: formData.get("engFullName"),
    nickName: formData.get("nickName"),
    gender: formData.get("gender"),
    bloodGroup: formData.get("bloodGroup"),
    schoolName: formData.get("schoolName"),
    maritalStatus: formData.get("maritalStatus"),
    childrenCount: formData.get("childrenCount") || 0,
    profession: formData.get("profession"),
    currentAddress: formData.get("currentAddress"),
    permanentAddress: formData.get("permanentAddress"),
    personalMobile: formData.get("personalMobile"),
    altMobile: formData.get("altMobile"),
    profilePicture: formData.get("profilePicture") || null,
    thenPhoto: formData.get("thenPhoto") || null,
    aboutMe: formData.get("aboutMe") || null,
    isDeceased: formData.get("isDeceased") === "true",
    deceasedDate: formData.get("deceasedDate") || null,
  };

  const parsed = profileSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const firstError = Object.values(fieldErrors)[0]?.[0] || "তথ্য যাচাইকরণ ব্যর্থ হয়েছে।";
    return { success: false, errors: fieldErrors, message: firstError };
  }

  const userId = crypto.randomUUID();
  let created;
  try {
    created = await prisma.profile.create({
      data: { ...parsed.data, userId },
    });
  } catch (err: unknown) {
    const errorMsg = String((err as Error)?.message || "");
    if (errorMsg.includes("deceasedDate")) {
      const { deceasedDate, ...dataWithoutDeceasedDate } = parsed.data;
      created = await prisma.profile.create({
        data: { ...dataWithoutDeceasedDate, userId },
      });
      if (deceasedDate) {
        await prisma.$executeRawUnsafe(
          `UPDATE "Profile" SET "deceasedDate" = $1::text WHERE id = $2`,
          deceasedDate,
          created.id
        );
      }
      (created as Record<string, unknown>).deceasedDate = deceasedDate ?? null;
    } else {
      throw err;
    }
  }

  revalidatePath("/members");
  revalidatePath("/in-memoriam");
  revalidatePath("/blood-bank");
  revalidatePath("/admin/members");
  revalidatePath("/");
  return { success: true, member: created };
}

export async function updateMember(id: string, formData: FormData) {
  const raw = {
    banglaFullName: formData.get("banglaFullName"),
    engFullName: formData.get("engFullName"),
    nickName: formData.get("nickName"),
    gender: formData.get("gender"),
    bloodGroup: formData.get("bloodGroup"),
    schoolName: formData.get("schoolName"),
    maritalStatus: formData.get("maritalStatus"),
    childrenCount: formData.get("childrenCount") || 0,
    profession: formData.get("profession"),
    currentAddress: formData.get("currentAddress"),
    permanentAddress: formData.get("permanentAddress"),
    personalMobile: formData.get("personalMobile"),
    altMobile: formData.get("altMobile"),
    profilePicture: formData.get("profilePicture") || null,
    thenPhoto: formData.get("thenPhoto") || null,
    aboutMe: formData.get("aboutMe") || null,
    isDeceased: formData.get("isDeceased") === "true",
    deceasedDate: formData.get("deceasedDate") || null,
  };

  const parsed = profileSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const firstError = Object.values(fieldErrors)[0]?.[0] || "তথ্য যাচাইকরণ ব্যর্থ হয়েছে।";
    return { success: false, errors: fieldErrors, message: firstError };
  }

  let updated;
  try {
    updated = await prisma.profile.update({ where: { id }, data: parsed.data });
  } catch (err: unknown) {
    const errorMsg = String((err as Error)?.message || "");
    if (errorMsg.includes("deceasedDate")) {
      const { deceasedDate, ...dataWithoutDeceasedDate } = parsed.data;
      updated = await prisma.profile.update({
        where: { id },
        data: dataWithoutDeceasedDate,
      });
      await prisma.$executeRawUnsafe(
        `UPDATE "Profile" SET "deceasedDate" = $1::text WHERE id = $2`,
        deceasedDate ?? null,
        id
      );
      (updated as Record<string, unknown>).deceasedDate = deceasedDate ?? null;
    } else {
      throw err;
    }
  }
  revalidatePath("/members");
  revalidatePath(`/members/${id}`);
  revalidatePath("/in-memoriam");
  revalidatePath("/blood-bank");
  revalidatePath("/admin/members");
  revalidatePath("/");
  return { success: true, member: updated };
}

export async function deleteMember(id: string) {
  await prisma.profile.delete({ where: { id } });
  revalidatePath("/members");
  revalidatePath("/in-memoriam");
  revalidatePath("/blood-bank");
  revalidatePath("/admin/members");
  revalidatePath("/");
  return { success: true };
}

export async function bulkCreateMembers(formData: FormData) {
  const file = formData.get("file") as File;
  if (!file) return { success: false, message: "কোনো ফাইল পাওয়া যায়নি।" };

  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Record<string, string>>(sheet);

  const toCreate = rows
    .map((row) => ({
      userId: crypto.randomUUID(),
      banglaFullName: row.banglaFullName ?? "",
      engFullName: row.engFullName ?? "",
      nickName: row.nickName ?? "",
      gender: row.gender ?? "পুরুষ",
      bloodGroup: row.bloodGroup ?? "O+",
      schoolName: row.schoolName ?? "",
      maritalStatus: row.maritalStatus ?? "বিবাহিত",
      childrenCount: parseInt(row.childrenCount ?? "0") || 0,
      profession: row.profession ?? "",
      currentAddress: row.currentAddress ?? "",
      permanentAddress: row.permanentAddress ?? "",
      personalMobile: row.personalMobile ?? "",
      altMobile: row.altMobile ?? "",
    }))
    .filter((r) => r.banglaFullName && r.personalMobile);

  await prisma.profile.createMany({ data: toCreate, skipDuplicates: true });
  revalidatePath("/members");
  revalidatePath("/admin/members");
  return { success: true, count: toCreate.length };
}
