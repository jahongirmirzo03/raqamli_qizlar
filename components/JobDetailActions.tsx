"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  applyToJobAction,
  acceptApplicationAction,
  updateJobStatusAction,
  togglePaymentFlagAction,
  submitReviewAction,
  sendJobMessageAction,
} from "@/app/jobs/actions";
import { TEXTS } from "@/lib/texts";
import {
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Star,
  CreditCard,
  MessageSquare,
} from "lucide-react";
import type { Message } from "@/lib/types";

export function ApplyJobForm({
  jobId,
  defaultBudget,
}: {
  jobId: string;
  defaultBudget: number | null;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.set("job_id", jobId);

    const res = await applyToJobAction(formData);
    setLoading(false);

    if (res.error) {
      setError(res.error);
      return;
    }

    setSuccess(true);
    router.refresh();
  }

  if (success) {
    return (
      <div className="p-5 rounded-2xl bg-emerald-950/60 border border-emerald-400/30 text-emerald-200 space-y-2">
        <div className="flex items-center gap-2 font-semibold text-base">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>Arizangiz muvaffaqiyatli yuborildi!</span>
        </div>
        <p className="text-xs sm:text-sm text-emerald-200/80">
          Ariza holatini shaxsiy kabinetingizda kuzatib borishingiz mumkin.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-400/30 text-red-200 text-xs sm:text-sm flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-1.5">
        <label
          htmlFor="apply-message"
          className="block text-sm font-medium text-brand-text"
        >
          Buyurtmachiga xabaringiz * (kamida 10 ta belgi)
        </label>
        <textarea
          id="apply-message"
          name="message"
          required
          minLength={10}
          rows={4}
          placeholder="Nega aynan siz ushbu vazifani yaxshi bajara olishingiz va qancha vaqtda tugatishingiz haqida yozing..."
          className="w-full px-4 py-3 rounded-xl bg-brand-bg border border-brand-primary/25 text-brand-text text-sm focus:outline-none focus:border-brand-primary"
        />
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="apply-price"
          className="block text-sm font-medium text-brand-text"
        >
          Taklif narxingiz (so&apos;mda)
        </label>
        <input
          id="apply-price"
          name="price_uzs"
          type="number"
          min={5000}
          step={5000}
          defaultValue={defaultBudget ?? ""}
          placeholder="Masalan: 150000"
          className="w-full px-4 py-3 rounded-xl bg-brand-bg border border-brand-primary/25 text-brand-text text-sm focus:outline-none focus:border-brand-primary"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-brand-accent hover:bg-brand-primary text-brand-bg font-semibold text-sm inline-flex items-center justify-center gap-2 transition-colors shadow-purple-sm"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Send className="w-4 h-4" />
        )}
        <span>Ariza yuborish</span>
      </button>
    </form>
  );
}

