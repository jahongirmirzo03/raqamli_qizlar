import Link from "next/link";
import { createServerSupabase, getCurrentProfile } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { DEMO_JOBS } from "@/lib/demo-data";
import { TEXTS } from "@/lib/texts";
import type { Job } from "@/lib/types";
import { JobsCatalogClient } from "@/components/JobsCatalogClient";
import { PlusCircle } from "lucide-react";

export default async function JobsPage() {
  const currentUser = await getCurrentProfile();
  let jobs: Job[] = [];

  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabase();
    const { data } = await supabase
      .from("jobs")
      .select(
        "*, client:profiles!jobs_client_id_fkey(id, full_name, region, verified)"
      )
      .eq("hidden", false)
      .eq("status", "open")
      .order("created_at", { ascending: false });

    if (data && data.length > 0) {
      jobs = data as unknown as Job[];
    }
  }

  // Agar bazada hali ishlar bo'lmasa yoki Supabase ulanmagan bo'lsa, namuna ishlarni ko'rsatamiz
  if (jobs.length === 0) {
    jobs = DEMO_JOBS;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-brand-text">
            {TEXTS.jobs.listTitle}
          </h1>
          <p className="text-sm sm:text-base text-brand-muted">
            {TEXTS.jobs.listSubtitle}
          </p>
        </div>

        {(currentUser?.role === "client" || currentUser?.role === "admin") && (
          <Link
            href="/jobs/new"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-brand-accent hover:bg-brand-primary text-brand-bg font-semibold text-sm transition-colors shadow-purple-sm shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{TEXTS.nav.postJob}</span>
          </Link>
        )}
      </div>

      <JobsCatalogClient initialJobs={jobs} currentUser={currentUser} />
    </div>
  );
}
