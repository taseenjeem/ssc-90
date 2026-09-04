"use server";

import { createClient } from "@supabase/supabase-js";

/**
 * Generates a signed upload URL for a single file.
 * The service role key is server-only — never sent to the browser.
 * The client gets a time-limited signed URL and uploads directly to Supabase.
 */
export async function getSignedUploadUrl(
  bucket: string,
  path: string
): Promise<{ signedUrl: string; token: string; path: string } | { error: string }> {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    return { error: "SUPABASE_SERVICE_ROLE_KEY is not configured." };
  }

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceKey,
    { auth: { persistSession: false } }
  );

  const { data, error } = await admin.storage
    .from(bucket)
    .createSignedUploadUrl(path, { upsert: false });

  if (error || !data) {
    return { error: error?.message ?? "Failed to create signed URL." };
  }

  return { signedUrl: data.signedUrl, token: data.token, path: data.path };
}
