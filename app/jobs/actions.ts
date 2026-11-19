"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase, getCurrentProfile } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import {
  createJobSchema,
  applicationSchema,
  reviewSchema,
  messageSchema,
  sanitizeContactInfo,
} from "@/lib/validators";

export async function createJobAction(formData: FormData): Promise<{
  error?: string;
  jobId?: string;
}> {
  if (!isSupabaseConfigured()) {
    return {
      error: "Supabase ulanishi hali sozlanmagan.",
    };
  }

  const profile = await getCurrentProfile();
  if (!profile) {
    return {
      error: "Ish e'lon qilish uchun tizimga kiring.",
    };
  }

  if (profile.role !== "client" && profile.role !== "admin") {
    return {
      error: "Faqat buyurtmachilar yangi ish e'lon qila oladi.",
    };
  }

  const skillsRaw = String(formData.get("skills") ?? "");
  const skills = skillsRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const budgetStr = String(formData.get("budget_uzs") ?? "").trim();
  const budget_uzs = budgetStr ? Number(budgetStr) : null;

  const hoursStr = String(formData.get("estimated_hours") ?? "").trim();
  const estimated_hours = hoursStr ? Number(hoursStr) : null;

  const deadlineStr = String(formData.get("deadline") ?? "").trim();

  const parsed = createJobSchema.safeParse({
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    category: String(formData.get("category") ?? ""),
    skills,
    budget_uzs,
    estimated_hours,
    is_micro: formData.get("is_micro") === "on",
    flexible_deadline: formData.get("flexible_deadline") === "on",
    deadline: deadlineStr || null,
  });

  if (!parsed.success) {
    return {
      error: parsed.error.errors[0]?.message || "Ma'lumotlarda xatolik bor",
    };
  }

  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("jobs")
    .insert({
      client_id: profile.id,
      title: parsed.data.title,
      description: parsed.data.description,
      category: parsed.data.category,
      skills: parsed.data.skills,
      budget_uzs: parsed.data.budget_uzs,
      estimated_hours: parsed.data.estimated_hours,
      is_micro: parsed.data.is_micro,
      flexible_deadline: parsed.data.flexible_deadline,
      deadline: parsed.data.deadline,
      status: "open",
    })
    .select("id")
    .single();

  if (error || !data) {
    return {
      error: "Buyurtmani saqlashda xatolik yuz berdi.",
    };
  }

  revalidatePath("/jobs");
  revalidatePath("/dashboard");

  return { jobId: data.id };
}

export async function applyToJobAction(formData: FormData): Promise<{
  error?: string;
  success?: boolean;
}> {
  if (!isSupabaseConfigured()) {
    return {
      error: "Ariza yuborish uchun Supabase ulanishi sozlangan bo'lishi kerak.",
    };
  }

  const profile = await getCurrentProfile();
  if (!profile) {
    return {
      error: "Ariza yuborish uchun avval tizimga kiring.",
    };
  }

  if (profile.role !== "freelancer") {
    return {
      error: "Faqat frilanserlar ishlarga ariza yubora oladi.",
    };
  }

  const priceStr = String(formData.get("price_uzs") ?? "").trim();
  const price_uzs = priceStr ? Number(priceStr) : null;

  const parsed = applicationSchema.safeParse({
    job_id: String(formData.get("job_id") ?? ""),
    message: String(formData.get("message") ?? ""),
    price_uzs,
  });

  if (!parsed.success) {
    return {
      error: parsed.error.errors[0]?.message || "Ariza ma'lumotlari noto'g'ri",
    };
  }

  const supabase = await createServerSupabase();

  // Ish ochiqligini tekshiramiz
  const { data: job } = await supabase
    .from("jobs")
    .select("id, status, client_id")
    .eq("id", parsed.data.job_id)
    .single();

  if (!job || job.status !== "open") {
    return {
      error: "Ushbu buyurtma hozirda yangi arizalar qabul qilmayapti.",
    };
  }

  const { error } = await supabase.from("applications").insert({
    job_id: parsed.data.job_id,
    freelancer_id: profile.id,
    message: parsed.data.message,
    price_uzs: parsed.data.price_uzs,
    status: "pending",
  });

  if (error) {
    if (error.code === "23505") {
      return {
        error: "Siz ushbu ishga allaqachon ariza yuborgansiz.",
      };
    }
    return {
      error: "Arizani yuborishda xatolik yuz berdi.",
    };
  }

  revalidatePath(`/jobs/${parsed.data.job_id}`);
  revalidatePath("/dashboard");
  return { success: true };
}

