"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CATEGORIES, POPULAR_SKILLS } from "@/lib/texts";
import { createJobAction } from "@/app/jobs/actions";
import {
  PlusCircle,
  Loader2,
  AlertCircle,
  ArrowLeft,
  Zap,
  Clock,
} from "lucide-react";

export function NewJobForm() {
  const router = useRouter();
  const [skillsText, setSkillsText] = useState("");
  const [isMicro, setIsMicro] = useState(false);
  const [flexibleDeadline, setFlexibleDeadline] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const activeSkills = skillsText
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  function toggleSkill(skill: string) {
    if (activeSkills.includes(skill)) {
      setSkillsText(activeSkills.filter((s) => s !== skill).join(", "));
    } else {
      setSkillsText([...activeSkills, skill].join(", "));
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.set("skills", skillsText);

    const res = await createJobAction(formData);
    setLoading(false);

    if (res.error) {
      setError(res.error);
      return;
    }

    if (res.jobId) {
      router.push(`/jobs/${res.jobId}`);
      router.refresh();
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">
      <Link
        href="/jobs"
        className="inline-flex items-center gap-1.5 text-sm text-brand-muted hover:text-brand-text"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Ishlar ro&apos;yxatiga qaytish</span>
      </Link>

      <div className="p-6 sm:p-8 rounded-2xl bg-brand-card border border-brand-primary/25 shadow-purple space-y-6">
        <div className="space-y-1">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-text">
            Yangi ish e&apos;lon qilish
          </h1>
          <p className="text-sm text-brand-muted">
            Vazifa haqida aniq ma&apos;lumot bering — tizim eng mos frilanserlarni
            avtomatik saralab beradi.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-950/60 border border-red-400/30 text-red-200 text-sm flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Sarlavha */}
          <div className="space-y-1.5">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-brand-text"
            >
              Ish sarlavhasi *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              minLength={5}
              placeholder="Masalan: Instagram sahifasi uchun 5 ta Canva banner tayyorlash"
              className="w-full px-4 py-3 rounded-xl bg-brand-bg border border-brand-primary/25 text-brand-text text-sm focus:outline-none focus:border-brand-primary"
            />
          </div>

          {/* Kategoriya va Muddat */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label
                htmlFor="category"
                className="block text-sm font-medium text-brand-text"
              >
                Kategoriya *
              </label>
              <select
                id="category"
                name="category"
                required
                defaultValue={CATEGORIES[0]}
                className="w-full px-4 py-3 rounded-xl bg-brand-bg border border-brand-primary/25 text-brand-text text-sm focus:outline-none focus:border-brand-primary"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="deadline"
                className="block text-sm font-medium text-brand-text"
              >
                Topshirish sanasi (muddat)
              </label>
              <input
                id="deadline"
                name="deadline"
                type="date"
                className="w-full px-4 py-3 rounded-xl bg-brand-bg border border-brand-primary/25 text-brand-text text-sm focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>

          {/* Tavsif */}
          <div className="space-y-1.5">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-brand-text"
            >
              Batafsil tavsif * (kamida 20 ta belgi)
            </label>
            <textarea
              id="description"
              name="description"
              required
              minLength={20}
              rows={5}
              placeholder="Nima qilinishi kerak, qanday natija kutilmoqda va qanday materiallar taqdim etiladi..."
              className="w-full px-4 py-3 rounded-xl bg-brand-bg border border-brand-primary/25 text-brand-text text-sm focus:outline-none focus:border-brand-primary"
            />
          </div>

          {/* Talab qilinadigan ko'nikmalar */}
          <div className="space-y-2">
            <label
              htmlFor="skills"
              className="block text-sm font-medium text-brand-text"
            >
              Talab qilinadigan ko&apos;nikmalar (vergul bilan ajrating)
            </label>
            <input
              id="skills"
              name="skills"
              type="text"
              value={skillsText}
              onChange={(e) => setSkillsText(e.target.value)}
              placeholder="Canva, SMM, Copywriting..."
              className="w-full px-4 py-3 rounded-xl bg-brand-bg border border-brand-primary/25 text-brand-text text-sm focus:outline-none focus:border-brand-primary"
            />
            <div className="flex flex-wrap gap-1.5 pt-1">
              {POPULAR_SKILLS.map((skill) => {
                const active = activeSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                      active
                        ? "bg-brand-primary/25 border-brand-primary text-brand-text"
                        : "bg-brand-bg border-brand-primary/20 text-brand-muted hover:text-brand-text"
                    }`}
                  >
                    + {skill}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Byudjet va Taxminiy soat */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label
                htmlFor="budget_uzs"
                className="block text-sm font-medium text-brand-text"
              >
                Byudjet (so&apos;mda)
              </label>
              <input
                id="budget_uzs"
                name="budget_uzs"
                type="number"
                min={10000}
                step={5000}
                placeholder="Masalan: 150000"
                className="w-full px-4 py-3 rounded-xl bg-brand-bg border border-brand-primary/25 text-brand-text text-sm focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="estimated_hours"
                className="block text-sm font-medium text-brand-text"
              >
                Taxminiy ish vaqti (soatda)
              </label>
              <input
                id="estimated_hours"
                name="estimated_hours"
                type="number"
                min={1}
                max={500}
                placeholder="Masalan: 3"
                className="w-full px-4 py-3 rounded-xl bg-brand-bg border border-brand-primary/25 text-brand-text text-sm focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>

          {/* Mikro-vazifa va Moslashuvchan muddat */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <label className="cursor-pointer p-4 rounded-xl bg-brand-bg border border-brand-primary/25 flex items-start gap-3">
              <input
                type="checkbox"
                name="is_micro"
                checked={isMicro}
                onChange={(e) => setIsMicro(e.target.checked)}
                className="mt-1 accent-brand-accent w-4 h-4"
              />
              <div>
                <span className="flex items-center gap-1.5 text-sm font-semibold text-brand-text">
                  <Zap className="w-4 h-4 text-amber-300" />
                  Mikro-vazifa (15–30 daqiqa)
                </span>
                <span className="block text-xs text-brand-muted mt-0.5">
                  Tez bajariladigan kichik hajmli topshiriq
                </span>
              </div>
            </label>

            <label className="cursor-pointer p-4 rounded-xl bg-brand-bg border border-brand-primary/25 flex items-start gap-3">
              <input
                type="checkbox"
                name="flexible_deadline"
                checked={flexibleDeadline}
                onChange={(e) => setFlexibleDeadline(e.target.checked)}
                className="mt-1 accent-brand-accent w-4 h-4"
              />
              <div>
                <span className="flex items-center gap-1.5 text-sm font-semibold text-brand-text">
                  <Clock className="w-4 h-4 text-emerald-300" />
                  Moslashuvchan muddat (“Ona rejimi”)
                </span>
                <span className="block text-xs text-brand-muted mt-0.5">
                  Erkin grafikda ishlovchi ayollar uchun qulay
                </span>
              </div>
            </label>
          </div>

          <div className="pt-3 flex items-center justify-end gap-3">
            <Link
              href="/jobs"
              className="px-5 py-3 rounded-xl bg-brand-bg border border-brand-primary/20 text-brand-muted text-sm font-medium"
            >
              Bekor qilish
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-2xl bg-brand-accent hover:bg-brand-primary text-brand-bg font-semibold text-sm inline-flex items-center gap-2 transition-colors shadow-purple-sm"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <PlusCircle className="w-4 h-4" />
              )}
              <span>E&apos;lonni joylash</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
