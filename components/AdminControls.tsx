"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  toggleUserVerifiedAction,
  toggleJobHiddenAction,
} from "@/app/admin/actions";
import { BadgeCheck, Eye, EyeOff, Loader2 } from "lucide-react";

export function ToggleVerifiedButton({
  userId,
  verified,
}: {
  userId: string;
  verified: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    await toggleUserVerifiedAction(userId, !verified);
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      type="button"
      disabled={loading}
      onClick={handleClick}
      className={`px-3 py-1.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 border transition-colors ${
        verified
          ? "bg-emerald-500/20 border-emerald-400/40 text-emerald-300 hover:bg-red-950/50 hover:text-red-200 hover:border-red-400/40"
          : "bg-brand-bg border-brand-primary/30 text-brand-text hover:bg-brand-accent hover:text-brand-bg"
      }`}
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <BadgeCheck className="w-3.5 h-3.5" />
      )}
      <span>
        {verified ? "Tasdiqni olib tashlash" : "Tasdiqlash (Verified)"}
      </span>
    </button>
  );
}

export function ToggleJobHiddenButton({
  jobId,
  hidden,
}: {
  jobId: string;
  hidden: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    await toggleJobHiddenAction(jobId, !hidden);
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      type="button"
      disabled={loading}
      onClick={handleClick}
      className={`px-3 py-1.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 border transition-colors ${
        hidden
          ? "bg-amber-500/20 border-amber-400/40 text-amber-300 hover:bg-emerald-500/20 hover:text-emerald-200"
          : "bg-brand-bg border-brand-primary/30 text-brand-muted hover:bg-red-950/60 hover:text-red-200"
      }`}
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : hidden ? (
        <Eye className="w-3.5 h-3.5" />
      ) : (
        <EyeOff className="w-3.5 h-3.5" />
      )}
      <span>{hidden ? "Qayta ko'rsatish" : "E'lonni yashirish"}</span>
    </button>
  );
}
