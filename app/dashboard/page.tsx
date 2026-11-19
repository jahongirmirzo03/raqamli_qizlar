import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabase, getCurrentProfile } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { DEMO_JOBS } from "@/lib/demo-data";
import { TEXTS } from "@/lib/texts";
import { matchScore } from "@/lib/matching";
import { JobCard, formatUzs } from "@/components/JobCard";
import {
  AcceptCandidateButton,
  JobStatusControl,
} from "@/components/JobDetailActions";
import type { Application, Job } from "@/lib/types";
import {
  Sparkles,
  Briefcase,
  PlusCircle,
  Edit3,
  CheckCircle2,
  Clock,
  ArrowRight,
  BadgeCheck,
  ShieldCheck,
} from "lucide-react";

export default async function DashboardPage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/login?next=/dashboard");
  }

  const supabase = await createServerSupabase();

  // ================= FRILANSER PANELI =================
  if (profile.role === "freelancer") {
    let myApplications: Application[] = [];
    let assignedJobs: Job[] = [];
    let openJobs: Job[] = [];

    if (isSupabaseConfigured()) {
      const { data: apps } = await supabase
        .from("applications")
        .select("*, job:jobs(*)")
        .eq("freelancer_id", profile.id)
        .order("created_at", { ascending: false });
      myApplications = (apps as unknown as Application[]) ?? [];

      const { data: activeJ } = await supabase
        .from("jobs")
        .select("*")
        .eq("assigned_to", profile.id)
        .order("created_at", { ascending: false });
      assignedJobs = (activeJ as unknown as Job[]) ?? [];

      const { data: allOpen } = await supabase
        .from("jobs")
        .select(
          "*, client:profiles!jobs_client_id_fkey(id, full_name, region, verified)"
        )
        .eq("hidden", false)
        .eq("status", "open")
        .order("created_at", { ascending: false });
      openJobs = (allOpen as unknown as Job[]) ?? [];
    }

    if (openJobs.length === 0) {
      openJobs = DEMO_JOBS;
    }

    // 4.3-bo'lim: Panelda eng yuqori 6 ta mos ishni ko'rsat
    const topMatchedJobs = openJobs
      .map((job) => ({
        job,
        score: matchScore(profile, job),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);

    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
        {/* Welcome banner */}
        <div className="p-6 sm:p-8 rounded-2xl bg-brand-card border border-brand-primary/30 shadow-purple flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-primary">
              Frilanser kabineti
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-text">
              Xush kelibsiz, {profile.full_name}!
            </h1>
            <p className="text-sm text-brand-muted">
              {profile.skills?.length
                ? `Ko'nikmalaringiz: ${profile.skills.join(", ")} · Haftasiga ${
                    profile.weekly_hours || "—"
                  } soat`
                : "Sizga mos ishlarni aniqroq topish uchun ko'nikmalaringiz va 'Ona rejimi' soatlarini kiriting."}
            </p>
          </div>
          <Link
            href="/profile/edit"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-brand-accent hover:bg-brand-primary text-brand-bg font-semibold text-xs sm:text-sm transition-colors shrink-0"
          >
            <Edit3 className="w-4 h-4" />
            <span>Profil va ko&apos;nikmalarni sozlash</span>
          </Link>
        </div>

        {/* Sizga biriktirilgan faol buyurtmalar */}
        {assignedJobs.length > 0 && (
          <section className="space-y-4">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-brand-text flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Siz bajarayotgan buyurtmalar ({assignedJobs.length})</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assignedJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-5 rounded-2xl bg-brand-card border border-brand-primary/30 space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-brand-primary/15 text-brand-primary text-xs font-semibold">
                      {TEXTS.jobs.statusLabels[job.status]}
                    </span>
                    <span className="text-sm font-bold text-brand-primary">
                      {formatUzs(job.budget_uzs)}
                    </span>
                  </div>
                  <Link
                    href={`/jobs/${job.id}`}
                    className="block font-serif text-lg font-bold text-brand-text hover:text-brand-primary"
                  >
                    {job.title}
                  </Link>
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
                    <JobStatusControl
                      jobId={job.id}
                      status={job.status}
                      isClient={false}
                      isAssignedFreelancer={true}
                    />
                    <Link
                      href={`/jobs/${job.id}`}
                      className="text-xs font-semibold text-brand-primary hover:underline inline-flex items-center gap-1"
                    >
                      <span>Tafsilot va yozishmalar</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Yuborgan arizalarim va ularning holati */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-brand-text flex items-center gap-2">
            <Clock className="w-5 h-5 text-brand-primary" />
            <span>Yuborgan arizalarim ({myApplications.length})</span>
          </h2>

          {myApplications.length === 0 ? (
            <div className="p-6 rounded-2xl bg-brand-card border border-brand-primary/20 text-sm text-brand-muted">
              Siz hali birorta buyurtmaga ariza yubormagansiz. Pastdagi{" "}
              <strong className="text-brand-text">“Sizga mos ishlar”</strong>{" "}
              ro&apos;yxatidan o&apos;zingizga ma&apos;qulini tanlang!
            </div>
          ) : (
            <div className="space-y-3">
              {myApplications.map((app) => (
                <div
                  key={app.id}
                  className="p-5 rounded-2xl bg-brand-card border border-brand-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <Link
                      href={`/jobs/${app.job_id}`}
                      className="font-serif text-lg font-bold text-brand-text hover:text-brand-primary"
                    >
                      {app.job?.title || "Buyurtma"}
                    </Link>
                    <p className="text-xs sm:text-sm text-brand-muted line-clamp-1">
                      Taklifingiz: {formatUzs(app.price_uzs)} · “{app.message}”
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`px-3 py-1 rounded-xl text-xs font-semibold ${
                        app.status === "accepted"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
                          : app.status === "rejected"
                          ? "bg-red-500/20 text-red-300 border border-red-400/30"
                          : "bg-brand-primary/15 text-brand-primary border border-brand-primary/30"
                      }`}
                    >
                      {TEXTS.jobs.applicationStatus[app.status]}
                    </span>
                    <Link
                      href={`/jobs/${app.job_id}`}
                      className="text-xs font-semibold text-brand-primary hover:underline"
                    >
                      Ko&apos;rish →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* SIZGA MOS ISHLAR (Eng yuqori 6 ta mos ish) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-brand-text flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-primary" />
              <span>Sizga mos ishlar (Top 6)</span>
            </h2>
            <Link
              href="/jobs"
              className="text-xs sm:text-sm font-semibold text-brand-primary hover:underline"
            >
              Barcha ishlarni ko&apos;rish →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {topMatchedJobs.map(({ job, score }) => (
              <JobCard key={job.id} job={job} matchPercent={score} />
            ))}
          </div>
        </section>
      </div>
    );
  }

  // ================= BUYURTMACHI (YOKI ADMIN) PANELI =================
  let myJobs: Job[] = [];
  let jobApplicationsMap: Record<string, Application[]> = {};

  if (isSupabaseConfigured()) {
    const { data: jobsData } = await supabase
      .from("jobs")
      .select("*")
      .eq("client_id", profile.id)
      .order("created_at", { ascending: false });
    myJobs = (jobsData as unknown as Job[]) ?? [];

    if (myJobs.length > 0) {
      const jobIds = myJobs.map((j) => j.id);
      const { data: appsData } = await supabase
        .from("applications")
        .select(
          "*, freelancer:profiles!applications_freelancer_id_fkey(*)"
        )
        .in("job_id", jobIds)
        .order("created_at", { ascending: false });

      const allApps = (appsData as unknown as Application[]) ?? [];
      jobApplicationsMap = allApps.reduce<Record<string, Application[]>>(
        (acc, app) => {
          acc[app.job_id] = acc[app.job_id] || [];
          acc[app.job_id].push(app);
          return acc;
        },
        {}
      );
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      <div className="p-6 sm:p-8 rounded-2xl bg-brand-card border border-brand-primary/30 shadow-purple flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-primary">
            Buyurtmachi kabineti
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-text">
            Xush kelibsiz, {profile.full_name}!
          </h1>
          <p className="text-sm text-brand-muted">
            E&apos;lon qilgan buyurtmalaringiz va ularga kelib tushgan arizalarni
            shu yerdan boshqaring.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {profile.role === "admin" && (
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-brand-bg border border-brand-primary/35 text-brand-primary font-semibold text-xs sm:text-sm"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin panelga o&apos;tish</span>
            </Link>
          )}
          <Link
            href="/jobs/new"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-brand-accent hover:bg-brand-primary text-brand-bg font-semibold text-xs sm:text-sm transition-colors shadow-purple-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Yangi ish e&apos;lon qilish</span>
          </Link>
        </div>
      </div>

      {/* Mening e'lonlarim va har bir e'londagi arizalar */}
      <section className="space-y-5">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-brand-text flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-brand-primary" />
          <span>Mening e&apos;lonlarim ({myJobs.length})</span>
        </h2>

        {myJobs.length === 0 ? (
          <div className="p-10 rounded-2xl bg-brand-card border border-brand-primary/20 text-center space-y-3">
            <p className="text-base font-semibold text-brand-text">
              Siz hali birorta ish e&apos;lon qilmagansiz.
            </p>
            <p className="text-sm text-brand-muted">
              Yangi vazifa qo&apos;shing va sanoqli daqiqalarda nomzodlardan
              arizalar qabul qiling.
            </p>
            <Link
              href="/jobs/new"
              className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-accent text-brand-bg font-semibold text-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Birinchi ishni e&apos;lon qilish</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {myJobs.map((job) => {
              const apps = jobApplicationsMap[job.id] || [];
              return (
                <div
                  key={job.id}
                  className="p-6 rounded-2xl bg-brand-card border border-brand-primary/25 shadow-purple-sm space-y-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-primary/15 pb-4">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-lg bg-brand-primary/15 text-brand-primary text-xs font-semibold">
                          {TEXTS.jobs.statusLabels[job.status]}
                        </span>
                        <span className="text-xs text-brand-muted">
                          {job.category}
                        </span>
                      </div>
                      <Link
                        href={`/jobs/${job.id}`}
                        className="font-serif text-xl font-bold text-brand-text hover:text-brand-primary"
                      >
                        {job.title}
                      </Link>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-bold text-brand-primary text-base">
                        {formatUzs(job.budget_uzs)}
                      </span>
                      <JobStatusControl
                        jobId={job.id}
                        status={job.status}
                        isClient={true}
                        isAssignedFreelancer={false}
                      />
                      <Link
                        href={`/jobs/${job.id}`}
                        className="px-3.5 py-2 rounded-xl bg-brand-bg border border-brand-primary/25 text-xs font-semibold text-brand-text hover:border-brand-primary"
                      >
                        Batafsil →
                      </Link>
                    </div>
                  </div>

                  {/* Arizalar */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-primary">
                      Arizalar ({apps.length})
                    </h3>

                    {apps.length === 0 ? (
                      <p className="text-xs sm:text-sm text-brand-muted">
                        Hozircha arizalar yo&apos;q.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        {apps.map((app) => {
                          const score = app.freelancer
                            ? matchScore(app.freelancer, job)
                            : null;
                          return (
                            <div
                              key={app.id}
                              className="p-4 rounded-xl bg-brand-bg/90 border border-brand-primary/20 space-y-2.5"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-1.5">
                                  <Link
                                    href={`/u/${app.freelancer_id}`}
                                    className="font-semibold text-sm text-brand-text hover:text-brand-primary"
                                  >
                                    {app.freelancer?.full_name || "Frilanser"}
                                  </Link>
                                  {app.freelancer?.verified && (
                                    <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
                                  )}
                                  {typeof score === "number" && (
                                    <span className="px-2 py-0.5 rounded-full bg-brand-primary/15 text-brand-primary text-[11px] font-bold">
                                      Mos: {score}%
                                    </span>
                                  )}
                                </div>
                                <span
                                  className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold ${
                                    app.status === "accepted"
                                      ? "bg-emerald-500/20 text-emerald-300"
                                      : app.status === "rejected"
                                      ? "bg-red-500/20 text-red-300"
                                      : "bg-brand-primary/15 text-brand-muted"
                                  }`}
                                >
                                  {TEXTS.jobs.applicationStatus[app.status]}
                                </span>
                              </div>

                              <p className="text-xs font-semibold text-brand-primary">
                                Taklif narxi: {formatUzs(app.price_uzs)}
                              </p>
                              <p className="text-xs text-brand-muted line-clamp-3">
                                {app.message}
                              </p>

                              {job.status === "open" &&
                                app.status === "pending" && (
                                  <div className="pt-1">
                                    <AcceptCandidateButton
                                      jobId={job.id}
                                      applicationId={app.id}
                                      freelancerId={app.freelancer_id}
                                    />
                                  </div>
                                )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
