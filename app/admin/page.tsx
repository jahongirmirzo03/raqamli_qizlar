import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabase, getCurrentProfile } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { TEXTS } from "@/lib/texts";
import { formatUzs } from "@/components/JobCard";
import {
  ToggleVerifiedButton,
  ToggleJobHiddenButton,
} from "@/components/AdminControls";
import type { Job, Profile, Report } from "@/lib/types";
import {
  ShieldCheck,
  ShieldAlert,
  Users,
  Briefcase,
  Flag,
  BadgeCheck,
  ArrowLeft,
} from "lucide-react";

export default async function AdminPage() {
  const currentUser = await getCurrentProfile();

  if (!currentUser) {
    redirect("/login?next=/admin");
  }

  // 4.1: Faqat admin kira oladi, noto'g'ri rolda kirishga urinilsa ruxsat berma
  if (currentUser.role !== "admin") {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center space-y-4">
        <div className="p-8 rounded-2xl bg-brand-card border border-red-400/30 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-red-500/15 border border-red-400/30 flex items-center justify-center text-red-300 mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-brand-text">
            Faqat administratorlar uchun
          </h1>
          <p className="text-sm text-brand-muted leading-relaxed">
            Ushbu sahifaga kirish uchun sizda <strong>admin</strong> huquqi
            bo&apos;lishi zarur.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-accent text-brand-bg font-semibold text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kabinetga qaytish</span>
          </Link>
        </div>
      </div>
    );
  }

  let profiles: Profile[] = [];
  let jobs: Job[] = [];
  let reports: Report[] = [];

  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabase();

    const [{ data: dbProfiles }, { data: dbJobs }, { data: dbReports }] =
      await Promise.all([
        supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("jobs")
          .select(
            "*, client:profiles!jobs_client_id_fkey(id, full_name, region, verified)"
          )
          .order("created_at", { ascending: false }),
        supabase
          .from("reports")
          .select(
            "*, reporter:profiles!reports_reporter_id_fkey(id, full_name)"
          )
          .order("created_at", { ascending: false }),
      ]);

    profiles = (dbProfiles as unknown as Profile[]) ?? [];
    jobs = (dbJobs as unknown as Job[]) ?? [];
    reports = (dbReports as unknown as Report[]) ?? [];
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-brand-card border border-brand-primary/35 shadow-purple flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand-primary">
            <ShieldCheck className="w-4 h-4" />
            <span>Boshqaruv va Moderatsiya</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-text">
            Administrator paneli
          </h1>
          <p className="text-sm text-brand-muted">
            Foydalanuvchilarni tasdiqlash, e&apos;lonlarni yashirish va
            shikoyatlarni ko&apos;rib chiqish.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="px-4 py-2.5 rounded-xl bg-brand-bg border border-brand-primary/20">
            <p className="font-serif text-xl font-bold text-brand-primary">
              {profiles.length}
            </p>
            <p className="text-[11px] text-brand-muted">Foydalanuvchi</p>
          </div>
          <div className="px-4 py-2.5 rounded-xl bg-brand-bg border border-brand-primary/20">
            <p className="font-serif text-xl font-bold text-brand-primary">
              {jobs.length}
            </p>
            <p className="text-[11px] text-brand-muted">E&apos;lonlar</p>
          </div>
          <div className="px-4 py-2.5 rounded-xl bg-brand-bg border border-brand-primary/20">
            <p className="font-serif text-xl font-bold text-red-300">
              {reports.length}
            </p>
            <p className="text-[11px] text-brand-muted">Shikoyatlar</p>
          </div>
        </div>
      </div>

      {/* 1. SHIKOYATLAR (REPORTS) */}
      <section className="space-y-4">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-brand-text flex items-center gap-2">
          <Flag className="w-5 h-5 text-red-400" />
          <span>Kelib tushgan shikoyatlar ({reports.length})</span>
        </h2>

        {reports.length === 0 ? (
          <div className="p-6 rounded-2xl bg-brand-card border border-brand-primary/20 text-sm text-brand-muted">
            Hozircha shikoyatlar yo&apos;q.
          </div>
        ) : (
          <div className="space-y-3">
            {reports.map((rep) => (
              <div
                key={rep.id}
                className="p-5 rounded-2xl bg-brand-card border border-red-400/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="px-2.5 py-0.5 rounded-lg bg-red-500/20 text-red-300 font-semibold">
                      {rep.target_type === "job"
                        ? "E'lon ustidan"
                        : "Profil ustidan"}
                    </span>
                    <span className="text-brand-muted">
                      Yuboruvchi: {rep.reporter?.full_name || rep.reporter_id}
                    </span>
                  </div>
                  <p className="text-sm text-brand-text">{rep.reason}</p>
                </div>

                <Link
                  href={
                    rep.target_type === "job"
                      ? `/jobs/${rep.target_id}`
                      : `/u/${rep.target_id}`
                  }
                  className="px-4 py-2 rounded-xl bg-brand-bg border border-brand-primary/25 text-xs font-semibold text-brand-primary hover:underline shrink-0"
                >
                  Ob&apos;yektni ko&apos;rish →
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 2. FOYDALANUVCHILAR RO'YXATI VA VERIFIED BELGISI */}
      <section className="space-y-4">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-brand-text flex items-center gap-2">
          <Users className="w-5 h-5 text-brand-primary" />
          <span>Foydalanuvchilar ({profiles.length})</span>
        </h2>

        <div className="space-y-3">
          {profiles.map((u) => (
            <div
              key={u.id}
              className="p-4 sm:p-5 rounded-2xl bg-brand-card border border-brand-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/u/${u.id}`}
                    className="font-semibold text-base text-brand-text hover:text-brand-primary"
                  >
                    {u.full_name}
                  </Link>
                  {u.verified && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-semibold">
                      <BadgeCheck className="w-3.5 h-3.5" />
                      Tasdiqlangan
                    </span>
                  )}
                  <span className="px-2.5 py-0.5 rounded-lg bg-brand-primary/15 text-brand-primary text-xs">
                    {u.role}
                  </span>
                </div>
                <p className="text-xs text-brand-muted">
                  {u.region || "Hudud kiritilmagan"} · Ko&apos;nikmalar:{" "}
                  {u.skills?.length ? u.skills.join(", ") : "—"}
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <ToggleVerifiedButton userId={u.id} verified={u.verified} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. E'LONLAR VA YASHIRISH (HIDDEN) */}
      <section className="space-y-4">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-brand-text flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-brand-primary" />
          <span>Barcha e&apos;lonlar ({jobs.length})</span>
        </h2>

        <div className="space-y-3">
          {jobs.map((job) => (
            <div
              key={job.id}
              className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                job.hidden
                  ? "bg-brand-card/50 border-red-400/25 opacity-75"
                  : "bg-brand-card border-brand-primary/20"
              }`}
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/jobs/${job.id}`}
                    className="font-serif font-bold text-base sm:text-lg text-brand-text hover:text-brand-primary"
                  >
                    {job.title}
                  </Link>
                  <span className="px-2 py-0.5 rounded-lg bg-brand-primary/15 text-brand-primary text-xs">
                    {TEXTS.jobs.statusLabels[job.status]}
                  </span>
                  {job.hidden && (
                    <span className="px-2 py-0.5 rounded-lg bg-red-500/20 text-red-300 text-xs font-semibold">
                      Yashirilgan
                    </span>
                  )}
                </div>
                <p className="text-xs text-brand-muted">
                  Buyurtmachi: {job.client?.full_name || "—"} ·{" "}
                  {formatUzs(job.budget_uzs)} · {job.category}
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <ToggleJobHiddenButton jobId={job.id} hidden={job.hidden} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
