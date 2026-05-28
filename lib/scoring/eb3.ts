// ─────────────────────────────────────────────────────────────────────────────
// EB-3 — Employment-Based Third Preference Green Card
// ─────────────────────────────────────────────────────────────────────────────
//
// Legal basis: INA § 203(b)(3); 8 CFR § 204.5(l)
// USCIS Policy Manual Vol. 6, Part F, Chapter 7
// Official source: uscis.gov/working-in-the-united-states/
//   permanent-workers/employment-based-immigration-
//   third-preference-eb-3
//
// EB-3 is the most accessible employer-sponsored green card
// for workers who don't qualify for EB-1 or EB-2.
// Three subcategories with different requirements:
//   EB-3A (Professionals): bachelor's degree required;
//     profession must normally require a bachelor's degree
//   EB-3B (Skilled Workers): job requires 2+ years training
//     or experience; bachelor's not required
//   EB-3C (Other Workers): unskilled, less than 2 years
//     training — very long backlog, limited practical value
// ALL subcategories require:
//   (1) Permanent, full-time job offer from a U.S. employer
//   (2) Approved PERM labor certification from DOL
//       EXCEPTION: Schedule A occupations (nurses and
//       physical therapists) skip PERM — file I-140 directly
//       per 20 CFR § 656.5
//   (3) I-140 petition filed by employer after PERM approval
// NO National Interest Waiver exists for EB-3.
//   NIW is EB-2 only — EB-3 cannot be self-petitioned.
// PERM timeline: ~500 days DOL analyst review (2025–2026);
//   audits can extend this to 24+ months
// Backlog by country:
//   India: severe — years to decades depending on subcategory
//   China: moderate to severe
//   Philippines: moderate (especially EB-3 nurses historically)
//   Mexico: generally current or short wait
//   Rest of World (Argentina, Colombia, Brazil, etc.):
//     typically current or minimal wait — major advantage
//     for Latin American applicants
// EB-3B particularly useful for: tradespeople (electricians,
//   plumbers, welders), chefs, construction workers, technicians
//   with 2+ years documented experience, workers without degrees
// Schedule A Group I (nurses, physical therapists):
//   No PERM required — fastest EB-3 path available.
//   U.S. faces chronic nursing shortage; high demand with
//   expedited processing available in many cases.
//
// This scoring is educational only — not legal advice.
// ─────────────────────────────────────────────────────────────────────────────

import type { QuizAnswers, VisaResult, VisaScoringFactor } from "@/lib/types";
import { mapConfidence } from "./engine";

// Display threshold: 50+ AND employer sponsor present AND no hard blocks
// "Strong match":    78–100
// "Possible pathway": 58–77
// "Worth exploring":  50–57
const MINIMUM_THRESHOLD = 50;

//
// Four-component additive scoring model:
//   Component 1 — Employer Sponsor        (0–40)
//   Component 2 — Qualification Match     (0–35)
//   Component 3 — Occupation Factor       (0–15)
//   Component 4 — Country Backlog Factor  (0–10)
//   ─────────────────────────────────────────────
//   Total                                 (0–100)
//

// ─── PROFESSION CLASSIFICATION ───────────────────────────────────────────────
//
// Classifies the profession for Schedule A detection and occupation factor.
// Schedule A Group I: nurses and physical therapists — no PERM required.
// High-demand: healthcare, STEM, skilled trades — stronger labor shortage case.
// Standard: typical professional occupations.
// Low-demand: roles with many available U.S. workers — harder PERM recruitment.
// Unskilled: EB-3C territory — not recommended for our target audience.

type ProfessionCategory =
  | "schedule_a"   // nurse / physical therapist — skip PERM entirely
  | "high_demand"  // healthcare, STEM, skilled trades — documented shortages
  | "standard"     // standard professional occupation
  | "low_demand"   // many available U.S. workers — PERM is harder to certify
  | "unskilled";   // EB-3C territory — extreme backlog

