/**
 * EB-2 PERM — Advanced Degree with Labor Certification
 * Legal basis: INA § 203(b)(2)(A), 8 CFR § 204.5(k)
 * Requires: U.S. employer sponsor + DOL PERM labor certification
 *           + Form I-140 filed by employer.
 *
 * IMPORTANT: Without a U.S. employer willing to sponsor a permanent position,
 * this visa is unavailable. permanentJobSponsor === false is a hard disqualifier.
 *
 * Current realistic timelines (as of 2025–2026):
 * - PERM certification: ~500 calendar days (DOL analyst review)
 * - I-140 processing: 6–9 months standard, 15 business days premium
 * - Adjustment of status: 6–18 months
 * - Total for ROW countries: approximately 2.5–4 years
 * - Total for India: 15+ years (12+ year backlog after PERM)
 * - Mexico and all other Latin American countries: NO backlog penalty
 *   (they fall under Rest of World which is typically current)
 */

import type { QuizAnswers, VisaResult, VisaScoringFactor } from "@/lib/types";
import { mapConfidence } from "./engine";

const MINIMUM_THRESHOLD = 55;

// ── Country helpers ────────────────────────────────────────────────────────────

function isIndianNational(nationality: string): boolean {
  return /\bindia\b|\bindian\b/i.test(nationality);
}

function isChineseNational(nationality: string): boolean {
  return /\bchina\b|\bchinese\b|\bmainland china\b/i.test(nationality);
}

function isNoBacklogCountry(nationality: string): boolean {
  // Returns true for all countries EXCEPT India and China.
  // Latin America, Europe, Africa, Southeast Asia, Middle East = ROW (currently current)
  return !isIndianNational(nationality) && !isChineseNational(nationality);
}

// ── Specialty occupation helper ────────────────────────────────────────────────
// EB-2 requires either advanced degree OR exceptional ability.
// Specialty occupation proxy using profession field.
const SPECIALTY_PATTERNS: RegExp[] = [
  /engineer|engineering|software|developer|programmer|data scientist|ai|machine learning|ml/i,
  /physician|doctor|surgeon|medical|dentist|nurse|pharmacist|therapist|psychiatrist/i,
  /scientist|researcher|physicist|chemist|biologist|academic/i,
  /lawyer|attorney|legal|counsel/i,
  /architect|urban planner/i,
  /accountant|cpa|actuary|economist|financial analyst/i,
  /professor|lecturer|teacher/i,
  /biotechnology|bioinformatics|genomics/i,
];

function isSpecialtyOccupation(profession: string): boolean {
  if (!profession) return false;
  return SPECIALTY_PATTERNS.some((p) => p.test(profession));
}

// ─────────────────────────────────────────────────────────────────────────────

