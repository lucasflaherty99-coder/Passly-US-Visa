/**
 * EB-1A — Alien of Extraordinary Ability
 * Legal basis: INA § 203(b)(1)(A), 8 CFR § 204.5(h)(3)
 * No job offer required. Self-petition via Form I-140.
 * Two-step Kazarian analysis:
 *   (1) Satisfy at least 3 of the 10 regulatory criteria
 *   (2) Final merits determination — totality of evidence
 *
 * Important legal notes:
 * - Criterion 7 (artistic exhibitions): ONLY artistic exhibitions qualify under
 *   this criterion per USCIS 2024 policy update. Non-artistic exhibitions may
 *   qualify only as comparable evidence.
 * - Criterion 9 (high salary): requires documented comparison data (BLS stats,
 *   industry surveys) — salary alone without comparative evidence is insufficient
 *   per AAO decisions.
 * - Final merits: meeting 3+ criteria is necessary but NOT sufficient. The scoring
 *   threshold reflects this — a score above threshold indicates potential eligibility,
 *   not guaranteed approval.
 */

import type { QuizAnswers, VisaResult, VisaScoringFactor } from "@/lib/types";
import { scoreO1 } from "./o1";
import { mapConfidence } from "./engine";

const MINIMUM_THRESHOLD = 50;

