import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentProfile } from "@/lib/supabase/server";
import { NewJobForm } from "@/components/NewJobForm";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default async function NewJobPage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/login?next=/jobs/new");
  }

  // 4.1: Noto'g'ri rolda kirishga urinilsa ruxsat berma
  if (profile.role !== "client" && profile.role !== "admin") {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center space-y-4">
        <div className="p-8 rounded-2xl bg-brand-card border border-red-400/30 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-red-500/15 border border-red-400/30 flex items-center justify-center text-red-300 mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-brand-text">
            Ruxsat berilmadi
          </h1>
          <p className="text-sm text-brand-muted leading-relaxed">
            Yangi ish e&apos;lon qilish faqat <strong>Buyurtmachi</strong> roli uchun
            ochiq. Siz hozirda <strong>Frilanser</strong> sifatida kirgansiz.
          </p>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-accent text-brand-bg font-semibold text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Ochiq ishlarni ko&apos;rish</span>
          </Link>
        </div>
      </div>
    );
  }

  return <NewJobForm />;
}
