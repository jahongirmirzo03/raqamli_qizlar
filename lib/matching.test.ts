import assert from "node:assert/strict";
import { matchScore } from "./matching";

// 1-test: To'liq moslik (100%)
const scoreFull = matchScore(
  {
    skills: ["Canva", "SMM", "Grafik dizayn"],
    weekly_hours: 15,
    flexible_only: true,
  },
  {
    skills: ["Canva", "SMM"],
    estimated_hours: 10,
    flexible_deadline: true,
  }
);
assert.equal(scoreFull, 100, "To'liq moslik 100% bo'lishi kerak");

// 2-test: Ishda ko'nikma bo'sh bo'lganda skillOverlap = 0.5 bo'lishi
// 0.6*0.5 + 0.25*1 + 0.15*1 = 0.3 + 0.25 + 0.15 = 0.70 -> 70%
const scoreEmptyJobSkills = matchScore(
  {
    skills: ["Canva"],
    weekly_hours: 10,
    flexible_only: false,
  },
  {
    skills: [],
    estimated_hours: 5,
    flexible_deadline: false,
  }
);
assert.equal(
  scoreEmptyJobSkills,
  70,
  "Bo'sh ko'nikmali ishda moslik 70% bo'lishi kerak"
);

// 3-test: Frilanser 'faqat moslashuvchan' bo'lsa va ish moslashuvchan bo'lmasa flexFit = 0,
// va haftalik soat taxminiy soatning yarmi bo'lsa timeFit = 0.5
// skillOverlap = 1/2 = 0.5 -> 0.6*0.5 = 0.30
// timeFit = 5/10 = 0.5     -> 0.25*0.5 = 0.125
// flexFit = 0              -> 0.15*0 = 0
// Jami = round(42.5) = 43%
const scorePartial = matchScore(
  {
    skills: ["Copywriting"],
    weekly_hours: 5,
    flexible_only: true,
  },
  {
    skills: ["Copywriting", "SMM"],
    estimated_hours: 10,
    flexible_deadline: false,
  }
);
assert.equal(scorePartial, 43, "Qisman moslik 43% chiqishi kerak");

// 4-test: Umuman mos kelmaydigan ko'nikmalar va moslashuvchanlik
const scoreZeroSkills = matchScore(
  {
    skills: ["Tarjima"],
    weekly_hours: 4,
    flexible_only: true,
  },
  {
    skills: ["React", "TypeScript"],
    estimated_hours: 20,
    flexible_deadline: false,
  }
);
// skillOverlap = 0, timeFit = 4/20 = 0.2 -> 0.25*0.2 = 0.05 -> 5%
assert.equal(scoreZeroSkills, 5, "Past moslik 5% chiqishi kerak");

console.log("Barcha 4 ta matching unit testlari muvaffaqiyatli o'tdi!");
