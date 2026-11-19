"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { TEXTS } from "@/lib/texts";
import { registerAction } from "../actions";
import {
  UserPlus,
  AlertCircle,
  Loader2,
  Sparkles,
  Briefcase,
} from "lucide-react";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole =
    searchParams.get("role") === "client" ? "client" : "freelancer";

  const [role, setRole] = useState<"freelancer" | "client">(initialRole);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.set("role", role);

    const res = await registerAction(formData);
    if (res.error) {
      setError(res.error);
      setLoading(false);
      return;
    }

    router.push(role === "freelancer" ? "/profile/edit" : "/dashboard");
    router.refresh();
  }

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-brand-card border border-brand-primary/25 shadow-purple space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-text">
          {TEXTS.auth.registerTitle}
        </h1>
        <p className="text-sm text-brand-muted">
          {TEXTS.auth.registerSubtitle}
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/60 border border-red-400/30 text-red-200 text-sm flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Rol tanlash */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-brand-text">
            {TEXTS.auth.roleLabel}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole("freelancer")}
              className={`p-4 rounded-2xl border text-left transition-all ${
                role === "freelancer"
                  ? "bg-brand-primary/20 border-brand-primary text-brand-text shadow-purple-sm"
                  : "bg-brand-bg border-brand-primary/20 text-brand-muted hover:border-brand-primary/40"
              }`}
            >
              <div className="flex items-center gap-2 font-semibold text-sm text-brand-text">
                <Sparkles className="w-4 h-4 text-brand-primary" />
                <span>{TEXTS.auth.roleFreelancer}</span>
              </div>
              <p className="mt-1 text-xs text-brand-muted">
                {TEXTS.auth.roleFreelancerDesc}
              </p>
            </button>

            <button
              type="button"
              onClick={() => setRole("client")}
              className={`p-4 rounded-2xl border text-left transition-all ${
                role === "client"
                  ? "bg-brand-primary/20 border-brand-primary text-brand-text shadow-purple-sm"
                  : "bg-brand-bg border-brand-primary/20 text-brand-muted hover:border-brand-primary/40"
              }`}
            >
              <div className="flex items-center gap-2 font-semibold text-sm text-brand-text">
                <Briefcase className="w-4 h-4 text-brand-primary" />
                <span>{TEXTS.auth.roleClient}</span>
              </div>
              <p className="mt-1 text-xs text-brand-muted">
                {TEXTS.auth.roleClientDesc}
              </p>
            </button>
          </div>
          <input type="hidden" name="role" value={role} />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="full_name"
            className="block text-sm font-medium text-brand-text"
          >
            {TEXTS.auth.fullNameLabel}
          </label>
          <input
            id="full_name"
            name="full_name"
            type="text"
            required
            minLength={2}
            placeholder="Masalan: Nilufar Karimova"
            className="w-full px-4 py-3 rounded-xl bg-brand-bg border border-brand-primary/25 text-brand-text placeholder-brand-muted/50 focus:outline-none focus:border-brand-primary text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-brand-text"
          >
            {TEXTS.auth.emailLabel}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="sizning@email.uz"
            className="w-full px-4 py-3 rounded-xl bg-brand-bg border border-brand-primary/25 text-brand-text placeholder-brand-muted/50 focus:outline-none focus:border-brand-primary text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-brand-text"
          >
            {TEXTS.auth.passwordLabel}
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="Kamida 8 ta belgi"
            className="w-full px-4 py-3 rounded-xl bg-brand-bg border border-brand-primary/25 text-brand-text placeholder-brand-muted/50 focus:outline-none focus:border-brand-primary text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-5 rounded-2xl bg-brand-accent hover:bg-brand-primary disabled:opacity-60 text-brand-bg font-semibold text-base transition-colors inline-flex items-center justify-center gap-2 shadow-purple-sm"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Yaratilmoqda...</span>
            </>
          ) : (
            <>
              <UserPlus className="w-5 h-5" />
              <span>{TEXTS.auth.submitRegister}</span>
            </>
          )}
        </button>
      </form>

      <p className="text-center text-sm text-brand-muted">
        {TEXTS.auth.hasAccount}{" "}
        <Link
          href="/login"
          className="text-brand-primary hover:underline font-semibold"
        >
          {TEXTS.nav.login}
        </Link>
      </p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-10 sm:py-14">
      <Suspense
        fallback={
          <div className="p-8 rounded-2xl bg-brand-card border border-brand-primary/20 text-center text-brand-muted">
            Yuklanmoqda...
          </div>
        }
      >
        <RegisterForm />
      </Suspense>
    </div>
  );
}
