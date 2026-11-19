"use client";

import { useState, useMemo } from "react";
import type { Job, Profile } from "@/lib/types";
import { CATEGORIES, TEXTS } from "@/lib/texts";
import { matchScore } from "@/lib/matching";
import { JobCard } from "@/components/JobCard";
import {
  Search,
  SlidersHorizontal,
  Zap,
  Clock,
  RotateCcw,
  Inbox,
} from "lucide-react";

interface JobsCatalogClientProps {
  initialJobs: Job[];
  currentUser: Profile | null;
}

const PAGE_SIZE = 6;

export function JobsCatalogClient({
  initialJobs,
  currentUser,
}: JobsCatalogClientProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [onlyMicro, setOnlyMicro] = useState(false);
  const [onlyFlexible, setOnlyFlexible] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Agar foydalanuvchi frilanser bo'lsa, o'z profiliga moslik hisoblanadi
  const isFreelancer = currentUser?.role === "freelancer";

  const filteredJobs = useMemo(() => {
    const q = search.trim().toLowerCase();
    const minB = minBudget ? Number(minBudget) : null;
    const maxB = maxBudget ? Number(maxBudget) : null;

    return initialJobs.filter((job) => {
      if (job.hidden) return false;

      if (q) {
        const inTitle = job.title.toLowerCase().includes(q);
        const inDesc = job.description.toLowerCase().includes(q);
        const inSkills = (job.skills || []).some((s) =>
          s.toLowerCase().includes(q)
        );
        if (!inTitle && !inDesc && !inSkills) return false;
      }

      if (category && job.category !== category) {
        return false;
      }

      if (minB !== null && !Number.isNaN(minB)) {
        if ((job.budget_uzs ?? 0) < minB) return false;
      }

      if (maxB !== null && !Number.isNaN(maxB) && maxB > 0) {
        if ((job.budget_uzs ?? 0) > maxB) return false;
      }

      if (onlyMicro && !job.is_micro) {
        return false;
      }

      if (onlyFlexible && !job.flexible_deadline) {
        return false;
      }

      return true;
    });
  }, [initialJobs, search, category, minBudget, maxBudget, onlyMicro, onlyFlexible]);

  const visibleJobs = filteredJobs.slice(0, visibleCount);
  const hasMore = visibleCount < filteredJobs.length;

  function resetFilters() {
    setSearch("");
    setCategory("");
    setMinBudget("");
    setMaxBudget("");
    setOnlyMicro(false);
    setOnlyFlexible(false);
    setVisibleCount(PAGE_SIZE);
  }

  return (
    <div className="space-y-6">
      {/* Filtrlar paneli */}
      <div className="p-5 sm:p-6 rounded-2xl bg-brand-card border border-brand-primary/25 shadow-purple-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
          {/* Qidiruv */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-brand-primary absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setVisibleCount(PAGE_SIZE);
              }}
              placeholder={TEXTS.jobs.searchPlaceholder}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-brand-bg border border-brand-primary/25 text-brand-text placeholder-brand-muted/50 text-sm focus:outline-none focus:border-brand-primary"
            />
          </div>

          {/* Kategoriya */}
          <div className="md:col-span-3">
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setVisibleCount(PAGE_SIZE);
              }}
              aria-label="Kategoriya bo'yicha filtr"
              className="w-full px-3.5 py-3 rounded-xl bg-brand-bg border border-brand-primary/25 text-brand-text text-sm focus:outline-none focus:border-brand-primary"
            >
              <option value="">{TEXTS.jobs.categoryAll}</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Byudjet oralig'i */}
          <div className="md:col-span-2">
            <input
              type="number"
              min={0}
              step={10000}
              value={minBudget}
              onChange={(e) => {
                setMinBudget(e.target.value);
                setVisibleCount(PAGE_SIZE);
              }}
              placeholder={TEXTS.jobs.minBudget}
              className="w-full px-3.5 py-3 rounded-xl bg-brand-bg border border-brand-primary/25 text-brand-text placeholder-brand-muted/50 text-sm focus:outline-none focus:border-brand-primary"
            />
          </div>

          <div className="md:col-span-2">
            <input
              type="number"
              min={0}
              step={10000}
              value={maxBudget}
              onChange={(e) => {
                setMaxBudget(e.target.value);
                setVisibleCount(PAGE_SIZE);
              }}
              placeholder={TEXTS.jobs.maxBudget}
              className="w-full px-3.5 py-3 rounded-xl bg-brand-bg border border-brand-primary/25 text-brand-text placeholder-brand-muted/50 text-sm focus:outline-none focus:border-brand-primary"
            />
          </div>
        </div>

        {/* Qo'shimcha tezkor tugmalar: Mikro-vazifa va Moslashuvchan muddat */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 text-xs text-brand-muted">
              <SlidersHorizontal className="w-3.5 h-3.5 text-brand-primary" />
              Maxsus rejimlar:
            </span>

            <button
              type="button"
              onClick={() => {
                setOnlyMicro(!onlyMicro);
                setVisibleCount(PAGE_SIZE);
              }}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                onlyMicro
                  ? "bg-amber-500/20 border-amber-400 text-amber-200"
                  : "bg-brand-bg border-brand-primary/20 text-brand-muted hover:text-brand-text"
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{TEXTS.jobs.onlyMicro}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setOnlyFlexible(!onlyFlexible);
                setVisibleCount(PAGE_SIZE);
              }}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                onlyFlexible
                  ? "bg-emerald-500/20 border-emerald-400 text-emerald-200"
                  : "bg-brand-bg border-brand-primary/20 text-brand-muted hover:text-brand-text"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{TEXTS.jobs.onlyFlexible}</span>
            </button>
          </div>

          {(search ||
            category ||
            minBudget ||
            maxBudget ||
            onlyMicro ||
            onlyFlexible) && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-brand-primary hover:underline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Filtrlarni tozalash</span>
            </button>
          )}
        </div>
      </div>

      {/* Natijalar soni */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-brand-muted px-1">
        <span>
          Jami topilgan ishlar:{" "}
          <strong className="text-brand-text">{filteredJobs.length} ta</strong>
        </span>
        {!isFreelancer && (
          <span className="text-xs">
            Shaxsiy moslik foizini ko&apos;rish uchun frilanser sifatida tizimga
            kiring
          </span>
        )}
      </div>

      {/* Ro'yxat yoki Bo'sh holat (Empty state) */}
      {visibleJobs.length === 0 ? (
        <div className="p-10 sm:p-14 rounded-2xl bg-brand-card border border-brand-primary/20 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-primary/15 border border-brand-primary/30 flex items-center justify-center text-brand-primary mx-auto">
            <Inbox className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-bold text-brand-text">
            {TEXTS.jobs.noJobs}
          </h3>
          <p className="text-sm text-brand-muted max-w-md mx-auto">
            Qidiruv so&apos;zini o&apos;zgartirib ko&apos;ring yoki barcha filtrlarni
            tozalang.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-accent text-brand-bg font-semibold text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Barcha ishlarni ko&apos;rsatish</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {visibleJobs.map((job) => {
            const score = isFreelancer && currentUser
              ? matchScore(currentUser, job)
              : null;
            return <JobCard key={job.id} job={job} matchPercent={score} />;
          })}
        </div>
      )}

      {/* Ko'proq yuklash (Pagination) */}
      {hasMore && (
        <div className="pt-4 text-center">
          <button
            type="button"
            onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
            className="px-7 py-3.5 rounded-2xl bg-brand-card hover:bg-brand-primary/20 text-brand-text border border-brand-primary/35 font-semibold text-sm transition-colors shadow-purple-sm"
          >
            {TEXTS.jobs.loadMore} ({filteredJobs.length - visibleCount} ta qoldi)
          </button>
        </div>
      )}
    </div>
  );
}
