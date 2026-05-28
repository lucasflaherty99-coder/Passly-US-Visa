// ─────────────────────────────────────────────────────────────────────────────
// TN — USMCA Professional Work Visa
// ─────────────────────────────────────────────────────────────────────────────
//
// Legal basis: INA § 214(e); 8 CFR § 214.6
// USMCA Chapter 16, Appendix 2 — 63 occupations (unchanged since NAFTA 1994)
// USCIS Policy Manual update: June 4, 2025
// Official source: uscis.gov/working-in-the-united-states/
//   temporary-workers/tn-usmca-professionals
//
// TN is available ONLY to citizens of Mexico and Canada.
// Not available to any other nationality — hard nationality gate.
// Created under NAFTA (1994), preserved under USMCA (2020).
// The 63 occupation list has NOT changed since 1994.
// No lottery, no annual cap, no PERM labor certification.
// No USCIS petition required for Canadians — apply at border.
// Mexicans MUST get TN visa stamp at U.S. consulate first.
// Initial stay: up to 3 years. Renewable indefinitely in
//   increments of up to 3 years — no maximum stay limit.
// Self-employment is NOT permitted under TN status.
// TN is nonimmigrant — does not directly lead to green card.
//   But "dual intent" is not explicitly prohibited; many TN
//   holders later pursue EB-2/EB-3/O-1 green card paths.
//
// FY2024 denial rate (Mexican consular applicants): 42.63%
//   Primary denial reason: occupation mismatch or job duties
//   not clearly matching the TN profession.
// FY2025 USCIS denial rate (employer petitions): 5.2%
//   (lower because these are renewals/employer changes,
//   not new first-time applicants)
//
// JUNE 4, 2025 USCIS POLICY MANUAL UPDATE — CRITICAL:
// 1. Engineer: applicant MUST have bachelor's in engineering or
//    closely related field + duties must align with OOH engineering
//    definition. "Software Engineer" title does NOT automatically
//    qualify — must show true engineering duties.
// 2. Computer Systems Analyst: primarily coding-focused roles do
//    NOT qualify. Must show true systems analysis distinction.
// 3. Economist: ONLY traditional economic analysis roles qualify.
//    Market research analysts, financial analysts do NOT qualify.
// 4. Experience substitution: NO LONGER PERMITTED for most
//    categories. Applicant must hold the required educational
//    credential. EXCEPTION: Management Consultant can still qualify
//    based solely on substantial professional experience.
// 5. Job duties — not job title — must match the TN list.
//    Officers apply a four-part test for Engineer category:
//    degree match + OOH alignment + duties match + title clarity.
//
// This scoring is educational only — not legal advice.
// ─────────────────────────────────────────────────────────────────────────────

import type { QuizAnswers, VisaResult, VisaScoringFactor } from "@/lib/types";
import { mapConfidence } from "./engine";

// Display threshold: 55+ AND nationalityEligible AND no hard blocks
// "Strong match":    82–100
// "Possible pathway": 62–81
// "Worth exploring":  55–61
const MINIMUM_THRESHOLD = 55;

//
// Three-component additive scoring model:
//   Component 1 — Occupation Match        (0–50)
//   Component 2 — Credential Match        (0–30)
//   Component 3 — Employer & Job Offer    (0–20)
//   ─────────────────────────────────────────────
//   Total                                 (0–100)
//

// ─── NATIONALITY GATE ─────────────────────────────────────────────────────────
//
// TN is available ONLY to citizens of Mexico and Canada.
// Returns true ONLY for these two nationalities.

function isTNEligible(nationality: string): boolean {
  const n = nationality.trim().toLowerCase();
  return n === "mexico" || n === "canada" || n === "méxico";
}

function isMexican(nationality: string): boolean {
  const n = nationality.trim().toLowerCase();
  return n === "mexico" || n === "méxico";
}

// ─── OCCUPATIONS THAT ACCEPT DIPLOMA + 3 YR EXPERIENCE ───────────────────────
//
// Most TN categories require a specific educational credential.
// The following professions accept post-secondary diploma + 3 years experience
// as an alternative to a bachelor's degree.
// Per June 2025 update: experience substitution NO LONGER PERMITTED for most
// categories — these are the exceptions that still allow it.

const DIPLOMA_PLUS_EXPERIENCE_OCCUPATIONS = new Set([
  "Computer Systems Analyst",
  "Hotel Manager",
  "Computer Programmer",
  "Graphic Designer",
  "Interior Designer",
  "Industrial Designer",
  "Scientific Technician / Technologist",
]);

// ─── OCCUPATION MAPPING ───────────────────────────────────────────────────────
//
// Maps a free-text profession string to one of the 63 USMCA Appendix 2 professions.
// Returns the matched occupation, confidence level, and any June 2025 notices.
// Job duties — not job title — must match the TN list. This mapper uses the
// profession string as a proxy for duties, which carries inherent uncertainty.

interface TNOccupationMatch {
  occupation: string | null;
  confidence: "high" | "medium" | "none";
  postUpdateNotice?: string;
  noMatchReason?: string;
}