function classifyEB3Profession(profession: string): ProfessionCategory {
  const p = profession.toLowerCase().trim();

  // Schedule A Group I: no PERM required
  if (/\bnurse\b|registered nurse|\brn\b|\bnursing\b/.test(p)) return "schedule_a";
  if (/\bphysical therapist\b|\bphysiotherapist\b/.test(p)) return "schedule_a";

  // High-demand: documented shortage occupations — healthcare (non-Schedule A)
  if (/\bphysician\b|\bdoctor\b|\bsurgeon\b|\bdentist\b|\bpharmacist\b|\boccupational therapist\b|\bspeech therapist\b|\bradiologist\b|\bsonographer\b|\bdiagnostic\b/.test(p))
    return "high_demand";

  // High-demand: STEM / technical
  if (/\bengineer\b|\bscientist\b|\bresearcher\b|\bprogrammer\b|\bdeveloper\b|\bdata\b|\bsoftware\b|\bai\b|\bmachine learning\b|\bcybersecurity\b|\banalytics\b/.test(p))
    return "high_demand";

  // High-demand: skilled trades with documented shortages
  if (/\belectrician\b|\bplumber\b|\bwelder\b|\bcarpenter\b|\bmachinist\b|\btechnician\b|\bmechanic\b|\bchef\b|\bcook\b|\bculinary\b|\bconstruction\b|\bcontractor\b/.test(p))
    return "high_demand";

  // Standard professional occupations
  if (/\baccountant\b|\barchitect\b|\bdesigner\b|\bwriter\b|\bteacher\b|\beducator\b|\bmanager\b|\bconsultant\b|\banalyst\b|\bspecialist\b|\badministrator\b/.test(p))
    return "standard";

  // Low-demand (many available U.S. workers)
  if (
    /\bsales\b|\bmarketing\b|\bcustomer service\b|\breception\b|\bclerk\b|\bsecretary\b/.test(p)
  )
    return "low_demand";

  // Unskilled / EB-3C indicators
  if (
    /\bhouse ?keeper\b|\bcleaner\b|\bjanitor\b|\blabor\b|\bpacker\b|\bwarehouse\b/.test(p)
  )
    return "unskilled";

  return "standard";
}

// ─── SUBCATEGORY DETECTION ───────────────────────────────────────────────────
//
// EB-3A (Professionals): bachelor's degree required in a field where the
//   profession normally requires a bachelor's. Education + experience cannot
//   substitute for the bachelor's in EB-3A — must hold the actual degree.
// EB-3B (Skilled Workers): job requires 2+ years of training or experience.
//   Bachelor's not required — ideal for tradespeople, chefs, technicians.
// EB-3C (Other Workers): less than 2 years training or experience. Extreme
//   backlog — not practical for most applicants.

function detectEB3Subcategory(
  educationLevel: string,
  yearsExperience: number,
  professionMatchesDegree: string,
  professionCategory: ProfessionCategory
): "eb3a" | "eb3b" | "eb3c" {
  const hasBachelorOrHigher =
    educationLevel === "bachelors" ||
    educationLevel === "masters" ||
    educationLevel === "phd";

  const degreeMatches =
    professionMatchesDegree === "yes" || professionMatchesDegree === "somewhat";

  if (hasBachelorOrHigher && degreeMatches) return "eb3a";

  // Unskilled or very short experience → EB-3C territory
  if (professionCategory === "unskilled" || yearsExperience < 2) return "eb3c";

  // 2+ years experience (with or without degree) → EB-3B
  return "eb3b";
}

// ─── COUNTRY BACKLOG FACTOR ───────────────────────────────────────────────────
//
// EB-3 has per-country annual visa limits that create significant backlogs
// for high-demand nationalities. The priority date cutoff published monthly
// in the DOS Visa Bulletin determines how long an applicant waits.
//
// India: severe backlog — EB-3A/B estimated years to decade+ wait times.
//   Annual EB-3 cap: 28,600 visas worldwide; ~7% per-country limit ≈ 2,004.
//   India demand far exceeds this allocation every year.
// China: moderate to severe — shorter than India but still significant.
// Philippines: moderate — historically high EB-3 demand, especially nurses.
// Mexico: generally current or short wait — meaningful advantage.
// Rest of World (including most of Latin America, Europe, Africa):
//   typically current or minimal wait — EB-3 is much more accessible.

interface BacklogFactor {
  score: number;
  notice: string | null;
}

