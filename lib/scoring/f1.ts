// ─────────────────────────────────────────────────────────────────────────────
// F-1 Student Visa Scorer
// ─────────────────────────────────────────────────────────────────────────────
//
// Legal basis: INA § 101(a)(15)(F); 8 CFR § 214.2(f)
// Nonimmigrant intent standard: INA § 214(b)
// Adjudicated at U.S. consulate abroad — not USCIS petition
//
// FY2023-2024: 41% of F-1 applications were denied globally.
// ~279,000 of 679,000 applications rejected — 10-year high.
// Primary denial basis: INA § 214(b) — failure to overcome
// presumption of immigrant intent.
//
// 2025 State Dept rule: most applicants must apply at home
// country consulate — "forum shopping" now triggers denial.
//
// Under Trump administration: additional scrutiny on students
// from certain countries and on STEM fields.
//
// Key distinction: F-1 requires showing NONIMMIGRANT INTENT
// (intent to return home) — opposite of EB-2 NIW/EB-1A.
// Every applicant is PRESUMED to be an intending immigrant
// until they prove otherwise (INA § 214(b)). Burden of proof
// is on the applicant.
//
// This scoring is educational only — not legal advice.
// ─────────────────────────────────────────────────────────────────────────────

import type { QuizAnswers, VisaResult, VisaScoringFactor } from "@/lib/types";
import { mapConfidence } from "./engine";

// Display threshold: 50+ AND no hard blocks
// "Strong match":    78–100
// "Possible pathway": 58–77
// "Worth exploring":  50–57
const MINIMUM_THRESHOLD = 50;

