import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerSupabase, getCurrentProfile } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { DEMO_JOBS } from "@/lib/demo-data";
import { TEXTS } from "@/lib/texts";
import { matchScore } from "@/lib/matching";
import { formatUzs } from "@/components/JobCard";
import { ReportButton } from "@/components/ReportButton";
import {
  ApplyJobForm,
  AcceptCandidateButton,
  JobStatusControl,
  PaymentStatusBox,
  LeaveReviewBox,
  JobMessagesBox,
} from "@/components/JobDetailActions";
import type { Application, Job, Message, Profile, Review } from "@/lib/types";
import {
  ArrowLeft,
  Clock,
  Zap,
  Sparkles,
  Calendar,
  BadgeCheck,
  User,
  CheckCircle2,
} from "lucide-react";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const currentUser = await getCurrentProfile();

  let job: Job | null = null;
  let applications: Application[] = [];
  let assignedFreelancer: Profile | null = null;
  let reviews: Review[] = [];
  let messages: Message[] = [];

  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabase();
    const { data: dbJob } = await supabase
      .from("jobs")
      .select(
        "*, client:profiles!jobs_client_id_fkey(id, full_name, region, verified)"
      )
      .eq("id", id)
      .single();

    if (dbJob) {
      job = dbJob as unknown as Job;

      // Arizalar (RLS bo'yicha faqat ariza egasi va ish egasiga qaytadi)
      const { data: dbApps } = await supabase
        .from("applications")
        .select(
          "*, freelancer:profiles!applications_freelancer_id_fkey(*)"
        )
        .eq("job_id", id)
        .order("created_at", { ascending: false });
      applications = (dbApps as unknown as Application[]) ?? [];

      if (job.assigned_to) {
        const { data: af } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", job.assigned_to)
          .single();
        assignedFreelancer = (af as Profile) ?? null;
      }

      const { data: dbReviews } = await supabase
        .from("reviews")
        .select(
          "*, reviewer:profiles!reviews_reviewer_id_fkey(id, full_name, verified)"
        )
        .eq("job_id", id);
      reviews = (dbReviews as unknown as Review[]) ?? [];

      if (
        currentUser &&
        (currentUser.id === job.client_id ||
          currentUser.id === job.assigned_to ||
          currentUser.role === "admin")
      ) {
        const { data: dbMessages } = await supabase
          .from("messages")
          .select("*, sender:profiles!messages_sender_id_fkey(id, full_name)")
          .eq("job_id", id)
          .order("created_at", { ascending: true });
        messages = (dbMessages as unknown as Message[]) ?? [];
      }
    }
  }

  if (!job) {
    const demo = DEMO_JOBS.find((j) => j.id === id);
    if (demo) {
      job = demo;
    }
  }

  if (!job) {
    notFound();
  }

  const isClient =
    Boolean(currentUser) &&
    (currentUser?.id === job.client_id || currentUser?.role === "admin");
  const isAssignedFreelancer =
    Boolean(currentUser) && currentUser?.id === job.assigned_to;
  const isFreelancer = currentUser?.role === "freelancer";

  const myApplication = currentUser
    ? applications.find((a) => a.freelancer_id === currentUser.id)
    : null;

  const matchPercent =
    isFreelancer && currentUser ? matchScore(currentUser, job) : null;

  const hasMyReview = currentUser
    ? reviews.some((r) => r.reviewer_id === currentUser.id)
    : false;

  const statusLabel =
    TEXTS.jobs.statusLabels[job.status] || job.status;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">
      <div className="flex items-center justify-between gap-2">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-1.5 text-sm text-brand-muted hover:text-brand-text"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Barcha ishlarga qaytish</span>
        </Link>

        <ReportButton targetType="job" targetId={job.id} />
      </div>

      {/* Asosiy tafsilot kartasi */}
      <div className="p-6 sm:p-8 rounded-2xl bg-brand-card border border-brand-primary/25 shadow-purple space-y-6">
        {/* Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-xl bg-brand-primary/15 text-brand-primary text-xs font-semibold">
              {job.category}
            </span>

            <span className="px-3 py-1 rounded-xl bg-brand-bg border border-brand-primary/30 text-brand-text text-xs font-semibold">
              Holati: {statusLabel}
            </span>

            {job.is_micro && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-semibold">
                <Zap className="w-3.5 h-3.5" />
                {TEXTS.jobs.microBadge}
              </span>
            )}

            {job.flexible_deadline && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
                <Clock className="w-3.5 h-3.5" />
                {TEXTS.jobs.flexibleBadge}
              </span>
            )}
          </div>

          {typeof matchPercent === "number" && (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-accent/25 border border-brand-primary text-brand-text text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              {TEXTS.jobs.matchPrefix} {matchPercent}%
            </span>
          )}
        </div>

        {/* Title & Budget */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-text leading-snug">
            {job.title}
          </h1>
          <div className="sm:text-right shrink-0">
            <p className="text-xs text-brand-muted">Taklif etilgan byudjet</p>
            <p className="font-serif text-xl sm:text-2xl font-bold text-brand-primary">
              {formatUzs(job.budget_uzs)}
            </p>
          </div>
        </div>

        {/* Meta info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-brand-bg/80 border border-brand-primary/15 text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-brand-muted">
            <Clock className="w-4 h-4 text-brand-primary shrink-0" />
            <span>
              Taxminiy vaqt:{" "}
              <strong className="text-brand-text">
                {job.estimated_hours
                  ? `${job.estimated_hours} ${TEXTS.jobs.hoursUnit}`
                  : "Kelishiladi"}
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-2 text-brand-muted">
            <Calendar className="w-4 h-4 text-brand-primary shrink-0" />
            <span>
              Muddat:{" "}
              <strong className="text-brand-text">
                {job.deadline || "Moslashuvchan"}
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-2 text-brand-muted">
            <User className="w-4 h-4 text-brand-primary shrink-0" />
            <span>
              Buyurtmachi:{" "}
              {job.client ? (
                <Link
                  href={`/u/${job.client.id}`}
                  className="font-semibold text-brand-primary hover:underline inline-flex items-center gap-1"
                >
                  <span>{job.client.full_name}</span>
                  {job.client.verified && (
                    <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                </Link>
              ) : (
                <strong className="text-brand-text">Buyurtmachi</strong>
              )}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-brand-primary">
            Vazifa tavsifi
          </h2>
          <p className="text-sm sm:text-base text-brand-muted leading-relaxed whitespace-pre-line">
            {job.description}
          </p>
        </div>

        {/* Skills */}
        {job.skills && job.skills.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-brand-primary">
              Talab qilinadigan ko&apos;nikmalar
            </h2>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 rounded-xl bg-brand-bg border border-brand-primary/25 text-xs font-medium text-brand-text"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Biriktirilgan frilanser va holat boshqaruvi */}
        {assignedFreelancer && (
          <div className="p-4 rounded-xl bg-brand-bg border border-brand-primary/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-sm">
              <span className="text-brand-muted">Tanlangan ijrochi: </span>
              <Link
                href={`/u/${assignedFreelancer.id}`}
                className="font-semibold text-brand-primary hover:underline"
              >
                {assignedFreelancer.full_name}
              </Link>
            </div>
            {(isClient || isAssignedFreelancer) && (
              <JobStatusControl
                jobId={job.id}
                status={job.status}
                isClient={isClient}
                isAssignedFreelancer={isAssignedFreelancer}
              />
            )}
          </div>
        )}

        {/* To'lov ma'lumoti va belgilari (4.5-bo'lim) */}
        <PaymentStatusBox
          jobId={job.id}
          clientPaid={job.client_paid}
          freelancerReceived={job.freelancer_received}
          isClient={isClient}
          isAssignedFreelancer={isAssignedFreelancer}
        />
      </div>

      {/* Buyurtma yakunlanganda (completed) sharh qoldirish bloki */}
      {job.status === "completed" &&
        (isClient || isAssignedFreelancer) &&
        !hasMyReview &&
        job.assigned_to && (
          <LeaveReviewBox
            jobId={job.id}
            revieweeId={isClient ? job.assigned_to : job.client_id}
            revieweeName={
              isClient
                ? assignedFreelancer?.full_name || "Frilanser"
                : job.client?.full_name || "Buyurtmachi"
            }
          />
        )}

      {/* Buyurtma ichidagi yozishmalar (faqat buyurtmachi va biriktirilgan frilanser uchun) */}
      {currentUser &&
        job.assigned_to &&
        (isClient || isAssignedFreelancer) && (
          <JobMessagesBox
            jobId={job.id}
            messages={messages}
            currentUserId={currentUser.id}
          />
        )}

      {/* Ariza yuborish bloki (Frilanser yoki mehmon uchun) */}
      {job.status === "open" && !isClient && (
        <div className="p-6 sm:p-8 rounded-2xl bg-brand-card border border-brand-primary/25 shadow-purple-sm space-y-4">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-brand-text">
            Ushbu ishga ariza topshirish
          </h2>

          {!currentUser ? (
            <div className="p-5 rounded-xl bg-brand-bg border border-brand-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-sm text-brand-muted">
                Ariza yuborish va buyurtmachi bilan ishlash uchun tizimga
                kirishingiz kerak.
              </p>
              <Link
                href={`/login?next=/jobs/${job.id}`}
                className="px-5 py-2.5 rounded-xl bg-brand-accent text-brand-bg font-semibold text-xs sm:text-sm text-center shrink-0"
              >
                Tizimga kirish
              </Link>
            </div>
          ) : myApplication ? (
            <div className="p-5 rounded-xl bg-emerald-950/40 border border-emerald-400/30 space-y-2">
              <div className="flex items-center gap-2 text-emerald-300 font-semibold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  Siz ushbu ishga ariza yuborgansiz (Holati:{" "}
                  {TEXTS.jobs.applicationStatus[myApplication.status]})
                </span>
              </div>
              <p className="text-xs sm:text-sm text-brand-muted">
                Xabaringiz: “{myApplication.message}”
              </p>
            </div>
          ) : isFreelancer ? (
            <ApplyJobForm jobId={job.id} defaultBudget={job.budget_uzs} />
          ) : null}
        </div>
      )}

      {/* Buyurtmachi uchun: Kelib tushgan arizalar ro'yxati */}
      {isClient && (
        <div className="p-6 sm:p-8 rounded-2xl bg-brand-card border border-brand-primary/25 space-y-4">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-brand-text">
            Kelib tushgan arizalar ({applications.length})
          </h2>

          {applications.length === 0 ? (
            <p className="text-sm text-brand-muted py-2">
              Hozircha ushbu e&apos;longa arizalar kelib tushmagan.
            </p>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => {
                const score =
                  app.freelancer && job
                    ? matchScore(app.freelancer, job)
                    : null;
                return (
                  <div
                    key={app.id}
                    className="p-5 rounded-xl bg-brand-bg/90 border border-brand-primary/20 space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/u/${app.freelancer_id}`}
                          className="font-semibold text-base text-brand-text hover:text-brand-primary"
                        >
                          {app.freelancer?.full_name || "Frilanser"}
                        </Link>
                        {app.freelancer?.verified && (
                          <BadgeCheck className="w-4 h-4 text-emerald-400" />
                        )}
                        {typeof score === "number" && (
                          <span className="px-2.5 py-0.5 rounded-full bg-brand-primary/15 text-brand-primary text-xs font-bold">
                            Mos: {score}%
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-brand-primary">
                          {formatUzs(app.price_uzs)}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold ${
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
                    </div>

                    <p className="text-sm text-brand-muted whitespace-pre-line">
                      {app.message}
                    </p>

                    {job.status === "open" && app.status === "pending" && (
                      <div className="pt-2">
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
      )}
    </div>
  );
}
