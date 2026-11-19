import type { Job, Profile } from "./types";

export interface MatchCandidateProfile {
  skills?: string[] | null;
  weekly_hours?: number | null;
  flexible_only?: boolean | null;
}

export interface MatchCandidateJob {
  skills?: string[] | null;
  estimated_hours?: number | null;
  flexible_deadline?: boolean | null;
}

/**
 * 4.3-bo'lim: "Sizga mos ishlar" (qoidaga asoslangan moslik)
 * Formula:
 * skillOverlap = (frilanser va ish uchun umumiy ko'nikmalar soni) / (ish talab qilgan ko'nikmalar soni) // 0..1, ish ko'nikmasi bo'sh bo'lsa 0.5
 * timeFit      = frilanserning haftalik soati >= ishning taxminiy soati ? 1 : haftalik soat / taxminiy soat
 * flexFit      = frilanser "faqat moslashuvchan" bo'lsa: ish moslashuvchan muddatli ? 1 : 0; aks holda 1
 * score        = round(100 * (0.60*skillOverlap + 0.25*timeFit + 0.15*flexFit))
 */
export function matchScore(
  freelancer: MatchCandidateProfile | Profile,
  job: MatchCandidateJob | Job
): number {
  const freelancerSkills = (freelancer.skills ?? []).map((s) =>
    s.trim().toLowerCase()
  );
  const jobSkills = (job.skills ?? [])
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  // 1. skillOverlap (0..1)
  let skillOverlap = 0.5;
  if (jobSkills.length > 0) {
    const commonCount = jobSkills.filter((js) =>
      freelancerSkills.includes(js)
    ).length;
    skillOverlap = commonCount / jobSkills.length;
  }

  // 2. timeFit (0..1)
  let timeFit = 1;
  const estHours = job.estimated_hours ?? 0;
  const weeklyHours = freelancer.weekly_hours ?? 0;

  if (estHours > 0) {
    if (weeklyHours <= 0) {
      // Frilanser soatini kiritmagan bo'lsa o'rtacha 0.5 beramiz
      timeFit = 0.5;
    } else if (weeklyHours >= estHours) {
      timeFit = 1;
    } else {
      timeFit = Math.max(0, Math.min(1, weeklyHours / estHours));
    }
  }

  // 3. flexFit (0 yoki 1)
  const flexFit = freelancer.flexible_only
    ? job.flexible_deadline
      ? 1
      : 0
    : 1;

  const rawScore = 100 * (0.6 * skillOverlap + 0.25 * timeFit + 0.15 * flexFit);
  return Math.max(0, Math.min(100, Math.round(rawScore)));
}
