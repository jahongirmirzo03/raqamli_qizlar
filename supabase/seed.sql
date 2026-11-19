-- Digital She — Demo ma'lumotlar (Seed)
-- 8-bo'lim talabi: 4 ta namunaviy profil va 8 ta namunaviy ish (turli kategoriya, 3 tasi mikro-vazifa, 2 tasi moslashuvchan muddatli).
-- Muhim: Demo ma'lumotlar haqiqiy odamlar emasligi aniq ("Demo foydalanuvchi 1..4", "[Namuna] ...").
-- Haqiqiy foydalanuvchilar kelgach ushbu seed qatorlarini o'chirib tashlashingiz mumkin.

-- 1. auth.users ga 4 ta demo foydalanuvchi qo'shamiz (profiles trigger yoki quyidagi upsert orqali to'ldiriladi)
insert into auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
)
values
  (
    '00000000-0000-0000-0000-000000000101',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'demo1@digitalshe.example',
    '$2a$10$abcdefghijklmnopqrstuv',
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Demo foydalanuvchi 1 (Dizayner)","role":"freelancer"}',
    now(),
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000102',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'demo2@digitalshe.example',
    '$2a$10$abcdefghijklmnopqrstuv',
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Demo foydalanuvchi 2 (Tarjimon va Kopirayter)","role":"freelancer"}',
    now(),
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000103',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'demo3@digitalshe.example',
    '$2a$10$abcdefghijklmnopqrstuv',
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Demo foydalanuvchi 3 (Veb va Ma''lumot kiritish)","role":"freelancer"}',
    now(),
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000104',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'demo4@digitalshe.example',
    '$2a$10$abcdefghijklmnopqrstuv',
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Demo foydalanuvchi 4 (Buyurtmachi)","role":"client"}',
    now(),
    now()
  )
on conflict (id) do nothing;

-- 2. 4 ta namunaviy profilni to'liq ma'lumotlari bilan yangilaymiz
insert into public.profiles (
  id,
  role,
  full_name,
  region,
  bio,
  skills,
  languages,
  weekly_hours,
  flexible_only,
  portfolio_links,
  verified
)
values
  (
    '00000000-0000-0000-0000-000000000101',
    'freelancer',
    'Demo foydalanuvchi 1 (Dizayner)',
    'Toshkent shahri',
    'Namuna profil: Canva va grafik dizayn yo''nalishida 2 yillik tajriba. Ona rejimida (moslashuvchan muddatlarda) ijtimoiy tarmoq bannerlari va taqdimotlar tayyorlayman.',
    array['Canva', 'Grafik dizayn', 'Logotip', 'SMM'],
    array['uz', 'ru'],
    15,
    true,
    array['https://example.com/demo-portfolio-1'],
    true
  ),
  (
    '00000000-0000-0000-0000-000000000102',
    'freelancer',
    'Demo foydalanuvchi 2 (Tarjimon va Kopirayter)',
    'Samarqand viloyati',
    'Namuna profil: O''zbek, rus va ingliz tillarida maqolalar tarjima qilaman hamda bloglar uchun matn yozaman.',
    array['O''zbek-Ingliz tarjima', 'O''zbek-Rus tarjima', 'Copywriting'],
    array['uz', 'ru', 'en'],
    25,
    false,
    array['https://example.com/demo-portfolio-2'],
    true
  ),
  (
    '00000000-0000-0000-0000-000000000103',
    'freelancer',
    'Demo foydalanuvchi 3 (Veb va Ma''lumot kiritish)',
    'Farg''ona viloyati',
    'Namuna profil: Excel jadvallar, ma''lumot kiritish va boshlang''ich Frontend (HTML/CSS/React) vazifalarini sifatli bajaraman.',
    array['Excel / Google Sheets', 'Ma''lumot kiritish', 'Frontend (HTML/CSS/React)', 'Telegram bot'],
    array['uz', 'en'],
    20,
    true,
    array['https://example.com/demo-portfolio-3'],
    false
  ),
  (
    '00000000-0000-0000-0000-000000000104',
    'client',
    'Demo foydalanuvchi 4 (Buyurtmachi)',
    'Toshkent shahri',
    'Namuna buyurtmachi profili: Kichik ta''lim va hunarmandchilik loyihalari uchun masofaviy mutaxassislarni jalb qilamiz.',
    array[]::text[],
    array['uz', 'ru'],
    null,
    false,
    array[]::text[],
    true
  )
on conflict (id) do update set
  role = excluded.role,
  full_name = excluded.full_name,
  region = excluded.region,
  bio = excluded.bio,
  skills = excluded.skills,
  languages = excluded.languages,
  weekly_hours = excluded.weekly_hours,
  flexible_only = excluded.flexible_only,
  portfolio_links = excluded.portfolio_links,
  verified = excluded.verified;

