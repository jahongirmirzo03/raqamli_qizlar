"use client";

import { useState } from "react";
import { Flag, X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { submitReportAction } from "@/app/actions/report";

interface ReportButtonProps {
  targetType: "job" | "profile";
  targetId: string;
  label?: string;
}

export function ReportButton({
  targetType,
  targetId,
  label = "Shikoyat qilish",
}: ReportButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.set("target_type", targetType);
    formData.set("target_id", targetId);

    const res = await submitReportAction(formData);
    setLoading(false);

    if (res.error) {
      setError(res.error);
      return;
    }

    setSuccess(true);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          setError(null);
          setSuccess(false);
        }}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-brand-bg/70 hover:bg-red-950/50 text-brand-muted hover:text-red-200 border border-brand-primary/20 hover:border-red-400/30 transition-colors"
      >
        <Flag className="w-3.5 h-3.5" />
        <span>{label}</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-brand-card border border-brand-primary/30 shadow-purple p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-brand-text flex items-center gap-2">
                <Flag className="w-4 h-4 text-red-400" />
                <span>
                  {targetType === "job"
                    ? "E'lon ustidan shikoyat"
                    : "Profil ustidan shikoyat"}
                </span>
              </h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg text-brand-muted hover:text-brand-text"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {success ? (
              <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-400/30 text-emerald-200 text-sm space-y-3">
                <div className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Shikoyatingiz adminga yuborildi!</span>
                </div>
                <p className="text-xs text-emerald-200/80">
                  Platforma xavfsizligini saqlashga yordam berganingiz uchun rahmat.
                </p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-brand-accent text-brand-bg font-semibold text-xs"
                >
                  Yopish
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-xl bg-red-950/60 border border-red-400/30 text-red-200 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label
                    htmlFor="report-reason"
                    className="block text-xs font-medium text-brand-text"
                  >
                    Shikoyat sababini batafsil yozing (kamida 10 ta belgi)
                  </label>
                  <textarea
                    id="report-reason"
                    name="reason"
                    required
                    minLength={10}
                    rows={4}
                    placeholder="Masalan: Shubhali taklif, shaxsiy ma'lumot so'rash yoki nomaqbul matn..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-brand-bg border border-brand-primary/25 text-brand-text text-sm focus:outline-none focus:border-brand-primary"
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-medium bg-brand-bg text-brand-muted border border-brand-primary/20"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-red-500 hover:bg-red-400 text-white inline-flex items-center gap-1.5"
                  >
                    {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Yuborish</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