/**
 * Buyurtmachi nomzodni tanlaganda:
 * ish holati in_progress, tanlangan ariza accepted, qolganlari rejected.
 */
export async function acceptApplicationAction(
  jobId: string,
  applicationId: string,
  freelancerId: string
): Promise<{ error?: string; success?: boolean }> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase sozlanmagan." };
  }

  const profile = await getCurrentProfile();
  if (!profile) {
    return { error: "Tizimga kiring." };
  }

  const supabase = await createServerSupabase();
  const { data: job } = await supabase
    .from("jobs")
    .select("id, client_id, status")
    .eq("id", jobId)
    .single();

  if (!job || (job.client_id !== profile.id && profile.role !== "admin")) {
    return { error: "Sizda ushbu buyurtmani boshqarish huquqi yo'q." };
  }

  if (job.status !== "open") {
    return { error: "Buyurtma allaqachon boshqa holatga o'tgan." };
  }

  // 1. Tanlangan arizani accepted qilish
  const { error: accErr } = await supabase
    .from("applications")
    .update({ status: "accepted" })
    .eq("id", applicationId)
    .eq("job_id", jobId);

  if (accErr) {
    return { error: "Arizani qabul qilishda xatolik yuz berdi." };
  }

  // 2. Qolgan arizalarni rejected qilish
  await supabase
    .from("applications")
    .update({ status: "rejected" })
    .eq("job_id", jobId)
    .neq("id", applicationId);

  // 3. Ish holatini in_progress va assigned_to = freelancerId qilish
  const { error: jobErr } = await supabase
    .from("jobs")
    .update({
      status: "in_progress",
      assigned_to: freelancerId,
    })
    .eq("id", jobId);

  if (jobErr) {
    return { error: "Buyurtma holatini yangilashda xatolik." };
  }

  revalidatePath(`/jobs/${jobId}`);
  revalidatePath("/dashboard");
  revalidatePath("/jobs");
  return { success: true };
}

/**
 * Buyurtma holatlari:
 * - Faqat tanlangan frilanser "topshirdim" (submitted) tugmasini bosa oladi.
 * - Faqat buyurtmachi "qabul qildim" (completed) yoki bekor qilish (cancelled) bosa oladi.
 */
export async function updateJobStatusAction(
  jobId: string,
  nextStatus: "submitted" | "completed" | "cancelled"
): Promise<{ error?: string; success?: boolean }> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase sozlanmagan." };
  }

  const profile = await getCurrentProfile();
  if (!profile) {
    return { error: "Tizimga kiring." };
  }

  const supabase = await createServerSupabase();
  const { data: job } = await supabase
    .from("jobs")
    .select("id, client_id, assigned_to, status")
    .eq("id", jobId)
    .single();

  if (!job) {
    return { error: "Buyurtma topilmadi." };
  }

  if (nextStatus === "submitted") {
    if (job.assigned_to !== profile.id) {
      return {
        error: "Faqat biriktirilgan frilanser ishni topshira oladi.",
      };
    }
    if (job.status !== "in_progress") {
      return {
        error: "Faqat jarayondagi ishni topshirish mumkin.",
      };
    }
  } else if (nextStatus === "completed") {
    if (job.client_id !== profile.id && profile.role !== "admin") {
      return {
        error: "Faqat buyurtmachi topshirilgan ishni qabul qila oladi.",
      };
    }
    if (job.status !== "submitted") {
      return {
        error: "Ish avval frilanser tomonidan topshirilgan bo'lishi kerak.",
      };
    }
  } else if (nextStatus === "cancelled") {
    if (job.client_id !== profile.id && profile.role !== "admin") {
      return {
        error: "Faqat buyurtmachi e'lonni bekor qila oladi.",
      };
    }
  }

  const { error } = await supabase
    .from("jobs")
    .update({ status: nextStatus })
    .eq("id", jobId);

  if (error) {
    return { error: "Holatni yangilashda xatolik yuz berdi." };
  }

  revalidatePath(`/jobs/${jobId}`);
  revalidatePath("/dashboard");
  revalidatePath("/jobs");
  return { success: true };
}

/**
 * 4.5. To'lov holati belgilari:
 * Buyurtmachi "To'lov qildim" (client_paid), Frilanser "To'lovni oldim" (freelancer_received).
 */
