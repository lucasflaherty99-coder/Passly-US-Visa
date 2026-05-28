// ─────────────────────────────────────────────────────────────────────────────
// J-1 — Exchange Visitor Visa
// ─────────────────────────────────────────────────────────────────────────────
//
// Legal basis: INA § 101(a)(15)(J); 22 CFR Part 62
// Two-year home residency requirement: INA § 212(e)
// December 9, 2024 Skills List update: State Dept Public Notice 12555
// Administered by U.S. Department of State — NOT USCIS.
// Official source: travel.state.gov/content/travel/en/us-visas/
//   study/exchange/exchange-visitor-visa.html
//
// 310,000+ J-1 participants annually from 200+ countries.
// FY2022: 284,486 J-1 visas issued at 88.8% approval rate.
//
// 12 J-1 SUBCATEGORIES — this scorer focuses on:
//   Research Scholar — postdoctoral or advanced researchers
//   Professor — teaching/research at U.S. institutions
//   Trainee — structured training in their professional field
//   Intern — recent graduate (enrolled or within 12 months)
//   Specialist — expert invited for knowledge exchange
//   Teacher — K-12 foreign teacher exchange
//
// TWO-YEAR HOME RESIDENCY REQUIREMENT (INA § 212(e)):
// THE most important factor to evaluate in J-1 scoring.
// Subject to the requirement if ANY of the following apply:
//   (a) Received U.S. government funding (Fulbright, USAID, etc.)
//   (b) Received home government funding for the exchange
//   (c) Field of study/work is on home country's Skills List
//   (d) Participated in graduate medical education (GME) training
// If subject: cannot change to H-1B, L-1, or apply for any
//   immigrant visa until either:
//   - Returns home for 2 years, OR
//   - Obtains a waiver (Form DS-3035)
//
// DECEMBER 9, 2024 STATE DEPT UPDATE (Public Notice 12555):
// Retroactively removed many countries from Exchange Visitor
// Skills List. Key removals relevant to app target audience:
//   China, India, Brazil, Turkey, South Korea REMOVED.
//   This is retroactive — J-1 holders already in the U.S.
//   from these countries may no longer be subject to 212(e)
//   based solely on Skills List criteria.
//   (Still subject if received government funding or in GME.)
// Most Latin American countries were already absent from the
//   Skills List for most fields — this primarily benefits
//   Indian, Chinese, and Brazilian applicants.
//
// 12/24-MONTH BAR for Research Scholar and Professor:
//   Cannot begin a new J-1 Research Scholar or Professor
//   program within 12 or 24 months of completing a prior
//   J-1 in those same categories.
//   Does NOT affect other J-1 subcategories.
//
// WAIVER PATHS for 212(e) if subject to requirement:
//   1. No objection statement from home government
//   2. Interested U.S. government agency waiver
//   3. Persecution / exceptional hardship (Form I-612 via USCIS)
//   4. Conrad State 30 program — physicians practice in
//      medically underserved area for 3 years (MDs only)
//
// This scoring is educational only — not legal advice.
// ─────────────────────────────────────────────────────────────────────────────

import type { QuizAnswers, VisaResult, VisaScoringFactor } from "@/lib/types";
import { mapConfidence } from "./engine";

// Display threshold: 50+ AND no hard blocks
// "Strong match":    75–100
// "Possible pathway": 58–74
// "Worth exploring":  50–57
const MINIMUM_THRESHOLD = 50;

//
// Three-component additive scoring model:
//   Component 1 — Program Sponsor Access       (0–35)
//   Component 2 — Qualification Match          (0–35)
//   Component 3 — Two-Year Requirement Risk    (0–30)
//   ──────────────────────────────────────────────────
//   Total                                      (0–100)
//
// Component 3 is inverted: higher score = lower 212(e) risk = better.
// A certain 212(e) subject scores 0; no risk scores 25–30.
//

// ─── SUBCATEGORY DETECTION ───────────────────────────────────────────────────
//
// Detects the most likely J-1 subcategory from quiz answers.
// Focuses on subcategories relevant to the app's target audience:
// professionals, researchers, academics, and skilled trainees.

type J1Subcategory =
  | "Research Scholar"
  | "Professor"
  | "Trainee"
  | "Intern"
  | "Specialist"
  | "Teacher"
  | "General Exchange";

