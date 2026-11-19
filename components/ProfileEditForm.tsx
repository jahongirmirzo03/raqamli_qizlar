"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Profile } from "@/lib/types";
import { REGIONS, LANGUAGES_LIST, POPULAR_SKILLS } from "@/lib/texts";
import { updateProfileAction } from "@/app/profile/actions";
import {
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Clock,
  Sparkles,
} from "lucide-react";

interface ProfileEditFormProps {
  profile: Profile;
}

export function ProfileEditForm({ profile }: ProfileEditFormProps) {
  const router = useRouter();
  const [skillsText, setSkillsText] = useState(
    (profile.skills || []).join(", ")
  );
  const [selectedLangs, setSelectedLangs] = useState<string[]>(
    profile.languages?.length ? profile.languages : ["uz"]
  );
  const [flexibleOnly, setFlexibleOnly] = useState(Boolean(profile.flexible_only));
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  function toggleSkillChip(skill: string) {
    const current = skillsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (current.includes(skill)) {
      setSkillsText(current.filter((s) => s !== skill).join(", "));
    } else {
      setSkillsText([...current, skill].join(", "));
    }
  }

  function toggleLang(code: string) {
    if (selectedLangs.includes(code)) {
      if (selectedLangs.length > 1) {
        setSelectedLangs(selectedLangs.filter((l) => l !== code));
      }
    } else {
      setSelectedLangs([...selectedLangs, code]);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.set("skills", skillsText);

    const res = await updateProfileAction(formData);
    setLoading(false);

    if (res.error) {
      setError(res.error);
      return;
    }

    setSuccess(true);
    router.push("/profile");
    router.refresh();
  }

  const activeSkillsList = skillsText
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/profile"
          className="inline-flex items-center gap-1.5 text-sm text-brand-muted hover:text-brand-text"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Profilga qaytish</span>
        </Link>
      </div>

      <div className="p-6 sm:p-8 rounded-2xl bg-brand-card border border-brand-primary/25 shadow-purple space-y-6">
        <div className="space-y-1">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-text">
            Profilni tahrirlash
          </h1>
          <p className="text-sm text-brand-muted">
            Ma&apos;lumotlaringiz qanchalik to&apos;liq bo&apos;lsa, sizga mos ishlarni
            topish shunchalik osonlashadi.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-950/60 border border-red-400/30 text-red-200 text-sm flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-400/30 text-emerald-200 text-sm flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Profil muvaffaqiyatli saqlandi!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* To'liq ism va Viloyat */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label
                htmlFor="full_name"
                className="block text-sm font-medium text-brand-text"
              >
                To&apos;liq ismingiz *
              </label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                required
                defaultValue={profile.full_name}
                className="w-full px-4 py-3 rounded-xl bg-brand-bg border border-brand-primary/25 text-brand-text text-sm focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="region"
                className="block text-sm font-medium text-brand-text"
              >
                Hudud / Viloyat
              </label>
              <select
                id="region"
                name="region"
                defaultValue={profile.region || ""}
                className="w-full px-4 py-3 rounded-xl bg-brand-bg border border-brand-primary/25 text-brand-text text-sm focus:outline-none focus:border-brand-primary"
              >
                <option value="">Viloyatni tanlang...</option>
                {REGIONS.map((reg) => (
                  <option key={reg} value={reg}>
                    {reg}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-1.5">
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-brand-text"
            >
              O&apos;zingiz haqingizda
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              defaultValue={profile.bio || ""}
              placeholder="Tajribangiz, qaysi sohada ishlashingiz va ustun jihatlaringiz haqida qisqacha yozing..."
              className="w-full px-4 py-3 rounded-xl bg-brand-bg border border-brand-primary/25 text-brand-text text-sm focus:outline-none focus:border-brand-primary"
            />
          </div>

          {/* Ko'nikmalar */}
          <div className="space-y-2">
            <label
              htmlFor="skills"
              className="block text-sm font-medium text-brand-text"
            >
              Ko&apos;nikmalar (vergul bilan ajrating yoki pastdan tanlang)
            </label>
            <input
              id="skills"
              name="skills"
              type="text"
              value={skillsText}
              onChange={(e) => setSkillsText(e.target.value)}
              placeholder="Masalan: Canva, SMM, Copywriting, Excel / Google Sheets"
              className="w-full px-4 py-3 rounded-xl bg-brand-bg border border-brand-primary/25 text-brand-text text-sm focus:outline-none focus:border-brand-primary"
            />
            <div className="flex flex-wrap gap-1.5 pt-1">
              {POPULAR_SKILLS.map((skill) => {
                const active = activeSkillsList.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkillChip(skill)}
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

          {/* Tillar */}
          <div className="space-y-2">
            <span className="block text-sm font-medium text-brand-text">
              Ishlay oladigan tillaringiz
            </span>
            <div className="flex flex-wrap gap-2.5">
              {LANGUAGES_LIST.map((lang) => {
                const checked = selectedLangs.includes(lang.code);
                return (
                  <label
                    key={lang.code}
                    className={`cursor-pointer px-3.5 py-2 rounded-xl border text-xs font-medium inline-flex items-center gap-2 transition-colors ${
                      checked
                        ? "bg-brand-primary/20 border-brand-primary text-brand-text"
                        : "bg-brand-bg border-brand-primary/20 text-brand-muted"
                    }`}
                  >
                    <input
                      type="checkbox"
                      name="languages"
                      value={lang.code}
                      checked={checked}
                      onChange={() => toggleLang(lang.code)}
                      className="accent-brand-accent"
                    />
                    <span>{lang.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Ona rejimi (Haftalik soat va moslashuvchan muddat) */}
          <div className="p-5 rounded-2xl bg-brand-bg/90 border border-brand-primary/30 space-y-4">
            <div className="flex items-center gap-2 text-brand-primary font-semibold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>“Ona rejimi” va vaqt sozlamalari</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div className="space-y-1.5">
                <label
                  htmlFor="weekly_hours"
                  className="block text-xs sm:text-sm font-medium text-brand-text flex items-center gap-1.5"
                >
                  <Clock className="w-4 h-4 text-brand-primary" />
                  <span>Haftasiga necha soat ishlay olasiz?</span>
                </label>
                <input
                  id="weekly_hours"
                  name="weekly_hours"
                  type="number"
                  min={1}
                  max={80}
                  defaultValue={profile.weekly_hours ?? ""}
                  placeholder="Masalan: 15"
                  className="w-full px-4 py-2.5 rounded-xl bg-brand-card border border-brand-primary/25 text-brand-text text-sm focus:outline-none focus:border-brand-primary"
                />
              </div>

              <label className="cursor-pointer p-3.5 rounded-xl bg-brand-card border border-brand-primary/25 flex items-start gap-3">
                <input
                  type="checkbox"
                  name="flexible_only"
                  checked={flexibleOnly}
                  onChange={(e) => setFlexibleOnly(e.target.checked)}
                  className="mt-1 accent-brand-accent w-4 h-4"
                />
                <div>
                  <span className="block text-sm font-semibold text-brand-text">
                    Faqat moslashuvchan muddatli ishlar
                  </span>
                  <span className="block text-xs text-brand-muted mt-0.5">
                    Qat&apos;iy dedlayni bor ishlarni moslik ro&apos;yxatida pasaytiradi
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Portfolio havolalari */}
          <div className="space-y-1.5">
            <label
              htmlFor="portfolio_links"
              className="block text-sm font-medium text-brand-text"
            >
              Portfolio havolalari (har bir qatorda bittadan URL)
            </label>
            <textarea
              id="portfolio_links"
              name="portfolio_links"
              rows={3}
              defaultValue={(profile.portfolio_links || []).join("\n")}
              placeholder={"https://behance.net/sizning-sahifangiz\nhttps://github.com/sizning-sahifangiz"}
              className="w-full px-4 py-3 rounded-xl bg-brand-bg border border-brand-primary/25 text-brand-text text-sm focus:outline-none focus:border-brand-primary"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <Link
              href="/profile"
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
                <Save className="w-4 h-4" />
              )}
              <span>Saqlash</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
