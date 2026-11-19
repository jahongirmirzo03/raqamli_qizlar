# DIGITAL SHE — MVP Veb-platformasi

> **"Raqamli iqtisodiyotda ayollar imkoniyatlarini kengaytirish"**

**Digital She** — O'zbekistondagi ayollar va qizlar uchun masofaviy ish (frilans) hamda 15–30 daqiqalik mikro-vazifalar platformasi. Asosiy afzalliklari: **"Ona rejimi"** (moslashuvchan vaqt va muddat), **mikro-vazifalar**, qoidaga asoslangan **"Sizga mos ishlar"** (`matchScore`) algoritmi va o'zbek tilidagi xavfsiz muhit.

---

## 1. Texnologiyalar Steki

- **Framework**: Next.js 15 (App Router) + TypeScript
- **Dizayn & Stil**: Tailwind CSS (mobil-birinchi qora-binafsha `#0B0714` / `#150F24` / `#A78BFA` / `#8B5CF6` palitrasi, `Playfair Display` + `Inter` shriftlari)
- **Ma'lumotlar bazasi va Auth**: Supabase (PostgreSQL, Supabase Auth, Row Level Security)
- **Server Validatsiyasi**: `zod`
- **Til**: O'zbek tili (lotin). Barcha matnlar `lib/texts.ts` faylida saqlanadi.

---

## 2. Lokal Ishga Tushirish

1. Repozitoriyni yuklab oling va paketlarni o'rnating:
   ```bash
   npm install
   ```

2. `.env.example` faylidan nusxa olib `.env.local` yarating:
   ```bash
   cp .env.example .env.local
   ```
   Ichiga Supabase loyihangiz ma'lumotlarini kiriting:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://sizning-loyihangiz.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sizning-anon-public-kalitingiz
   ```
   *(Eslatma: Supabase kalitlari kiritilmagan taqdirda ham sayt xatosiz ochiladi va namuna ishlarni ko'rsatadi).*

3. Loyihani ishga tushiring:
   ```bash
   npm run dev
   ```
   Brauzerda `http://localhost:3000` manzilini oching.

4. Moslik (`matchScore`) unit testlarini va production yig'ilishini tekshirish:
   ```bash
   npm test
   npm run build
   ```

---

## 3. Supabase Sozlash Qadamlari

1. [Supabase](https://supabase.com) saytida bepul yangi loyiha yarating.
2. Chap menyudan **SQL Editor** bo'limiga kiring:
   - Avval [`supabase/schema.sql`](./supabase/schema.sql) faylining to'liq mazmunini nusxalab, **Run** tugmasini bosing (barcha jadvallar, `user_role` enum, `is_admin()` funksiyasi, `auth.users` triggeri va RLS qoidalari yaratiladi).
   - So'ng [`supabase/seed.sql`](./supabase/seed.sql) faylini ishga tushiring (4 ta namuna profil va 8 ta namuna ish qo'shiladi).
3. **Project Settings → API** bo'limidan:
   - `Project URL` ni `NEXT_PUBLIC_SUPABASE_URL` ga,
   - `anon` `public` key ni `NEXT_PUBLIC_SUPABASE_ANON_KEY` ga qo'ying.
   *(Muhim: `service_role` kalitini hech qachon brauzer kodiga yoki `NEXT_PUBLIC_` o'zgaruvchiga qo'ymang!)*
4. Tezkor test qilish uchun **Authentication → Providers → Email** bo'limida `"Confirm email"` opsiyasini o'chirib qo'yishingiz mumkin (yoki email tasdiqlash bilan ishlating).

---

## 4. Vercel'ga Joylash (Deployment)

1. Loyiha kodini GitHub repozitoriyga yuklang.
2. [Vercel](https://vercel.com) da **Add New Project** tugmasini bosib, GitHub repozitoriyni tanlang.
3. **Environment Variables** bo'limiga quyidagi 2 ta o'zgaruvchini qo'shing:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. **Deploy** tugmasini bosing.
5. Deploy tugagach, Supabase panelida **Authentication → URL Configuration → Site URL** maydoniga Vercel domen manzilingizni (`https://sizning-saytingiz.vercel.app`) kiriting.

---

## 5. Birinchi Administratorni Tayinlash

Xavfsizlik qoidasiga ko'ra, ro'yxatdan o'tishda faqat **Frilanser** yoki **Buyurtmachi** rolini tanlash mumkin. Birinchi adminni tayinlash uchun:

1. Saytda `/register` orqali o'z emailingiz bilan ro'yxatdan o'ting.
2. Supabase panelida **Table Editor → `profiles`** jadvalini oching.
3. O'z qatoringizdagi `role` ustunini `admin` qiymatiga o'zgartiring va saqlang (yoki SQL Editor'da quyidagini bajaring):
   ```sql
   update public.profiles
   set role = 'admin'
   where id = 'SIZNING_USER_UUID';
   ```
4. Endi saytning yuqori menyusida **Admin panel** (`/admin`) havolasi paydo bo'ladi.