function detectJ1Subcategory(
  educationLevel: string,
  profession: string,
  yearsExperience: number,
  hasPublications: boolean,
  hasSpeakingEngagements: boolean,
  isCurrentlyStudying: boolean | undefined
): J1Subcategory {
  const p = profession.toLowerCase().trim();

  // Professor: PhD + academic/teaching profession
  if (
    educationLevel === "phd" &&
    /\bprofessor\b|\blecturer\b|\bfaculty\b|\bacademic\b|\buniversity\b|\bteach/.test(p)
  ) {
    return "Professor";
  }

  // Research Scholar: PhD or master's with research background
  if (
    (educationLevel === "phd" ||
      (educationLevel === "masters" &&
        (hasPublications || /\bresearch\b|\bscientist\b|\bpostdoc\b|\bscholar\b/.test(p)))) &&
    /\bresearch\b|\bscientist\b|\bpostdoc\b|\bscholar\b|\bbiolog\b|\bchemist\b|\bphysics\b|\bengine/.test(
      p
    )
  ) {
    return "Research Scholar";
  }

  // Teacher: K-12 teaching profession
  if (/\bteacher\b|\bk-12\b|\belementary\b|\bsecondary\b|\bhigh school\b|\bprimary school\b/.test(p)) {
    return "Teacher";
  }

  // Intern: currently enrolled student or very recent graduate (< 2 years)
  if (isCurrentlyStudying || yearsExperience < 2) {
    return "Intern";
  }

  // Specialist: recognized expert with notable credentials but not full researcher
  if (
    yearsExperience >= 5 &&
    (hasSpeakingEngagements || hasPublications) &&
    educationLevel !== "none" &&
    educationLevel !== "high_school"
  ) {
    return "Specialist";
  }

  // Trainee: professional mid-career, structured training in their field
  if (yearsExperience >= 1 && yearsExperience < 8) {
    return "Trainee";
  }

  return "General Exchange";
}

// ─── 212(e) TWO-YEAR HOME RESIDENCY RISK ASSESSMENT ─────────────────────────
//
// Assesses the applicant's risk of being subject to INA § 212(e).
// Returns a score (higher = lower risk = better outcome) and a risk level.
//
// POST-DECEMBER 2024 STATUS:
// Countries removed from Skills List (Public Notice 12555) — lower risk
//   from skills list criteria, but government funding still triggers 212(e).
// Most Latin American countries were already absent from most fields.
//
// NOTE: The quiz does not capture J-1 funding source explicitly.
// We assess risk based on profession (GME detection), nationality
// (Skills List status), and subcategory (academic → higher risk).
// Always advise verification with sponsor or attorney.

type TwoYearRiskLevel = "none" | "possible" | "likely" | "certain";

interface TwoYearRiskResult {
  level: TwoYearRiskLevel;
  score: number;
}

// Countries removed from Exchange Visitor Skills List in Dec 9, 2024 update.
// Their nationals may no longer be subject to 212(e) based solely on skills
// list criteria — but government funding still independently triggers 212(e).
const REMOVED_FROM_SKILLS_LIST_DEC_2024 = new Set([
  "china",
  "china (mainland)",
  "china, mainland",
  "india",
  "brazil",
  "brasil",
  "turkey",
  "türkiye",
  "south korea",
  "korea, south",
  "republic of korea",
]);

// Latin American countries: generally absent from Skills List for most fields
// pre-Dec 2024 — low 212(e) skills list risk for most professions.
const LATIN_AMERICAN_COUNTRIES = new Set([
  "argentina",
  "colombia",
  "mexico",
  "méxico",
  "venezuela",
  "chile",
  "peru",
  "perú",
  "ecuador",
  "bolivia",
  "paraguay",
  "uruguay",
  "costa rica",
  "panama",
  "panamá",
  "honduras",
  "el salvador",
  "guatemala",
  "nicaragua",
  "dominican republic",
  "cuba",
  "haiti",
]);

function isGMEProfession(profession: string): boolean {
  // Graduate Medical Education: physicians in residency/fellowship
  // Always subject to 212(e) regardless of country or funding source.
  const p = profession.toLowerCase();
  return /\bresident\b|\bfellowship\b|\bmedical.*train|\bphysician.*train|\bresidency\b/.test(p);
}