function mapToTNOccupation(
  profession: string,
  degreeField = "",
  locale = "en"
): TNOccupationMatch {
  const p = profession.toLowerCase().trim();
  const d = degreeField.toLowerCase().trim();

  // ─── HIGH CONFIDENCE — unambiguous mapping ──────────────────────────────
  // These professions have clear, well-established TN mappings with minimal
  // adjudicatory ambiguity (absent the June 2025 updates noted below).

  if (/\baccountant\b|\bcpa\b|chartered accountant/.test(p)) {
    return { occupation: "Accountant", confidence: "high" };
  }
  if (/\blandscape architect\b/.test(p)) {
    return { occupation: "Landscape Architect", confidence: "high" };
  }
  if (/\barchitect\b/.test(p) && !/landscape/.test(p)) {
    return { occupation: "Architect", confidence: "high" };
  }
  if (/\bdentist\b|\bdds\b|\bdmd\b/.test(p)) {
    return { occupation: "Dentist", confidence: "high" };
  }
  if (/\bgeologist\b|\bgeophysicist\b/.test(p)) {
    return { occupation: "Geologist / Geophysicist", confidence: "high" };
  }
  if (/\blawyer\b|\battorney\b/.test(p)) {
    return { occupation: "Lawyer", confidence: "high" };
  }
  if (/\blibrarian\b/.test(p)) {
    return { occupation: "Librarian", confidence: "high" };
  }
  if (/\bstatistician\b/.test(p)) {
    return { occupation: "Statistician", confidence: "high" };
  }
  if (/\bmathematician\b/.test(p) && !/statistician/.test(p)) {
    return { occupation: "Mathematician", confidence: "high" };
  }
  if (/\bnurse\b|registered nurse|\brn\b/.test(p)) {
    return { occupation: "Nurse", confidence: "high" };
  }
  if (/\bnutritionist\b|\bdietitian\b|\bdietician\b/.test(p)) {
    return { occupation: "Nutritionist / Dietitian", confidence: "high" };
  }
  if (/\boccupational therapist\b/.test(p)) {
    return { occupation: "Occupational Therapist", confidence: "high" };
  }
  if (/\bpharmacist\b/.test(p)) {
    return { occupation: "Pharmacist", confidence: "high" };
  }
  if (/\bphysiotherapist\b|\bphysical therapist\b/.test(p)) {
    return { occupation: "Physical Therapist / Physiotherapist", confidence: "high" };
  }
  if (/\bphysician\b|\bmd\b|(?<!\w)doctor(?!\w)/.test(p) && !/product/.test(p)) {
    return { occupation: "Physician", confidence: "high" };
  }
  if (/\bpsychologist\b/.test(p)) {
    return { occupation: "Psychologist", confidence: "high" };
  }
  if (/\bsocial worker\b/.test(p)) {
    return { occupation: "Social Worker", confidence: "high" };
  }
  if (/\bveterinarian\b|\bveterinary\b|\bdvm\b/.test(p)) {
    return { occupation: "Veterinarian", confidence: "high" };
  }
  if (/\bbiochemist\b/.test(p)) {
    return { occupation: "Biochemist", confidence: "high" };
  }
  if (/\bzoologist\b/.test(p)) {
    return { occupation: "Zoologist", confidence: "high" };
  }
  if (/\bbiologist\b/.test(p) && !/micro/.test(p) && !/marine/.test(p)) {
    return { occupation: "Biologist", confidence: "high" };
  }
  if (/\bmicrobiologist\b|\bmarine biologist\b/.test(p)) {
    return { occupation: "Biologist", confidence: "high" };
  }
  if (/\bchemist\b/.test(p) && !/biochem/.test(p)) {
    return { occupation: "Chemist", confidence: "high" };
  }
  if (/\bforester\b/.test(p)) {
    return { occupation: "Forester", confidence: "high" };
  }
  if (/\bagrolog/.test(p) || /\bagronom/.test(p)) {
    return { occupation: "Agrologist / Agronomist", confidence: "high" };
  }
  if (/\burban planner\b|\bcity planner\b/.test(p)) {
    return { occupation: "Urban Planner", confidence: "high" };
  }
  if (/\bland surveyor\b|\bsurveyor\b/.test(p)) {
    return { occupation: "Land Surveyor", confidence: "high" };
  }
  if (/\brange manager\b|\brange conserv/.test(p)) {
    return { occupation: "Range Manager / Conservationalist", confidence: "high" };
  }
  if (/\btechnical (publications )?writer\b|\btech writer\b/.test(p)) {
    return { occupation: "Technical Publications Writer", confidence: "high" };
  }
  if (/\bgraphic designer\b/.test(p)) {
    return { occupation: "Graphic Designer", confidence: "high" };
  }
  if (/\binterior designer\b/.test(p)) {
    return { occupation: "Interior Designer", confidence: "high" };
  }
  if (/\bindustrial designer\b/.test(p)) {
    return { occupation: "Industrial Designer", confidence: "high" };
  }
  if (/\bhotel manager\b|\bhotel management\b/.test(p)) {
    return { occupation: "Hotel Manager", confidence: "high" };
  }
  if (/\bcomputer programmer\b/.test(p)) {
    return { occupation: "Computer Programmer", confidence: "high" };
  }
  if (/\bmanagement consultant\b/.test(p)) {
    return { occupation: "Management Consultant", confidence: "high" };
  }
  if (/\bscientific technician\b|\blab technician\b|\blaboratory technician\b/.test(p)) {
    return { occupation: "Scientific Technician / Technologist", confidence: "high" };
  }

  // Recreation / Tourism Manager (distinct from hotel manager)
  if (/\brecreation manager\b|\btourism manager\b/.test(p)) {
    return { occupation: "Recreation / Tourism Manager", confidence: "high" };
  }

  // Economist — HIGH confidence ONLY for traditional economic analysis
  // June 2025: financial analysts, market research analysts, marketing
  //   specialists do NOT qualify under the Economist TN category.
  if (/\beconomist\b/.test(p) && !/financial|market research|marketing/.test(p)) {
    return { occupation: "Economist", confidence: "high" };
  }

  // Computer Systems Analyst — HIGH confidence for clear CSA roles
  // June 2025: primarily coding-focused roles do NOT qualify
  if (/\b(computer\s+)?systems?\s+analyst\b|\bit\s+analyst\b/.test(p)) {
    return { occupation: "Computer Systems Analyst", confidence: "high" };
  }

  // Engineer — specific engineering disciplines (HIGH confidence)
  // June 2025: MUST have bachelor's in the specific engineering field +
  //   duties must align with OOH engineering definition.
  //   "Software Engineer" without an engineering degree does NOT qualify.
  if (
    /\b(civil|mechanical|electrical|chemical|structural|aerospace|biomedical|environmental|materials|mining|nuclear|petroleum|hardware|systems)\s+engineer\b/.test(
      p
    )
  ) {
    return { occupation: "Engineer", confidence: "high" };
  }

  // ─── MEDIUM CONFIDENCE — careful mapping required ───────────────────────

  // Software Engineer — maps to Engineer ONLY with engineering degree and
  // engineering-specific duties. Per June 2025 USCIS guidance, this is now
  // an explicitly higher-risk mapping that requires attorney review.
  if (/\bsoftware engineer\b/.test(p)) {
    const hasTrueEngineeringDegree =
      /engineering/.test(d) && !/computer science|cs\b|information|software/.test(d);
    const notice =
      locale === "es"
        ? "Bajo la guía de USCIS de junio de 2025, 'Ingeniero de Software' califica bajo TN solo si " +
          "tienes una licenciatura en una disciplina de ingeniería (no simplemente ciencias de la " +
          "computación) Y tus funciones implican verdadera ingeniería, no principalmente desarrollo " +
          "de software. Se recomienda consultar a un abogado de inmigración para verificar esta asignación."
        : "Under June 2025 USCIS guidance, 'Software Engineer' qualifies under TN only if you hold a " +
          "bachelor's in an engineering discipline (not simply computer science) AND duties align with " +
          "engineering — not primarily software development. An immigration attorney should review this " +
          "mapping before you apply.";
    // Higher confidence if the degree is clearly in an engineering field
    return {
      occupation: "Engineer",
      confidence: hasTrueEngineeringDegree ? "medium" : "medium",
      postUpdateNotice: notice,
    };
  }

  // Software Developer — may map to Computer Programmer on the TN list
  // Duties must correspond to programming tasks, not product/systems design.
  if (/\bsoftware developer\b|\bweb developer\b|\bmobile developer\b/.test(p)) {
    const notice =
      locale === "es"
        ? "'Desarrollador de Software' puede mapearse a 'Programador de Computadoras' en la lista TN, " +
          "pero las funciones deben corresponder claramente a programación — no a gestión de producto " +
          "o diseño de sistemas. El título exacto en la carta de oferta laboral es crítico."
        : "'Software Developer' may map to 'Computer Programmer' on the TN list, but duties must " +
          "clearly correspond to programming tasks — not product management or systems design. " +
          "The exact title in the offer letter is critical for this mapping.";
    return { occupation: "Computer Programmer", confidence: "medium", postUpdateNotice: notice };
  }

  // Data Scientist / Data Analyst — may map to Computer Systems Analyst
  // June 2025: primarily coding / ML roles are excluded.
  if (/\bdata scientist\b|\bdata analyst\b/.test(p)) {
    const notice =
      locale === "es"
        ? "'Data Scientist' o 'Data Analyst' puede mapearse a Analista de Sistemas Computacionales solo " +
          "si las funciones principales son análisis de sistemas — no codificación o modelado ML. La " +
          "guía de junio de 2025 excluye explícitamente los roles principalmente de codificación."
        : "'Data Scientist' or 'Data Analyst' may map to Computer Systems Analyst only if your primary " +
          "duties involve systems analysis — not primarily coding or ML modeling. June 2025 guidance " +
          "explicitly excludes primarily coding-focused roles from this TN category.";
    return { occupation: "Computer Systems Analyst", confidence: "medium", postUpdateNotice: notice };
  }

  // General engineer title — borderline, needs specific discipline clarification
  if (/\bengineer\b/.test(p)) {
    const notice =
      locale === "es"
        ? "Un título general de 'Ingeniero' requiere revisión cuidadosa. Según la guía de junio de 2025, " +
          "debes tener una licenciatura en la disciplina de ingeniería específica Y tus funciones deben " +
          "alinearse con la definición OOH para esa rama de ingeniería."
        : "A general 'Engineer' title requires careful review. Per June 2025 guidance, you must hold a " +
          "bachelor's in a specific engineering discipline AND duties must align with the OOH definition " +
          "for that engineering branch. Specify your engineering discipline in the job offer.";
    return { occupation: "Engineer", confidence: "medium", postUpdateNotice: notice };
  }

  // ─── NO MATCH ────────────────────────────────────────────────────────────
  //
  // Financial Analyst — explicitly excluded per June 2025 USCIS guidance
  if (/\bfinancial analyst\b|\bfinance analyst\b/.test(p)) {
    const reason =
      locale === "es"
        ? "'Analista Financiero' NO califica bajo la categoría TN de Economista según la guía de USCIS " +
          "de 2025. Solo los roles tradicionales de análisis económico califican. Esta categoría no " +
          "cubre analistas financieros, de mercado, o de marketing."
        : "'Financial Analyst' does NOT qualify under the TN Economist category per 2025 USCIS guidance. " +
          "Only traditional economic analysis roles qualify. This category does not cover financial, " +
          "market research, or marketing analysts.";
    return { occupation: null, confidence: "none", noMatchReason: reason };
  }

  // Default: no recognizable TN occupation mapping
  const noMatchReason =
    locale === "es"
      ? "Tu profesión no parece corresponder a ninguna de las 63 ocupaciones de la lista USMCA TN. El TN " +
        "está limitado a estas profesiones específicas. Considera otras rutas como H-1B, O-1A o EB-2 NIW."
      : "Your profession does not appear to match any of the 63 occupations on the USMCA TN list. TN " +
        "is limited to these specific professions. Consider other paths such as H-1B, O-1A, or EB-2 NIW.";
  return { occupation: null, confidence: "none", noMatchReason };
}