function getEB3BacklogFactor(nationality: string, locale = "en"): BacklogFactor {
  const n = nationality.trim().toLowerCase();

  if (n === "india") {
    return {
      score: 0,
      notice:
        locale === "es"
          ? "Los solicitantes de EB-3 de India enfrentan tiempos de espera muy largos debido a los límites " +
            "anuales de visas por país. Los tiempos de espera actuales para EB-3A/B pueden extenderse varios " +
            "años. EB-1C o EB-1A pueden ofrecer alternativas más rápidas si calificas."
          : "EB-3 applicants from India face very long wait times due to annual per-country visa limits. " +
            "Current wait times for EB-3A/B may extend many years. EB-1C or EB-1A may offer faster " +
            "alternatives if you qualify.",
    };
  }

  if (n === "china" || n === "china, mainland" || n === "china (mainland)") {
    return {
      score: 3,
      notice:
        locale === "es"
          ? "Los solicitantes de EB-3 de China enfrentan retrasos de moderados a severos por los límites " +
            "de visas por país. Revisa el Boletín de Visas actual del Departamento de Estado para las " +
            "fechas de prioridad vigentes."
          : "EB-3 applicants from China face moderate to severe wait times due to per-country visa limits. " +
            "Check the current State Department Visa Bulletin for the latest priority dates.",
    };
  }

  if (n === "philippines" || n === "filipinas" || n === "pilipinas") {
    return {
      score: 5,
      notice:
        locale === "es"
          ? "Los solicitantes de EB-3 de Filipinas pueden enfrentar tiempos de espera moderados, " +
            "especialmente en la subcategoría de enfermería que históricamente tiene alta demanda."
          : "EB-3 applicants from the Philippines may face moderate wait times, particularly in the " +
            "nursing subcategory which has historically high demand. Check the current Visa Bulletin.",
    };
  }

  if (n === "mexico" || n === "méxico") {
    return {
      score: 8,
      notice: null, // Mexico: generally current or short wait — no special notice needed
    };
  }

  // Rest of World — most Latin American, European, African, and other nationalities
  // are typically current or have minimal waits in EB-3
  return { score: 10, notice: null };
}

// ─── MAIN SCORER ─────────────────────────────────────────────────────────────