function assess212eRisk(
  nationality: string,
  profession: string,
  subcategory: J1Subcategory
): TwoYearRiskResult {
  const n = nationality.trim().toLowerCase();

  // GME programs (medical residency/fellowship) always trigger 212(e)
  // regardless of nationality, funding source, or skills list status.
  if (isGMEProfession(profession)) {
    return { level: "likely", score: 2 };
  }

  // Latin American countries: low Skills List risk for most fields.
  // Government funding (Fulbright) would still trigger — flagged separately.
  if (LATIN_AMERICAN_COUNTRIES.has(n)) {
    if (subcategory === "Research Scholar" || subcategory === "Professor") {
      // Academic J-1 programs commonly involve funding that may trigger 212(e)
      return { level: "possible", score: 18 };
    }
    return { level: "possible", score: 25 };
  }

  // Countries removed from Skills List in Dec 2024:
  // Reduced 212(e) exposure from skills criteria — still "possible" because
  // government funding can independently trigger the requirement.
  if (REMOVED_FROM_SKILLS_LIST_DEC_2024.has(n)) {
    if (subcategory === "Research Scholar" || subcategory === "Professor") {
      return { level: "possible", score: 15 };
    }
    return { level: "possible", score: 22 };
  }

  // Countries with unknown Skills List status (may still be on list):
  // Default to "possible" — advise verification with sponsor/attorney.
  if (subcategory === "Research Scholar" || subcategory === "Professor") {
    return { level: "possible", score: 10 };
  }
  return { level: "possible", score: 20 };
}

// ─── MAIN SCORER ─────────────────────────────────────────────────────────────

