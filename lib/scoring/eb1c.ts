// ─────────────────────────────────────────────────────────────────────────────
// EB-1C — Multinational Executive or Manager Green Card
// ─────────────────────────────────────────────────────────────────────────────
//
// Legal basis: INA § 203(b)(1)(C); 8 CFR § 204.5(j)
// USCIS Policy Manual Vol. 6, Part F, Chapter 4
//
// EB-1C: employment-based first preference green card for
//   multinational executives and managers.
// FY2025: 97.08% approval rate (10,940/11,269 cases).
// Lowest denial rate of any EB-1 subcategory.
// No PERM labor certification required.
// No annual cap backlog for most countries.
// India/China: EB-1 backlog exists but far shorter than
//   EB-2/EB-3 — significant strategic advantage.
//
// L-1A → EB-1C is the classic multinational transfer path.
// E-2 → EB-1C is an emerging path for investors who build
//   a qualifying multinational corporate structure.
//
// 2025 RFE trend: increased scrutiny on (1) qualifying
//   corporate relationship documentation, and (2) genuine
//   executive/managerial capacity — especially "functional
//   managers" and "working managers" who perform operational
//   tasks alongside management duties.
//
// Since Jan 2025: USCIS more aggressively scrutinizing
//   functional managers whose authority is not tied to
//   direct personnel supervision.
//
// Key AAO pattern: beneficiary must primarily perform
//   managerial/executive duties — not spend majority of
//   time on day-to-day operational functions.
//
// This scoring is educational only — not legal advice.
// ─────────────────────────────────────────────────────────────────────────────

import type { QuizAnswers, VisaResult, VisaScoringFactor } from "@/lib/types";
import { mapConfidence } from "./engine";

// Display threshold: 55+ AND no hard blocks
// "Strong match":    80–100
// "Possible pathway": 60–79
// "Worth exploring":  55–59
const MINIMUM_THRESHOLD = 55;

