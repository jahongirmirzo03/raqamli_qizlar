import Link from "next/link";
import type { Job } from "@/lib/types";
import { TEXTS } from "@/lib/texts";
import {
  Clock,
  Zap,
  Sparkles,
  Calendar,
  ArrowRight,
  BadgeCheck,
} from "lucide-react";

interface JobCardProps {
  job: Job;
  matchPercent?: number | null;
}

export function formatUzs(amount: number | null | undefined): string {
  if (!amount || amount <= 0) return TEXTS.jobs.budgetNegotiable;
  return `${amount.toLocaleString("uz-UZ")} ${TEXTS.jobs.currency}`;
}

export function JobCard({ job, matchPercent }: JobCardProps) {
  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-brand-card border border-brand-primary/20 hover:border-brand-primary/45 transition-all shadow-purple-sm flex flex-col justify-between gap-4">
      <div className="space-y-3">
        {/* Top badges */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="px-2.5 py-1 rounded-lg bg-brand-primary/15 text-brand-primary text-xs font-medium">
              {job.category}
            </span>

            {job.is_micro && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-semibold">
                <Zap className="w-3 h-3" />
                {TEXTS.jobs.microBadge}
              </span>
            )}

            {job.flexible_deadline && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
                <Clock className="w-3 h-3" />
                {TEXTS.jobs.flexibleBadge}
              </span>
            )}

            {(job.is_demo || job.title.startsWith("[Namuna]")) && (
              <span className="px-2.5 py-1 rounded-lg bg-brand-bg border border-brand-primary/25 text-brand-muted text-xs font-medium">
                {TEXTS.jobs.demoBadge}
              </span>
            )}
          </div>

          {typeof matchPercent === "number" && (
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${
                matchPercent >= 75
                  ? "bg-brand-accent/25 border-brand-primary text-brand-text"
                  : matchPercent >= 50
                  ? "bg-brand-primary/15 border-brand-primary/40 text-brand-primary"
                  : "bg-brand-bg border-brand-primary/20 text-brand-muted"
              }`}
            >
              <Sparkles className="w-3 h-3" />
              {TEXTS.jobs.matchPrefix} {matchPercent}%
            </span>
          )}
        </div>

        {/* Title & Description */}
        <div>
          <Link
            href={`/jobs/${job.id}`}
            className="font-serif text-lg sm:text-xl font-bold text-brand-text hover:text-brand-primary transition-colors line-clamp-2"
          >
            {job.title}
          </Link>
          <p className="mt-1.5 text-sm text-brand-muted line-clamp-2 leading-relaxed">
            {job.description}
          </p>
        </div>

        {/* Skills */}
        {job.skills && job.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {job.skills.map((skill) => (
              <span
                key={skill}
                className="px-2.5 py-1 rounded-lg bg-brand-bg/90 border border-brand-primary/15 text-xs text-brand-muted"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer: Budget, hours, link */}
      <div className="pt-3 border-t border-brand-primary/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="text-base sm:text-lg font-bold text-brand-primary">
            {formatUzs(job.budget_uzs)}
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-brand-muted">
            {job.estimated_hours && (
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-brand-primary" />~
                {job.estimated_hours} {TEXTS.jobs.hoursUnit}
              </span>
            )}
            {job.deadline && (
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-brand-primary" />
                Muddat: {job.deadline}
              </span>
            )}
            {job.client && (
              <span className="inline-flex items-center gap-1">
                <span>{job.client.full_name}</span>
                {job.client.verified && (
                  <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
                )}
              </span>
            )}
          </div>
        </div>

        <Link
          href={`/jobs/${job.id}`}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-accent/20 hover:bg-brand-accent text-brand-text hover:text-brand-bg border border-brand-primary/35 font-semibold text-xs sm:text-sm transition-colors shrink-0"
        >
          <span>Batafsil</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