export function AcceptCandidateButton({
  jobId,
  applicationId,
  freelancerId,
}: {
  jobId: string;
  applicationId: string;
  freelancerId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAccept() {
    setLoading(true);
    setError(null);
    const res = await acceptApplicationAction(jobId, applicationId, freelancerId);
    setLoading(false);
    if (res.error) {
      setError(res.error);
      return;
    }
    router.refresh();
  }

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={handleAccept}
        disabled={loading}
        className="px-4 py-2 rounded-xl bg-brand-accent hover:bg-brand-primary text-brand-bg font-semibold text-xs inline-flex items-center gap-1.5 transition-colors"
      >
        {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
        <span>Nomzodni tanlash (Qabul qilish)</span>
      </button>
      {error && <p className="text-xs text-red-300">{error}</p>}
    </div>
  );
}

export function JobStatusControl({
  jobId,
  status,
  isClient,
  isAssignedFreelancer,
}: {
  jobId: string;
  status: string;
  isClient: boolean;
  isAssignedFreelancer: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(nextStatus: "submitted" | "completed" | "cancelled") {
    setLoading(true);
    setError(null);
    const res = await updateJobStatusAction(jobId, nextStatus);
    setLoading(false);
    if (res.error) {
      setError(res.error);
      return;
    }
    router.refresh();
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2.5">
        {isAssignedFreelancer && status === "in_progress" && (
          <button
            type="button"
            disabled={loading}
            onClick={() => handleChange("submitted")}
            className="px-5 py-2.5 rounded-xl bg-brand-accent hover:bg-brand-primary text-brand-bg font-semibold text-xs sm:text-sm inline-flex items-center gap-1.5"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>Ishni topshirdim</span>
          </button>
        )}

        {isClient && status === "submitted" && (
          <button
            type="button"
            disabled={loading}
            onClick={() => handleChange("completed")}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-brand-bg font-semibold text-xs sm:text-sm inline-flex items-center gap-1.5"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>Ishni qabul qildim (Yakunlash)</span>
          </button>
        )}

        {isClient && (status === "open" || status === "in_progress") && (
          <button
            type="button"
            disabled={loading}
            onClick={() => handleChange("cancelled")}
            className="px-4 py-2.5 rounded-xl bg-red-950/60 hover:bg-red-900/60 text-red-200 border border-red-400/30 font-medium text-xs"
          >
            Buyurtmani bekor qilish
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-300">{error}</p>}
    </div>
  );
}

export function PaymentStatusBox({
  jobId,
  clientPaid,
  freelancerReceived,
  isClient,
  isAssignedFreelancer,
}: {
  jobId: string;
  clientPaid: boolean;
  freelancerReceived: boolean;
  isClient: boolean;
  isAssignedFreelancer: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleToggle(flag: "client_paid" | "freelancer_received") {
    setLoading(true);
    await togglePaymentFlagAction(jobId, flag);
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="p-5 rounded-2xl bg-brand-bg/90 border border-brand-primary/25 space-y-3">
      <div className="flex items-start gap-2.5">
        <CreditCard className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
        <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
          {TEXTS.jobs.paymentNotice}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-1">
        <div
          className={`px-3.5 py-2 rounded-xl border text-xs font-semibold inline-flex items-center gap-2 ${
            clientPaid
              ? "bg-emerald-500/15 border-emerald-400/40 text-emerald-300"
              : "bg-brand-card border-brand-primary/20 text-brand-muted"
          }`}
        >
          <span>
            Buyurtmachi: {clientPaid ? "✓ To'lov qildim" : "To'lov kutilmoqda"}
          </span>
          {isClient && (
            <button
              type="button"
              disabled={loading}
              onClick={() => handleToggle("client_paid")}
              className="ml-1 px-2.5 py-1 rounded-lg bg-brand-accent text-brand-bg font-bold"
            >
              {clientPaid ? "Bekor qilish" : TEXTS.jobs.clientPaidBtn}
            </button>
          )}
        </div>

        <div
          className={`px-3.5 py-2 rounded-xl border text-xs font-semibold inline-flex items-center gap-2 ${
            freelancerReceived
              ? "bg-emerald-500/15 border-emerald-400/40 text-emerald-300"
              : "bg-brand-card border-brand-primary/20 text-brand-muted"
          }`}
        >
          <span>
            Frilanser:{" "}
            {freelancerReceived ? "✓ To'lovni oldim" : "Tasdiqlanmagan"}
          </span>
          {isAssignedFreelancer && (
            <button
              type="button"
              disabled={loading}
              onClick={() => handleToggle("freelancer_received")}
              className="ml-1 px-2.5 py-1 rounded-lg bg-brand-accent text-brand-bg font-bold"
            >
              {freelancerReceived
                ? "Bekor qilish"
                : TEXTS.jobs.freelancerReceivedBtn}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function LeaveReviewBox({
  jobId,
  revieweeId,
  revieweeName,
}: {
  jobId: string;
  revieweeId: string;
  revieweeName: string;
}) {
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set("job_id", jobId);
    formData.set("reviewee_id", revieweeId);
    formData.set("rating", String(rating));

    const res = await submitReviewAction(formData);
    setLoading(false);

    if (res.error) {
      setError(res.error);
      return;
    }

    setDone(true);
    router.refresh();
  }

  if (done) {
    return (
      <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-400/30 text-emerald-200 text-sm">
        Sharhingiz qabul qilindi. Rahmat!
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-5 rounded-2xl bg-brand-bg/90 border border-brand-primary/30 space-y-4"
    >
      <h3 className="font-serif text-lg font-bold text-brand-text">
        {revieweeName} bilan hamkorlikni baholang
      </h3>

      {error && (
        <div className="p-3 rounded-xl bg-red-950/60 border border-red-400/30 text-red-200 text-xs">
          {error}
        </div>
      )}

      <div className="space-y-1.5">
        <span className="block text-xs font-medium text-brand-muted">
          Bahoyingiz (1 dan 5 gacha):
        </span>
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => setRating(num)}
              className="p-1.5 rounded-lg bg-brand-card border border-brand-primary/20"
            >
              <Star
                className={`w-5 h-5 ${
                  num <= rating
                    ? "fill-amber-300 text-amber-300"
                    : "text-brand-muted/40"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="review-comment"
          className="block text-xs font-medium text-brand-text"
        >
          Izohingiz *
        </label>
        <textarea
          id="review-comment"
          name="comment"
          required
          minLength={3}
          rows={3}
          placeholder="Hamkorlik qanday o'tdi?"
          className="w-full px-3.5 py-2.5 rounded-xl bg-brand-card border border-brand-primary/25 text-brand-text text-sm focus:outline-none focus:border-brand-primary"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="px-5 py-2.5 rounded-xl bg-brand-accent hover:bg-brand-primary text-brand-bg font-semibold text-xs sm:text-sm inline-flex items-center gap-1.5"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        <span>Sharh qoldirish</span>
      </button>
    </form>
  );
}

export function JobMessagesBox({
  jobId,
  messages,
  currentUserId,
}: {
  jobId: string;
  messages: Message[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSend(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!body.trim()) return;
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.set("job_id", jobId);
    formData.set("body", body);

    const res = await sendJobMessageAction(formData);
    setLoading(false);

    if (res.error) {
      setError(res.error);
      return;
    }

    setBody("");
    router.refresh();
  }

  return (
    <div className="p-6 rounded-2xl bg-brand-card border border-brand-primary/25 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-lg font-bold text-brand-text flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-brand-primary" />
          <span>Buyurtma bo&apos;yicha xavfsiz yozishmalar</span>
        </h3>
        <span className="text-xs text-brand-muted">
          Telefon va email avtomatik yashiriladi
        </span>
      </div>

      <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
        {messages.length === 0 ? (
          <p className="text-xs sm:text-sm text-brand-muted py-3">
            Hozircha xabarlar yo&apos;q. Ish tafsilotlarini shu yerda
            kelishishingiz mumkin.
          </p>
        ) : (
          messages.map((msg) => {
            const isMine = msg.sender_id === currentUserId;
            return (
              <div
                key={msg.id}
                className={`p-3.5 rounded-xl border text-xs sm:text-sm ${
                  isMine
                    ? "bg-brand-primary/15 border-brand-primary/35 ml-6"
                    : "bg-brand-bg border-brand-primary/15 mr-6"
                }`}
              >
                <div className="flex items-center justify-between text-xs text-brand-muted mb-1">
                  <span className="font-semibold text-brand-text">
                    {msg.sender?.full_name || "Ishtirokchi"}
                  </span>
                </div>
                <p className="text-brand-text whitespace-pre-line">{msg.body}</p>
              </div>
            );
          })
        )}
      </div>

      {error && <p className="text-xs text-red-300">{error}</p>}

      <form onSubmit={handleSend} className="flex items-center gap-2">
        <input
          type="text"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Xabar yozing (shaxsiy telefon raqam yozmang)..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-brand-bg border border-brand-primary/25 text-brand-text text-sm focus:outline-none focus:border-brand-primary"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2.5 rounded-xl bg-brand-accent hover:bg-brand-primary text-brand-bg font-semibold text-xs sm:text-sm inline-flex items-center gap-1.5"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          <span>Yuborish</span>
        </button>
      </form>
    </div>
  );
}