export function scoreEB1A(answers: Partial<QuizAnswers>, locale = "en"): VisaResult {
  const {
    hasAwards = false,
    hasJudgingExperience = false,
    hasMediaCoverage = false,
    hasPublications = false,
    publicationsCount,
    hasMemberships = false,
    hasSpeakingEngagements = false,
    hasPortfolio = false,
    patents = false,
    recognitionBeyondEmployer,   // undefined = not answered; false = local/employer-only
    incomeRange = "<30k",
    longTermGoal,
    hasOverstay = false,
    hasDenial = false,
  } = answers;

  // ── Criteria mapping to USCIS 8 CFR 204.5(h)(3) ──────────────────────────
  // We approximate using available questionnaire fields.
  // Criterion 1 — Awards/prizes
  const awardsMet = hasAwards;
  // Criterion 2 — Elite membership
  const membershipMet = hasMemberships === true;
  // Criterion 3 — Published material about the beneficiary
  const mediaMet = hasMediaCoverage;
  // Criterion 4 — Judging others' work
  const judgingMet = hasJudgingExperience === true;
  // Criterion 5 & 6 — Original contributions + Scholarly articles
  const publicationsMet = hasPublications;
  // Criterion 7/comparable — Patents or original technical contributions
  const patentsMet = patents === true;
  // Criterion 8 — Critical role (proxy: speaking = invited role in distinguished context)
  const criticalRoleMet = hasSpeakingEngagements;
  // Criterion 9 — High salary relative to field
  const highSalaryMet = incomeRange === "100k-200k" || incomeRange === "200k+";

  const criteriaMetCount = [
    awardsMet, membershipMet, mediaMet, judgingMet,
    publicationsMet || patentsMet,  // group 5/6/7 as one criterion for counting
    criticalRoleMet, highSalaryMet,
  ].filter(Boolean).length;

  // ── Base score (additive, based on spec weight assignments) ───────────────
  let score = 0;

  if (hasAwards) score += 20;
  if (hasJudgingExperience) score += 15;
  if (hasMediaCoverage) score += 15;
  // Original contributions criterion (+20) — best satisfied by patents or portfolio
  if (patents || hasPortfolio) score += 20;
  // Scholarly articles criterion (+10) — publications specifically
  if (hasPublications) score += 10;
  // Publications count bonus
  if (hasPublications && publicationsCount === "10+") score += 5;
  else if (hasPublications && publicationsCount === "4-10") score += 3;
  // Elite membership
  if (hasMemberships) score += 10;
  // Patents (separate criterion from original contributions)
  if (patents) score += 10;
  // High salary (requires comparative data — see note above)
  if (incomeRange === "200k+") score += 10;
  else if (incomeRange === "100k-200k") score += 7;
  // Speaking / critical role bonus
  if (hasSpeakingEngagements) score += 5;

  // ── Cross-pathway bonus: O-1 and EB-1A share the same legal standard ──────
  // A strong O-1A profile directly supports EB-1A eligibility.
  const o1Result = scoreO1(answers, locale);
  if (o1Result.totalScore >= 70) score += 15;

  // ── Risk factor deductions ─────────────────────────────────────────────────
  // Fewer than 3 criteria met — hard threshold under Kazarian step 1
  if (criteriaMetCount < 3) score -= 30;

  // Recognition limited to single employer or local scope
  if (recognitionBeyondEmployer === false) score -= 20;

  score = Math.max(0, Math.min(100, score));

  // ── Contextual notice (informational, does not reduce score) ──────────────
  let contextualNotice: string | undefined;
  if (score >= 55 && recognitionBeyondEmployer === false) {
    contextualNotice = locale === "es"
      ? "Tu perfil muestra logros sólidos dentro de tu organización. Construir reconocimiento más amplio en tu campo — a través de publicaciones, charlas o cobertura mediática — podría fortalecer significativamente esta opción."
      : "Your profile shows strong achievements within your organization. Building broader recognition in your field — through publications, speaking engagements, or media coverage — could significantly strengthen this pathway.";
  }

  // ── Narrative output ───────────────────────────────────────────────────────
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const riskFactors: string[] = [];
  const nextSteps: string[] = [];
  const recommendedEvidence: string[] = [];

  // Strengths
  if (hasAwards) strengths.push("National or international awards demonstrate extraordinary achievement in your field");
  if (hasMediaCoverage) strengths.push("Published media coverage provides documented evidence of recognition by others");
  if (hasJudgingExperience) strengths.push("Judging or peer review experience proves standing and recognition in your field");
  if (hasPublications) strengths.push("Publications establish original scholarly contributions");
  if (patents) strengths.push("Patents demonstrate documented original contributions — a strong stand-alone criterion");
  if (o1Result.totalScore >= 70) strengths.push("Strong O-1 profile directly supports EB-1A — both use the same 'extraordinary ability' legal standard");
  if (!longTermGoal || longTermGoal === "permanent_residency" || longTermGoal === "citizenship_path") {
    strengths.push("No employer sponsor required — self-petition directly with USCIS via Form I-140");
  }
  if (criteriaMetCount >= 3) strengths.push(`Meets or approaches the 3-criteria minimum required under Kazarian step one (${criteriaMetCount} criteria identified)`);

  // Weaknesses
  if (criteriaMetCount < 3) weaknesses.push(`Only ${criteriaMetCount} of the 10 USCIS criteria identified — at least 3 must be clearly met`);
  if (!hasAwards) weaknesses.push("No documented awards or prizes — national/international recognition is one of the strongest EB-1A criteria");
  if (!hasMediaCoverage) weaknesses.push("Published media about you specifically (not just your employer) is a commonly evidenced criterion");
  if (!hasJudgingExperience) weaknesses.push("Serving as a judge, peer reviewer, or evaluator is a frequently proven criterion");
  if (recognitionBeyondEmployer === false) weaknesses.push("Recognition appears limited to your organization — broader field-wide recognition is essential for EB-1A");
  if (!patents && !hasPublications) weaknesses.push("Original contributions (patents, publications, or portfolio) are required to satisfy multiple criteria");

  // Risk factors
  if (hasOverstay) riskFactors.push("Prior U.S. visa overstay must be disclosed and may require a waiver");
  if (hasDenial) riskFactors.push("Prior visa denial should be proactively addressed in your petition narrative");
  if (criteriaMetCount < 3) riskFactors.push("Petition may not survive Kazarian step-one review without meeting at least 3 criteria");

  // Next steps
  nextSteps.push("Consult an immigration attorney experienced in EB-1A I-140 self-petitions");
  nextSteps.push("Map each achievement to one of the 10 USCIS regulatory criteria with supporting documentation");
  nextSteps.push("Commission expert opinion letters from recognized professionals who can describe your specific impact");
  if (!hasAwards) nextSteps.push("Pursue national or international awards or competitions in your field");
  if (!hasMediaCoverage) nextSteps.push("Seek press coverage, interviews, or published features about you and your work");
  if (o1Result.totalScore >= 60) nextSteps.push("Consider concurrent O-1 and EB-1A filings — they share legal standards and evidence");

  // Recommended evidence (from spec)
  recommendedEvidence.push("Awards with documentation of selection criteria, judging panel composition, and geographic scope");
  recommendedEvidence.push("Published media coverage about you and your work (not press releases you issued)");
  recommendedEvidence.push("Peer review or judging invitations with confirmation from editors or organizers");
  recommendedEvidence.push("Salary comparison data against field peers (BLS statistics, industry surveys, Levels.fyi)");
  recommendedEvidence.push("Expert recommendation letters from recognized professionals describing specific impact");
  recommendedEvidence.push("Evidence of critical role in distinguished organizations (org reputation + your specific role)");
  if (patents) recommendedEvidence.push("Patent documents (filed or granted) or proof of original contributions with real-world adoption");

  // ── Factors array (for UI display) ────────────────────────────────────────
  const highSalaryScore = incomeRange === "200k+" ? 100 : incomeRange === "100k-200k" ? 70 : incomeRange === "60k-100k" ? 30 : 0;
  const factors: VisaScoringFactor[] = [
    { factor: "awards", weight: 0.20, score: awardsMet ? 100 : 0, label: "National/international awards or prizes", present: awardsMet },
    { factor: "judging", weight: 0.15, score: judgingMet ? 100 : 0, label: "Judging or evaluating others' work", present: judgingMet },
    { factor: "media", weight: 0.15, score: mediaMet ? 100 : 0, label: "Published media about you and your work", present: mediaMet },
    { factor: "publications", weight: 0.10, score: publicationsMet ? 100 : 0, label: "Scholarly articles or publications", present: publicationsMet },
    { factor: "original_contributions", weight: 0.15, score: (patents || hasPortfolio) ? 100 : 0, label: "Original contributions / patents", present: patents || hasPortfolio },
    { factor: "membership", weight: 0.10, score: membershipMet ? 100 : 0, label: "Elite professional association membership", present: membershipMet },
    { factor: "high_salary", weight: 0.10, score: highSalaryScore, label: "High remuneration relative to field peers", present: highSalaryScore > 0 },
    { factor: "criteria_threshold", weight: 0.05, score: Math.min(100, (criteriaMetCount / 3) * 100), label: "Kazarian step-one threshold (3+ criteria)", present: criteriaMetCount >= 3 },
  ];

  return {
    visaType: "eb1a",
    totalScore: Math.round(score),
    confidence: mapConfidence(score),
    meetsMinimumThreshold: score >= MINIMUM_THRESHOLD,
    contextualNotice,
    ageOutWarning: !!answers.dependentAges?.some((a) => a >= 19 && a <= 21),
    dualIntentRisk: false, // EB-1A is immigrant — no dual intent issue
    factors,
    strengths,
    weaknesses,
    riskFactors,
    nextSteps,
    recommendedEvidence,
    processingTimeMonths: [8, 24],
    estimatedCostUsd: [4000, 12000],
  };
}
