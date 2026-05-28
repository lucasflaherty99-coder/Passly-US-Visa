import type { QuizAnswers, VisaResult, VisaScoringFactor } from "@/lib/types";
import { weightedScore, mapConfidence } from "./engine";

const MINIMUM_THRESHOLD = 50;

// SPECIALTY_OCCUPATIONS maps profession keywords to a specialty score (0-100)
// Based on USCIS specialty occupation criteria
const SPECIALTY_OCCUPATION_KEYWORDS: { pattern: RegExp; score: number }[] = [
  { pattern: /engineer|engineering/i, score: 100 },
  { pattern: /software|developer|programmer|coder|devops/i, score: 100 },
  { pattern: /architect/i, score: 100 },
  { pattern: /physician|doctor|surgeon|medical|dentist/i, score: 100 },
  { pattern: /lawyer|attorney|legal/i, score: 100 },
  { pattern: /accountant|auditor|cpa|finance|financial analyst/i, score: 100 },
  { pattern: /scientist|researcher|biologist|chemist|physicist/i, score: 100 },
  { pattern: /mathematician|statistician|data scientist|analyst/i, score: 100 },
  { pattern: /designer|ux|ui|graphic/i, score: 80 },
  { pattern: /marketing|product manager|project manager/i, score: 80 },
  { pattern: /consultant|advisor|strategy/i, score: 75 },
  { pattern: /professor|teacher|educator|academic/i, score: 90 },
  { pattern: /economist|policy|urban planner/i, score: 90 },
  { pattern: /nurse|pharmacist|therapist|psychologist/i, score: 90 },
  { pattern: /fashion|artist|musician|writer|filmmaker/i, score: 40 },
  { pattern: /entrepreneur|founder|startup/i, score: 30 },
];

function getSpecialtyScore(profession: string): number {
  if (!profession) return 30;
  for (const { pattern, score } of SPECIALTY_OCCUPATION_KEYWORDS) {
    if (pattern.test(profession)) return score;
  }
  return 50;
}