-- 3. 8 ta namunaviy ish (turli kategoriya, 3 tasi mikro-vazifa, 2 tasi moslashuvchan muddatli)
insert into public.jobs (
  id,
  client_id,
  title,
  description,
  category,
  skills,
  budget_uzs,
  estimated_hours,
  is_micro,
  flexible_deadline,
  deadline,
  status
)
values
  (
    '00000000-0000-0000-0000-000000000201',
    '00000000-0000-0000-0000-000000000104',
    '[Namuna] Instagram sahifasi uchun 5 ta Canva post dizayni',
    'Namuna e''lon: Ayollar kiyim-kechak do''koni Instagram sahifasi uchun 5 ta post bannerini Canva dasturida tayyorlash kerak. Tayyor matn va rasmlar beriladi. Ona rejimida ishlovchilar uchun moslashuvchan muddat.',
    'Dizayn (logotip, banner, Canva)',
    array['Canva', 'Grafik dizayn', 'SMM'],
    250000,
    4,
    false,
    true,
    '2026-12-10',
    'open'
  ),
  (
    '00000000-0000-0000-0000-000000000202',
    '00000000-0000-0000-0000-000000000104',
    '[Namuna] 20 ta mahsulot nomini Excel jadvalga kiritish (Mikro-vazifa)',
    'Namuna e''lon: Rasmda berilgan 20 ta mahsulot nomi va narxini Google Sheets jadvaliga xatosiz ko''chirib yozish kerak. Taxminan 20–25 daqiqa vaqt oladi.',
    'Ma''lumot kiritish',
    array['Excel / Google Sheets', 'Ma''lumot kiritish'],
    45000,
    1,
    true,
    false,
    '2026-12-01',
    'open'
  ),
  (
    '00000000-0000-0000-0000-000000000203',
    '00000000-0000-0000-0000-000000000104',
    '[Namuna] 1 betlik taqdimot matnini o''zbekchadan inglizchaga tarjima qilish',
    'Namuna e''lon: Hunarmandchilik loyihasi haqidagi 250 so''zlik qisqa matnni ingliz tiliga ravon tarjima qilish lozim. 30 daqiqalik mikro-vazifa.',
    'Tarjima',
    array['O''zbek-Ingliz tarjima'],
    60000,
    1,
    true,
    false,
    '2026-12-02',
    'open'
  ),
  (
    '00000000-0000-0000-0000-000000000204',
    '00000000-0000-0000-0000-000000000104',
    '[Namuna] Bolalar o''quv markazi uchun 1 haftalik SMM kontent-reja',
    'Namuna e''lon: Telegram va Instagram kanali uchun 7 ta post g''oyasi va matnlarini yozib berish kerak. Muddat moslashuvchan, uyda o''tirgan onalar uchun juda qulay.',
    'SMM va kontent',
    array['SMM', 'Copywriting', 'Canva'],
    350000,
    6,
    false,
    true,
    '2026-12-15',
    'open'
  ),
  (
    '00000000-0000-0000-0000-000000000205',
    '00000000-0000-0000-0000-000000000104',
    '[Namuna] Ona va bola salomatligi haqida 3 ta blog maqola yozish',
    'Namuna e''lon: Tibbiy-ma''rifiy portal uchun o''zbek tilida imlo xatolarsiz, o''qishli 3 ta maqola (har biri 600-800 so''z) tayyorlash talab etiladi.',
    'Matn yozish',
    array['Copywriting'],
    300000,
    5,
    false,
    false,
    '2026-12-12',
    'open'
  ),
  (
    '00000000-0000-0000-0000-000000000206',
    '00000000-0000-0000-0000-000000000104',
    '[Namuna] Qandolatchilik kursi uchun bir sahifali (Landing) veb-sayt',
    'Namuna e''lon: Onlayn qandolatchilik kursi uchun mobil telefonda chiroyli ko''rinadigan landing sahifa (HTML/Tailwind yoki React) tayyorlash kerak.',
    'Veb va dasturlash',
    array['Frontend (HTML/CSS/React)'],
    800000,
    12,
    false,
    false,
    '2026-12-20',
    'open'
  ),
  (
    '00000000-0000-0000-0000-000000000207',
    '00000000-0000-0000-0000-000000000104',
    '[Namuna] 1 daqiqalik Reels videosiga subtitr qo''shish (Mikro-vazifa)',
    'Namuna e''lon: Tayyor 1 daqiqalik videoga CapCut dasturida o''zbekcha subtitr qo''shib berish kerak. 20 daqiqalik kichik vazifa.',
    'Boshqa',
    array['Video montaj (CapCut)', 'SMM'],
    50000,
    1,
    true,
    false,
    '2026-12-03',
    'open'
  ),
  (
    '00000000-0000-0000-0000-000000000208',
    '00000000-0000-0000-0000-000000000104',
    '[Namuna] O''quv qo''llanmani rus tilidan o''zbek tiliga tarjima qilish',
    'Namuna e''lon: Boshlang''ich kompyuter savodxonligi bo''yicha 10 sahifalik qo''llanmani rus tilidan o''zbek tiliga tushunarli qilib tarjima qilish.',
    'Tarjima',
    array['O''zbek-Rus tarjima', 'Copywriting'],
    450000,
    10,
    false,
    false,
    '2026-12-18',
    'open'
  )
on conflict (id) do nothing;
