import type { QuizAnswers, VisaResult, VisaScoringFactor } from "@/lib/types";
import { weightedScore, mapConfidence } from "./engine";
import { isE2TreatyCountry, COUNTRY_CODE_TO_NAME } from "./e2TreatyCountries";

const MINIMUM_THRESHOLD = 50;

// E-2 Treaty Investor Visa
// Source: https://travel.state.gov/content/travel/en/us-visas/employment/treaty-trader-investor-visa-e.html
// Requires:
// 1. National of a treaty country
// 2. Substantial investment in a bona fide U.S. enterprise
// 3. Investment must not be marginal
// 4. Investor must have controlling interest (≥50%) and direct operations
export function scoreE2(answers: Partial<QuizAnswers>): VisaResult {
  const {
    nationality = "",
    isFounder = false,
    investmentCapitalAvailable,
    hasUsBusinessPartner = false,
    incomeRange = "<30k",
    hasOverstay = false,
    hasDenial = false,
    longTermGoal,
  } = answers;

  // Resolve country name from code if needed
  const countryName = COUNTRY_CODE_TO_NAME[nationality] || nationality;
  const isTreatyCountry = isE2TreatyCountry(countryName);

  // Hard block: not a treaty country national
  if (!isTreatyCountry && nationality) {
    return buildNotTreatyResult(countryName, answers);
  }

  const treatyScore = isTreatyCountry ? 100 : 0;

  const investmentScore = (() => {
    if (!investmentCapitalAvailable) return 0;
    if (investmentCapitalAvailable === "500k+") return 100;
    if (investmentCapitalAvailable === "100k-500k") return 80;
    if (investmentCapitalAvailable === "50k-100k") return 50;
    return 20;
  })();

  const controlScore = isFounder ? 100 : 0;

  const notMarginalScore = (() => {
    if (incomeRange === "200k+" || incomeRange === "100k-200k") return 100;
    if (incomeRange === "60k-100k") return 80;
    if (incomeRange === "30k-60k") return 55;
    return 30;
  })();

  const viabilityScore = (() => {
    let pts = 0;
    if (hasUsBusinessPartner) pts += 60;
    if (incomeRange === "60k-100k" || incomeRange === "100k-200k" || incomeRange === "200k+") pts += 40;
    return Math.min(100, pts);
  })();

  const factors: VisaScoringFactor[] = [
    {
      factor: "treaty_country",
      weight: 0.25,
      score: treatyScore,
      label: "Nationality from E-2 treaty country",
      present: isTreatyCountry,
    },
    {
      factor: "investment_amount",
      weight: 0.30,
      score: investmentScore,
      label: "Substantial investment capital",
      present: investmentScore >= 50,
    },
    {
      factor: "controlling_interest",
      weight: 0.20,
      score: controlScore,
      label: "At least 50% ownership and operational control",
      present: isFounder,
    },
    {
      factor: "not_marginal",
      weight: 0.15,
      score: notMarginalScore,
      label: "Enterprise is not marginal (generates more than a living)",
      present: notMarginalScore >= 55,
    },
    {
      factor: "viability",
      weight: 0.10,
      score: viabilityScore,
      label: "Business viability and partnerships",
      present: viabilityScore >= 50,
    },
  ];

  let total = weightedScore(factors);

  const riskFactors: string[] = [];
  if (hasOverstay) {
    riskFactors.push("Prior U.S. visa overstay is a serious risk factor");
    total = Math.min(total, 60);
  }
  if (hasDenial) {
    riskFactors.push("Prior visa denial requires a compelling explanation");
  }
  const isDualIntentRisk = longTermGoal === "permanent_residency" || longTermGoal === "citizenship_path";
  if (isDualIntentRisk) {
    riskFactors.push("E-2 holders must maintain nonimmigrant intent — green card intent can create issues");
  }

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const nextSteps: string[] = [];
  const recommendedEvidence: string[] = [];

  if (isTreatyCountry) strengths.push(`${countryName || "Your country"} has an E-2 treaty with the United States`);
  if (investmentScore >= 80) strengths.push("Substantial investment capital meets a key E-2 requirement");
  if (isFounder) strengths.push("Founder status supports the controlling interest requirement");
  if (hasUsBusinessPartner) strengths.push("U.S. business partner can help establish and operate the enterprise");

  if (!investmentCapitalAvailable || investmentScore < 50) weaknesses.push("Investment amount may be below typical E-2 approval thresholds — USCIS looks at proportionality");
  if (!isFounder) weaknesses.push("E-2 requires at least 50% ownership and active direction of the business");
  if (isDualIntentRisk) weaknesses.push("E-2 requires maintaining nonimmigrant intent — plan carefully");

  nextSteps.push("Consult an immigration attorney about E-2 investment requirements for your specific country");
  nextSteps.push("Develop a detailed business plan showing the enterprise is not marginal");
  nextSteps.push("Document the source of investment funds (not borrowed funds secured by investment)");
  nextSteps.push("Apply at the U.S. embassy or consulate — E-2 is typically processed there, not USCIS");

  recommendedEvidence.push("Proof of treaty country nationality (passport)");
  recommendedEvidence.push("Evidence of investment: bank statements, wire transfers, escrow accounts");
  recommendedEvidence.push("Business plan demonstrating economic viability");
  recommendedEvidence.push("Proof of at least 50% ownership");
  recommendedEvidence.push("Source of funds documentation");
  recommendedEvidence.push("Lease agreements or purchase contracts for U.S. business premises");

  return {
    visaType: "E-2",
    totalScore: Math.round(Math.min(100, total)),
    confidence: mapConfidence(total),
    meetsMinimumThreshold: total >= MINIMUM_THRESHOLD,
    dualIntentRisk: isDualIntentRisk,
    ageOutWarning: !!answers.dependentAges?.some((age) => age >= 19 && age <= 21),
    factors,
    strengths,
    weaknesses,
    riskFactors,
    nextSteps,
    recommendedEvidence,
    processingTimeMonths: [2, 6],
    estimatedCostUsd: [1000, 5000],
  };
}

function buildNotTreatyResult(country: string, answers: Partial<QuizAnswers>): VisaResult {
  return {
    visaType: "E-2",
    totalScore: 0,
    confidence: "not_applicable",
    meetsMinimumThreshold: false,
    factors: [{
      factor: "treaty_country",
      weight: 1.0,
      score: 0,
      label: "Nationality from E-2 treaty country",
      present: false,
    }],
    strengths: [],
    weaknesses: [`${country || "Your country"} does not currently have an E-2 treaty with the United States`],
    riskFactors: ["Nationality from non-treaty country disqualifies E-2 eligibility"],
    nextSteps: [
      "Explore EB-5 investor green card (available to all nationalities)",
      "Consider acquiring citizenship or residency of a treaty country if feasible",
      "Explore other visa categories based on your professional profile",
    ],
    recommendedEvidence: [],
    processingTimeMonths: [2, 6],
    estimatedCostUsd: [1000, 5000],
  };
}
