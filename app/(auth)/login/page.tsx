"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { TEXTS } from "@/lib/texts";
import { loginAction } from "../actions";
import { LogIn, AlertCircle, Loader2 } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") || "/dashboard";

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await loginAction(formData);

    if (res.error) {
      setError(res.error);
      setLoading(false);
      return;
    }

    router.push(nextUrl);
    router.refresh();
  }

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-brand-card border border-brand-primary/25 shadow-purple space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-text">
          {TEXTS.auth.loginTitle}
        </h1>
        <p className="text-sm text-brand-muted">{TEXTS.auth.loginSubtitle}</p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/60 border border-red-400/30 text-red-200 text-sm flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
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
            autoComplete="current-password"
            placeholder="••••••••"
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
              <span>Kirilmoqda...</span>
            </>
          ) : (
            <>
              <LogIn className="w-5 h-5" />
              <span>{TEXTS.auth.submitLogin}</span>
            </>
          )}
        </button>
      </form>

      <p className="text-center text-sm text-brand-muted">
        {TEXTS.auth.noAccount}{" "}
        <Link
          href="/register"
          className="text-brand-primary hover:underline font-semibold"
        >
          {TEXTS.nav.register}
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-16">
      <Suspense
        fallback={
          <div className="p-8 rounded-2xl bg-brand-card border border-brand-primary/20 text-center text-brand-muted">
            Yuklanmoqda...
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
