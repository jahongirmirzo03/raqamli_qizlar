-- Digital She — MVP Ma'lumotlar bazasi sxemasi (Supabase / PostgreSQL)
-- Ushbu faylni Supabase SQL Editor orqali to'liq ishga tushiring.

-- 1. Rollar uchun enum
do $$ begin
  create type user_role as enum ('freelancer','client','admin');
exception
  when duplicate_object then null;
end $$;

-- 2. Jadvallar
create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  role user_role not null default 'freelancer',
  full_name text not null,
  region text,
  bio text,
  skills text[] not null default '{}',
  languages text[] not null default '{uz}',
  weekly_hours int,
  flexible_only boolean not null default false,
  portfolio_links text[] not null default '{}',
  verified boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists jobs (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  description text not null,
  category text not null,
  skills text[] not null default '{}',
  budget_uzs bigint,
  estimated_hours int,
  is_micro boolean not null default false,
  flexible_deadline boolean not null default false,
  deadline date,
  status text not null default 'open' check (status in ('open','in_progress','submitted','completed','cancelled')),
  assigned_to uuid references profiles(id),
  client_paid boolean not null default false,
  freelancer_received boolean not null default false,
  hidden boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references jobs(id) on delete cascade,
  freelancer_id uuid not null references profiles(id) on delete cascade,
  message text not null,
  price_uzs bigint,
  status text not null default 'pending' check (status in ('pending','accepted','rejected')),
  created_at timestamptz not null default now(),
  unique (job_id, freelancer_id)
);

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references jobs(id) on delete cascade,
  reviewer_id uuid not null references profiles(id),
  reviewee_id uuid not null references profiles(id),
  rating int not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  unique (job_id, reviewer_id)
);

create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references profiles(id),
  target_type text not null check (target_type in ('job','profile')),
  target_id uuid not null,
  reason text not null,
  created_at timestamptz not null default now()
);

-- Buyurtma ichida oddiy xabarlar (yozishmalar)
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references jobs(id) on delete cascade,
  sender_id uuid not null references profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

-- 3. Admin tekshiruvi uchun yordamchi funksiya
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- 4. Trigger: auth.users ga yangi foydalanuvchi qo'shilganda profiles qatori avtomatik yaratilsin
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_role text;
  safe_role user_role;
  raw_name text;
begin
  requested_role := coalesce(new.raw_user_meta_data->>'role', 'freelancer');
  -- Ro'yxatdan o'tishda faqat freelancer yoki client bo'lishi mumkin (admin faqat bazada qo'lda beriladi)
  if requested_role = 'client' then
    safe_role := 'client';
  else
    safe_role := 'freelancer';
  end if;

  raw_name := coalesce(nullif(trim(new.raw_user_meta_data->>'full_name'), ''), 'Foydalanuvchi');

  insert into public.profiles (id, role, full_name)
  values (new.id, safe_role, raw_name)
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 5. Trigger: Oddiy foydalanuvchi o'zining role va verified ustunlarini o'zgartira olmasin
create or replace function public.protect_profile_sensitive_columns()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() and auth.uid() is not null then
    new.role := old.role;
    new.verified := old.verified;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_protect_profile_columns on public.profiles;
create trigger trg_protect_profile_columns
  before update on public.profiles
  for each row execute procedure public.protect_profile_sensitive_columns();

-- 6. RLS (Row Level Security) — barcha jadvallarda yoqilsin
alter table public.profiles enable row level security;
alter table public.jobs enable row level security;
alter table public.applications enable row level security;
alter table public.reviews enable row level security;
alter table public.reports enable row level security;
alter table public.messages enable row level security;

-- PROFILES RLS
drop policy if exists "Profiles hamma o'qiy oladi" on public.profiles;
create policy "Profiles hamma o'qiy oladi"
  on public.profiles for select
  using (true);

drop policy if exists "Foydalanuvchi o'z profilini yaratadi" on public.profiles;
create policy "Foydalanuvchi o'z profilini yaratadi"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "Faqat egasi yoki admin profilni yangilaydi" on public.profiles;
create policy "Faqat egasi yoki admin profilni yangilaydi"
  on public.profiles for update
  using (auth.uid() = id or public.is_admin())
  with check (auth.uid() = id or public.is_admin());