export function scoreEB3(answers: Partial<QuizAnswers>, locale = "en"): VisaResult {
  const {
    nationality              = "",
    profession               = "",
    degreeField              = "",
    degreeCountry            = "",
    educationLevel           = "none",
    professionMatchesDegree  = "no",
    yearsExperience          = 0,
    employmentType           = "unemployed",
    isFounder                = false,
    temporaryJobSponsor      = false,
    permanentJobSponsor      = false,
    hasUsSponsor             = false,
    hasUsBusinessPartner     = false,
    hasOverstay              = false,
    hasDenial                = false,
    longTermGoal             = "temporary_visit",
    dependentAges,
  } = answers;

  const riskFactors: string[] = [];
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const nextSteps: string[] = [];
  const recommendedEvidence: string[] = [];

  // ─── SUBCATEGORY AND PROFESSION DETECTION ─────────────────────────────────

  const professionCategory = classifyEB3Profession(profession);
  const isScheduleA = professionCategory === "schedule_a";

  const subcategory = detectEB3Subcategory(
    educationLevel,
    yearsExperience,
    professionMatchesDegree,
    professionCategory
  );

  const { score: backlogScore, notice: backlogNotice } = getEB3BacklogFactor(nationality, locale);

  // ─── HARD BLOCKS ─────────────────────────────────────────────────────────
  //
  // EB-3 has a single structural hard block: no employer sponsor.
  // Unlike EB-2 NIW or EB-1A, EB-3 cannot be self-petitioned.
  // The employer must file both the PERM application and the I-140.

  const hardBlocks: string[] = [];

  const isSelfEmployedWithNoSponsor =
    (isFounder || employmentType === "freelance") &&
    !temporaryJobSponsor &&
    !permanentJobSponsor &&
    !hasUsSponsor;

  const hasNoEmployerSignal =
    !permanentJobSponsor &&
    !temporaryJobSponsor &&
    !hasUsSponsor &&
    !hasUsBusinessPartner &&
    employmentType === "unemployed";

  if (isSelfEmployedWithNoSponsor) {
    hardBlocks.push(
      locale === "es"
        ? "EB-3 requiere que un empleador de EE.UU. patrocine la petición y obtenga la certificación " +
          "laboral PERM. A diferencia de EB-2 NIW o EB-1A, el EB-3 no puede autopeticionarse. El " +
          "autoempleo no es compatible con el EB-3."
        : "EB-3 requires a U.S. employer to sponsor the petition and obtain PERM labor certification. " +
          "Unlike EB-2 NIW or EB-1A, EB-3 cannot be self-petitioned. Self-employment is not compatible " +
          "with the EB-3 pathway."
    );
  } else if (hasNoEmployerSignal) {
    hardBlocks.push(
      locale === "es"
        ? "EB-3 requiere una oferta de trabajo permanente y a tiempo completo de un empleador de EE.UU. " +
          "Sin un empleador patrocinador, el EB-3 no está disponible."
        : "EB-3 requires a permanent, full-time job offer from a U.S. employer. Without an employer " +
          "sponsor, EB-3 is not available."
    );
  }

  hardBlocks.forEach((b) => riskFactors.push(b));

  // ─── COMPONENT 1: EMPLOYER SPONSOR (0–40) ────────────────────────────────
  //
  // EB-3 cannot be self-petitioned. The employer must:
  //   (1) Recruit U.S. workers in good faith (PERM requirement)
  //   (2) File the PERM application with DOL
  //   (3) File the I-140 petition with USCIS after PERM approval
  //   (4) Demonstrate ability to pay the offered wage (since PERM filing date)
  //
  // PERM timeline: ~500 days DOL analyst review + potential audit (2025–2026).
  // Total EB-3 process from PERM filing to green card: 2–5+ years (excl. backlog).
  //
  // Employer ability to pay: documented from first day of PERM filing.
  //   Employer must show annual income ≥ offered wage OR net assets ≥ offered wage.

  let sponsorRaw = 0;

  if (permanentJobSponsor) {
    // Clear permanent employer sponsor — ideal for EB-3
    sponsorRaw = 40;
    strengths.push(
      "A willing U.S. employer sponsor is the essential foundation of EB-3 — the employer will " +
        "file both the PERM labor certification and the I-140 petition on your behalf."
    );
  } else if (temporaryJobSponsor || hasUsSponsor) {
    // Employer relationship exists — may convert to permanent sponsor
    sponsorRaw = 20;
    weaknesses.push(
      "A permanent, full-time job offer is required for EB-3. If your employer currently sponsors " +
        "only a temporary visa (H-1B, L-1, TN), discuss whether they are willing to begin the PERM " +
        "process for EB-3 sponsorship as well."
    );
  } else if (hasUsBusinessPartner) {
    // Business connection that may lead to an employment relationship
    sponsorRaw = 15;
    weaknesses.push(
      "A confirmed permanent job offer from a U.S. employer is needed to begin the EB-3 process. " +
        "A business partnership alone does not constitute an employer-employee relationship."
    );
  } else if (!isSelfEmployedWithNoSponsor && !hasNoEmployerSignal && employmentType === "employee") {
    // Employed status without explicit sponsor confirmation — possible but unconfirmed
    sponsorRaw = 15;
  }
  // Self-employed / no employer → sponsorRaw = 0 (hard block already added)

  // Startup / recently established employer risk
  const isNewEmployer = isFounder && !permanentJobSponsor;
  if (isNewEmployer && sponsorRaw > 0) {
    sponsorRaw = Math.max(0, sponsorRaw - 5);
    riskFactors.push(
      locale === "es"
        ? "La certificación PERM requiere que el empleador demuestre capacidad para pagar el salario " +
          "ofrecido. Las empresas nuevas o startups pueden enfrentar mayor escrutinio del DOL respecto " +
          "a la estabilidad financiera y la capacidad de pago."
        : "PERM requires the employer to demonstrate ability to pay the offered wage. Startups or newly " +
          "established companies may face additional DOL scrutiny regarding financial stability and " +
          "ability to pay."
    );
  }

  const sponsorScore = Math.min(40, sponsorRaw);

  // ─── COMPONENT 2: QUALIFICATION MATCH (0–35) ──────────────────────────────
  //
  // EB-3A (Professionals):
  //   Requires a bachelor's degree (or foreign equivalent) in the relevant field.
  //   The profession must normally require a bachelor's — the employer must
  //   document this in the PERM job description.
  //   NOTE: Education AND experience CANNOT substitute for the bachelor's
  //   degree in EB-3A. The applicant must actually hold the degree.
  //
  // EB-3B (Skilled Workers):
  //   No bachelor's required. The job must require at least 2 years of
  //   training or experience — documented in the PERM job description.
  //   The applicant must demonstrate they meet this training/experience requirement.
  //
  // EB-3C (Other Workers):
  //   Any experience. Very low score reflects limited practical value
  //   due to extreme per-country backlogs in this subcategory.

  let qualificationRaw = 0;
  const isForeignDegree =
    !!degreeCountry && !/(united states|usa|us|canada)/i.test(degreeCountry);

  if (subcategory === "eb3a") {
    if (
      educationLevel === "bachelors" ||
      educationLevel === "masters" ||
      educationLevel === "phd"
    ) {
      qualificationRaw = isForeignDegree ? 30 : 35;
      if (isForeignDegree) {
        riskFactors.push(
          locale === "es"
            ? "Una evaluación de credenciales de una organización miembro de NACES es necesaria para " +
              "documentar que tu título extranjero equivale al título universitario requerido de EE.UU."
            : "A credential evaluation from a NACES-member organization is required to document that " +
              "your foreign degree is equivalent to the required U.S. bachelor's degree."
        );
      }
      if (educationLevel === "masters" || educationLevel === "phd") {
        strengths.push(
          "Your advanced degree not only qualifies you for EB-3A but may also open EB-2 PERM pathways " +
            "with potentially shorter backlogs — discuss both options with your employer and attorney."
        );
      }
    }
  } else if (subcategory === "eb3b") {
    // EB-3B: skill level determined by documented experience
    if (yearsExperience >= 5) {
      qualificationRaw = 32;
      strengths.push(
        "5+ years of skilled work experience strongly supports the EB-3B qualification — document " +
          "each role with employer letters, pay stubs, and professional references."
      );
    } else if (yearsExperience >= 3) {
      qualificationRaw = 28;
    } else if (yearsExperience >= 2) {
      qualificationRaw = 22;
      // 2 years is the minimum — tight margin worth flagging
      riskFactors.push(
        locale === "es"
          ? "Dos años es el mínimo de experiencia requerida para EB-3B. Documenta cuidadosamente " +
            "el período completo con cartas de empleadores, talones de pago y referencias profesionales."
          : "Two years is the minimum qualifying experience for EB-3B. Document the full period carefully " +
            "with employer letters, pay stubs, and professional references — any gap may affect eligibility."
      );
    } else {
      // Less than 2 years — technically EB-3C territory (already reflected in subcategory)
      qualificationRaw = 12;
    }
  } else {
    // EB-3C: unskilled — assign low score
    qualificationRaw = 15;
  }

  const qualificationScore = Math.min(35, qualificationRaw);

  // ─── COMPONENT 3: OCCUPATION FACTOR (0–15) ────────────────────────────────
  //
  // Measures how favorable the occupation is for EB-3 PERM certification.
  // Schedule A occupations skip PERM entirely — highest factor.
  // High-demand occupations have stronger labor shortage documentation.
  // Low-demand occupations require more extensive PERM recruitment.
  //
  // The PERM process requires the employer to conduct good-faith recruitment
  // to demonstrate no qualified U.S. workers are available. Occupations where
  // U.S. workers are plentiful face higher PERM denial risk.

  let occupationRaw = 0;

  if (isScheduleA) {
    // Schedule A Group I: nurse and physical therapist — PERM not required
    // File I-140 directly; USCIS acknowledges documented labor shortage
    occupationRaw = 15;
  } else if (professionCategory === "high_demand") {
    occupationRaw = 10;
  } else if (professionCategory === "standard") {
    occupationRaw = 7;
  } else if (professionCategory === "low_demand") {
    occupationRaw = 3;
    riskFactors.push(
      locale === "es"
        ? "Las ocupaciones con muchos trabajadores disponibles en EE.UU. enfrentan un proceso de " +
          "reclutamiento PERM más intenso, ya que el empleador debe documentar que no hay trabajadores " +
          "estadounidenses calificados disponibles para el puesto."
        : "Occupations with many available U.S. workers face a more intensive PERM recruitment process, " +
          "as the employer must document that no qualified U.S. workers are available for the position. " +
          "This increases PERM denial risk and overall timeline."
    );
  } else if (professionCategory === "unskilled") {
    occupationRaw = 2;
  }

  const occupationScore = Math.min(15, occupationRaw);

  // ─── TOTAL SCORE ──────────────────────────────────────────────────────────
  //
  // Direct sum of four components:
  //   Sponsor (0–40) + Qualification (0–35) + Occupation (0–15) + Backlog (0–10) = 0–100

  let total = Math.min(
    100,
    sponsorScore + qualificationScore + occupationScore + backlogScore
  );

  // Hard block cap
  if (hardBlocks.length > 0) total = Math.min(total, 25);

  // EB-3C: significantly reduce total to reflect the backlog reality
  if (subcategory === "eb3c" && hardBlocks.length === 0) {
    total = Math.min(total, 45);
  }

  // Prior overstay: serious bar for green card adjudication
  if (hasOverstay) {
    total = Math.min(total, 45);
    riskFactors.push(
      locale === "es"
        ? "Una estadía ilegal previa en EE.UU. es un obstáculo serio para cualquier beneficio de " +
          "inmigración. Consulta a un abogado sobre posibles barras de inadmisibilidad antes de iniciar " +
          "el proceso EB-3."
        : "A prior U.S. overstay is a serious bar to any immigration benefit, including EB-3. Consult " +
          "an immigration attorney about potential inadmissibility grounds and waivers before starting " +
          "the EB-3 process."
    );
  }

  // Prior denial: flags heightened scrutiny
  if (hasDenial) {
    total = Math.min(total, 70);
    riskFactors.push(
      locale === "es"
        ? "Un rechazo previo de visa será considerado en la adjudicación. Documenta qué ha cambiado " +
          "materialmente desde ese rechazo."
        : "A prior visa denial will be reviewed during adjudication. Document what has materially changed " +
          "since that denial."
    );
  }

  // ─── FACTORS (for UI display) ─────────────────────────────────────────────
  //
  // Factor weights map component contributions:
  //   0.40 × (sponsorScore/40 × 100)        = sponsorScore       ✓
  //   0.35 × (qualificationScore/35 × 100)  = qualificationScore ✓
  //   0.15 × (occupationScore/15 × 100)     = occupationScore    ✓
  //   0.10 × (backlogScore/10 × 100)        = backlogScore       ✓
  //   Sum                                   = total               ✓

  const subcategoryLabel =
    subcategory === "eb3a"
      ? "EB-3A (Professional — bachelor's degree)"
      : subcategory === "eb3b"
      ? "EB-3B (Skilled Worker — 2+ years training/experience)"
      : "EB-3C (Other Worker — unskilled)";

  const factors: VisaScoringFactor[] = [
    {
      factor: "employer_sponsor",
      weight: 0.40,
      score: sponsorScore > 0 ? Math.round((sponsorScore / 40) * 100) : 0,
      label: "Permanent, full-time U.S. employer sponsor (PERM + I-140 required)",
      present: sponsorScore >= 20,
    },
    {
      factor: "qualification_match",
      weight: 0.35,
      score: qualificationScore > 0 ? Math.round((qualificationScore / 35) * 100) : 0,
      label: subcategoryLabel,
      present: qualificationScore >= 20,
    },
    {
      factor: "occupation_factor",
      weight: 0.15,
      score: occupationScore > 0 ? Math.round((occupationScore / 15) * 100) : 0,
      label: isScheduleA
        ? "Schedule A — no PERM labor certification required (nurse / PT)"
        : "Occupation demand and PERM certification outlook",
      present: occupationScore >= 7,
    },
    {
      factor: "country_backlog",
      weight: 0.10,
      score: Math.round((backlogScore / 10) * 100),
      label: "Country-specific EB-3 priority date backlog (per-country annual visa limits)",
      present: backlogScore >= 7,
    },
  ];

  // ─── CONTEXTUAL NOTICES ───────────────────────────────────────────────────

  let contextualNotice: string | undefined;

  // Schedule A notice — highest priority
  if (isScheduleA) {
    contextualNotice =
      locale === "es"
        ? "Como enfermero/a o fisioterapeuta, puedes calificar bajo el Anexo A (Schedule A) — una ruta " +
          "especial de EB-3 que omite completamente la certificación laboral PERM. EE.UU. ha documentado " +
          "escasez crónica de estas profesiones, permitiendo la presentación directa del I-140 ante USCIS " +
          "sin pasar por el proceso del DOL. Esto puede acelerar significativamente tu proceso hacia la " +
          "green card."
        : "As a nurse or physical therapist, you may qualify under Schedule A — a special EB-3 pathway " +
          "that skips the PERM labor certification entirely. The U.S. has documented chronic shortages in " +
          "these professions, allowing direct I-140 filing with USCIS without going through the DOL PERM " +
          "process. This can significantly accelerate your green card timeline.";
  } else if (subcategory === "eb3c") {
    // EB-3C warning
    contextualNotice =
      locale === "es"
        ? "La subcategoría EB-3 'Otros Trabajadores' (trabajo no calificado) tiene una lista de espera " +
          "extremadamente larga — los tiempos de espera pueden superar los 10 años para algunas " +
          "nacionalidades. Esta ruta generalmente no es práctica para la mayoría de los solicitantes. " +
          "Te recomendamos explorar otras opciones de visa."
        : "The EB-3 'Other Workers' subcategory (unskilled work) has an extremely long backlog — wait " +
          "times can exceed 10 years for some nationalities. This pathway is generally not practical for " +
          "most applicants. We recommend exploring other visa options.";
  } else if (
    (subcategory === "eb3a" &&
      (educationLevel === "masters" || educationLevel === "phd")) ||
    permanentJobSponsor
  ) {
    // EB-3A with bachelor's+ — may also qualify for EB-2 PERM (shorter backlog generally)
    contextualNotice =
      locale === "es"
        ? "Con tu perfil, puedes calificar tanto para EB-3 como para EB-2 PERM. EB-2 generalmente tiene " +
          "una lista de espera más corta y mayor prioridad de preferencia. Si tu trabajo requiere un título " +
          "universitario Y tu empleador puede documentar este requisito de grado avanzado, EB-2 suele ser " +
          "la mejor ruta. Pídele a tu abogado que evalúe cuál categoría se adapta mejor a tu rol."
        : "With your profile, you may qualify for both EB-3 and EB-2 PERM. EB-2 generally has a shorter " +
          "backlog and higher preference priority. If your job requires a bachelor's degree AND your " +
          "employer can document the advanced degree requirement, EB-2 is usually the better path. Ask " +
          "your attorney to evaluate which category better fits your role.";
  }

  // ─── STRENGTHS ────────────────────────────────────────────────────────────

  if (isScheduleA) {
    strengths.push(
      "Schedule A occupations (nurse / physical therapist) skip the PERM process entirely — the " +
        "fastest available EB-3 path, with I-140 filed directly with USCIS."
    );
  }
  if (subcategory === "eb3a") {
    strengths.push(
      "EB-3A (Professional) requires a bachelor's degree — your educational credential directly " +
        "satisfies one of the three main EB-3A requirements."
    );
  }
  if (subcategory === "eb3b" && yearsExperience >= 3) {
    strengths.push(
      "Your documented skilled work experience meets the EB-3B 2-year minimum — tradespeople, " +
        "technicians, and chefs without bachelor's degrees qualify through this path."
    );
  }
  if (backlogScore === 10) {
    strengths.push(
      "Your nationality is in the 'Rest of World' category — EB-3 priority dates for most of Latin " +
        "America and other nationalities are typically current or have minimal waits, making EB-3 " +
        "a realistic and timely green card path."
    );
  }
  if (backlogScore >= 8 && backlogScore < 10) {
    strengths.push(
      "EB-3 priority dates for your nationality are generally current or have minimal backlogs — " +
        "a meaningful advantage that makes EB-3 a faster green card path than for some other nationalities."
    );
  }
  if (longTermGoal === "permanent_residency" || longTermGoal === "citizenship_path") {
    strengths.push(
      "EB-3 grants full permanent residence — a direct path toward the long-term U.S. residency goal " +
        "you indicated."
    );
  }

  // ─── WEAKNESSES ───────────────────────────────────────────────────────────

  if (!permanentJobSponsor) {
    weaknesses.push(
      "EB-3 cannot be self-petitioned. A U.S. employer must sponsor the petition, conduct PERM " +
        "recruitment, and file the I-140. Securing a willing employer is the most critical first step."
    );
  }
  if (!isScheduleA) {
    weaknesses.push(
      "PERM labor certification from DOL is required before the I-140 can be filed. Current DOL " +
        "analyst review times are approximately 500 days (2025–2026). Audits extend this further."
    );
  }
  if (backlogScore === 0) {
    weaknesses.push(
      "Due to per-country annual visa limits, EB-3 applicants from India face very long wait times " +
        "that can extend many years. Consider exploring EB-1A or EB-1C if your profile allows it."
    );
  }
  if (subcategory === "eb3c") {
    weaknesses.push(
      "EB-3C (Other Workers / unskilled) has extreme per-country backlogs that make this subcategory " +
        "impractical for most applicants, regardless of nationality."
    );
  }

  // ─── NEXT STEPS ───────────────────────────────────────────────────────────

  if (!permanentJobSponsor) {
    nextSteps.push(
      "Identify and secure a U.S. employer willing to sponsor an EB-3 petition. Discuss the PERM " +
        "process timeline and cost with prospective employers — many larger companies have experience " +
        "with this process."
    );
  }
  if (isScheduleA) {
    nextSteps.push(
      "If you are a nurse, obtain your CGFNS certificate, pass the NCLEX-RN exam, and secure a state " +
        "nursing license. Your employer can then file the I-140 directly without PERM."
    );
  } else {
    nextSteps.push(
      "Work with your employer and an immigration attorney to begin the PERM recruitment process. " +
        "The employer must document good-faith recruitment efforts before DOL will certify the position."
    );
  }
  nextSteps.push(
    "Consult an immigration attorney experienced in PERM and EB-3 I-140 petitions to evaluate your " +
      "specific profile and the most appropriate subcategory (EB-3A vs. EB-3B)."
  );
  nextSteps.push(
    "Once your priority date is established (after PERM filing), monitor the monthly DOS Visa Bulletin " +
      "for priority date movement. Your nationality determines how long you may wait for a visa number."
  );
  if (subcategory === "eb3a" && (educationLevel === "masters" || educationLevel === "phd")) {
    nextSteps.push(
      "Ask your attorney to evaluate EB-2 PERM alongside EB-3 — EB-2 typically has shorter backlogs " +
        "and if your role requires an advanced degree, it may be the more efficient path."
    );
  }

  // ─── RECOMMENDED EVIDENCE ─────────────────────────────────────────────────

  recommendedEvidence.push(
    "Permanent full-time job offer letter from U.S. employer (role, duties, salary, hours)"
  );
  if (subcategory === "eb3a") {
    recommendedEvidence.push("Bachelor's degree certificate + official transcripts");
    if (isForeignDegree) {
      recommendedEvidence.push(
        "Credential evaluation from a NACES-member organization confirming equivalence to U.S. bachelor's"
      );
    }
  }
  if (subcategory === "eb3b") {
    recommendedEvidence.push(
      "Employment history letters documenting 2+ years of qualifying skilled experience (from each employer)"
    );
    recommendedEvidence.push(
      "Pay stubs, W-2s, or tax records covering the qualifying experience period"
    );
    recommendedEvidence.push(
      "Professional references from supervisors or clients attesting to skill level and experience"
    );
  }
  if (isScheduleA) {
    recommendedEvidence.push("CGFNS certificate (for nurses) or equivalent credential evaluation");
    recommendedEvidence.push("State nursing or physical therapy license");
    recommendedEvidence.push("NCLEX-RN passing score (for nurses)");
    recommendedEvidence.push("English proficiency evidence (IELTS/TOEFL)");
  }
  recommendedEvidence.push(
    "Employer's ability to pay documentation (most recent tax return, audited financial statements, " +
      "or annual report)"
  );
  recommendedEvidence.push(
    "Professional licenses or certifications if applicable to your occupation"
  );

  // ─── RETURN ───────────────────────────────────────────────────────────────

  return {
    visaType: "eb3",
    totalScore: Math.round(Math.min(100, total)),
    confidence:
      hardBlocks.length > 0
        ? "not_applicable"
        : mapConfidence(total),
    meetsMinimumThreshold:
      hardBlocks.length === 0 &&
      sponsorScore > 0 &&
      total >= MINIMUM_THRESHOLD,
    dualIntentRisk: false,       // EB-3 is immigrant — no dual intent concern
    lotteryRisk: false,           // No lottery for EB-3
    ageOutWarning: !!dependentAges?.some((age) => age >= 19 && age <= 21),
    contextualNotice,
    eb3Subcategory: subcategory,
    isScheduleA,
    factors,
    strengths,
    weaknesses,
    riskFactors,
    nextSteps,
    recommendedEvidence,
    // Processing: PERM (~14mo avg) + I-140 (6-12mo) + visa availability + AOS (8-18mo)
    // Schedule A skips PERM: shorter end of range
    processingTimeMonths: isScheduleA ? [14, 36] : [24, 60],
    estimatedCostUsd: [5000, 15000],  // Attorney + filing fees for full EB-3 process
  };
}