// H-1B: Specialty Occupation
// Source: https://www.uscis.gov/working-in-the-united-states/h-1b-specialty-occupations
// Requires a bachelor's degree or equivalent in a specialty occupation.
// Subject to annual cap and lottery (~20% selection rate).
export function scoreH1B(answers: Partial<QuizAnswers>): VisaResult {
  const {
    educationLevel = "none",
    profession = "",
    hasUsSponsor = false,
    incomeRange = "<30k",
    hasOverstay = false,
    hasDenial = false,
    longTermGoal,
  } = answers;

  // Hard block: no degree below bachelor's
  if (educationLevel === "none" || educationLevel === "high_school") {
    return buildBlockedResult(answers);
  }

  const degreeScore = (() => {
    if (educationLevel === "phd") return 100;
    if (educationLevel === "masters") return 90;
    if (educationLevel === "bachelors") return 70;
    return 50;
  })();

  const specialtyScore = getSpecialtyScore(profession);

  const salaryScore = (() => {
    if (incomeRange === "200k+") return 100;
    if (incomeRange === "100k-200k") return 100;
    if (incomeRange === "60k-100k") return 100;
    if (incomeRange === "30k-60k") return 60;
    return 30;
  })();

  const historyScore = (() => {
    if (hasOverstay && hasDenial) return 0;
    if (hasOverstay || hasDenial) return 50;
    return 100;
  })();

  const factors: VisaScoringFactor[] = [
    {
      factor: "specialty_degree",
      weight: 0.30,
      score: degreeScore,
      label: "Bachelor's or higher in specialty field",
      present: degreeScore >= 70,
    },
    {
      factor: "field_match",
      weight: 0.20,
      score: specialtyScore,
      label: "Specialty occupation field",
      present: specialtyScore >= 75,
    },
    {
      factor: "employer_sponsor",
      weight: 0.25,
      score: hasUsSponsor ? 100 : 0,
      label: "U.S. employer sponsorship",
      present: hasUsSponsor,
    },
    {
      factor: "salary_threshold",
      weight: 0.15,
      score: salaryScore,
      label: "Salary meeting prevailing wage requirements",
      present: salaryScore >= 60,
    },
    {
      factor: "no_adverse_history",
      weight: 0.10,
      score: historyScore,
      label: "Clean U.S. immigration history",
      present: historyScore >= 80,
    },
  ];

  let total = weightedScore(factors);

  const riskFactors: string[] = [];
  if (hasOverstay) {
    riskFactors.push("Prior U.S. visa overstay is a serious risk factor");
    total = Math.min(total, 60);
  }
  if (hasDenial) {
    riskFactors.push("Prior visa denial requires explanation with application");
  }
  if (!hasUsSponsor) {
    riskFactors.push("H-1B requires a U.S. employer sponsor — independent petitions are not allowed");
  }

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const nextSteps: string[] = [];
  const recommendedEvidence: string[] = [];

  if (degreeScore >= 90) strengths.push("Advanced degree strongly supports specialty occupation qualification");
  if (specialtyScore >= 90) strengths.push("Your profession is well-recognized as a specialty occupation");
  if (hasUsSponsor) strengths.push("Having a U.S. employer ready to sponsor you is the most critical factor");

  if (!hasUsSponsor) weaknesses.push("No U.S. employer sponsor identified — this is required for H-1B");
  if (specialtyScore < 75) weaknesses.push("Your profession may need additional documentation to qualify as a specialty occupation");
  if (degreeScore < 70) weaknesses.push("Degree equivalency evaluation may be needed");

  nextSteps.push("Find a U.S. employer willing to file an H-1B petition on your behalf");
  nextSteps.push("Prepare for April H-1B lottery registration window (opens in March)");
  nextSteps.push("Obtain an official degree evaluation if your degree is from outside the U.S.");
  nextSteps.push("Research OPT/STEM OPT if you're currently studying in the U.S.");

  recommendedEvidence.push("Official degree transcripts and diploma");
  recommendedEvidence.push("Credential evaluation from NACES-approved evaluator (if non-U.S. degree)");
  recommendedEvidence.push("Employment offer letter from U.S. employer");
  recommendedEvidence.push("Labor Condition Application (LCA) from employer");
  recommendedEvidence.push("Evidence of specialty occupation: licenses, certifications, past employment");

  const dualIntentRisk = longTermGoal === "permanent_residency" || longTermGoal === "citizenship_path";

  return {
    visaType: "H-1B",
    totalScore: Math.round(Math.min(100, total)),
    confidence: mapConfidence(total),
    meetsMinimumThreshold: total >= MINIMUM_THRESHOLD,
    lotteryRisk: true,
    ageOutWarning: !!answers.dependentAges?.some((age) => age >= 19 && age <= 21),
    dualIntentRisk,
    factors,
    strengths,
    weaknesses,
    riskFactors,
    nextSteps,
    recommendedEvidence,
    processingTimeMonths: [3, 8],
    estimatedCostUsd: [2000, 6000],
  };
}

function buildBlockedResult(answers: Partial<QuizAnswers>): VisaResult {
  return {
    visaType: "H-1B",
    totalScore: 0,
    confidence: "not_applicable",
    meetsMinimumThreshold: false,
    lotteryRisk: true,
    factors: [],
    strengths: [],
    weaknesses: ["H-1B requires at minimum a bachelor's degree or equivalent"],
    riskFactors: ["Educational requirement not met"],
    nextSteps: ["Consider F-1 student visa to obtain a U.S. degree", "Explore O-1 if you have extraordinary ability without a traditional degree"],
    recommendedEvidence: [],
    processingTimeMonths: [3, 8],
    estimatedCostUsd: [2000, 6000],
  };
}