export function scoreJ1(answers: Partial<QuizAnswers>, locale = "en"): VisaResult {
  const {
    nationality            = "",
    profession             = "",
    educationLevel         = "none",
    yearsExperience        = 0,
    hasPublications        = false,
    hasSpeakingEngagements = false,
    hasAwards              = false,
    hasCertifications      = false,
    isCurrentlyStudying    = undefined,
    temporaryJobSponsor    = false,
    permanentJobSponsor    = false,
    hasUsSponsor           = false,
    hasUsBusinessPartner   = false,
    hasUniversityAcceptance = false,
    hasDenial              = false,
    hasOverstay            = false,
    longTermGoal           = "temporary_visit",
    intent                 = "not_sure",
    dependentAges,
  } = answers;

  const riskFactors: string[] = [];
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const nextSteps: string[] = [];
  const recommendedEvidence: string[] = [];

  // ─── SUBCATEGORY DETECTION ──────────────────────────────────────────────

  const subcategory = detectJ1Subcategory(
    educationLevel,
    profession,
    yearsExperience,
    hasPublications,
    hasSpeakingEngagements,
    isCurrentlyStudying
  );

  // ─── 212(e) TWO-YEAR RISK ASSESSMENT ────────────────────────────────────

  const { level: twoYearRiskLevel, score: riskRaw } = assess212eRisk(
    nationality,
    profession,
    subcategory
  );

  // ─── HARD BLOCKS ─────────────────────────────────────────────────────────
  //
  // J-1 has no categorical eligibility hard blocks (unlike TN or EB-1C).
  // Prior overstay / denial are risk factors rather than absolute bars.
  // The main practical barrier — no sponsor — reduces score but does not block.

  const hardBlocks: string[] = [];

  // Check for unfulfilled 212(e): if the applicant has had a prior J-1 AND
  // is asking about H/L/immigrant visas AND twoYearRisk is "likely/certain",
  // this is a potential soft block. We encode as a risk factor, not a hard block,
  // since we cannot definitively determine prior J-1 status from quiz answers.

  // ─── COMPONENT 1: PROGRAM SPONSOR ACCESS (0–35) ──────────────────────────
  //
  // J-1 requires acceptance into a State Dept-designated exchange program.
  // The sponsoring organization issues the DS-2019 form.
  // Without DS-2019, no J-1 application is possible.
  // Sponsors include: universities, research institutions, government agencies,
  //   hospitals, private exchange organizations, and corporations.
  //
  // The DS-2019 defines: program category, funding source, start/end dates.
  // Funding source on DS-2019 determines 212(e) exposure — critical.

  let sponsorRaw = 0;

  if (hasUniversityAcceptance) {
    // University acceptance strongly implies DS-2019 access for academic J-1
    sponsorRaw = 30;
    strengths.push(
      "University or institutional acceptance is the strongest signal of access to a DS-2019 " +
        "sponsoring organization — the essential prerequisite for any J-1 exchange program."
    );
  } else if (temporaryJobSponsor || permanentJobSponsor || hasUsSponsor) {
    // U.S. organization has confirmed interest or sponsorship
    sponsorRaw = 25;
    strengths.push(
      "A confirmed relationship with a U.S. organization suggests access to exchange program " +
        "sponsorship. Confirm whether the organization is a State Dept-designated J-1 sponsor."
    );
  } else if (hasUsBusinessPartner) {
    // Business connection — may lead to corporate J-1 trainee sponsorship
    sponsorRaw = 18;
    weaknesses.push(
      "A confirmed U.S. exchange program sponsor is required before the J-1 process can begin. " +
        "Verify whether the U.S. organization is authorized to issue DS-2019 forms."
    );
  } else {
    // No sponsor access identified — significant practical barrier
    sponsorRaw = 5;
    weaknesses.push(
      "J-1 requires acceptance into a State Department-approved exchange program. The sponsoring " +
        "organization issues the DS-2019 form — you cannot apply for J-1 without it. Universities, " +
        "research institutions, hospitals, and private exchange programs all serve as sponsors."
    );
    nextSteps.push(
      "Research State Dept-approved J-1 sponsor organizations in your field. University international " +
        "exchange offices, research institutes, and programs like Fulbright are common entry points."
    );
  }

  // Additional sponsor score based on subcategory-specific context
  if (subcategory === "Research Scholar" || subcategory === "Professor") {
    if (hasPublications || hasSpeakingEngagements) {
      sponsorRaw = Math.min(35, sponsorRaw + 5); // Strong academic profile attracts invitations
    }
  }

  const sponsorScore = Math.min(35, sponsorRaw);

  // ─── COMPONENT 2: QUALIFICATION MATCH (0–35) ──────────────────────────────
  //
  // Each J-1 subcategory has different qualification requirements.
  // Research Scholar: requires advanced degree + research background.
  // Professor: requires doctoral-level credentials + university role.
  // Trainee: degree or equivalent + 1 year professional experience
  //   (or 5 years experience without degree).
  // Intern: currently enrolled or graduated within 12 months.
  // Specialist: recognized expert in specialized field.
  // Teacher: teaching credential + 2 years of full-time teaching abroad.

  let qualificationRaw = 0;

  switch (subcategory) {
    case "Research Scholar":
      // PhD + postdoctoral research background → strongest match
      if (educationLevel === "phd") {
        qualificationRaw = hasPublications ? 35 : 28;
      } else if (educationLevel === "masters") {
        qualificationRaw = hasPublications ? 25 : 18;
      } else {
        qualificationRaw = 5;
        weaknesses.push(
          "Research Scholar J-1 programs typically require a doctoral degree or equivalent. " +
            "A master's degree with research experience is the minimum for most programs."
        );
      }
      break;

    case "Professor":
      // PhD required for university-level teaching exchange programs
      if (educationLevel === "phd") {
        qualificationRaw = hasSpeakingEngagements || hasPublications ? 35 : 25;
      } else {
        qualificationRaw = 10;
        weaknesses.push(
          "Professor J-1 programs at U.S. universities typically require a doctoral degree. " +
            "A master's may suffice in some specialized vocational or professional fields."
        );
      }
      break;

    case "Trainee":
      // Degree + 1 year experience in field, OR 5 years experience without degree
      if (
        (educationLevel !== "none" &&
          educationLevel !== "high_school" &&
          yearsExperience >= 1) ||
        yearsExperience >= 5
      ) {
        qualificationRaw =
          yearsExperience >= 3
            ? 30
            : yearsExperience >= 1
            ? 24
            : 15;
      } else {
        qualificationRaw = 12;
        weaknesses.push(
          "J-1 Trainee requires either a degree in the field plus 1 year of related experience, " +
            "OR at least 5 years of experience in the occupational field without a degree."
        );
      }
      break;

    case "Intern":
      // Currently enrolled student OR graduated within past 12 months
      if (isCurrentlyStudying) {
        qualificationRaw = 30;
        strengths.push(
          "J-1 Intern is specifically designed for students currently enrolled in a degree program — " +
            "your active enrollment is the primary qualification."
        );
      } else if (yearsExperience < 2 && educationLevel !== "none") {
        qualificationRaw = 25;
        strengths.push(
          "J-1 Intern eligibility extends to graduates within 12 months of degree completion — " +
            "confirm your graduation date meets the program's recency requirement."
        );
      } else {
        qualificationRaw = 12;
        weaknesses.push(
          "J-1 Intern is limited to students currently enrolled or who graduated within the last " +
            "12 months. If you graduated earlier, consider J-1 Trainee instead."
        );
      }
      break;

    case "Specialist":
      // Expert in specialized field invited by U.S. organization for knowledge exchange
      {
        const recognitionSignals =
          (hasPublications ? 1 : 0) +
          (hasSpeakingEngagements ? 1 : 0) +
          (hasAwards ? 1 : 0) +
          (hasCertifications ? 1 : 0);
        if (yearsExperience >= 5 && recognitionSignals >= 2) {
          qualificationRaw = 30;
        } else if (yearsExperience >= 3 && recognitionSignals >= 1) {
          qualificationRaw = 22;
        } else {
          qualificationRaw = 14;
          weaknesses.push(
            "J-1 Specialist requires recognized expertise in a specialized field. Documented " +
              "recognition (publications, awards, speaking invitations) strengthens the case."
          );
        }
      }
      break;

    case "Teacher":
      // Teaching credential + 2 years full-time teaching experience abroad
      if (yearsExperience >= 2 && educationLevel !== "none" && educationLevel !== "high_school") {
        qualificationRaw = 30;
      } else if (yearsExperience >= 1) {
        qualificationRaw = 20;
        weaknesses.push(
          "J-1 Teacher programs typically require 2 years of full-time teaching experience in " +
            "the country of origin. Confirm the specific requirements with your target program."
        );
      } else {
        qualificationRaw = 10;
      }
      break;

    default:
      // General Exchange: base score from education level
      qualificationRaw =
        educationLevel === "phd"
          ? 22
          : educationLevel === "masters"
          ? 18
          : educationLevel === "bachelors"
          ? 15
          : 8;
      break;
  }

  const qualificationScore = Math.min(35, qualificationRaw);

  // ─── COMPONENT 3: TWO-YEAR HOME RESIDENCY RISK (0–30) ───────────────────
  //
  // This component measures the RISK of 212(e) applying.
  // Higher score = LOWER risk = better outcome for long-term immigration goals.
  //
  // SCORING LOGIC:
  //   certain (0):  GME programs — always subject to 212(e)
  //   likely  (2):  Medical training context — near-certain subject
  //   possible (8–25): Country/field combination may trigger 212(e)
  //   none    (27–30): Low skills list risk and no funding triggers detected
  //
  // The quiz does not capture J-1 funding source (Fulbright, USAID, etc.).
  // Government funding is the most common 212(e) trigger for academic programs.
  // ALWAYS advise applicants to verify their 212(e) status with their
  // program sponsor or an immigration attorney.

  const riskScore = Math.min(30, riskRaw);

  // Adjust risk for long-term immigration goals: if applicant wants a green card,
  // 212(e) is especially consequential — reflect this in risk factors.
  if (
    (longTermGoal === "permanent_residency" || longTermGoal === "citizenship_path") &&
    twoYearRiskLevel !== "none"
  ) {
    riskFactors.push(
      locale === "es"
        ? "Tu objetivo de residencia permanente se verá afectado si estás sujeto al requisito de " +
          "residencia de dos años de la J-1. Deberías confirmar tu estatus 212(e) antes de que " +
          "cualquier empleador de EE.UU. presente una petición de green card en tu nombre."
        : "Your permanent residency goal will be directly affected if you are subject to the J-1 " +
          "two-year home residency requirement. Confirm your 212(e) status before any U.S. employer " +
          "files a green card petition on your behalf."
    );
  }

  // GME-specific risk factor
  if (twoYearRiskLevel === "likely") {
    riskFactors.push(
      locale === "es"
        ? "Los programas de formación médica de posgrado (residencias y fellowships) siempre " +
          "están sujetos al requisito de residencia de dos años según INA § 212(e), " +
          "independientemente de la nacionalidad o la fuente de financiamiento. El programa " +
          "Conrad State 30 ofrece una exención para médicos que presten servicios en áreas " +
          "médicamente desatendidas durante 3 años."
        : "Graduate medical education programs (residencies and fellowships) are always subject " +
          "to the two-year home residency requirement under INA § 212(e), regardless of nationality " +
          "or funding source. The Conrad State 30 program offers a waiver for physicians who serve " +
          "in medically underserved areas for 3 years."
    );
  }

  // ─── TOTAL SCORE ──────────────────────────────────────────────────────────
  //
  // Direct sum of three components:
  //   Sponsor (0–35) + Qualification (0–35) + Risk (0–30) = 0–100

  let total = Math.min(100, sponsorScore + qualificationScore + riskScore);

  // Hard block cap (no confirmed hard blocks for J-1 in current model)
  if (hardBlocks.length > 0) total = Math.min(total, 20);

  // Prior overstay: applies at consular interview — significant for J-1 renewal
  if (hasOverstay) {
    total = Math.min(total, 45);
    riskFactors.push(
      locale === "es"
        ? "Una estadía ilegal previa puede complicar tanto la obtención de la visa J-1 como " +
          "futuras solicitudes de cambio de estatus o visa."
        : "A prior overstay can complicate both J-1 visa issuance and any future change of status " +
          "or visa applications. Disclose this to your program sponsor and attorney."
    );
  }

  // Prior visa denial: add risk factor
  if (hasDenial) {
    total = Math.min(total, 70);
    riskFactors.push(
      locale === "es"
        ? "Un rechazo previo de visa será revisado en tu entrevista consular J-1. El programa " +
          "patrocinador debe estar informado de este antecedente."
        : "A prior visa denial will be reviewed at your J-1 consular interview. Your sponsoring " +
          "program should be informed of this history."
    );
  }

  // ─── FACTORS (for UI display) ─────────────────────────────────────────────
  //
  // Factor weights map component contributions:
  //   0.35 × (sponsorScore/35 × 100)    = sponsorScore       ✓
  //   0.35 × (qualificationScore/35×100)= qualificationScore ✓
  //   0.30 × (riskScore/30 × 100)       = riskScore          ✓
  //   Sum                               = total               ✓

  const riskLabel =
    twoYearRiskLevel === "certain"
      ? "212(e) two-year requirement: CERTAIN — applies to your program"
      : twoYearRiskLevel === "likely"
      ? "212(e) two-year requirement: LIKELY — GME program detected"
      : twoYearRiskLevel === "possible"
      ? "212(e) two-year requirement: POSSIBLE — verify with sponsor or attorney"
      : "212(e) two-year requirement: LOW RISK — confirm with attorney";

  const factors: VisaScoringFactor[] = [
    {
      factor: "sponsor_access",
      weight: 0.35,
      score: sponsorScore > 0 ? Math.round((sponsorScore / 35) * 100) : 0,
      label: `State Dept-approved exchange program sponsor (DS-2019 required) — ${subcategory}`,
      present: sponsorScore >= 20,
    },
    {
      factor: "qualification_match",
      weight: 0.35,
      score: qualificationScore > 0 ? Math.round((qualificationScore / 35) * 100) : 0,
      label: `${subcategory} program qualification (education + experience)`,
      present: qualificationScore >= 20,
    },
    {
      factor: "two_year_risk",
      weight: 0.30,
      score: Math.round((riskScore / 30) * 100),
      label: riskLabel,
      present: riskScore >= 15, // present = lower risk = better
    },
  ];

  // ─── CONTEXTUAL NOTICE (always shown) ─────────────────────────────────────
  //
  // THE MOST IMPORTANT PIECE OF INFORMATION for any J-1 applicant.
  // Always shown regardless of score or risk level.
  // The two-year home residency requirement (212(e)) can prevent H-1B, L-1,
  // or green card applications for years if not properly managed.
  // The Dec 2024 Skills List update is retroactive and may benefit many holders.

  let contextualNotice: string;

  if (twoYearRiskLevel === "likely") {
    contextualNotice =
      locale === "es"
        ? "⚠️ Requisito de Residencia de Dos Años — Probable: Los programas de formación médica " +
          "de posgrado siempre están sujetos al requisito INA § 212(e). Esto significa que deberías " +
          "regresar a tu país de origen por dos años — u obtener una exención — antes de solicitar " +
          "H-1B, L-1 o cualquier green card. El programa Conrad State 30 ofrece una vía de exención " +
          "para médicos. Consulta a un abogado de inmigración antes de comenzar cualquier programa J-1."
        : "⚠️ Two-Year Home Residency Requirement — Likely: Graduate medical education programs are " +
          "always subject to INA § 212(e). This means you would need to return to your home country " +
          "for two years — or obtain a waiver — before applying for H-1B, L-1, or any green card. " +
          "The Conrad State 30 program offers a waiver path for physicians. Consult an immigration " +
          "attorney before beginning any J-1 program.";
  } else if (twoYearRiskLevel === "certain") {
    contextualNotice =
      locale === "es"
        ? "⚠️ Requisito de Residencia de Dos Años — Tu programa involucra financiamiento gubernamental " +
          "o formación médica, lo que activa el requisito INA § 212(e). Deberás regresar a tu país de " +
          "origen por dos años — u obtener una exención (Formulario DS-3035) — antes de solicitar H-1B, " +
          "L-1 o una green card. Consulta a un abogado antes de aceptar cualquier financiamiento."
        : "⚠️ Two-Year Home Residency Requirement — Your program involves government funding or medical " +
          "training, which triggers INA § 212(e). You will need to return to your home country for two " +
          "years — or obtain a waiver (Form DS-3035) — before applying for H-1B, L-1, or a green card. " +
          "Consult an attorney before accepting any government-funded program.";
  } else {
    // possible or none
    contextualNotice =
      locale === "es"
        ? "ℹ️ Requisito de Residencia de Dos Años (INA § 212(e)): Algunos titulares de J-1 deben " +
          "regresar a su país de origen por dos años antes de solicitar H-1B, L-1 o una green card. " +
          "Aplica si recibiste financiamiento gubernamental (Fulbright, etc.), si tu campo aparece en " +
          "la Lista de Habilidades de tu país, o si participaste en formación médica. Una actualización " +
          "de diciembre de 2024 eliminó a China, India y Brasil de esa lista — lo que puede eliminar " +
          "este requisito para muchos ex titulares de J-1. Confirma tu estatus 212(e) con tu " +
          "patrocinador del programa o un abogado de inmigración."
        : "ℹ️ Two-Year Home Residency Requirement (INA § 212(e)): Some J-1 holders must return to their " +
          "home country for two years before applying for H-1B, L-1, or a green card. This applies if " +
          "you receive government funding (Fulbright, etc.), if your field appears on your country's " +
          "Skills List, or if you participate in medical training. A December 2024 update removed China, " +
          "India, and Brazil from this list — potentially eliminating this requirement for many former " +
          "J-1 holders. Confirm your 212(e) status with your program sponsor or an immigration attorney.";
  }

  // ─── STRENGTHS ────────────────────────────────────────────────────────────

  if (subcategory === "Research Scholar" && educationLevel === "phd") {
    strengths.push(
      "J-1 Research Scholar is the primary visa for postdoctoral researchers at U.S. universities — " +
        "your PhD is the core qualifying credential for this subcategory."
    );
  }
  if (subcategory === "Intern" && isCurrentlyStudying) {
    strengths.push(
      "J-1 Intern is specifically designed for currently enrolled students — your active enrollment " +
        "is the clearest pathway into this program category."
    );
  }
  if (twoYearRiskLevel === "none" || (twoYearRiskLevel === "possible" && riskScore >= 22)) {
    strengths.push(
      "Your nationality and field profile suggests a lower risk of 212(e) home residency obligation — " +
        "particularly following the December 2024 Skills List update. Confirm with your sponsor."
    );
  }
  if (longTermGoal === "temporary_visit" || longTermGoal === "multi_year_stay") {
    strengths.push(
      "J-1 is well-suited for temporary exchange programs — the visa can be renewed for the " +
        "duration of an approved exchange program."
    );
  }

  // ─── WEAKNESSES ───────────────────────────────────────────────────────────

  if (twoYearRiskLevel === "likely" || twoYearRiskLevel === "certain") {
    weaknesses.push(
      "The two-year home residency requirement (INA § 212(e)) would prevent you from applying for " +
        "H-1B, L-1, or any immigrant visa until the requirement is fulfilled or waived."
    );
  }
  if (sponsorScore < 15) {
    weaknesses.push(
      "Without an identified State Dept-approved exchange program sponsor, J-1 cannot proceed. " +
        "Finding and being accepted by a sponsor is the first and most critical step."
    );
  }
  if (subcategory === "Research Scholar" || subcategory === "Professor") {
    weaknesses.push(
      "The 12/24-month bar applies: you cannot begin a new J-1 Research Scholar or Professor " +
        "program within 12 or 24 months of completing a prior J-1 in those same categories."
    );
  }
  if (longTermGoal === "permanent_residency" && twoYearRiskLevel !== "none") {
    weaknesses.push(
      "J-1 can delay your green card timeline significantly if you are subject to 212(e). " +
        "If permanent residency is your primary goal, consider H-1B or O-1A paths instead."
    );
  }

  // ─── NEXT STEPS ───────────────────────────────────────────────────────────

  nextSteps.push(
    "Identify a State Department-designated exchange program sponsor in your field (universities, " +
      "research institutes, Fulbright, private exchange organizations) and apply for acceptance."
  );
  nextSteps.push(
    "Ask your program sponsor explicitly: 'Will I be subject to the two-year home residency " +
      "requirement (INA § 212(e))?' — specifically about your funding source and Skills List status."
  );
  nextSteps.push(
    "Once accepted, pay the SEVIS fee (Form I-901, $220) and apply for the J-1 visa at your " +
      "nearest U.S. consulate using your DS-2019 form."
  );
  if (twoYearRiskLevel === "possible" || twoYearRiskLevel === "likely") {
    nextSteps.push(
      "Consult an immigration attorney to determine whether 212(e) applies to your specific " +
        "situation — especially if you intend to apply for H-1B, L-1, or a green card in the future."
    );
  }
  if (twoYearRiskLevel === "likely") {
    nextSteps.push(
      "If you are a physician interested in waiving 212(e) through Conrad State 30, research " +
        "state health department programs that sponsor physicians in medically underserved areas."
    );
  }

  // ─── RECOMMENDED EVIDENCE ─────────────────────────────────────────────────

  recommendedEvidence.push("DS-2019 form issued by the sponsoring organization");
  recommendedEvidence.push("SEVIS fee payment receipt (Form I-901, $220)");
  recommendedEvidence.push(
    "Proof of English proficiency (accepted by most programs — TOEFL, IELTS, or institutional test)"
  );
  recommendedEvidence.push(
    "Academic credentials relevant to program (degree certificates, transcripts, CV)"
  );
  recommendedEvidence.push(
    "Evidence of sufficient financial support for duration of program (bank statements, award letter, " +
      "sponsor financial guarantee)"
  );
  recommendedEvidence.push(
    "Evidence of ties to home country showing intent to return (property, family, employment letter)"
  );
  if (subcategory === "Research Scholar" || subcategory === "Professor") {
    recommendedEvidence.push(
      "Publication list, research proposal, or invitation letter from U.S. institution"
    );
  }
  if (twoYearRiskLevel !== "none") {
    recommendedEvidence.push(
      "If 212(e) waiver is needed: Form DS-3035 + supporting documentation for applicable waiver basis"
    );
  }

  // ─── RETURN ───────────────────────────────────────────────────────────────

  return {
    visaType: "j1",
    totalScore: Math.round(Math.min(100, total)),
    confidence:
      hardBlocks.length > 0
        ? "not_applicable"
        : mapConfidence(total),
    meetsMinimumThreshold: hardBlocks.length === 0 && total >= MINIMUM_THRESHOLD,
    dualIntentRisk: true,   // J-1 requires nonimmigrant intent — dual intent problematic
    lotteryRisk: false,
    ageOutWarning: !!dependentAges?.some((age) => age >= 19 && age <= 21),
    contextualNotice,
    j1Subcategory: subcategory,
    twoYearRiskLevel,
    factors,
    strengths,
    weaknesses,
    riskFactors,
    nextSteps,
    recommendedEvidence,
    processingTimeMonths: [1, 4],   // Program acceptance → DS-2019 → visa interview
    estimatedCostUsd: [500, 2000],  // SEVIS fee + visa fee + attorney (if needed)
  };
}