//
// Four-component additive scoring model reflecting consular evaluation logic:
//   Component 1 — Academic Preparedness  (0–25)
//   Component 2 — Financial Capacity     (0–25)
//   Component 3 — Home Country Ties      (0–30)  ← most important for INA § 214(b)
//   Component 4 — Nonimmigrant Intent    (0–20)  ← subtract risk factors from 20
//   ─────────────────────────────────────────────
//   Total                                (0–100)
//
export function scoreF1(answers: Partial<QuizAnswers>, locale = "en"): VisaResult {
  const {
    intent,
    nationality          = "",
    countryOfResidence   = "",
    ageRange,
    educationLevel       = "none",
    degreeField,
    documentsReady       = [],
    employmentType       = "unemployed",
    incomeRange          = "<30k",
    hasOverstay          = false,
    hasDenial            = false,
    hasFamilyInUs        = false,
    hasUniversityAcceptance = false,
    hasUsSponsor         = false,
    priorUsVisits        = 0,
    longTermGoal         = "temporary_visit",
    isMarried,
    hasPropertyHomeTies,
    hasVehicleOrBusiness,
    isCurrentlyStudying,
    dependentAges,
  } = answers;

  const riskFactors: string[] = [];
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const nextSteps: string[] = [];
  const recommendedEvidence: string[] = [];

  // Derived helpers used across multiple components
  const hasAcademicDocs =
    documentsReady.includes("diploma") || documentsReady.includes("transcripts");
  const applyingFromHomeCountry =
    !!nationality &&
    !!countryOfResidence &&
    nationality.toLowerCase() === countryOfResidence.toLowerCase();
  const isDualIntentRisk =
    longTermGoal === "permanent_residency" || longTermGoal === "citizenship_path";

  // ─── HARD BLOCKS ─────────────────────────────────────────────────────────
  //
  // If hard blocks are present the visa is "not_applicable" regardless of score.

  const hardBlocks: string[] = [];

  if (!hasUniversityAcceptance) {
    hardBlocks.push(
      "F-1 requires acceptance from a SEVP-approved U.S. school and an I-20 form. " +
      "Without these, this pathway cannot be pursued."
    );
  }

  if (hasOverstay) {
    hardBlocks.push(
      "A prior visa overstay is a serious negative factor for any U.S. visa. " +
      "Consult an immigration attorney before applying."
    );
  }

  // Push hard block text into riskFactors so the UI can surface it
  hardBlocks.forEach((b) => riskFactors.push(b));

  // ─── COMPONENT 1: ACADEMIC PREPAREDNESS (0–25) ───────────────────────────
  //
  // Reflects consular evaluation of academic credibility and I-20 readiness.
  // Without a valid I-20 from an SEVP-approved school, F-1 cannot be issued.
  // Consular officers frequently deny community college enrollment citing
  // "non-career enhancement" perception — applicants must clearly explain
  // why the program fits their career goals at home.

  let academicRaw = 0;

  // University acceptance / I-20 availability (+20 — hard requirement)
  if (hasUniversityAcceptance) {
    academicRaw += 20;
  }

  // School tier (approximated from applicant's prior education level):
  // Higher prior education correlates with admission to 4-year/research schools.
  // high_school / none → first-degree student, potentially community college.
  if (educationLevel === "masters" || educationLevel === "phd") {
    academicRaw += 5; // Research university / well-known institution
  } else if (educationLevel === "bachelors" || educationLevel === "other") {
    academicRaw += 4; // Standard 4-year institution
  } else {
    // high_school or none → community college or entry-level program (+2)
    // "Community college enrollment faces higher scrutiny at some consulates.
    // Be prepared to clearly explain why this program is the right path for
    // your goals and how it connects to your career plans at home."
    academicRaw += 2;
    if (hasUniversityAcceptance) {
      riskFactors.push(
        "Community college enrollment receives heightened scrutiny at some consulates. " +
        "Prepare a clear explanation of why this program fits your specific career goals."
      );
    }
  }

  // Program alignment with career goals (approximated from employment + degreeField):
  // Officers deny when enrollment seems like "non-career enhancement."
  const hasCareerAlignment =
    employmentType !== "unemployed" ||
    (degreeField !== undefined && degreeField.trim().length > 0);
  if (hasCareerAlignment) {
    academicRaw += 3; // Clear alignment documented
  }
  // Unclear or inconsistent alignment → +0

  // Prior academic track record
  if (hasAcademicDocs) {
    academicRaw += 2; // Strong grades / academic history
  } else {
    academicRaw += 1; // No academic history (first degree) — not penalized
  }

  const academicScore = Math.min(25, academicRaw);

  // ─── COMPONENT 2: FINANCIAL CAPACITY (0–25) ──────────────────────────────
  //
  // F-1 requires proof of sufficient funds to cover tuition AND living
  // expenses for the FULL duration of study. Officers evaluate financial
  // SUSTAINABILITY, not just current balance.
  //
  // Financial insufficiency is one of the top 3 denial reasons.
  // Officers look for:
  //   - Bank statements (ideally 3–6 months of history)
  //   - Sponsor's employment letter + income evidence
  //   - Scholarship award letters if applicable

  let financialRaw = 0;

  // Financial capacity relative to program cost (income as proxy for family wealth)
  if (incomeRange === "200k+" || incomeRange === "100k-200k") {
    financialRaw = 25; // Clearly sufficient — documented savings/sponsorship covers full program
  } else if (incomeRange === "60k-100k") {
    financialRaw = 15; // Likely sufficient (partial documentation scenario)
  } else if (incomeRange === "30k-60k") {
    financialRaw = 10; // Unclear or insufficient
  } else {
    financialRaw = 5;  // No or minimal financial evidence
  }

  // Source of funds stability bonuses (component capped at 25)
  if (employmentType === "employee" || employmentType === "founder") {
    financialRaw = Math.min(25, financialRaw + 3); // Employed parent/family sponsor with stable income
  }
  if (hasUsSponsor) {
    financialRaw = Math.min(25, financialRaw + 5); // Scholarship or institutional funding
  }
  if (hasAcademicDocs) {
    // Organized applicant with documents is more likely to have financial docs ready too
    financialRaw = Math.min(25, financialRaw + 2); // Personal savings documented
  }

  const financialScore = Math.min(25, financialRaw);

  // ─── COMPONENT 3: HOME COUNTRY TIES (0–30) ───────────────────────────────
  //
  // MOST IMPORTANT component for F-1 adjudication.
  // INA § 214(b) requires demonstrating a "residence abroad which they have
  // no intention of abandoning." The consular officer evaluates the totality
  // of home ties: family, economic, social, professional, and property ties.
  //
  // Note: The home ties step (employment, property, marriage) is only collected
  // for tourism-intent paths in the questionnaire. For study-intent profiles,
  // this component approximates ties from employment type, age, income level,
  // and whether the applicant is applying from their home country.

  let homeTiesRaw = 0;

  // Employment / career ties (strongest signal of home country anchor)
  if (isCurrentlyStudying) {
    homeTiesRaw += 4; // Currently studying — will return to complete academic path
  } else if (employmentType === "employee") {
    homeTiesRaw += 8; // Currently employed in home country
  } else if (employmentType === "founder") {
    homeTiesRaw += 6; // Business ownership in home country
  } else if (employmentType === "freelance") {
    homeTiesRaw += 4; // Freelance work — some economic anchor at home
  }
  // unemployed → +0

  // Family ties in home country
  if (isMarried) {
    homeTiesRaw += 7; // Married with spouse / children in home country
  } else if (ageRange === "18-24") {
    homeTiesRaw += 5; // Young applicant — parents and close family likely at home
  } else if (ageRange === "25-34") {
    homeTiesRaw += 3; // Some family ties
  } else {
    homeTiesRaw += 2; // Older applicant — reduced family tie assumption
  }

  // Property / economic ties
  if (hasPropertyHomeTies) {
    homeTiesRaw += 5; // Owns property or real estate in home country
  }
  if (hasVehicleOrBusiness) {
    homeTiesRaw += 4; // Owns business or significant assets
  }
  // If property fields were not collected (study-intent path), use income as proxy
  if (!hasPropertyHomeTies && !hasVehicleOrBusiness) {
    if (incomeRange === "100k-200k" || incomeRange === "200k+") {
      homeTiesRaw += 2; // Implied financial ties from high income level
    }
  }

  // Social / residence ties: applying from home country vs. third country
  // 2025 State Dept rule: most applicants must apply at home country consulate.
  if (applyingFromHomeCountry) {
    homeTiesRaw += 3; // Long-term residence at home — strongest social tie signal
  }

  // Age factor (consular pattern):
  // Age 18-24: standard profile, no additional scrutiny
  // Age 25-30: slight increased scrutiny
  // Age 30+: consular officers apply higher scrutiny for older students;
  //   applicant must clearly explain why they are pursuing this degree now
  //   and how it connects to their career path at home.
  if (ageRange === "35-44" || ageRange === "45-54" || ageRange === "55+") {
    riskFactors.push(
      "Applicants over 30 often face additional questions about program timing and " +
      "career purpose. A compelling personal statement connecting your studies to " +
      "your home career is essential."
    );
  }

  const homeTiesScore = Math.min(30, homeTiesRaw);

  // ─── COMPONENT 4: NONIMMIGRANT INTENT SIGNALS (0–20) ─────────────────────
  //
  // Evaluates risk factors that signal immigrant intent to consular officers.
  // This component REDUCES the score when risk factors are present.
  // Start at 20 and subtract for each risk factor found.
  // Minimum: 0 (cannot go negative).

  let intentRisk = 20;

  // Prior U.S. visa overstay → hard block + full elimination of this component
  if (hasOverstay) {
    intentRisk -= 20;
  }

  // Prior F-1 or other visa denial (−10)
  // Denial will be visible to the consular officer; must explain what changed.
  if (hasDenial) {
    intentRisk -= 10;
    riskFactors.push(
      "A prior visa denial will be visible to the consular officer. " +
      "You should be prepared to explain what has changed since then."
    );
  }

  // Family members with U.S. green card or citizenship (−5)
  // Not disqualifying but flags potential immigrant intent; must address proactively.
  if (hasFamilyInUs) {
    intentRisk -= 5;
    riskFactors.push(
      "Having immediate family with U.S. permanent residency may raise questions " +
      "about your own immigration intent. Documenting your ties to your home " +
      "country is especially important."
    );
  }

  // No clear plan to return — long-term goal signals immigrant intent (−8)
  if (isDualIntentRisk) {
    intentRisk -= 8;
  }

  // Applying from third country — forum shopping risk under 2025 State Dept rule (−5)
  if (!applyingFromHomeCountry && nationality && countryOfResidence) {
    intentRisk -= 5;
    riskFactors.push(
      "Applying from a country other than your nationality may be viewed as " +
      "forum shopping under 2025 State Department guidelines. Applying from your " +
      "home country consulate is strongly recommended."
    );
  }

  // Many prior U.S. visits may suggest an extended-stay pattern (−3)
  if (priorUsVisits > 5) {
    intentRisk -= 3;
  }

  const intentRiskScore = Math.max(0, intentRisk);

  // ─── TOTAL SCORE ──────────────────────────────────────────────────────────
  //
  // Direct sum of four components:
  //   Academic (0–25) + Financial (0–25) + Home Ties (0–30) + Intent (0–20) = 0–100

  let total = Math.min(100, academicScore + financialScore + homeTiesScore + intentRiskScore);

  // Hard cap: non-study intents have no meaningful path to F-1
  if (intent !== "study" && intent !== "not_sure") {
    total = Math.min(total, 20);
  }

  // Weak home ties consular risk flag (generated after total is computed)
  // homeTiesScore < 12 → likely insufficient to overcome INA § 214(b) presumption
  if (homeTiesScore < 12) {
    riskFactors.push(
      "Your home country ties profile may not be strong enough to overcome the " +
      "presumption of immigrant intent under INA § 214(b). Consider strengthening " +
      "documented ties before applying."
    );
  }

  // ─── FACTORS (for UI display) ─────────────────────────────────────────────
  //
  // Each factor maps its component score onto a 0–100 scale so that
  // weight × score (0–100) reproduces the component's contribution to the total:
  //   0.25 × (academicScore/25 × 100)    = academicScore    ✓
  //   0.25 × (financialScore/25 × 100)   = financialScore   ✓
  //   0.30 × (homeTiesScore/30 × 100)    = homeTiesScore    ✓
  //   0.20 × (intentRiskScore/20 × 100)  = intentRiskScore  ✓
  //                                        ───────────────
  //   Sum                                = total             ✓

  const factors: VisaScoringFactor[] = [
    {
      factor: "academic_preparedness",
      weight: 0.25,
      score: Math.round((academicScore / 25) * 100),
      label: "Academic preparedness & I-20 eligibility",
      present: academicScore >= 18,
    },
    {
      factor: "financial_capacity",
      weight: 0.25,
      score: Math.round((financialScore / 25) * 100),
      label: "Financial capacity for full program duration",
      present: financialScore >= 15,
    },
    {
      factor: "home_country_ties",
      weight: 0.30,
      score: Math.round((homeTiesScore / 30) * 100),
      label: "Home country ties (INA § 214(b))",
      present: homeTiesScore >= 15,
    },
    {
      factor: "nonimmigrant_intent",
      weight: 0.20,
      score: Math.round((intentRiskScore / 20) * 100),
      label: "Nonimmigrant intent signals",
      present: intentRiskScore >= 14,
    },
  ];

  // ─── STRENGTHS ────────────────────────────────────────────────────────────

  if (hasUniversityAcceptance) {
    strengths.push(
      "University acceptance and I-20 are the critical documents for F-1 — you have the key requirement."
    );
  }
  if (financialScore >= 20) {
    strengths.push(
      "Strong financial capacity will be a significant positive factor at your visa interview."
    );
  }
  if (employmentType === "employee" || employmentType === "founder") {
    strengths.push(
      "Current employment or business ownership is a strong home country anchor that supports nonimmigrant intent."
    );
  }
  if (homeTiesScore >= 20) {
    strengths.push(
      "Your home country ties profile is strong — this is the most important factor for F-1 approval under INA § 214(b)."
    );
  }
  if (!hasOverstay && priorUsVisits > 0) {
    strengths.push(
      "Prior U.S. visits with full compliance demonstrate a good track record with U.S. immigration."
    );
  }
  if (intentRiskScore >= 18) {
    strengths.push(
      "Your profile shows minimal immigrant intent risk — a key advantage under the INA § 214(b) standard."
    );
  }
  if (applyingFromHomeCountry) {
    strengths.push(
      "Applying from your home country consulate is the correct forum under 2025 State Department rules."
    );
  }

  // ─── WEAKNESSES ───────────────────────────────────────────────────────────

  if (!hasUniversityAcceptance) {
    weaknesses.push(
      "You need a Form I-20 from a SEVP-approved U.S. school. Without it, an F-1 visa cannot be issued."
    );
  }
  if (financialScore < 10) {
    weaknesses.push(
      "F-1 requires demonstrated financial ability to cover full tuition and living expenses. " +
      "Insufficient financial evidence is a top denial reason."
    );
  }
  if (homeTiesScore < 12) {
    weaknesses.push(
      "Your home country ties may not be sufficient to overcome the INA § 214(b) presumption of immigrant intent. " +
      "This is the most common basis for F-1 denial."
    );
  }
  if (isDualIntentRisk) {
    weaknesses.push(
      "F-1 requires nonimmigrant intent. Disclosed plans for permanent residency " +
      "signal immigrant intent and are likely to result in denial."
    );
  }
  if (intentRiskScore < 8) {
    weaknesses.push(
      "Multiple intent risk factors are present. A consular officer may not be satisfied " +
      "that you intend to return home after your studies."
    );
  }

  // ─── CONTEXTUAL NOTICE (amber caution) ───────────────────────────────────
  //
  // Show if: home ties are weak AND the score still meets the display threshold.
  // Rendered as an amber indicator on the result card.

  let contextualNotice: string | undefined;

  if (homeTiesScore < 12 && total >= MINIMUM_THRESHOLD) {
    contextualNotice =
      "Your profile shows academic and financial readiness for F-1, but consular " +
      "officers will focus heavily on your ties to your home country. Building " +
      "stronger documented ties before applying significantly improves your chances.";
  }

  // ─── NEXT STEPS ───────────────────────────────────────────────────────────

  if (!hasUniversityAcceptance) {
    nextSteps.push(
      "Apply to SEVP-approved U.S. universities and obtain your Form I-20 — this is required before you can apply for F-1."
    );
  } else {
    nextSteps.push(
      "Apply for your F-1 visa at the U.S. embassy or consulate in your home country."
    );
  }
  nextSteps.push(
    "Prepare a strong personal statement explaining your program choice and your post-graduation career plan at home."
  );
  nextSteps.push(
    "Gather financial documentation: 3–6 months of bank statements, sponsor's employment letter, and any scholarship awards."
  );
  nextSteps.push(
    "Compile home country tie evidence: current employment letter, property documents, family records."
  );
  nextSteps.push(
    "Practice for the consular interview — be ready to clearly explain your intent to return home and your career plan."
  );

  // ─── RECOMMENDED EVIDENCE ─────────────────────────────────────────────────

  // Academic
  recommendedEvidence.push("Form I-20 from SEVP-approved institution");
  recommendedEvidence.push("University acceptance letter");
  recommendedEvidence.push("Academic transcripts and diplomas");
  recommendedEvidence.push("Statement of purpose (program choice + home career plan)");

  // Financial
  recommendedEvidence.push("Bank statements (3–6 months) for self or sponsoring family member");
  recommendedEvidence.push("Sponsor's employment letter and income evidence");
  if (hasUsSponsor) {
    recommendedEvidence.push("Scholarship or institutional funding award letter");
  }
  recommendedEvidence.push("Tax returns of sponsoring family member");

  // Home ties (most critical category)
  recommendedEvidence.push("Employment letter from current or future employer in home country");
  if (hasPropertyHomeTies) {
    recommendedEvidence.push("Property ownership documents");
  }
  recommendedEvidence.push("Family registration documents (birth certificate, marriage certificate if applicable)");
  if (hasVehicleOrBusiness) {
    recommendedEvidence.push("Evidence of business ownership or significant assets in home country");
  }
  recommendedEvidence.push("Community or professional memberships in home country");

  // Intent signals
  recommendedEvidence.push("Clear post-graduation career plan in home country");
  recommendedEvidence.push("Evidence of demand in your home country for your field of study");

  // ─── RETURN ───────────────────────────────────────────────────────────────

  return {
    visaType: "F-1",
    totalScore: Math.round(Math.min(100, total)),
    confidence: hardBlocks.length > 0 ? "not_applicable" : mapConfidence(total),
    meetsMinimumThreshold: hardBlocks.length === 0 && total >= MINIMUM_THRESHOLD,
    dualIntentRisk: isDualIntentRisk,
    ageOutWarning: !!dependentAges?.some((age) => age >= 19 && age <= 21),
    contextualNotice,
    factors,
    strengths,
    weaknesses,
    riskFactors,
    nextSteps,
    recommendedEvidence,
    processingTimeMonths: [1, 4],
    estimatedCostUsd: [200, 600],
  };
}
