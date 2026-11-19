import Link from "next/link";
import type { Profile, Review } from "@/lib/types";
import { LANGUAGES_LIST } from "@/lib/texts";
import { ReportButton } from "@/components/ReportButton";
import {
  BadgeCheck,
  MapPin,
  Clock,
  Sparkles,
  Globe,
  ExternalLink,
  Star,
  Edit3,
} from "lucide-react";

interface ProfileViewProps {
  profile: Profile;
  reviews: Review[];
  isOwner: boolean;
}

export function ProfileView({ profile, reviews, isOwner }: ProfileViewProps) {
  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : null;

  const getLanguageLabel = (code: string) =>
    LANGUAGES_LIST.find((l) => l.code === code)?.label || code;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">
      {/* Asosiy profil kartasi */}
      <div className="p-6 sm:p-8 rounded-2xl bg-brand-card border border-brand-primary/25 shadow-purple space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-text">
                {profile.full_name}
              </h1>
              {profile.verified && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
                  <BadgeCheck className="w-3.5 h-3.5" />
                  Tasdiqlangan
                </span>
              )}
              {profile.is_demo && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-semibold">
                  Namuna profil
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-brand-muted">
              <span className="px-2.5 py-0.5 rounded-lg bg-brand-primary/15 text-brand-primary font-medium">
                {profile.role === "freelancer"
                  ? "Frilanser"
                  : profile.role === "client"
                  ? "Buyurtmachi"
                  : "Administrator"}
              </span>

              {profile.region && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-brand-primary" />
                  {profile.region}
                </span>
              )}

              {avgRating && (
                <span className="inline-flex items-center gap-1 text-amber-300 font-semibold">
                  <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
                  {avgRating} ({reviews.length} ta sharh)
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {isOwner ? (
              <Link
                href="/profile/edit"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-accent hover:bg-brand-primary text-brand-bg font-semibold text-xs sm:text-sm transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                <span>Profilni tahrirlash</span>
              </Link>
            ) : (
              <ReportButton targetType="profile" targetId={profile.id} />
            )}
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-1.5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-brand-primary">
            O&apos;zi haqida
          </h2>
          <p className="text-sm sm:text-base text-brand-muted leading-relaxed whitespace-pre-line">
            {profile.bio || "Foydalanuvchi hali o'zi haqida ma'lumot kiritmagan."}
          </p>
        </div>

        {/* Ona rejimi va ish vaqti (Frilanserlar uchun) */}
        {profile.role === "freelancer" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-brand-bg/80 border border-brand-primary/20 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-accent/20 flex items-center justify-center text-brand-primary shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-brand-muted">
                  Ona rejimi (Haftalik vaqt)
                </p>
                <p className="text-sm font-semibold text-brand-text">
                  {profile.weekly_hours
                    ? `Haftasiga ${profile.weekly_hours} soatgacha`
                    : "Kiritilmagan"}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-brand-bg/80 border border-brand-primary/20 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-accent/20 flex items-center justify-center text-brand-primary shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-brand-muted">Muddat afzalligi</p>
                <p className="text-sm font-semibold text-brand-text">
                  {profile.flexible_only
                    ? "Faqat moslashuvchan muddatli ishlar"
                    : "Barcha muddatli ishlar"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Ko'nikmalar */}
        {profile.skills && profile.skills.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-brand-primary">
              Ko&apos;nikmalar
            </h2>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 rounded-xl bg-brand-bg border border-brand-primary/25 text-xs font-medium text-brand-text"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tillar va Portfolio */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          <div className="space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-brand-primary flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              <span>Biladigan tillari</span>
            </h2>
            <div className="flex flex-wrap gap-2">
              {(profile.languages?.length ? profile.languages : ["uz"]).map(
                (lang) => (
                  <span
                    key={lang}
                    className="px-3 py-1 rounded-lg bg-brand-primary/15 text-xs text-brand-text"
                  >
                    {getLanguageLabel(lang)}
                  </span>
                )
              )}
            </div>
          </div>

          {profile.portfolio_links && profile.portfolio_links.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-brand-primary">
                Portfolio havolalari
              </h2>
              <ul className="space-y-1.5">
                {profile.portfolio_links.map((url, idx) => (
                  <li key={idx}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-brand-primary hover:underline break-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                      <span>{url}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Sharhlar va reytinglar */}
      <div className="p-6 sm:p-8 rounded-2xl bg-brand-card border border-brand-primary/20 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-brand-text">
            Sharhlar va baholar ({reviews.length})
          </h2>
          {avgRating && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-300 text-sm font-bold">
              <Star className="w-4 h-4 fill-amber-300" />
              <span>O&apos;rtacha: {avgRating} / 5</span>
            </div>
          )}
        </div>

        {reviews.length === 0 ? (
          <p className="text-sm text-brand-muted py-4">
            Hozircha sharhlar yo&apos;q. Yakunlangan buyurtmalardan so&apos;ng bu yerda
            baholar ko&apos;rinadi.
          </p>
        ) : (
          <div className="space-y-3">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-4 rounded-xl bg-brand-bg/80 border border-brand-primary/15 space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-brand-text">
                    {rev.reviewer?.full_name || "Foydalanuvchi"}
                  </span>
                  <div className="flex items-center gap-1 text-amber-300">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating
                            ? "fill-amber-300 text-amber-300"
                            : "text-brand-muted/30"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                {rev.comment && (
                  <p className="text-sm text-brand-muted leading-relaxed">
                    {rev.comment}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
