import type { QuizAnswers, VisaResult, VisaScoringFactor } from "@/lib/types";
import { weightedScore, mapConfidence } from "./engine";

const MINIMUM_THRESHOLD = 40;

// B-1/B-2 Visitor Visa
// Source: https://travel.state.gov/content/travel/en/us-visas/tourism-visit/visitor.html
// B-1: Business visitors (meetings, conferences, negotiations)
// B-2: Tourists, personal travel, medical treatment
// Key requirement: Demonstrate nonimmigrant intent and strong ties to home country
export function scoreB1B2(answers: Partial<QuizAnswers>): VisaResult {
  const {
    intent,
    hasEmploymentHomeTies = false,
    isCurrentlyStudying = false,
    hasPropertyHomeTies = false,
    hasVehicleOrBusiness = false,
    isMarried = false,
    priorTravelHistory,
    hasOverstay = false,
    hasDenial = false,
    plansToReturn = true,
    longTermGoal,
    priorUsVisits = 0,
    hasFamilyInUs = false,
  } = answers;

  const intentScore = (() => {
    if (intent === "tourism") return 100;
    if (intent === "business_investment") return 80;
    if (intent === "not_sure") return 40;
    return 20;
  })();

  const employmentScore = (hasEmploymentHomeTies || isCurrentlyStudying) ? 100 : 0;

  const propertyScore = (() => {
    if (hasPropertyHomeTies && hasVehicleOrBusiness) return 100;
    if (hasPropertyHomeTies || hasVehicleOrBusiness) return 75;
    return 25;
  })();

  const familyScore = (() => {
    if (isMarried) return 100;
    return 40;
  })();

  const travelScore = (() => {
    if (priorTravelHistory === "extensive") return 100;
    if (priorTravelHistory === "moderate") return 75;
    if (priorTravelHistory === "limited") return 40;
    return 20;
  })();

  const overstayScore = hasOverstay ? 0 : 100;

  const factors: VisaScoringFactor[] = [
    {
      factor: "nonimmigrant_intent",
      weight: 0.25,
      score: intentScore,
      label: "Clear temporary visit intent",
      present: intentScore >= 80,
    },
    {
      factor: "employment_home_ties",
      weight: 0.20,
      score: employmentScore,
      label: "Employment or academic ties to home country",
      present: employmentScore > 0,
    },
    {
      factor: "property_home_ties",
      weight: 0.15,
      score: propertyScore,
      label: "Property or financial ties to home country",
      present: propertyScore >= 50,
    },
    {
      factor: "family_home_ties",
      weight: 0.15,
      score: familyScore,
      label: "Family ties to home country",
      present: familyScore >= 70,
    },
    {
      factor: "prior_travel",
      weight: 0.15,
      score: travelScore,
      label: "Prior international travel history and compliance",
      present: travelScore >= 60,
    },
    {
      factor: "no_overstay",
      weight: 0.10,
      score: overstayScore,
      label: "No prior visa violations",
      present: !hasOverstay,
    },
  ];

  let total = weightedScore(factors);

  const riskFactors: string[] = [];
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const nextSteps: string[] = [];
  const recommendedEvidence: string[] = [];

  // Hard caps
  if (hasOverstay) {
    riskFactors.push("Prior U.S. visa overstay is the most serious risk factor for B-1/B-2 approval");
    total = Math.min(total, 25);
  }
  if (hasDenial) {
    riskFactors.push("Prior visa denial requires explanation at interview");
    total = Math.min(total, 40);
  }

  const isDualIntentRisk = longTermGoal === "permanent_residency" || longTermGoal === "citizenship_path";
  if (isDualIntentRisk) {
    riskFactors.push("Stated intent for permanent residency contradicts B-1/B-2 nonimmigrant status requirement");
    total = Math.min(total, 35);
  }

  // Positive factors
  if (hasEmploymentHomeTies) strengths.push("Current employment is a strong tie to your home country");
  if (isCurrentlyStudying) strengths.push("Active academic enrollment demonstrates home country ties");
  if (hasPropertyHomeTies) strengths.push("Property ownership shows significant financial ties");
  if (isMarried) strengths.push("Marital status and family ties strengthen nonimmigrant intent");
  if (travelScore >= 75) strengths.push("Strong international travel history with compliance record");
  if (!hasOverstay && priorUsVisits > 0) strengths.push("Prior U.S. visits without violations show good track record");

  // Weaknesses
  if (!hasEmploymentHomeTies && !isCurrentlyStudying) weaknesses.push("No current employment or academic enrollment weakens home country ties");
  if (!hasPropertyHomeTies && !hasVehicleOrBusiness) weaknesses.push("Limited financial ties to home country may raise questions");
  if (travelScore < 40) weaknesses.push("Limited travel history — consular officers favor applicants with established travel records");
  if (!plansToReturn) weaknesses.push("Plan to return to home country must be clearly demonstrated");

  nextSteps.push("Gather documents demonstrating strong ties to your home country");
  nextSteps.push("Prepare for the visa interview — be ready to explain your purpose and return plans");
  nextSteps.push("Book your flights (return ticket) before the interview");
  nextSteps.push("Prepare your travel itinerary showing clear plans for your visit");

  recommendedEvidence.push("Employment letter confirming position and approved leave");
  recommendedEvidence.push("Bank statements showing financial stability");
  recommendedEvidence.push("Property ownership documents or rental agreements");
  recommendedEvidence.push("Return flight reservation");
  recommendedEvidence.push("Hotel bookings or invitation letter from U.S. host");
  recommendedEvidence.push("Travel itinerary for your U.S. visit");
  if (isMarried) recommendedEvidence.push("Marriage certificate");
  recommendedEvidence.push("Evidence of prior international travel (passport stamps)");

  return {
    visaType: "B1/B2",
    totalScore: Math.round(Math.min(100, total)),
    confidence: mapConfidence(total),
    meetsMinimumThreshold: total >= MINIMUM_THRESHOLD,
    dualIntentRisk: isDualIntentRisk,
    factors,
    strengths,
    weaknesses,
    riskFactors,
    nextSteps,
    recommendedEvidence,
    processingTimeMonths: [1, 4],
    estimatedCostUsd: [160, 400],
  };
}