export function scoreEB2PERM(answers: Partial<QuizAnswers>, locale = "en"): VisaResult {
  const {
    permanentJobSponsor = false,
    educationLevel = "none",
    yearsExperience = 0,
    profession = "",
    nationality = "",
    hasOverstay = false,
    hasDenial = false,
    longTermGoal,
    dependentAges,
  } = answers;

  // ── Hard disqualifier ─────────────────────────────────────────────────────
  // Without a permanent employer sponsor, EB-2 PERM is unavailable.
  if (!permanentJobSponsor) {
    return {
      visaType: "eb2perm",
      totalScore: 0,
      confidence: "not_applicable",
      meetsMinimumThreshold: false,
      factors: [],
      strengths: [],
      weaknesses: ["A U.S. employer willing to sponsor a permanent position (PERM) is required for this pathway"],
      riskFactors: [],
      nextSteps: ["Find a U.S. employer willing to sponsor you for a permanent position before pursuing EB-2 PERM"],
      recommendedEvidence: [],
      processingTimeMonths: [30, 60],
      estimatedCostUsd: [5000, 15000],
    };
  }

  // ── Score calculation ──────────────────────────────────────────────────────
  let score = 0;

  // Permanent employer sponsor (core requirement, heavily weighted)
  score += 45;

  // Education qualification
  const hasMastersOrHigher = educationLevel === "masters" || educationLevel === "phd";
  const hasBachelorsPlusExp = educationLevel === "bachelors" && yearsExperience >= 10;
  if (hasMastersOrHigher) {
    score += 25;
  } else if (hasBachelorsPlusExp) {
    // Bachelor's + 5 years progressive experience = equivalent to advanced degree per 8 CFR 204.5(k)(3)(ii)(C)
    score += 20;
  }

  // Years of experience
  if (yearsExperience >= 5) score += 10;

  // Specialty occupation match
  if (isSpecialtyOccupation(profession)) score += 15;

  // No country backlog (ROW = Rest of World)
  if (isNoBacklogCountry(nationality)) score += 15;

  // ── Risk factors (country backlog) ─────────────────────────────────────────
  const indian = isIndianNational(nationality);
  const chinese = isChineseNational(nationality);
  if (indian) score -= 35;
  else if (chinese) score -= 25;

  score = Math.max(0, Math.min(100, score));

  // ── Contextual notices ─────────────────────────────────────────────────────
  let contextualNotice: string | undefined;
  if (indian && score >= MINIMUM_THRESHOLD) {
    contextualNotice = locale === "es"
      ? "EB-2 PERM podría ser una opción con patrocinio de empleador, pero los nacionales de India enfrentan actualmente tiempos de espera que superan los 12 años debido a los límites anuales de visas. Un abogado puede ayudarte a evaluar si este cronograma se adapta a tu situación, o si EB-1A o EB-2 NIW podrían ser mejores alternativas."
      : "EB-2 PERM could be an option with employer sponsorship, but nationals from India currently face wait times exceeding 12 years due to annual visa limits. An attorney can help you evaluate whether this timeline fits your situation, or whether EB-1A or EB-2 NIW might be better alternatives.";
  } else if (chinese && score >= MINIMUM_THRESHOLD) {
    contextualNotice = locale === "es"
      ? "EB-2 PERM podría estar disponible con patrocinio de empleador, pero los nacionales de China enfrentan actualmente esperas de varios años. Un abogado puede evaluar si otras opciones como EB-1A podrían ofrecer un camino más rápido."
      : "EB-2 PERM may be available with employer sponsorship, but nationals from China currently face multi-year wait times due to annual visa limits. An attorney can help assess whether other pathways like EB-1A might offer a faster route.";
  }

  // ── Narrative output ───────────────────────────────────────────────────────
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const riskFactors: string[] = [];
  const nextSteps: string[] = [];
  const recommendedEvidence: string[] = [];

  strengths.push("U.S. employer sponsor is in place — the core requirement for EB-2 PERM is met");
  if (hasMastersOrHigher) strengths.push("Advanced degree meets the educational qualification for EB-2 directly");
  if (hasBachelorsPlusExp) strengths.push("Bachelor's degree + 10+ years progressive experience can substitute for an advanced degree");
  if (isSpecialtyOccupation(profession)) strengths.push("Profession matches a specialty occupation — strengthens the job requirement documentation");
  if (isNoBacklogCountry(nationality) && !indian && !chinese) strengths.push("No country-specific backlog — Rest of World priority dates are typically current");
  if (longTermGoal === "permanent_residency" || longTermGoal === "citizenship_path") {
    strengths.push("Green card provides a permanent path to residency and eventual citizenship");
  }

  if (!hasMastersOrHigher && !hasBachelorsPlusExp) {
    weaknesses.push("EB-2 requires a Master's degree (or higher) OR a Bachelor's + 5 years progressive experience demonstrating exceptional ability");
  }
  if (yearsExperience < 5) weaknesses.push("At least 5 years of progressive post-degree experience strengthens the PERM application");
  if (!isSpecialtyOccupation(profession)) weaknesses.push("The PERM process requires showing no qualified U.S. workers are available — specialty occupations have stronger precedent");

  if (hasOverstay) riskFactors.push("Prior visa overstay may affect adjustment of status — consult an attorney");
  if (hasDenial) riskFactors.push("Prior visa denial should be disclosed and addressed proactively");
  if (indian) riskFactors.push("India-born nationals face an estimated 12+ year wait due to per-country annual limits");
  else if (chinese) riskFactors.push("China-born nationals face multi-year waits due to annual per-country limits");

  nextSteps.push("Work with your employer to initiate the PERM labor certification process with the Department of Labor");
  nextSteps.push("Hire an immigration attorney — the PERM process has strict procedural requirements and any error resets the clock");
  nextSteps.push("Your employer must advertise the position extensively before PERM filing to show no qualified U.S. workers applied");
  if (indian || chinese) nextSteps.push("Evaluate EB-1A or EB-2 NIW as parallel strategies — both avoid the per-country backlog");

  recommendedEvidence.push("Permanent employment offer letter from U.S. employer with job duties, salary, and minimum requirements");
  recommendedEvidence.push("Official degree certificates and transcripts (translated if not in English)");
  recommendedEvidence.push("Experience letters from past employers showing progressive responsibility");
  recommendedEvidence.push("Professional licenses or certifications relevant to the position");
  if (hasMastersOrHigher) {
    recommendedEvidence.push("Documentation that the position genuinely requires an advanced degree");
  }

  // ── Factors array ──────────────────────────────────────────────────────────
  const eduScore = hasMastersOrHigher ? 100 : hasBachelorsPlusExp ? 80 : educationLevel === "bachelors" ? 40 : 10;
  const expScore = yearsExperience >= 10 ? 100 : yearsExperience >= 5 ? 70 : yearsExperience >= 3 ? 40 : 10;
  const backlogScore = indian ? 0 : chinese ? 25 : 100;

  const factors: VisaScoringFactor[] = [
    { factor: "employer_sponsor", weight: 0.40, score: 100, label: "U.S. employer permanent sponsorship", present: true },
    { factor: "education", weight: 0.25, score: eduScore, label: "Advanced degree or equivalent experience", present: eduScore >= 40 },
    { factor: "experience", weight: 0.10, score: expScore, label: "Years of relevant professional experience", present: expScore >= 40 },
    { factor: "specialty", weight: 0.15, score: isSpecialtyOccupation(profession) ? 100 : 30, label: "Specialty occupation match", present: isSpecialtyOccupation(profession) },
    { factor: "backlog", weight: 0.10, score: backlogScore, label: "Priority date availability (no country backlog)", present: backlogScore >= 75 },
  ];

  return {
    visaType: "eb2perm",
    totalScore: Math.round(score),
    confidence: mapConfidence(score),
    meetsMinimumThreshold: score >= MINIMUM_THRESHOLD,
    contextualNotice,
    ageOutWarning: !!dependentAges?.some((a) => a >= 19 && a <= 21),
    factors,
    strengths,
    weaknesses,
    riskFactors,
    nextSteps,
    recommendedEvidence,
    processingTimeMonths: [30, 60],
    estimatedCostUsd: [5000, 15000],
  };
}
