// ─────────────────────────────────────────────────────────────────────────────
// L-1 Intracompany Transferee Visa Scorer
// ─────────────────────────────────────────────────────────────────────────────
//
// Legal basis: INA § 101(a)(15)(L); 8 CFR § 214.2(l)
// USCIS Policy Manual Vol. 2, Part L
//
// L-1A max stay: 7 years. L-1B max stay: 5 years.
// New office initial approval: 1 year only.
// L-1A → EB-1C green card path: no PERM, no lottery.
// L-1B denial rates significantly elevated in 2025.
//
// Key 2025 trend: USCIS demanding proof that L-1B knowledge is
//   distinct from general industry knowledge and not easily
//   transferable to other employers.
//
// L-1B heightened scrutiny began significantly in 2025 per
//   multiple immigration attorney reports.
//
// No annual cap, no lottery — key advantage vs H-1B.
//
// L-1A is more stable but requires genuine managerial/executive
//   duties with real organizational authority.
//
// New office L-1 (U.S. office < 1 year) gets only 1-year
//   initial approval and faces heavier scrutiny.
//
// Both subcategories require:
//   (1) qualifying corporate relationship (≥ 50% common ownership/control)
//   (2) 1 continuous year of employment abroad within the last 3 years
//   (3) transferring to U.S. in same or related capacity
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
// Three-component additive scoring model reflecting USCIS evaluation logic:
//   Component 1 — Qualifying Corporate Relationship  (0–35)
//   Component 2 — Qualifying Employment              (0–30)
//   Component 3 — Role Qualification (L-1A or L-1B) (0–35)
//   ─────────────────────────────────────────────────────────
//   Total                                            (0–100)
//
export function scoreL1(answers: Partial<QuizAnswers>, locale = "en"): VisaResult {
  const {
    isFounder              = false,
    hasManagementExperience = false,
    hasUsBusinessPartner   = false,
    temporaryJobSponsor    = false,
    yearsExperience        = 0,
    hasCertifications      = false,
    hasPublications        = false,
    hasJudgingExperience   = false,
    hasPortfolio           = false,
    patents                = false,
    recognitionBeyondEmployer = false,
    incomeRange            = "<30k",
    hasOverstay            = false,
    hasDenial              = false,
    longTermGoal           = "temporary_visit",
    dependentAges,
  } = answers;

  const riskFactors: string[] = [];
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const nextSteps: string[] = [];
  const recommendedEvidence: string[] = [];

  // ─── SUBCATEGORY DETECTION ────────────────────────────────────────────────
  //
  // L-1A: manager or executive with real organizational authority
  // L-1B: specialized knowledge worker with proprietary company knowledge
  //
  // Detection priority: L-1A takes precedence when both signals are present
  // because L-1A has higher approval rates and opens the EB-1C green card path.

  const isL1ACandidate = isFounder || hasManagementExperience;

  // L-1B specialized knowledge signals:
  // Knowledge must be proprietary to the company — not general industry knowledge.
  // Patents are the strongest single signal of truly proprietary knowledge.
  const hasStrongSpecializedKnowledge =
    patents === true ||
    (hasPublications && hasCertifications) ||
    (hasPublications && hasPortfolio);
  const hasWeakSpecializedKnowledge =
    hasCertifications || hasPublications || hasPortfolio || hasJudgingExperience || recognitionBeyondEmployer;

  const isL1BCandidate = hasStrongSpecializedKnowledge || hasWeakSpecializedKnowledge;

  type Subcategory = "L1A" | "L1B" | "unclear";
  const subcategory: Subcategory = isL1ACandidate
    ? "L1A"
    : isL1BCandidate
    ? "L1B"
    : "unclear";

  // ─── HARD BLOCKS ─────────────────────────────────────────────────────────
  //
  // Without all three hard requirements, L-1 is unavailable.

  const hardBlocks: string[] = [];

  // Hard block 1: No qualifying corporate relationship
  const hasQualifyingRelationship = hasUsBusinessPartner || temporaryJobSponsor || isFounder;
  if (!hasQualifyingRelationship) {
    hardBlocks.push(
      "L-1 requires a parent, subsidiary, affiliate, or branch relationship between " +
      "your current employer and a U.S. entity. Without this, L-1 is not available."
    );
  }

  // Hard block 2: Less than 1 year of continuous employment abroad
  if (yearsExperience < 1) {
    hardBlocks.push(
      "L-1 requires at least 1 continuous year working abroad for the qualifying " +
      "organization within the 3 years before the U.S. transfer."
    );
  }

  // Hard block 3: No qualifying role (neither L-1A nor L-1B)
  if (subcategory === "unclear") {
    hardBlocks.push(
      "L-1 requires either a genuine managerial/executive role (L-1A) or proprietary " +
      "specialized knowledge (L-1B). Your role type determines which category applies."
    );
  }

  // Push hard block text into riskFactors so the UI can surface it
  hardBlocks.forEach((b) => riskFactors.push(b));

  // Short-circuit: if ALL three hard blocks are present, return blocked result immediately
  if (hardBlocks.length >= 3) {
    return buildBlockedResult(answers, hardBlocks);
  }

  // ─── COMPONENT 1: QUALIFYING CORPORATE RELATIONSHIP (0–35) ───────────────
  //
  // This is a hard structural requirement. Without a qualifying relationship
  // (parent, subsidiary, affiliate, or branch — ≥ 50% common ownership/control),
  // L-1 is not available regardless of the applicant's qualifications.
  //
  // Qualifying relationship types all earn the full +35:
  //   Parent company, Subsidiary, Affiliate, Branch office

  let corporateRaw = 0;

  if (hasUsBusinessPartner || temporaryJobSponsor) {
    // Established qualifying relationship with named U.S. entity
    corporateRaw = 35;
  } else if (isFounder) {
    // Founder can establish a new U.S. office — but new office petitions receive
    // only a 1-year initial approval (not 3 years) and face heavier documentation
    // requirements: realistic business plan, lease, funding evidence.
    // New U.S. office L-1 petitions receive a 1-year initial approval (not 3 years).
    // Renewal requires proving the office is operational and the manager/executive
    // role is established.
    corporateRaw = 35 - 10; // New office penalty: -10
    riskFactors.push(
      "New U.S. office L-1 petitions receive only a 1-year initial approval (not 3 years). " +
      "Renewal requires proving the office is operational and that a genuine " +
      "managerial/executive role has been established."
    );
  }
  // No qualifying relationship → corporateRaw stays 0 (hard block already added above)

  const corporateScore = Math.min(35, corporateRaw);

  // ─── COMPONENT 2: QUALIFYING EMPLOYMENT (0–30) ───────────────────────────
  //
  // Requirement: 1 continuous year employed abroad with the qualifying
  // organization WITHIN the 3 years before the U.S. transfer.
  // Officers scrutinize gaps and verify the continuity of employment.

  let employmentRaw = 0;

  if (yearsExperience >= 2) {
    employmentRaw = 30; // 2+ years within last 3 — well above threshold
  } else if (yearsExperience >= 1) {
    // 1–2 years: meets the minimum but officers may request additional continuity evidence
    // "Exactly 1 year of qualifying employment is the minimum threshold.
    // Document the continuous nature of your employment carefully."
    employmentRaw = yearsExperience >= 1.5 ? 22 : 15;
    if (yearsExperience < 1.5) {
      riskFactors.push(
        "Your qualifying employment period is close to the 1-year minimum threshold. " +
        "Document the continuous nature of your employment carefully — any gaps " +
        "could jeopardize eligibility."
      );
    }
  }
  // < 1 year → employmentRaw = 0 (hard block already added above)

  // Capacity matching: same capacity abroad → U.S. (no penalty assumed when roles align)
  // Different capacity would incur -5 to -15, but we cannot determine this from
  // available data — default to same capacity (best case for the applicant).

  const employmentScore = Math.min(30, employmentRaw);

  // ─── COMPONENT 3: ROLE QUALIFICATION (0–35) ──────────────────────────────
  //
  // Scored separately for L-1A and L-1B based on the detected subcategory.

  let roleRaw = 0;
  let subcategoryNotice = "";
  let greenCardPathNotice: string | undefined;

  if (subcategory === "L1A") {
    // ── L-1A: MANAGERIAL OR EXECUTIVE ROLE ──────────────────────────────────
    //
    // USCIS scrutinizes whether management is genuine.
    // Common denial reason: "working manager" who performs non-managerial
    // duties alongside management duties.
    // Must show: authority to hire/fire, budget control, or direction of
    // organizational policy.
    //
    // Scoring reflects the organizational level of authority:

    if (isFounder) {
      // Founders direct the entire organization — clearest executive role
      roleRaw = 35; // Manages organizational strategy, hires/fires, controls budget
    } else if (hasManagementExperience) {
      // Non-founder managers — evaluate depth by income (proxy for seniority)
      // and experience level
      if (incomeRange === "200k+" || incomeRange === "100k-200k") {
        roleRaw = 32; // Senior manager or director — likely manages other managers
      } else if (incomeRange === "60k-100k" && yearsExperience >= 3) {
        roleRaw = 25; // Mid-level manager of a function or department
      } else {
        roleRaw = 15; // Manages staff but organizational authority may be questioned
        riskFactors.push(
          "USCIS will scrutinize whether your management role involves genuine authority " +
          "(hiring/firing, budget control, policy direction) or primarily operational duties. " +
          "Document your organizational authority carefully."
        );
      }
    }
    // No managerial role → roleRaw = 0 (hard block already in list)

    subcategoryNotice =
      "L-1A approval requires demonstrating genuine managerial or executive authority — " +
      "not just a management title. Document your ability to hire, fire, set budgets, or " +
      "direct organizational policy. Org charts, reporting structures, and payroll " +
      "evidence are critical.";

    // L-1A → EB-1C green card path: one of the most strategic immigration benefits.
    // No labor certification (PERM), no lottery — direct path for qualifying managers.
    if (locale === "es") {
      greenCardPathNotice =
        "Los titulares de L-1A pueden calificar para la green card EB-1C (Ejecutivo o Gerente " +
        "Multinacional) sin certificación laboral. Es uno de los caminos más rápidos hacia la " +
        "residencia permanente para gerentes y ejecutivos calificados. Consulte a un abogado " +
        "sobre su elegibilidad para EB-1C mientras está en estatus L-1A.";
    } else {
      greenCardPathNotice =
        "L-1A holders may qualify for the EB-1C green card (Multinational Executive or Manager) " +
        "without a labor certification. This is one of the fastest green card paths for qualifying " +
        "managers and executives. Ask an attorney about your EB-1C eligibility while on L-1A status.";
    }

  } else if (subcategory === "L1B") {
    // ── L-1B: SPECIALIZED KNOWLEDGE ─────────────────────────────────────────
    //
    // L-1B specialized knowledge standard (8 CFR § 214.2(l)):
    // Knowledge must be: (1) special or advanced, AND
    // (2) proprietary to the company's products/services/procedures, OR
    // (3) an advanced level of knowledge of the organization's processes.
    //
    // CRITICAL: must be DISTINCT from general industry knowledge and not
    // easily obtainable elsewhere or transferable to other employers.
    //
    // Most common L-1B denial in 2025-2026:
    // "The petitioner has not established that the beneficiary's knowledge
    // is distinct from general industry knowledge."

    if (patents === true) {
      // Patents are the strongest single signal of truly proprietary knowledge
      roleRaw = 35;
    } else if (hasPublications && hasCertifications) {
      roleRaw = 28; // Strong proprietary signal — documents authored + certified expertise
    } else if (hasPublications && hasPortfolio) {
      roleRaw = 25; // Published work + demonstrable output
    } else if (hasStrongSpecializedKnowledge) {
      roleRaw = 25; // Multiple strong signals
    } else if (hasWeakSpecializedKnowledge) {
      // Some signals present but may not clear the "distinct from general industry" bar
      roleRaw = 20;
      riskFactors.push(
        "L-1B faces the highest denial rate of any L-1 subcategory in 2025. " +
        "USCIS requires proof that your knowledge is truly specialized and proprietary — " +
        "not just advanced general industry expertise."
      );
    }
    // recognitionBeyondEmployer is a minor positive signal for L-1B
    if (recognitionBeyondEmployer && roleRaw > 0 && roleRaw < 35) {
      roleRaw = Math.min(35, roleRaw + 3);
    }

    subcategoryNotice =
      "L-1B faces the highest denial rate of any L-1 subcategory. USCIS requires proof " +
      "that your knowledge is truly specialized and proprietary — not just advanced general " +
      "industry expertise. Patents, technical manuals you authored, and detailed descriptions " +
      "of proprietary systems are the strongest evidence.";

  } else {
    // subcategory === "unclear"
    // Neither L-1A nor L-1B clearly established — score with significant uncertainty penalty
    const bestL1AScore = (isFounder ? 35 : hasManagementExperience ? 20 : 0);
    const bestL1BScore = hasStrongSpecializedKnowledge ? 25 : hasWeakSpecializedKnowledge ? 15 : 0;
    roleRaw = Math.round(Math.max(bestL1AScore, bestL1BScore) * 0.70);

    subcategoryNotice =
      "L-1 requires either a managerial/executive role (L-1A) or specialized knowledge " +
      "(L-1B). Your role type determines which category applies and significantly affects " +
      "approval chances. Consulting an immigration attorney to determine your subcategory " +
      "before filing is strongly recommended.";
  }

  const roleScore = Math.min(35, Math.max(0, roleRaw));

  // ─── TOTAL SCORE ──────────────────────────────────────────────────────────
  //
  // Direct sum of three components:
  //   Corporate (0–35) + Employment (0–30) + Role (0–35) = 0–100

  let total = Math.min(100, corporateScore + employmentScore + roleScore);

  // Apply hard block caps: each unresolved block significantly reduces the score
  if (hardBlocks.length > 0) {
    total = Math.min(total, 30 * (3 - hardBlocks.length));
  }

  // Prior overstay: serious complication — cap at 55
  if (hasOverstay) {
    total = Math.min(total, 55);
    riskFactors.push(
      "A prior U.S. visa overstay complicates any U.S. visa petition. " +
      "Consult an immigration attorney about waivers or remediation."
    );
  }

  // Prior denial: requires explanation — cap at 65
  if (hasDenial) {
    total = Math.min(total, 65);
    riskFactors.push(
      "A prior visa denial will be reviewed by USCIS. Be prepared to document " +
      "what has materially changed since the prior denial."
    );
  }

  // ─── FACTORS (for UI display) ─────────────────────────────────────────────
  //
  // Each factor maps its component score onto a 0–100 scale so that
  // weight × score(0–100) reproduces the component's contribution to the total:
  //   0.35 × (corporateScore/35 × 100)   = corporateScore   ✓
  //   0.30 × (employmentScore/30 × 100)  = employmentScore  ✓
  //   0.35 × (roleScore/35 × 100)        = roleScore        ✓
  //                                        ─────────────────
  //   Sum                                = total             ✓

  const subcategoryLabel =
    subcategory === "L1A"
      ? "L-1A (managerial/executive) role qualification"
      : subcategory === "L1B"
      ? "L-1B (specialized knowledge) role qualification"
      : "Role qualification (subcategory unclear)";

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
      label: "1+ year qualifying employment abroad within last 3 years",
      present: employmentScore >= 20,
    },
    {
      factor: "role_qualification",
      weight: 0.35,
      score: Math.round((roleScore / 35) * 100),
      label: subcategoryLabel,
      present: roleScore >= 20,
    },
  ];

  // ─── STRENGTHS ────────────────────────────────────────────────────────────

  if (hasUsBusinessPartner || temporaryJobSponsor) {
    strengths.push(
      "A qualifying U.S. entity relationship is the structural foundation of L-1 — you have this critical element."
    );
  }
  if (isFounder) {
    strengths.push(
      "As a founder, you may qualify for L-1A as an executive — the strongest L-1 subcategory with a path to EB-1C."
    );
  }
  if (yearsExperience >= 2) {
    strengths.push(
      "2+ years of qualifying foreign employment comfortably meets the 1-year minimum threshold."
    );
  }
  if (subcategory === "L1A" && (isFounder || hasManagementExperience)) {
    strengths.push(
      "L-1A (managerial/executive) has significantly higher approval rates than L-1B and opens the EB-1C green card path."
    );
  }
  if (subcategory === "L1B" && patents) {
    strengths.push(
      "Patent filings or grants are the strongest evidence of proprietary specialized knowledge for L-1B."
    );
  }
  if (
    longTermGoal !== "permanent_residency" &&
    longTermGoal !== "citizenship_path"
  ) {
    strengths.push(
      "L-1 has no annual cap, no lottery, and no labor certification — significant advantages over H-1B and EB-2 PERM."
    );
  }

  // ─── WEAKNESSES ───────────────────────────────────────────────────────────

  if (!hasQualifyingRelationship) {
    weaknesses.push(
      "A qualifying corporate relationship (parent, subsidiary, affiliate, or branch) is required — " +
      "this must be established before filing."
    );
  }
  if (yearsExperience < 1) {
    weaknesses.push(
      "L-1 requires at least 1 continuous year of employment abroad with the qualifying organization " +
      "within the 3 years before the transfer."
    );
  }
  if (subcategory === "L1B" && !hasStrongSpecializedKnowledge) {
    weaknesses.push(
      "L-1B specialized knowledge must be clearly proprietary — not general industry expertise. " +
      "Additional documentation of unique, company-specific knowledge is essential."
    );
  }
  if (subcategory === "unclear") {
    weaknesses.push(
      "Your role must clearly qualify as either L-1A (managerial/executive) or L-1B (specialized knowledge). " +
      "An ambiguous role profile increases denial risk significantly."
    );
  }
  if (isFounder && !hasUsBusinessPartner && !temporaryJobSponsor) {
    weaknesses.push(
      "A new U.S. office petition receives only a 1-year initial approval and requires a detailed " +
      "business plan, lease evidence, and proof of adequate funding."
    );
  }

  // ─── CONTEXTUAL NOTICE ────────────────────────────────────────────────────
  //
  // For L-1A: surface the EB-1C green card path (highest strategic value).
  // For L-1B: surface the heightened scrutiny warning.
  // For unclear: surface the subcategory determination notice.

  const contextualNotice =
    greenCardPathNotice ??
    (subcategory === "L1B" ? subcategoryNotice : undefined);

  // ─── NEXT STEPS ───────────────────────────────────────────────────────────

  if (!hasQualifyingRelationship) {
    nextSteps.push(
      "Establish or identify a qualifying corporate relationship between your foreign employer " +
      "and a U.S. entity (parent, subsidiary, affiliate, or branch)."
    );
  }
  nextSteps.push(
    "Work with an immigration attorney to determine whether L-1A or L-1B applies to your specific role."
  );
  nextSteps.push(
    "Gather corporate documentation: ownership structure, articles of incorporation for both entities, " +
    "financial statements, and organizational charts."
  );
  nextSteps.push(
    "Collect 1+ year employment records from the foreign entity: offer letters, payroll records, tax documents."
  );
  if (subcategory === "L1A") {
    nextSteps.push(
      "Document your managerial authority: org charts with reporting lines, evidence of hiring/firing authority, " +
      "budget management records."
    );
    nextSteps.push(
      "Ask an immigration attorney about your EB-1C green card eligibility — L-1A holders can petition " +
      "for permanent residence as multinational executives or managers without labor certification."
    );
  }
  if (subcategory === "L1B") {
    nextSteps.push(
      "Prepare detailed documentation of proprietary knowledge: technical manuals you authored, " +
      "patent filings, proprietary system descriptions, and a senior management letter explaining " +
      "why your knowledge is unique and unavailable in the U.S. labor market."
    );
  }
  if (isFounder && !hasUsBusinessPartner) {
    nextSteps.push(
      "Develop a detailed U.S. business plan demonstrating realistic prospects for a viable U.S. operation."
    );
  }

  // ─── RECOMMENDED EVIDENCE ─────────────────────────────────────────────────

  // Corporate relationship
  recommendedEvidence.push("Corporate ownership structure documentation (stock certificates, partnership agreements)");
  recommendedEvidence.push("Articles of incorporation for both foreign and U.S. entities");
  recommendedEvidence.push("Audited financial statements of both entities");
  recommendedEvidence.push("Organizational charts showing reporting structure");

  // Employment history
  recommendedEvidence.push("Employment letters confirming 1+ year of qualifying employment abroad");
  recommendedEvidence.push("Payroll records or tax documents covering the qualifying period");
  recommendedEvidence.push("Performance reviews or promotion letters");

  // Role-specific evidence
  if (subcategory === "L1A") {
    recommendedEvidence.push("Organizational chart with reporting lines and number of direct reports");
    recommendedEvidence.push("Evidence of hiring/firing authority (signed offer letters, termination letters)");
    recommendedEvidence.push("Budget management documentation (budget approvals, expense authority)");
    recommendedEvidence.push("Job description clearly distinguishing managerial from operational duties");
  } else if (subcategory === "L1B") {
    recommendedEvidence.push("Technical manuals or documentation authored by the applicant");
    if (patents) {
      recommendedEvidence.push("Patent filings or grants demonstrating proprietary knowledge");
    }
    recommendedEvidence.push("Proprietary system descriptions — architecture, design documents, process maps");
    recommendedEvidence.push("Senior management letter explaining uniqueness of knowledge and why it is not available in the U.S. labor market");
  }

  if (isFounder && !hasUsBusinessPartner) {
    recommendedEvidence.push("Detailed U.S. business plan with financial projections (1–2 years)");
    recommendedEvidence.push("U.S. office lease or lease commitment letter");
    recommendedEvidence.push("Evidence of adequate capitalization for U.S. operations");
  }

  // ─── RETURN ───────────────────────────────────────────────────────────────

  return {
    visaType: "L-1",
    totalScore: Math.round(Math.min(100, total)),
    confidence: hardBlocks.length > 0 ? "not_applicable" : mapConfidence(total),
    meetsMinimumThreshold: hardBlocks.length === 0 && total >= MINIMUM_THRESHOLD,
    l1AEligible: subcategory === "L1A",
    ageOutWarning: !!dependentAges?.some((age) => age >= 19 && age <= 21),
    contextualNotice,
    factors,
    strengths,
    weaknesses,
    riskFactors,
    nextSteps,
    recommendedEvidence,
    processingTimeMonths: [2, 6],
    estimatedCostUsd: [2000, 7000],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// BLOCKED RESULT
// Used when all three hard structural requirements are missing simultaneously.
// ─────────────────────────────────────────────────────────────────────────────
function buildBlockedResult(
  answers: Partial<QuizAnswers>,
  hardBlocks: string[]
): VisaResult {
  return {
    visaType: "L-1",
    totalScore: 0,
    confidence: "not_applicable",
    meetsMinimumThreshold: false,
    l1AEligible: false,
    ageOutWarning: !!answers.dependentAges?.some((age) => age >= 19 && age <= 21),
    factors: [],
    strengths: [],
    weaknesses: hardBlocks,
    riskFactors: hardBlocks,
    nextSteps: [
      "Explore forming a U.S. entity (subsidiary or affiliate) related to your foreign business to create a qualifying L-1 relationship.",
      "If you have specialty occupation skills, consider H-1B as an alternative.",
      "If you are from a treaty country with sufficient capital, explore E-2 investor visa.",
      "Consult an immigration attorney to map the fastest path to a U.S. work authorization for your specific situation.",
    ],
    recommendedEvidence: [],
    processingTimeMonths: [2, 6],
    estimatedCostUsd: [2000, 7000],
  };
}