// ─── MAIN SCORER ─────────────────────────────────────────────────────────────

export function scoreTN(answers: Partial<QuizAnswers>, locale = "en"): VisaResult {
  const {
    nationality           = "",
    profession            = "",
    degreeField           = "",
    degreeCountry         = "",
    educationLevel        = "none",
    professionMatchesDegree = "no",
    yearsExperience       = 0,
    employmentType        = "unemployed",
    isFounder             = false,
    temporaryJobSponsor   = false,
    permanentJobSponsor   = false,
    hasUsSponsor          = false,
    hasUsBusinessPartner  = false,
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

  // ─── NATIONALITY GATE ────────────────────────────────────────────────────
  //
  // TN is available ONLY to citizens of Mexico and Canada.
  // If the applicant is not from one of these two countries,
  // return a hard block immediately — no score computed.

  if (!isTNEligible(nationality)) {
    return buildNationalityBlockedResult(answers, locale);
  }

  const isMexicanApplicant = isMexican(nationality);

  // ─── OCCUPATION MAPPING ──────────────────────────────────────────────────
  //
  // Map the profession string to a TN occupation.
  // This is the most critical determinant of TN eligibility.
  // Job duties — not job title — must clearly match the TN list.

  const occupationMatch = mapToTNOccupation(profession, degreeField, locale);

  // ─── HARD BLOCKS ─────────────────────────────────────────────────────────

  const hardBlocks: string[] = [];

  // Hard block 1: No qualifying occupation match
  if (occupationMatch.confidence === "none") {
    hardBlocks.push(
      occupationMatch.noMatchReason ||
        "Your profession does not appear to match any of the 63 occupations on the USMCA TN list. " +
          "TN status is limited to these specific professions."
    );
  }

  // Hard block 2: Self-employment or no U.S. employer
  // TN requires a prearranged job offer from a U.S. employer.
  // Self-employment is NOT permitted under TN status.
  const isSelfEmployed =
    employmentType === "freelance" ||
    (isFounder && !temporaryJobSponsor && !permanentJobSponsor && !hasUsBusinessPartner);
  const hasNoJobOffer = employmentType === "unemployed" && !hasUsSponsor && !temporaryJobSponsor && !permanentJobSponsor;

  if (isSelfEmployed) {
    hardBlocks.push(
      locale === "es"
        ? "El TN requiere una oferta de trabajo prearreglada de un empleador estadounidense. El " +
          "autoempleo NO está permitido bajo el estatus TN. Debes ser empleado de una empresa de EE.UU."
        : "TN requires a prearranged job offer from a U.S. employer. Self-employment is NOT permitted " +
          "under TN status. You must be an employee of a U.S. company."
    );
  } else if (hasNoJobOffer) {
    hardBlocks.push(
      locale === "es"
        ? "El TN requiere una oferta de trabajo prearreglada de un empleador estadounidense. Sin oferta " +
          "de trabajo confirmada, el TN no está disponible."
        : "TN requires a prearranged job offer from a U.S. employer. Without a confirmed job offer, " +
          "TN is not available."
    );
  }

  // Hard block 3: No qualifying credential
  // Check after occupation match — each profession has specific requirements.
  const isManagementConsultant = occupationMatch.occupation === "Management Consultant";
  const acceptsDiplomaPlusExperience =
    occupationMatch.occupation !== null &&
    DIPLOMA_PLUS_EXPERIENCE_OCCUPATIONS.has(occupationMatch.occupation);

  const hasAnyDegree =
    educationLevel === "bachelors" ||
    educationLevel === "masters" ||
    educationLevel === "phd" ||
    educationLevel === "other";
  // hasPostSecondaryOrMore: any credential above high school (includes "other" = diploma/vocational)
  const hasPostSecondaryOrMore =
    hasAnyDegree ||
    (educationLevel !== "none" && educationLevel !== "high_school");
  const hasDiplomaWithExperience = hasPostSecondaryOrMore && yearsExperience >= 3;

  const hasQualifyingCredential =
    isManagementConsultant // No degree required — experience only
      ? yearsExperience >= 3
      : hasAnyDegree                          // Most professions: need a degree
      ? true
      : acceptsDiplomaPlusExperience && hasDiplomaWithExperience; // Some: diploma + 3yr experience

  if (occupationMatch.confidence !== "none" && !hasQualifyingCredential) {
    hardBlocks.push(
      locale === "es"
        ? "El TN requiere cumplir con el requisito educativo específico para tu profesión. La mayoría " +
          "de las categorías TN requieren un título universitario en el campo relevante. La sustitución " +
          "por experiencia ya NO está permitida para la mayoría de las categorías (actualización de junio 2025)."
        : "TN requires meeting the specific educational credential for your profession. Most TN categories " +
          "require a bachelor's degree in the relevant field. Experience substitution is NO LONGER permitted " +
          "for most categories per the June 2025 USCIS Policy Manual update."
    );
  }

  // Push hard block text into riskFactors for UI display
  hardBlocks.forEach((b) => riskFactors.push(b));

  // Short-circuit: if all three structural hard blocks hit, return immediately
  if (hardBlocks.length >= 3) {
    return buildBlockedResult(answers, hardBlocks, occupationMatch, locale);
  }

  // ─── COMPONENT 1: OCCUPATION MATCH (0–50) ────────────────────────────────
  //
  // The most critical component. CBP/consular officers evaluate whether the
  // applicant's job duties match one of the 63 USMCA Appendix 2 professions.
  // A detailed offer letter describing actual duties is essential evidence.

  let occupationRaw = 0;

  if (occupationMatch.confidence === "high") {
    occupationRaw = 50;
  } else if (occupationMatch.confidence === "medium") {
    occupationRaw = 30;
    riskFactors.push(
      occupationMatch.postUpdateNotice ||
        "This occupation mapping is uncertain. Confirm with an immigration attorney before applying."
    );
  }
  // "none" → occupationRaw = 0 (hard block already in list)

  const occupationScore = Math.min(50, occupationRaw);

  // ─── COMPONENT 2: CREDENTIAL MATCH (0–30) ────────────────────────────────
  //
  // Educational or licensing credential must meet the specific requirement
  // for the TN profession. Per June 2025 update: experience substitution is
  // no longer permitted for most categories.
  //
  // Degree from outside U.S./Canada: credential evaluation strongly recommended.
  // NACES-member evaluators are the standard reference for USCIS/CBP.

  let credentialRaw = 0;
  const isForeignDegree =
    hasAnyDegree &&
    !!degreeCountry &&
    !/(united states|usa|us|canada)/i.test(degreeCountry);

  if (isManagementConsultant && yearsExperience >= 3) {
    // Management Consultant: the ONLY TN category allowing experience-only qualification.
    // No degree strictly required — must show actual consulting work, not a management role.
    credentialRaw = 20;
    if (yearsExperience >= 6) credentialRaw = 25;
    strengths.push(
      "Management Consultant is the only TN category that allows qualification based on professional " +
        "experience alone — no degree strictly required."
    );
  } else if (hasAnyDegree && professionMatchesDegree === "yes" && !isForeignDegree) {
    // Degree directly matches the occupation's required credential
    credentialRaw = 30;
  } else if (hasAnyDegree && professionMatchesDegree === "yes" && isForeignDegree) {
    // Degree matches but is from outside U.S. — credential evaluation needed
    credentialRaw = 20;
    riskFactors.push(
      locale === "es"
        ? "Se recomienda encarecidamente una evaluación de credenciales de una organización miembro de " +
          "NACES para demostrar que tu título extranjero equivale al título requerido de EE.UU. CBP " +
          "puede solicitar esta evaluación en el puerto de entrada."
        : "A credential evaluation from a NACES-member organization is strongly recommended to show your " +
          "foreign degree is equivalent to the required U.S. credential. CBP may request this evaluation " +
          "at the port of entry."
    );
  } else if (hasAnyDegree && professionMatchesDegree === "somewhat") {
    // Degree related but not exact — borderline per June 2025 guidance
    // (e.g., CS degree for Engineer role with software duties)
    credentialRaw = 15;
    if (occupationMatch.postUpdateNotice) {
      // Notice already added from occupation mapping
    } else {
      riskFactors.push(
        locale === "es"
          ? "Tu título está relacionado pero no coincide directamente con la profesión TN. La guía de " +
            "junio de 2025 ha estrechado la interpretación de los requisitos educativos. Se recomienda " +
            "asesoría legal para evaluar si tu título cumple el estándar requerido."
          : "Your degree is related but does not directly match the TN profession's required credential. " +
            "June 2025 guidance has narrowed interpretation of educational requirements. Legal counsel is " +
            "recommended to assess whether your degree meets the required standard."
      );
    }
    if (isForeignDegree) {
      credentialRaw = 12; // Foreign + related = higher uncertainty
      riskFactors.push(
        locale === "es"
          ? "Tu título es extranjero y no coincide exactamente — la evaluación de credenciales NACES y " +
            "asesoría legal son especialmente importantes en este caso."
          : "Your degree is foreign and not an exact match — NACES credential evaluation and legal counsel " +
            "are especially important in this case."
      );
    }
  } else if (acceptsDiplomaPlusExperience && hasDiplomaWithExperience) {
    // Post-secondary diploma + 3 years experience (for qualifying occupations)
    credentialRaw = 22;
    strengths.push(
      `${occupationMatch.occupation} accepts a post-secondary diploma plus 3 years of relevant experience ` +
        "as an alternative to a bachelor's degree."
    );
  } else if (hasAnyDegree && professionMatchesDegree === "no") {
    // Degree exists but doesn't match profession at all
    credentialRaw = 8;
    weaknesses.push(
      "Your degree field does not appear to match the TN profession's educational requirement. A direct " +
        "degree match is critical — officers examine the curriculum and field of study, not just the degree level."
    );
  }
  // No qualifying credential → credentialRaw = 0 (hard block already added)

  const credentialScore = Math.min(30, credentialRaw);

  // ─── COMPONENT 3: EMPLOYER & JOB OFFER (0–20) ────────────────────────────
  //
  // TN requires a prearranged job offer from a U.S. employer.
  // Self-employment is NOT permitted — this is a hard disqualifier.
  //
  // Employer does NOT need to file a USCIS petition — a detailed offer letter
  // is sufficient for Canadians applying at the border or port of entry.
  // Mexicans need a consular appointment and a DS-160 application.
  //
  // The offer letter must specify: job title matching TN profession, duties
  // description, employer information, salary, and anticipated duration.

  let employerRaw = 0;

  if (isSelfEmployed || hasNoJobOffer) {
    employerRaw = 0; // Hard block cases — already handled above
  } else if (temporaryJobSponsor || permanentJobSponsor) {
    // Confirmed U.S. employer willing to sponsor a TN visa
    employerRaw = 20;
    strengths.push(
      "A willing U.S. employer is the essential prerequisite for TN — the offer letter is your primary " +
        "evidence at the port of entry or consulate."
    );
  } else if (hasUsSponsor || hasUsBusinessPartner) {
    // Some U.S. connection — job offer likely in progress
    employerRaw = 10;
    weaknesses.push(
      "A confirmed, written job offer from a U.S. employer is required before applying for TN. " +
        "Verbal agreements or offers in progress are not sufficient evidence at the border or consulate."
    );
  } else if (employmentType === "employee") {
    // Employee status without explicit sponsor confirmation — assume offer in progress
    employerRaw = 10;
  }
  // unemployed/freelance/founder (self-employed) → handled by hard blocks

  const employerScore = Math.min(20, employerRaw);

  // ─── TOTAL SCORE ──────────────────────────────────────────────────────────
  //
  // Direct sum of three components:
  //   Occupation (0–50) + Credential (0–30) + Employer (0–20) = 0–100

  let total = Math.min(100, occupationScore + credentialScore + employerScore);

  // Hard block caps: each active block significantly reduces the ceiling
  if (hardBlocks.length === 1) total = Math.min(total, 45);
  if (hardBlocks.length === 2) total = Math.min(total, 20);

  // Prior overstay: highly problematic for TN (border/consular adjudication)
  if (hasOverstay) {
    total = Math.min(total, 40);
    riskFactors.push(
      locale === "es"
        ? "Una estadía ilegal previa en EE.UU. es un problema serio para el TN, especialmente para " +
          "los ciudadanos mexicanos que deben pasar por procesamiento consular. Consulta a un abogado " +
          "sobre posibles barras de inadmisibilidad y dispensas antes de aplicar."
        : "A prior U.S. overstay is a serious concern for TN, especially for Mexican applicants who " +
          "go through consular processing. Consult an attorney about potential inadmissibility bars " +
          "and waivers before applying."
    );
  }

  // Prior visa denial: flags the file for heightened scrutiny
  if (hasDenial) {
    total = Math.min(total, 60);
    riskFactors.push(
      locale === "es"
        ? "Un rechazo previo de visa será considerado por el oficial. Documenta qué ha cambiado " +
          "materialmente desde ese rechazo para fortalecer tu nueva solicitud."
        : "A prior visa denial will be considered by the officer. Document what has materially changed " +
          "since that denial to strengthen your new application."
    );
  }

  // ─── FACTORS (for UI display) ─────────────────────────────────────────────
  //
  // Factor weights map component contributions so weight × score = contribution:
  //   0.50 × (occupationScore/50 × 100) = occupationScore  ✓
  //   0.30 × (credentialScore/30 × 100) = credentialScore  ✓
  //   0.20 × (employerScore/20  × 100)  = employerScore    ✓
  //                                       ────────────────
  //   Sum                               = total             ✓

  const factors: VisaScoringFactor[] = [
    {
      factor: "occupation_match",
      weight: 0.50,
      score: occupationScore > 0 ? Math.round((occupationScore / 50) * 100) : 0,
      label: occupationMatch.occupation
        ? `USMCA occupation match: ${occupationMatch.occupation}`
        : "No matching USMCA Appendix 2 occupation identified",
      present: occupationScore >= 30,
    },
    {
      factor: "credential_match",
      weight: 0.30,
      score: credentialScore > 0 ? Math.round((credentialScore / 30) * 100) : 0,
      label: "Educational or licensing credential meets TN profession requirement",
      present: credentialScore >= 20,
    },
    {
      factor: "employer_offer",
      weight: 0.20,
      score: employerScore > 0 ? Math.round((employerScore / 20) * 100) : 0,
      label: "Prearranged U.S. job offer from a qualifying employer (self-employment excluded)",
      present: employerScore >= 15,
    },
  ];

  // ─── CONTEXTUAL NOTICE ────────────────────────────────────────────────────
  //
  // Mexican applicants always receive the consular process notice.
  // June 2025 notices are surfaced when relevant.

  let contextualNotice: string | undefined;

  if (isMexicanApplicant) {
    contextualNotice =
      locale === "es"
        ? "Los ciudadanos mexicanos deben obtener el sello de visa TN en un consulado americano antes de " +
          "viajar — a diferencia de los canadienses, que pueden aplicar directamente en el puerto de " +
          "entrada. La tasa de rechazo consular para mexicanos fue del 42.63% en FY2024, principalmente " +
          "por discrepancias en la ocupación. Preparar documentación sólida sobre tu coincidencia de " +
          "ocupación es fundamental para el éxito."
        : "Mexican citizens must obtain a TN visa stamp at a U.S. consulate before traveling. Unlike " +
          "Canadians, who can apply directly at the border, Mexican applicants go through consular " +
          "processing. The consular denial rate for Mexican applicants was 42.63% in FY2024 — primarily " +
          "due to occupation mismatch. Preparing thorough documentation of your occupation match is " +
          "essential to a successful application.";
  } else if (occupationMatch.postUpdateNotice) {
    // Canadian applicant — surface the June 2025 notice if relevant
    contextualNotice = occupationMatch.postUpdateNotice;
  }

  // ─── STRENGTHS ────────────────────────────────────────────────────────────

  if (occupationMatch.confidence === "high") {
    strengths.push(
      `Your profession maps clearly to '${occupationMatch.occupation}' — a high-confidence USMCA TN occupation with established precedent.`
    );
  }
  if (!isMexicanApplicant) {
    strengths.push(
      "As a Canadian citizen, you can apply for TN directly at any U.S. port of entry — no advance " +
        "consular appointment or visa stamp required. Processing is typically same-day."
    );
  }
  if (employerScore === 20) {
    strengths.push(
      "No lottery, no annual cap, no PERM labor certification — TN is one of the fastest work visa " +
        "paths available for qualifying professionals."
    );
  }
  if (longTermGoal === "multi_year_stay") {
    strengths.push(
      "TN is renewable indefinitely in 3-year increments with no maximum stay limit — a sustainable " +
        "long-term work status for qualified professionals."
    );
  }

  // ─── WEAKNESSES ───────────────────────────────────────────────────────────

  if (occupationMatch.confidence === "medium") {
    weaknesses.push(
      "Your occupation mapping is not straightforward — CBP and consular officers apply the 4-part " +
        "test: degree match, OOH alignment, duties match, and title clarity. A vague mapping is the " +
        "primary reason for TN denials."
    );
  }
  if (isMexicanApplicant) {
    weaknesses.push(
      "Mexican applicants face a 42.63% consular denial rate (FY2024) — the most common reason is " +
        "occupation mismatch or a job offer letter that doesn't clearly describe duties matching the TN profession."
    );
  }
  if (credentialScore < 20 && !isManagementConsultant) {
    weaknesses.push(
      "Your educational credential does not appear to directly match your TN profession's requirement. " +
        "Per June 2025 guidance, experience substitution is no longer allowed for most categories."
    );
  }

  // ─── NEXT STEPS ───────────────────────────────────────────────────────────

  nextSteps.push(
    "Obtain a detailed written offer letter from your U.S. employer specifying: your exact job title " +
      "(matching the TN profession), a detailed duties description, employer information, salary, and " +
      "anticipated duration of employment."
  );
  if (occupationMatch.confidence === "medium") {
    nextSteps.push(
      "Consult an immigration attorney to confirm your occupation mapping and draft a support letter " +
        "explaining how your duties match the specific TN profession under the OOH standard."
    );
  }
  if (isMexicanApplicant) {
    nextSteps.push(
      "Schedule a DS-160 appointment at the nearest U.S. consulate. Pay the $185 MRV fee and prepare " +
        "your application package: DS-160 form, offer letter, degree + transcripts, professional license " +
        "(if applicable), and credential evaluation (if degree is from outside U.S.)."
    );
  } else {
    nextSteps.push(
      "Prepare your TN application package for presentation at the U.S. port of entry: offer letter, " +
        "degree + transcripts, professional license (if applicable), and credential evaluation if your " +
        "degree is from a non-U.S. institution."
    );
  }
  nextSteps.push(
    "Have your employer prepare a support letter on company letterhead confirming: the TN profession " +
      "being filled, why your specific credentials and experience qualify you for that profession, " +
      "and the non-speculative, temporary nature of the position."
  );
  if (isForeignDegree) {
    nextSteps.push(
      "Obtain a credential evaluation from a NACES-member organization (e.g., WES, ECE) to show your " +
        "foreign degree is equivalent to the required U.S. credential."
    );
  }

  // ─── RECOMMENDED EVIDENCE ─────────────────────────────────────────────────

  recommendedEvidence.push(
    "Detailed job offer letter (employer letterhead, job title matching TN profession, description of duties, salary, duration)"
  );
  recommendedEvidence.push("Bachelor's degree certificate + official transcripts");
  if (isForeignDegree) {
    recommendedEvidence.push(
      "Credential evaluation from NACES-member organization confirming equivalence to required U.S. credential"
    );
  }
  if (acceptsDiplomaPlusExperience && !hasAnyDegree) {
    recommendedEvidence.push(
      "Post-secondary diploma + evidence of 3+ years relevant experience (employer letters, pay stubs, professional references)"
    );
  }
  if (isManagementConsultant) {
    recommendedEvidence.push(
      "Consulting portfolio, client engagement letters, signed consulting contracts demonstrating the nature and scope of consulting work"
    );
  }
  recommendedEvidence.push(
    "Professional license (if required for your occupation — e.g., nursing, pharmacy, architecture)"
  );
  recommendedEvidence.push(
    "Employer support letter explaining why your specific credentials and experience qualify you for the TN profession"
  );
  recommendedEvidence.push(
    "Evidence of professional experience (employer letters, tax records, professional references)"
  );
  if (isMexicanApplicant) {
    recommendedEvidence.push(
      "Completed DS-160 form and MRV fee payment receipt ($185) for consular appointment"
    );
  }

  // ─── RETURN ───────────────────────────────────────────────────────────────

  return {
    visaType: "tn",
    totalScore: Math.round(Math.min(100, total)),
    confidence: hardBlocks.length > 0 ? "not_applicable" : mapConfidence(total),
    meetsMinimumThreshold: hardBlocks.length === 0 && total >= MINIMUM_THRESHOLD,
    dualIntentRisk: false,      // Dual intent not explicitly prohibited for TN
    lotteryRisk: false,          // No lottery — no annual cap on TN
    ageOutWarning: !!dependentAges?.some((age) => age >= 19 && age <= 21),
    contextualNotice,
    tnOccupation: occupationMatch.occupation ?? undefined,
    tnOccupationConfidence: occupationMatch.confidence,
    factors,
    strengths,
    weaknesses,
    riskFactors,
    nextSteps,
    recommendedEvidence,
    processingTimeMonths: isMexicanApplicant ? [2, 8] : [0, 1], // Canadians: same-day to weeks
    estimatedCostUsd: [500, 3500],  // $185 MRV (MX) or CBP fee (CA) + attorney fees
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// BLOCKED RESULTS
// ─────────────────────────────────────────────────────────────────────────────

function buildNationalityBlockedResult(
  answers: Partial<QuizAnswers>,
  locale = "en"
): VisaResult {
  const block =
    locale === "es"
      ? "El estatus TN está disponible únicamente para ciudadanos de México y Canadá bajo el USMCA. " +
        "Si no eres ciudadano de uno de estos dos países, el TN no está disponible para ti. Considera " +
        "el H-1B, O-1A, o EB-2 NIW según tu perfil profesional."
      : "TN status is available only to citizens of Mexico and Canada under the USMCA. If you are not " +
        "a citizen of one of these countries, TN is not available to you. Consider H-1B, O-1A, or " +
        "EB-2 NIW depending on your professional profile.";

  return {
    visaType: "tn",
    totalScore: 0,
    confidence: "not_applicable",
    meetsMinimumThreshold: false,
    dualIntentRisk: false,
    lotteryRisk: false,
    ageOutWarning: !!answers.dependentAges?.some((age) => age >= 19 && age <= 21),
    tnOccupation: undefined,
    tnOccupationConfidence: "none",
    factors: [],
    strengths: [],
    weaknesses: [block],
    riskFactors: [block],
    nextSteps: [
      "Explore H-1B (specialty occupation, annual lottery) if you have a U.S. employer sponsor.",
      "Explore O-1A (extraordinary ability — no lottery, no cap) if you have notable professional achievements.",
      "Explore EB-2 NIW (National Interest Waiver — no employer sponsor required) if you have an advanced degree.",
    ],
    recommendedEvidence: [],
    processingTimeMonths: [3, 12],
    estimatedCostUsd: [3000, 15000],
  };
}

function buildBlockedResult(
  answers: Partial<QuizAnswers>,
  hardBlocks: string[],
  occupationMatch: TNOccupationMatch,
  locale = "en"
): VisaResult {
  return {
    visaType: "tn",
    totalScore: 0,
    confidence: "not_applicable",
    meetsMinimumThreshold: false,
    dualIntentRisk: false,
    lotteryRisk: false,
    ageOutWarning: !!answers.dependentAges?.some((age) => age >= 19 && age <= 21),
    tnOccupation: occupationMatch.occupation ?? undefined,
    tnOccupationConfidence: occupationMatch.confidence,
    factors: [],
    strengths: [],
    weaknesses: hardBlocks,
    riskFactors: hardBlocks,
    nextSteps: [
      "Review the 63 USMCA TN occupation list and identify if any match your actual job duties (not just your job title).",
      "If your profession qualifies but you lack the required credential, consult an attorney about whether any exceptions apply.",
      "Consider H-1B, O-1A, or EB-2 NIW as alternative work visa pathways if TN is not available.",
    ],
    recommendedEvidence: [],
    processingTimeMonths: [2, 8],
    estimatedCostUsd: [500, 3500],
  };
}