export async function togglePaymentFlagAction(
  jobId: string,
  flag: "client_paid" | "freelancer_received"
): Promise<{ error?: string; success?: boolean }> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase sozlanmagan." };
  }

  const profile = await getCurrentProfile();
  if (!profile) {
    return { error: "Tizimga kiring." };
  }

  const supabase = await createServerSupabase();
  const { data: job } = await supabase
    .from("jobs")
    .select("id, client_id, assigned_to, client_paid, freelancer_received")
    .eq("id", jobId)
    .single();

  if (!job) {
    return { error: "Buyurtma topilmadi." };
  }

  if (flag === "client_paid" && job.client_id !== profile.id) {
    return { error: "Faqat buyurtmachi 'To'lov qildim' belgisini qo'ya oladi." };
  }

  if (flag === "freelancer_received" && job.assigned_to !== profile.id) {
    return { error: "Faqat ijrochi frilanser 'To'lovni oldim' belgisini qo'ya oladi." };
  }

  const updatePayload =
    flag === "client_paid"
      ? { client_paid: !job.client_paid }
      : { freelancer_received: !job.freelancer_received };

  const { error } = await supabase
    .from("jobs")
    .update(updatePayload)
    .eq("id", jobId);

  if (error) {
    return { error: "To'lov belgisini yangilashda xatolik." };
  }

  revalidatePath(`/jobs/${jobId}`);
  revalidatePath("/dashboard");
  return { success: true };
}

/**
 * 3.1 (10) & 4.4: Sharh va reyting
 * Sharhni faqat completed ishdagi ikki tomon qoldira oladi, har biri bir marta.
 */
export async function submitReviewAction(formData: FormData): Promise<{
  error?: string;
  success?: boolean;
}> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase sozlanmagan." };
  }

  const profile = await getCurrentProfile();
  if (!profile) {
    return { error: "Tizimga kiring." };
  }

  const parsed = reviewSchema.safeParse({
    job_id: String(formData.get("job_id") ?? ""),
    reviewee_id: String(formData.get("reviewee_id") ?? ""),
    rating: Number(formData.get("rating") ?? 5),
    comment: String(formData.get("comment") ?? ""),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.errors[0]?.message || "Sharh ma'lumotlari noto'g'ri",
    };
  }

  const supabase = await createServerSupabase();
  const { data: job } = await supabase
    .from("jobs")
    .select("id, status, client_id, assigned_to")
    .eq("id", parsed.data.job_id)
    .single();

  if (!job || job.status !== "completed") {
    return {
      error: "Sharh faqat yakunlangan (completed) buyurtmalar uchun qoldiriladi.",
    };
  }

  const isParticipant =
    (job.client_id === profile.id &&
      job.assigned_to === parsed.data.reviewee_id) ||
    (job.assigned_to === profile.id &&
      job.client_id === parsed.data.reviewee_id);

  if (!isParticipant) {
    return {
      error: "Faqat buyurtma ishtirokchilari bir-biriga baho bera oladi.",
    };
  }

  const { error } = await supabase.from("reviews").insert({
    job_id: parsed.data.job_id,
    reviewer_id: profile.id,
    reviewee_id: parsed.data.reviewee_id,
    rating: parsed.data.rating,
    comment: parsed.data.comment,
  });

  if (error) {
    if (error.code === "23505") {
      return {
        error: "Siz ushbu buyurtma bo'yicha allaqachon sharh qoldirgansiz.",
      };
    }
    return { error: "Sharhni saqlashda xatolik yuz berdi." };
  }

  revalidatePath(`/jobs/${parsed.data.job_id}`);
  revalidatePath(`/u/${parsed.data.reviewee_id}`);
  revalidatePath("/dashboard");
  return { success: true };
}

/**
 * 3.2: Har bir buyurtma ichida oddiy xabarlar (yozishmalar).
 * Telefon raqam va shaxsiy kontaktlar avtomatik yashiriladi.
 */
export async function sendJobMessageAction(formData: FormData): Promise<{
  error?: string;
  success?: boolean;
}> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase sozlanmagan." };
  }

  const profile = await getCurrentProfile();
  if (!profile) {
    return { error: "Tizimga kiring." };
  }

  const parsed = messageSchema.safeParse({
    job_id: String(formData.get("job_id") ?? ""),
    body: String(formData.get("body") ?? ""),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.errors[0]?.message || "Xabar matni noto'g'ri",
    };
  }

  const safeBody = sanitizeContactInfo(parsed.data.body);

  const supabase = await createServerSupabase();
  const { error } = await supabase.from("messages").insert({
    job_id: parsed.data.job_id,
    sender_id: profile.id,
    body: safeBody,
  });

  if (error) {
    return { error: "Xabarni yuborishda xatolik yuz berdi." };
  }

  revalidatePath(`/jobs/${parsed.data.job_id}`);
  return { success: true };
}