//
// Three-component additive scoring model:
//   Component 1 — Qualifying Corporate Relationship  (0–35)
//   Component 2 — Qualifying Employment Abroad       (0–30)
//   Component 3 — Executive / Managerial Capacity    (0–35)
//   ────────────────────────────────────────────────────────
//   Total                                            (0–100)
//
export function scoreEB1C(answers: Partial<QuizAnswers>, locale = "en"): VisaResult {
  const {
    intent,
    isFounder             = false,
    hasManagementExperience = false,
    hasUsBusinessPartner  = false,
    temporaryJobSponsor   = false,
    permanentJobSponsor   = false,
    yearsExperience       = 0,
    hasCertifications     = false,
    hasPublications       = false,
    hasSpeakingEngagements = false,
    hasMemberships        = false,
    hasAwards             = false,
    patents               = false,
    incomeRange           = "<30k",
    hasOverstay           = false,
    hasDenial             = false,
    longTermGoal          = "temporary_visit",
    dependentAges,
  } = answers;

  const riskFactors: string[] = [];
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const nextSteps: string[] = [];
  const recommendedEvidence: string[] = [];

  // ─── SUBPATH DETECTION ────────────────────────────────────────────────────
  //
  // l1a_to_eb1c: user has an L-1A-like profile (manager/founder + qualifying
  //   corporate structure). This is the most common and strongest path.
  // e2_to_eb1c:  business investment intent — E-2 investors who build a
  //   multinational structure can eventually transition to EB-1C.
  // direct:      direct EB-1C petition without prior L-1A or E-2.

  type EB1CSubpath = "l1a_to_eb1c" | "e2_to_eb1c" | "direct";

  const hasQualifyingStructure =
    hasUsBusinessPartner || temporaryJobSponsor || permanentJobSponsor || isFounder;
  const hasL1AProfile =
    (isFounder || hasManagementExperience) && hasQualifyingStructure;
  const isBusinessInvestmentIntent = intent === "business_investment";

  const subpath: EB1CSubpath = hasL1AProfile
    ? "l1a_to_eb1c"
    : isBusinessInvestmentIntent
    ? "e2_to_eb1c"
    : "direct";

  // ─── HARD BLOCKS ─────────────────────────────────────────────────────────
  //
  // All three structural requirements must be met. Each missing element is a
  // hard block; any single hard block → not_applicable.

  const hardBlocks: string[] = [];

  // Hard block 1: No qualifying corporate relationship
  if (!hasQualifyingStructure) {
    hardBlocks.push(
      "EB-1C requires a qualifying corporate relationship (parent, subsidiary, affiliate, or branch) " +
      "between a U.S. employer and a foreign entity. Without this structure, EB-1C is not available."
    );
  }

  // Hard block 2: Less than 1 year of qualifying employment abroad
  if (yearsExperience < 1) {
    hardBlocks.push(
      "EB-1C requires at least 1 continuous year employed abroad in a managerial or executive capacity " +
      "within the 3 years before filing the I-140 petition."
    );
  }

  // Hard block 3: No managerial or executive role
  if (!isFounder && !hasManagementExperience) {
    hardBlocks.push(
      "EB-1C is only available for managers and executives. Individual contributors, technical staff, " +
      "and non-managerial roles do not qualify."
    );
  }

  // Push hard block text into riskFactors for UI display
  hardBlocks.forEach((b) => riskFactors.push(b));

  // Short-circuit: if all three requirements are missing, return immediately
  if (hardBlocks.length >= 3) {
    return buildBlockedResult(answers, hardBlocks, locale);
  }

  // ─── COMPONENT 1: QUALIFYING CORPORATE RELATIONSHIP (0–35) ───────────────
  //
  // The U.S. employer must have a qualifying relationship with the foreign entity
  // where the beneficiary worked (≥ 50% common ownership or control).
  // Both entities must be actively doing business.
  // U.S. company must have been doing business for at least 1 year before filing.
  //
  // 2025 RFE trigger: inconsistencies across ownership documents, financial
  // records, and org charts. AAO: qualifying relationship must be proven with
  // credible, consistent corporate evidence.

  let corporateRaw = 0;

  if (hasUsBusinessPartner || temporaryJobSponsor || permanentJobSponsor) {
    corporateRaw = 35; // Established qualifying relationship — parent/subsidiary/affiliate/branch
  } else if (isFounder) {
    // Founder-established U.S. entity: qualifying relationship exists if the
    // U.S. company was set up by the same individual. However, the U.S. company
    // must have been doing business for at least 1 year before EB-1C can be filed.
    // "The U.S. company must have been doing business for at least 1 year before
    // filing EB-1C. If the U.S. entity was recently established, the petition
    // cannot be filed until this requirement is met."
    corporateRaw = 35 - 10; // Potential new-entity risk: -10 (unknown establishment date)
    riskFactors.push(
      "The U.S. company must have been doing business for at least 1 year before filing EB-1C. " +
      "If the U.S. entity was recently established, the petition cannot be filed until this " +
      "requirement is met."
    );
  }
  // No qualifying structure → corporateRaw = 0 (hard block already added)

  // Complex corporate structure penalty — flag for RFE risk
  // Cannot detect from quiz data; encode as a conditional notice for founders
  // with no explicit business partner confirmation.
  if (isFounder && !hasUsBusinessPartner) {
    riskFactors.push(
      "Complex or founder-only corporate structures require meticulous documentation. " +
      "Inconsistencies between ownership records, tax filings, and org charts are a " +
      "primary RFE trigger in 2025."
    );
  }

  const corporateScore = Math.min(35, corporateRaw);

  // ─── COMPONENT 2: QUALIFYING EMPLOYMENT ABROAD (0–30) ────────────────────
  //
  // Requirement: employed abroad for at least 1 continuous year within the
  // 3 years PRECEDING the I-140 petition filing date.
  //
  // CRITICAL timing note: the 3-year lookback is measured from the date of
  // the I-140 petition, NOT from when the person entered the U.S. This creates
  // a time trap for L-1A holders who have been in the U.S. for years. After
  // 3 years on L-1A, the foreign employment falls outside the lookback window
  // if not carefully tracked.
  //
  // Capacity abroad must be managerial or executive — the same type of role
  // as the U.S. position.

  let employmentRaw = 0;

  if (yearsExperience >= 2) {
    employmentRaw = 30; // 2+ years — comfortably meets the requirement
  } else if (yearsExperience >= 1) {
    // 1–2 years: meets minimum — officer may scrutinize continuity
    // "One year is the minimum qualifying period. Document the continuous
    // nature of your employment carefully — gaps may disqualify."
    employmentRaw = yearsExperience >= 1.5 ? 22 : 15;
    if (yearsExperience < 1.5) {
      riskFactors.push(
        "Your qualifying employment period is close to the 1-year minimum. Document the " +
        "continuous nature of your employment carefully — any gaps could jeopardize eligibility."
      );
    }
  }
  // < 1 year → employmentRaw = 0 (hard block already added)

  // Capacity abroad: must have been managerial/executive (same type as U.S. role)
  // If the applicant has no management experience, the abroad employment was
  // likely not in a qualifying capacity — apply the -20 deduction.
  if (!isFounder && !hasManagementExperience && yearsExperience >= 1) {
    employmentRaw = Math.max(0, employmentRaw - 20);
    riskFactors.push(
      "EB-1C requires that the qualifying year abroad was in a managerial or executive capacity — " +
      "not just any role. A non-managerial role abroad does not satisfy this requirement."
    );
  }

  const employmentScore = Math.min(30, employmentRaw);

  // ─── COMPONENT 3: EXECUTIVE OR MANAGERIAL CAPACITY (0–35) ────────────────
  //
  // Most scrutinized component in 2025.
  // INA § 101(a)(44) defines both terms precisely.
  //
  // EXECUTIVE: directs management of the organization or major component;
  //   establishes goals and policies; exercises wide latitude in discretionary
  //   decision-making; receives only general supervision from higher-level
  //   executives, board, or stockholders.
  //
  // MANAGERIAL: manages organization, department, subdivision, function, or
  //   component; supervises/controls supervisory, professional, or managerial
  //   employees OR manages an essential function at a senior level; has authority
  //   to hire/fire or recommend such; exercises discretion over day-to-day
  //   operations of the managed activity.
  //
  // KEY AAO distinction: beneficiary must PRIMARILY perform managerial duties.
  // If beneficiary spends majority of time on operational/technical/hands-on
  // work → not qualifying capacity ("working manager" problem).
  //
  // Since Jan 2025: USCIS more aggressively scrutinizing functional managers
  // whose authority is not tied to direct personnel supervision.

  let roleRaw = 0;
  type RFERisk = "low" | "medium" | "high";
  let rfeRisk: RFERisk = "medium";

  if (isFounder) {
    // Founders direct the entire organization — clearest executive profile.
    // INA § 101(a)(44)(B): directs management, establishes goals/policies,
    // exercises wide discretionary decision-making.
    roleRaw = 25; // Base executive role
    rfeRisk = "low";

    // Organizational evidence bonuses
    roleRaw += 5; // Org chart exists by definition (founder has direct reports or manages function)

    if (incomeRange === "200k+" || incomeRange === "100k-200k") {
      roleRaw += 5; // High compensation = clear executive seniority
    } else if (yearsExperience >= 3) {
      roleRaw += 3; // Established tenure suggests documented authority
    }

  } else if (hasManagementExperience) {
    // Non-founder managers: differentiate by seniority and authority signals
    if (incomeRange === "200k+" || incomeRange === "100k-200k") {
      // Senior executive / VP / Director — likely manages other managers
      roleRaw = 25; // Confirmed executive/senior manager
      rfeRisk = "low";
      roleRaw += 5; // Org chart + documented authority implied at this level
      if (yearsExperience >= 5) roleRaw += 5; // Long tenure = established authority → subordinates are professionals
    } else if (incomeRange === "60k-100k" && yearsExperience >= 3) {
      // Mid-level manager — manages a department or function
      // Function managers (who manage a department or function rather than people)
      // qualify under EB-1C, but must demonstrate they manage an 'essential function'
      // at a senior level and are not primarily performing operational tasks.
      roleRaw = 20; // Function manager or people manager
      rfeRisk = "medium";
      if (yearsExperience >= 5) roleRaw += 3; // Some org structure evidence implied
    } else {
      // Lower seniority / income — higher risk of "working manager" problem.
      // USCIS has increased scrutiny of 'working managers' since January 2025.
      // If you spend significant time on operational or technical tasks alongside
      // management duties, your petition must clearly document that management
      // is your PRIMARY function.
      roleRaw = 8; // Working manager profile
      rfeRisk = "high";
      riskFactors.push(
        "USCIS has increased scrutiny of 'working managers' since January 2025. If you spend " +
        "significant time on operational or technical tasks alongside management duties, your " +
        "petition must clearly document that management is your PRIMARY function."
      );
    }
  }
  // No management role → roleRaw = 0 (hard block already in list)

  // Professional recognition bonus: strong publication/award record suggests
  // the applicant manages professionals rather than junior operational staff.
  // AAO repeatedly cites having supervisory/professional subordinates as a
  // key factor distinguishing genuine management from operational supervision.
  const hasProfessionalRecognition =
    hasPublications || hasAwards || hasMemberships || hasSpeakingEngagements || patents;
  if (hasProfessionalRecognition && roleRaw > 0 && roleRaw < 35) {
    roleRaw = Math.min(35, roleRaw + 3); // Professional context suggests qualified subordinates
  }

  const roleScore = Math.min(35, Math.max(0, roleRaw));

  // ─── RFE RISK NOTICE ──────────────────────────────────────────────────────
  //
  // 2025 specific RFE trigger: USCIS requests detailed daily responsibility
  // descriptions, decision-making authority examples, budget control evidence,
  // and specific examples of policy-setting authority. Generic job descriptions
  // and HR titles are insufficient.

  if (rfeRisk === "high") {
    riskFactors.push(
      "Your role profile carries a higher RFE risk in 2025. USCIS is requesting detailed daily " +
      "responsibility descriptions, decision-making authority examples, budget control evidence, " +
      "and specific policy-setting examples. Generic job descriptions and HR titles are insufficient."
    );
  } else if (rfeRisk === "medium") {
    riskFactors.push(
      "Function managers without direct reports must demonstrate they manage an 'essential function' " +
      "at a senior level. Include a detailed description of your function's scope, your authority " +
      "over it, and why it is essential to the organization."
    );
  }

  // ─── TOTAL SCORE ──────────────────────────────────────────────────────────
  //
  // Direct sum of three components:
  //   Corporate (0–35) + Employment (0–30) + Role (0–35) = 0–100

  let total = Math.min(100, corporateScore + employmentScore + roleScore);

  // Hard block caps: each unresolved block cuts the ceiling significantly
  if (hardBlocks.length > 0) {
    total = Math.min(total, 30 * (3 - hardBlocks.length));
  }

  // Prior overstay: cap at 50 (green card adjudication — more severe impact)
  if (hasOverstay) {
    total = Math.min(total, 50);
    riskFactors.push(
      "A prior U.S. visa overstay is a serious bar to any immigration benefit. " +
      "Consult an immigration attorney about potential waivers before filing."
    );
  }

  // Prior denial: cap at 65
  if (hasDenial) {
    total = Math.min(total, 65);
    riskFactors.push(
      "A prior visa denial will be reviewed by USCIS. Document what has materially changed since then."
    );
  }

  // ─── FACTORS (for UI display) ─────────────────────────────────────────────
  //
  // Maps component scores to 0–100 scale so weight × score reproduces the total:
  //   0.35 × (corporateScore/35 × 100)  = corporateScore  ✓
  //   0.30 × (employmentScore/30 × 100) = employmentScore ✓
  //   0.35 × (roleScore/35 × 100)       = roleScore       ✓
  //                                       ─────────────────
  //   Sum                               = total            ✓

  const factors: VisaScoringFactor[] = [
    {
      factor: "corporate_relationship",
      weight: 0.35,
      score: Math.round((corporateScore / 35) * 100),
      label: "Qualifying corporate relationship (parent/subsidiary/affiliate/branch)",
      present: corporateScore >= 25,
    },
    {
      factor: "qualifying_employment",
      weight: 0.30,
      score: Math.round((employmentScore / 30) * 100),
      label: "1+ year qualifying managerial/executive employment abroad (within last 3 years)",
      present: employmentScore >= 20,
    },
    {
      factor: "exec_managerial_capacity",
      weight: 0.35,
      score: Math.round((roleScore / 35) * 100),
      label: "Genuine executive or managerial capacity (INA § 101(a)(44))",
      present: roleScore >= 20,
    },
  ];

  // ─── SUBPATH NOTICES ──────────────────────────────────────────────────────
  //
  // Each subpath gets a specific strategic notice surfaced as contextualNotice.

  let contextualNotice: string | undefined;

  if (subpath === "l1a_to_eb1c") {
    contextualNotice = locale === "es"
      ? "Tu perfil L-1A te posiciona bien para EB-1C. L-1A a EB-1C es el camino más común para " +
        "la green card de ejecutivos multinacionales. Muchos abogados recomiendan presentar EB-1C " +
        "mientras todavía estás en estatus L-1A para conservar tu fecha de prioridad. La estructura " +
        "corporativa calificada ya está establecida — principalmente necesitas documentar tu capacidad " +
        "ejecutiva/gerencial para el I-140."
      : "Your L-1A profile positions you well for EB-1C. L-1A to EB-1C is the most common " +
        "multinational executive green card path. Many attorneys recommend filing EB-1C while still " +
        "on L-1A status to preserve your priority date. The qualifying corporate structure is already " +
        "established — you mainly need to document your executive/managerial capacity for the I-140.";
  } else if (subpath === "e2_to_eb1c") {
    contextualNotice = locale === "es"
      ? "Los inversionistas E-2 pueden transitar a EB-1C si construyen una estructura corporativa " +
        "multinacional calificada — lo que significa que el negocio en EE.UU. y una entidad " +
        "extranjera afiliada deben estar ambos activamente en operación. Esto requiere planificación " +
        "estratégica y generalmente varios años de construcción de la empresa."
      : "E-2 investors can transition to EB-1C if they build a qualifying multinational corporate " +
        "structure — meaning the U.S. business and a foreign affiliated entity are both actively " +
        "operating. This requires strategic planning and typically several years of company building.";
  }

  // ─── STRENGTHS ────────────────────────────────────────────────────────────

  if (hasUsBusinessPartner || temporaryJobSponsor || permanentJobSponsor) {
    strengths.push(
      "A qualifying corporate relationship with a U.S. entity is the structural foundation of EB-1C — you have this critical element."
    );
  }
  if (isFounder) {
    strengths.push(
      "As a founder, you have the clearest executive profile for EB-1C — full organizational authority and policy-setting discretion."
    );
  }
  if (yearsExperience >= 2) {
    strengths.push(
      "2+ years of qualifying foreign employment comfortably meets the 1-year minimum and reduces the risk of lookback window issues."
    );
  }
  if (subpath === "l1a_to_eb1c") {
    strengths.push(
      "The L-1A to EB-1C is the most established multinational green card path — 97% approval rate in FY2025. " +
      "No PERM labor certification required."
    );
  }
  if (rfeRisk === "low") {
    strengths.push(
      "Your executive profile carries a low RFE risk — a clear organizational hierarchy and documented authority are your key assets."
    );
  }
  if (longTermGoal === "permanent_residency" || longTermGoal === "citizenship_path") {
    strengths.push(
      "EB-1C grants full permanent residence — no annual cap backlog for most nationalities, and no dual-intent restrictions."
    );
  }

  // ─── WEAKNESSES ───────────────────────────────────────────────────────────

  if (!hasQualifyingStructure) {
    weaknesses.push(
      "A qualifying corporate relationship between a U.S. and foreign entity must be established before EB-1C is available."
    );
  }
  if (yearsExperience < 1) {
    weaknesses.push(
      "EB-1C requires at least 1 continuous year of qualifying employment abroad within the 3 years before filing."
    );
  }
  if (!isFounder && !hasManagementExperience) {
    weaknesses.push(
      "EB-1C requires a genuine managerial or executive role. Individual contributor or technical roles do not qualify."
    );
  }
  if (rfeRisk === "high") {
    weaknesses.push(
      "Your role profile may appear as a 'working manager' to USCIS — a common denial reason. " +
      "Detailed documentation of primary management duties is essential."
    );
  }
  if (isFounder && !hasUsBusinessPartner) {
    weaknesses.push(
      "The U.S. entity must have been doing business for at least 1 year before EB-1C can be filed. " +
      "Verify this requirement is met before filing."
    );
  }

  // ─── NEXT STEPS ───────────────────────────────────────────────────────────

  nextSteps.push(
    "Consult an immigration attorney experienced in EB-1C I-140 petitions to evaluate your specific corporate structure and role."
  );
  if (!hasQualifyingStructure) {
    nextSteps.push(
      "Establish or confirm a qualifying corporate relationship (parent, subsidiary, affiliate, or branch) with a U.S. entity."
    );
  }
  nextSteps.push(
    "Document your managerial or executive role with specificity: org charts, evidence of hiring/firing authority, budget control records, and policy directives you have issued."
  );
  nextSteps.push(
    "Gather corporate relationship documentation: ownership structure, articles of incorporation for both entities, audited financials, and organizational charts."
  );
  nextSteps.push(
    "Collect 1+ year of qualifying employment records: offer letters, payroll records, and performance reviews from the foreign entity."
  );
  if (subpath === "l1a_to_eb1c") {
    nextSteps.push(
      "If on L-1A status, consider filing the I-140 now — after 3 years in the U.S. on L-1A, the qualifying year abroad may fall outside the 3-year lookback window."
    );
  }

  // ─── RECOMMENDED EVIDENCE ─────────────────────────────────────────────────

  // Corporate relationship
  recommendedEvidence.push("Corporate ownership structure documentation (stock certificates, partnership agreements, shareholder registers)");
  recommendedEvidence.push("Articles of incorporation for both foreign and U.S. entities");
  recommendedEvidence.push("Audited financial statements of both entities showing active business");
  recommendedEvidence.push("Organizational charts showing reporting structure across both entities");

  // Employment history
  recommendedEvidence.push("Employment letters confirming 1+ year in managerial/executive capacity abroad");
  recommendedEvidence.push("Payroll records or tax documents covering the qualifying period");
  recommendedEvidence.push("Performance reviews or promotion letters showing management trajectory");

  // Executive/managerial capacity
  recommendedEvidence.push("Organizational chart with reporting lines and number/level of direct reports");
  recommendedEvidence.push("Evidence of hiring/firing authority (signed offer letters, termination records)");
  recommendedEvidence.push("Budget management documentation (budget approvals, expense authority, P&L responsibility)");
  recommendedEvidence.push("Job description clearly distinguishing primary management duties from any operational functions");
  recommendedEvidence.push("Specific examples of policy-setting decisions and their organizational impact");

  // ─── RETURN ───────────────────────────────────────────────────────────────

  return {
    visaType: "eb1c",
    totalScore: Math.round(Math.min(100, total)),
    confidence: hardBlocks.length > 0 ? "not_applicable" : mapConfidence(total),
    meetsMinimumThreshold: hardBlocks.length === 0 && total >= MINIMUM_THRESHOLD,
    dualIntentRisk: false,       // EB-1C is immigrant — no dual intent concern
    l1AEligible: subpath === "l1a_to_eb1c",
    eb1cSubpath: subpath,
    ageOutWarning: !!dependentAges?.some((age) => age >= 19 && age <= 21),
    contextualNotice,
    factors,
    strengths,
    weaknesses,
    riskFactors,
    nextSteps,
    recommendedEvidence,
    processingTimeMonths: [8, 24],
    estimatedCostUsd: [4000, 10000],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// BLOCKED RESULT
// All three hard structural requirements are missing simultaneously.
// ─────────────────────────────────────────────────────────────────────────────
function buildBlockedResult(
  answers: Partial<QuizAnswers>,
  hardBlocks: string[],
  locale = "en"
): VisaResult {
  return {
    visaType: "eb1c",
    totalScore: 0,
    confidence: "not_applicable",
    meetsMinimumThreshold: false,
    dualIntentRisk: false,
    l1AEligible: false,
    eb1cSubpath: "direct",
    ageOutWarning: !!answers.dependentAges?.some((age) => age >= 19 && age <= 21),
    factors: [],
    strengths: [],
    weaknesses: hardBlocks,
    riskFactors: hardBlocks,
    nextSteps: [
      "Explore whether your company has or can establish a qualifying U.S. entity (parent, subsidiary, or affiliate) to create the corporate structure EB-1C requires.",
      "If you are a multinational manager with 1+ year abroad, consult an attorney — a qualifying structure may be achievable.",
      "Consider L-1A as an intermediate step: establish a U.S. entity, transfer on L-1A, then file EB-1C after the U.S. company has been in business for 1 year.",
      "If you have extraordinary ability, EB-1A (self-petition, no corporate structure needed) may be an alternative green card path.",
    ],
    recommendedEvidence: [],
    processingTimeMonths: [8, 24],
    estimatedCostUsd: [4000, 10000],
  };
}
