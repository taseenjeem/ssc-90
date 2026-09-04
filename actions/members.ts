"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import * as XLSX from "xlsx";

const profileSchema = z.object({
  banglaFullName: z.string().min(1),
  engFullName: z.string().min(1),
  nickName: z.string().min(1),
  gender: z.string().min(1),
  bloodGroup: z.string().min(1),
  schoolName: z.string().min(1),
  maritalStatus: z.string().min(1),
  childrenCount: z.coerce.number().int().min(0).optional(),
  profession: z.string().min(1),
  currentAddress: z.string().min(1),
  permanentAddress: z.string().min(1),
  personalMobile: z.string().min(1),
  altMobile: z.string().min(1),
  profilePicture: z.string().optional().nullable(),
  thenPhoto: z.string().optional().nullable(),
  aboutMe: z.string().optional().nullable(),
  isDeceased: z.boolean().optional().default(false),
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
    childrenCount: formData.get("childrenCount"),
    profession: formData.get("profession"),
    currentAddress: formData.get("currentAddress"),
    permanentAddress: formData.get("permanentAddress"),
    personalMobile: formData.get("personalMobile"),
    altMobile: formData.get("altMobile"),
    profilePicture: formData.get("profilePicture") || null,
    thenPhoto: formData.get("thenPhoto") || null,
    aboutMe: formData.get("aboutMe") || null,
    isDeceased: formData.get("isDeceased") === "true",
  };

  const parsed = profileSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  const userId = crypto.randomUUID();
  await prisma.profile.create({
    data: { ...parsed.data, userId },
  });

  revalidatePath("/members");
  revalidatePath("/admin/members");
  return { success: true };
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
    childrenCount: formData.get("childrenCount"),
    profession: formData.get("profession"),
    currentAddress: formData.get("currentAddress"),
    permanentAddress: formData.get("permanentAddress"),
    personalMobile: formData.get("personalMobile"),
    altMobile: formData.get("altMobile"),
    profilePicture: formData.get("profilePicture") || null,
    thenPhoto: formData.get("thenPhoto") || null,
    aboutMe: formData.get("aboutMe") || null,
    isDeceased: formData.get("isDeceased") === "true",
  };

  const parsed = profileSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  await prisma.profile.update({ where: { id }, data: parsed.data });
  revalidatePath("/members");
  revalidatePath(`/members/${id}`);
  revalidatePath("/admin/members");
  return { success: true };
}

export async function deleteMember(id: string) {
  await prisma.profile.delete({ where: { id } });
  revalidatePath("/members");
  revalidatePath("/admin/members");
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
