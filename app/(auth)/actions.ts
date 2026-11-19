"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { loginSchema, registerSchema } from "@/lib/validators";

export interface AuthActionResult {
  error?: string;
  success?: boolean;
}

export async function loginAction(formData: FormData): Promise<AuthActionResult> {
  const raw = {
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      error: parsed.error.errors[0]?.message || "Kiritilgan ma'lumotlarda xatolik bor",
    };
  }

  if (!isSupabaseConfigured()) {
    return {
      error:
        "Supabase ulanishi hali sozlanmagan (.env fayliga NEXT_PUBLIC_SUPABASE_URL va NEXT_PUBLIC_SUPABASE_ANON_KEY kiriting).",
    };
  }

  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return {
      error: "Email yoki parol noto'g'ri. Iltimos, qayta tekshirib ko'ring.",
    };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function registerAction(
  formData: FormData
): Promise<AuthActionResult> {
  const raw = {
    full_name: String(formData.get("full_name") ?? ""),
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
    role: String(formData.get("role") ?? "freelancer"),
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      error: parsed.error.errors[0]?.message || "Kiritilgan ma'lumotlarda xatolik bor",
    };
  }

  if (!isSupabaseConfigured()) {
    return {
      error:
        "Supabase ulanishi hali sozlanmagan (.env fayliga NEXT_PUBLIC_SUPABASE_URL va NEXT_PUBLIC_SUPABASE_ANON_KEY kiriting).",
    };
  }

  const supabase = await createServerSupabase();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.full_name,
        role: parsed.data.role,
      },
    },
  });

  if (error) {
    return {
      error:
        error.message.includes("already registered")
          ? "Ushbu elektron pochta allaqachon ro'yxatdan o'tgan."
          : `Ro'yxatdan o'tishda xatolik: ${error.message}`,
    };
  }

  // Agar trigger ishlamagan bo'lsa yoki darhol sessiya ochilgan bo'lsa, profil qatorini kafolatlaymiz
  if (data.user) {
    await supabase.from("profiles").upsert(
      {
        id: data.user.id,
        full_name: parsed.data.full_name,
        role: parsed.data.role,
      },
      { onConflict: "id" }
    );
  }

  revalidatePath("/", "layout");
  return { success: true };
}
