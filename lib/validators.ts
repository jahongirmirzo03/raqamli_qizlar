import { z } from "zod";
import { CATEGORIES, REGIONS } from "./texts";

export const registerSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(2, "To'liq ism kamida 2 ta belgidan iborat bo'lishi kerak")
    .max(80, "Ism juda uzun"),
  email: z.string().trim().email("Yaroqli elektron pochta manzilini kiriting"),
  password: z
    .string()
    .min(8, "Parol kamida 8 ta belgidan iborat bo'lishi shart")
    .max(100, "Parol juda uzun"),
  role: z.enum(["freelancer", "client"], {
    errorMap: () => ({ message: "Rolni tanlang: Frilanser yoki Buyurtmachi" }),
  }),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Yaroqli elektron pochta manzilini kiriting"),
  password: z
    .string()
    .min(8, "Parol kamida 8 ta belgidan iborat bo'lishi kerak"),
});

export const profileUpdateSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(2, "To'liq ism kamida 2 ta belgidan iborat bo'lishi kerak")
    .max(80, "Ism juda uzun"),
  region: z
    .string()
    .optional()
    .nullable()
    .refine(
      (val) => !val || (REGIONS as readonly string[]).includes(val),
      "Viloyat ro'yxatdan tanlanishi kerak"
    ),
  bio: z
    .string()
    .trim()
    .max(600, "O'zingiz haqingizdagi ma'lumot 600 belgidan oshmasin")
    .optional()
    .nullable(),
  skills: z
    .array(z.string().trim().min(1).max(40))
    .max(20, "Ko'pi bilan 20 ta ko'nikma kiritish mumkin"),
  languages: z
    .array(z.string().trim().min(1).max(20))
    .min(1, "Kamida bitta tilni tanlang"),
  weekly_hours: z
    .number()
    .int("Soat butun son bo'lishi kerak")
    .min(1, "Haftasiga kamida 1 soat")
    .max(80, "Haftasiga ko'pi bilan 80 soat")
    .optional()
    .nullable(),
  flexible_only: z.boolean(),
  portfolio_links: z
    .array(
      z
        .string()
        .trim()
        .url("Portfolio havolasi to'g'ri URL bo'lishi kerak (https://...)")
    )
    .max(10, "Ko'pi bilan 10 ta havola kiritish mumkin"),
});

export const createJobSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Sarlavha kamida 5 ta belgidan iborat bo'lishi kerak")
    .max(120, "Sarlavha 120 belgidan oshmasin"),
  description: z
    .string()
    .trim()
    .min(20, "Ish tavsifi kamida 20 ta belgidan iborat bo'lishi kerak")
    .max(3000, "Tavsif 3000 belgidan oshmasin"),
  category: z
    .string()
    .refine(
      (val) => (CATEGORIES as readonly string[]).includes(val),
      "Kategoriyani ro'yxatdan tanlang"
    ),
  skills: z
    .array(z.string().trim().min(1).max(40))
    .max(15, "Ko'pi bilan 15 ta ko'nikma"),
  budget_uzs: z
    .number()
    .int()
    .min(10000, "Byudjet kamida 10 000 so'm bo'lishi kerak")
    .max(500000000, "Byudjet juda katta")
    .optional()
    .nullable(),
  estimated_hours: z
    .number()
    .int()
    .min(1, "Taxminiy vaqt kamida 1 soat")
    .max(500, "Taxminiy soat juda katta")
    .optional()
    .nullable(),
  is_micro: z.boolean(),
  flexible_deadline: z.boolean(),
  deadline: z.string().optional().nullable(),
});

export const applicationSchema = z.object({
  job_id: z.string().uuid("Noto'g'ri buyurtma identifikatori"),
  message: z
    .string()
    .trim()
    .min(10, "Ariza xabari kamida 10 ta belgidan iborat bo'lishi kerak")
    .max(1200, "Xabar 1200 belgidan oshmasin"),
  price_uzs: z
    .number()
    .int()
    .min(5000, "Taklif narxi kamida 5 000 so'm bo'lishi kerak")
    .max(500000000, "Taklif narxi juda katta")
    .optional()
    .nullable(),
});

export const reviewSchema = z.object({
  job_id: z.string().uuid("Noto'g'ri buyurtma identifikatori"),
  reviewee_id: z.string().uuid("Noto'g'ri foydalanuvchi identifikatori"),
  rating: z
    .number()
    .int()
    .min(1, "Baho 1 dan 5 gacha bo'lishi kerak")
    .max(5, "Baho 1 dan 5 gacha bo'lishi kerak"),
  comment: z
    .string()
    .trim()
    .min(3, "Izoh kamida 3 ta belgidan iborat bo'lsin")
    .max(800, "Izoh 800 belgidan oshmasin"),
});

export const reportSchema = z.object({
  target_type: z.enum(["job", "profile"]),
  target_id: z.string().min(1, "Nishon ID bo'sh bo'lmasligi kerak"),
  reason: z
    .string()
    .trim()
    .min(10, "Shikoyat sababi kamida 10 ta belgidan iborat bo'lishi kerak")
    .max(1000, "Shikoyat sababi 1000 belgidan oshmasin"),
});

export const messageSchema = z.object({
  job_id: z.string().uuid("Noto'g'ri buyurtma identifikatori"),
  body: z
    .string()
    .trim()
    .min(1, "Xabar matnini kiriting")
    .max(1000, "Xabar 1000 belgidan oshmasin"),
});

/**
 * Buyurtma ichidagi yozishmalarda telefon raqam va shaxsiy kontaktlarni yashirish yordamchisi
 */
export function sanitizeContactInfo(text: string): string {
  // Telefon raqamlarni va email manzillarni yashiramiz
  return text
    .replace(/(\+?\d[\d\s\-()]{7,}\d)/g, "[kontakt yashirildi]")
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "[email yashirildi]");
}