-- JOBS RLS
drop policy if exists "Jobs hidden=false hamma o'qiydi, egasi va admin hammasini" on public.jobs;
create policy "Jobs hidden=false hamma o'qiydi, egasi va admin hammasini"
  on public.jobs for select
  using (hidden = false or client_id = auth.uid() or assigned_to = auth.uid() or public.is_admin());

drop policy if exists "Faqat buyurtmachi o'z e'lonini yaratadi" on public.jobs;
create policy "Faqat buyurtmachi o'z e'lonini yaratadi"
  on public.jobs for insert
  with check (
    client_id = auth.uid()
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('client', 'admin')
    )
  );

drop policy if exists "Buyurtmachi, biriktirilgan frilanser yoki admin ishni yangilaydi" on public.jobs;
create policy "Buyurtmachi, biriktirilgan frilanser yoki admin ishni yangilaydi"
  on public.jobs for update
  using (client_id = auth.uid() or assigned_to = auth.uid() or public.is_admin())
  with check (client_id = auth.uid() or assigned_to = auth.uid() or public.is_admin());

-- APPLICATIONS RLS
drop policy if exists "Ariza egasi va ish egasi o'qiydi" on public.applications;
create policy "Ariza egasi va ish egasi o'qiydi"
  on public.applications for select
  using (
    freelancer_id = auth.uid()
    or exists (
      select 1 from public.jobs
      where jobs.id = applications.job_id and jobs.client_id = auth.uid()
    )
    or public.is_admin()
  );

drop policy if exists "Faqat frilanser o'zi uchun ariza yaratadi" on public.applications;
create policy "Faqat frilanser o'zi uchun ariza yaratadi"
  on public.applications for insert
  with check (
    freelancer_id = auth.uid()
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'freelancer'
    )
  );

drop policy if exists "Ish egasi ariza holatini yangilaydi" on public.applications;
create policy "Ish egasi ariza holatini yangilaydi"
  on public.applications for update
  using (
    exists (
      select 1 from public.jobs
      where jobs.id = applications.job_id and jobs.client_id = auth.uid()
    )
    or public.is_admin()
  );

-- REVIEWS RLS
drop policy if exists "Sharhlarni hamma o'qiydi" on public.reviews;
create policy "Sharhlarni hamma o'qiydi"
  on public.reviews for select
  using (true);

drop policy if exists "Faqat completed ishdagi ishtirokchilar sharh yaratadi" on public.reviews;
create policy "Faqat completed ishdagi ishtirokchilar sharh yaratadi"
  on public.reviews for insert
  with check (
    reviewer_id = auth.uid()
    and exists (
      select 1 from public.jobs
      where jobs.id = reviews.job_id
        and jobs.status = 'completed'
        and (
          (jobs.client_id = auth.uid() and jobs.assigned_to = reviews.reviewee_id)
          or (jobs.assigned_to = auth.uid() and jobs.client_id = reviews.reviewee_id)
        )
    )
  );

-- REPORTS RLS
drop policy if exists "Faqat yaratgan kishi shikoyat qo'sha oladi" on public.reports;
create policy "Faqat yaratgan kishi shikoyat qo'sha oladi"
  on public.reports for insert
  with check (reporter_id = auth.uid());

drop policy if exists "Shikoyatlarni faqat admin o'qiydi" on public.reports;
create policy "Shikoyatlarni faqat admin o'qiydi"
  on public.reports for select
  using (public.is_admin());

-- MESSAGES RLS
drop policy if exists "Buyurtma ishtirokchilari xabarlarni o'qiydi" on public.messages;
create policy "Buyurtma ishtirokchilari xabarlarni o'qiydi"
  on public.messages for select
  using (
    exists (
      select 1 from public.jobs
      where jobs.id = messages.job_id
        and (jobs.client_id = auth.uid() or jobs.assigned_to = auth.uid())
    )
    or public.is_admin()
  );

drop policy if exists "Buyurtma ishtirokchilari xabar yozadi" on public.messages;
create policy "Buyurtma ishtirokchilari xabar yozadi"
  on public.messages for insert
  with check (
    sender_id = auth.uid()
    and exists (
      select 1 from public.jobs
      where jobs.id = messages.job_id
        and (jobs.client_id = auth.uid() or jobs.assigned_to = auth.uid())
    )
  );
