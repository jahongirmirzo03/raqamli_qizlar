"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase, getCurrentProfile } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export async function toggleUserVerifiedAction(
  userId: string,
  nextVerified: boolean
): Promise<{ error?: string; success?: boolean }> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase sozlanmagan." };
  }

  const admin = await getCurrentProfile();
  if (!admin || admin.role !== "admin") {
    return { error: "Faqat administrator ushbu amalni bajara oladi." };
  }

  const supabase = await createServerSupabase();
  const { error } = await supabase
    .from("profiles")
    .update({ verified: nextVerified })
    .eq("id", userId);

  if (error) {
    return { error: "Tasdiqlash holatini yangilashda xatolik yuz berdi." };
  }

  revalidatePath("/admin");
  revalidatePath(`/u/${userId}`);
  revalidatePath("/jobs");
  return { success: true };
}

export async function toggleJobHiddenAction(
  jobId: string,
  nextHidden: boolean
): Promise<{ error?: string; success?: boolean }> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase sozlanmagan." };
  }

  const admin = await getCurrentProfile();
  if (!admin || admin.role !== "admin") {
    return { error: "Faqat administrator ushbu amalni bajara oladi." };
  }

  const supabase = await createServerSupabase();
  const { error } = await supabase
    .from("jobs")
    .update({ hidden: nextHidden })
    .eq("id", jobId);

  if (error) {
    return { error: "E'lon holatini yangilashda xatolik yuz berdi." };
  }

  revalidatePath("/admin");
  revalidatePath("/jobs");
  revalidatePath(`/jobs/${jobId}`);
  return { success: true };
}
