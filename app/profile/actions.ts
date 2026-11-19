"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase, getCurrentProfile } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { profileUpdateSchema } from "@/lib/validators";

export async function updateProfileAction(formData: FormData): Promise<{
  error?: string;
  success?: boolean;
}> {
  if (!isSupabaseConfigured()) {
    return {
      error: "Supabase ulanishi hali sozlanmagan.",
    };
  }

  const profile = await getCurrentProfile();
  if (!profile) {
    return {
      error: "Profilni tahrirlash uchun tizimga kiring.",
    };
  }

  const skillsRaw = String(formData.get("skills") ?? "");
  const skills = skillsRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const languages = formData.getAll("languages").map((l) => String(l).trim()).filter(Boolean);

  const portfolioRaw = String(formData.get("portfolio_links") ?? "");
  const portfolio_links = portfolioRaw
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const weeklyHoursStr = String(formData.get("weekly_hours") ?? "").trim();
  const weekly_hours = weeklyHoursStr ? Number(weeklyHoursStr) : null;

  const regionStr = String(formData.get("region") ?? "").trim();

  const parsed = profileUpdateSchema.safeParse({
    full_name: String(formData.get("full_name") ?? ""),
    region: regionStr || null,
    bio: String(formData.get("bio") ?? "").trim() || null,
    skills,
    languages: languages.length > 0 ? languages : ["uz"],
    weekly_hours,
    flexible_only: formData.get("flexible_only") === "on",
    portfolio_links,
  });

  if (!parsed.success) {
    return {
      error: parsed.error.errors[0]?.message || "Ma'lumotlarda xatolik bor",
    };
  }

  const supabase = await createServerSupabase();
  // Muhim: role va verified ustunlari bu yerda yuborilmaydi va bazada trigger ham ularni himoya qiladi
  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: parsed.data.full_name,
      region: parsed.data.region,
      bio: parsed.data.bio,
      skills: parsed.data.skills,
      languages: parsed.data.languages,
      weekly_hours: parsed.data.weekly_hours,
      flexible_only: parsed.data.flexible_only,
      portfolio_links: parsed.data.portfolio_links,
    })
    .eq("id", profile.id);

  if (error) {
    return {
      error: "Profilni saqlashda xatolik yuz berdi.",
    };
  }

  revalidatePath("/profile");
  revalidatePath(`/u/${profile.id}`);
  revalidatePath("/dashboard");
  revalidatePath("/jobs");

  return { success: true };
}
