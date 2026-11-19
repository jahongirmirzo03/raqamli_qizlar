"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase, getCurrentProfile } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { reportSchema } from "@/lib/validators";

export async function submitReportAction(formData: FormData): Promise<{
  error?: string;
  success?: boolean;
}> {
  const raw = {
    target_type: String(formData.get("target_type") ?? ""),
    target_id: String(formData.get("target_id") ?? ""),
    reason: String(formData.get("reason") ?? ""),
  };

  const parsed = reportSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      error: parsed.error.errors[0]?.message || "Shikoyat ma'lumotlari noto'g'ri",
    };
  }

  if (!isSupabaseConfigured()) {
    return {
      error: "Shikoyat yuborish uchun tizimga kirish va Supabase ulanishi zarur.",
    };
  }

  const profile = await getCurrentProfile();
  if (!profile) {
    return {
      error: "Shikoyat yuborish uchun avval tizimga kiring.",
    };
  }

  const supabase = await createServerSupabase();
  const { error } = await supabase.from("reports").insert({
    reporter_id: profile.id,
    target_type: parsed.data.target_type,
    target_id: parsed.data.target_id,
    reason: parsed.data.reason,
  });

  if (error) {
    return {
      error: "Shikoyatni saqlashda xatolik yuz berdi.",
    };
  }

  revalidatePath("/admin");
  return { success: true };
}
