// Legal basis: INA § 203(b)(2)(B); 8 CFR § 204.5(k)
// Controlling precedent: Matter of Dhanasar, 26 I&N Dec. 884
// (AAO 2016) — replaced Matter of NYSDOT, 22 I&N Dec. 215 (1998)
// Burden of proof: preponderance of the evidence
// Source: USCIS Policy Manual Vol. 6, Part F, Chapter 5
// This scoring is educational only — not legal advice.
// Actual eligibility depends on totality of evidence and
// discretionary review by USCIS officer.
//
// ADJUDICATION CONTEXT (as of 2025-2026):
// FY2024 approval rate dropped from ~80% to ~43%.
// FY2025 Q4 denial rate exceeded approvals for first time (~35.7%).
// USCIS applying heightened scrutiny especially on Prong 1
// (national importance) and Prong 3 (waiver benefit).
// NIW denial rates now exceed EB-1A denial rates — reversal
// of historical pattern.
// STEM applicants maintain comparative advantage in 2025-2026.
// Non-STEM, regional-scope endeavors face highest denial risk.

import type { QuizAnswers, VisaResult, VisaScoringFactor } from "@/lib/types";
import { mapConfidence } from "./engine";

const MINIMUM_THRESHOLD = 55;

// ─── Field Detection ──────────────────────────────────────────────────────────
// Used for Prong 1 field classification. Priority: STEM > Healthcare >
// Education/Research > Business/Tech > Creative. The endeavor's field drives
// Prong 1 scoring; USCIS consistently prioritizes STEM and healthcare.

type FieldType = "stem" | "healthcare" | "education" | "business" | "creative" | "undefined";

function detectField(profession: string): FieldType {
  const p = (profession ?? "").toLowerCase();
  if (!p) return "undefined";

  // STEM — highest Prong 1 weight per consistent USCIS practice
  if (
    /research|scientist|researcher|engineer|engineering|software|developer|programmer|data\s*scientist|ai\b|ml\b|machine\s*learning|physicist|chemist|biologist|mathematician|statistician|computer|robotics|aerospace|nuclear|cybersecurity|analytics|algorithm|biotech|genomics|neuroscien|nanotechnolog/.test(p)
  ) return "stem";

  // Healthcare / public health
  if (
    /physician|doctor|surgeon|medical|dentist|nurse|therapist|healthcare|public\s*health|epidemiolog|pharmacist|psychiatrist|psychologist|optometrist|radiolog|cardiolog|neurolog|pediatr|oncolog|orthop|dermatolog/.test(p)
  ) return "healthcare";

  // Education / academic research (some overlap with STEM — STEM checked first)
  if (
    /professor|teacher|educator|lecturer|academic|curriculum|instructor/.test(p)
  ) return "education";

  // Business / tech / entrepreneurship with possible national scope
  if (
    /entrepreneur|founder|startup|executive|manager|consultant|analyst|economist|finance|financial|architect|urban\s*planner|environmental|product\s*manager|director|ceo|cto|cfo|policy|law|attorney|lawyer/.test(p)
  ) return "business";

  // Creative / cultural
  if (
    /artist|musician|filmmaker|creative|designer|writer|journalist|author|photographer|illustrator|animator|content\s*creator/.test(p)
  ) return "creative";

  return "undefined";
}

// ─── Internal Prong Scores ────────────────────────────────────────────────────

interface NIWProngScores {
  prong1: number;           // 0–33: substantial merit + national importance
  prong2: number;           // 0–40: well positioned to advance endeavor
  prong3: number;           // 0–27: beneficial to waive job offer requirement
  total: number;            // sum of above, 0–100
  weakestProng: "prong1" | "prong2" | "prong3";
  rfeRiskLevel: "low" | "medium" | "high";
}

// ─── Scorer ───────────────────────────────────────────────────────────────────

export function scoreEB2NIW(answers: Partial<QuizAnswers>, locale = "en"): VisaResult {
  const {
    educationLevel = "none",
    yearsExperience = 0,
    profession = "",
    employmentType = "employee",
    isFounder = false,
    hasPublications = false,
    publicationsCount,
    hasSpeakingEngagements = false,
    hasAwards = false,
    hasMediaCoverage = false,
    hasCertifications = false,
    hasMemberships = false,
    hasJudgingExperience = false,
    hasPortfolio = false,
    patents = false,
    longTermGoal = "multi_year_stay",
    desiredTimeline,
    hasUsBusinessPartner = false,
    hasDenial = false,
    hasOverstay = false,
  } = answers;

  const isEs = locale === "es";
  const field = detectField(profession);
  const isStem       = field === "stem";
  const isHealthcare = field === "healthcare";
  const isEducation  = field === "education";
  const isBusiness   = field === "business";
  const isCreative   = field === "creative";
  const isDefined    = field !== "undefined";
  const isSelfEmployed = employmentType === "freelance" || isFounder || employmentType === "founder";

  // ──────────────────────────────────────────────────────────────────────────
  // PRONG 1 — Substantial Merit and National Importance (0–33)
  //
  // Dhanasar: concerns the ENDEAVOR, not the person's credentials.
  // Jan 2025 USCIS policy explicitly added "potential prospective impact"
  // and "broader impacts of the proposed endeavor" as evaluation factors.
  // ──────────────────────────────────────────────────────────────────────────
  let prong1 = 0;

  // Base score by endeavor field
  if (isStem)          prong1 += 18;  // USCIS consistently prioritizes STEM
  else if (isHealthcare) prong1 += 16;
  else if (isEducation)  prong1 += 14; // Dhanasar explicitly cites education/research
  else if (isBusiness)   prong1 += 12; // requires documented national scope
  else if (isCreative)   prong1 +=  8; // with documented national impact

  // Government funding / grants / public investment proxy:
  // academic publications in STEM/healthcare imply grant-funded research
  if ((isStem || isEducation) && hasPublications) prong1 += 5;
  else if (isHealthcare && (hasPublications || hasMemberships)) prong1 += 5;

  // Interest from U.S. customers, investors, or institutional partners
  if (hasUsBusinessPartner) prong1 += 5;

  prong1 = Math.min(33, prong1);

  // ──────────────────────────────────────────────────────────────────────────
  // PRONG 2 — Well Positioned to Advance the Endeavor (0–40)
  //
  // Dhanasar: concerns the PERSON, not the endeavor.
  // Factors: education, skills, knowledge, record of success in related
  // efforts, plan for future activities, progress toward endeavor, interest
  // from relevant entities.
  // NOTE: Dhanasar does NOT require petitioner to prove endeavor is more
  // likely than not to succeed — only that they are well-positioned.
  // ──────────────────────────────────────────────────────────────────────────
  let prong2 = 0;

  // Advanced degree or equivalent (max 18)
  const ed = educationLevel;
  const yrs = yearsExperience ?? 0;
  if (ed === "phd" || ed === "masters") {
    prong2 += 18;
  } else if (ed === "bachelors" && yrs >= 5) {
    prong2 += 14;  // bachelor's + 5 yrs progressive experience
  } else if (ed === "bachelors") {
    prong2 += 8;
  }
  // No degree → +0; notice added to weaknesses below

  // Years of experience in field (max 12)
  if (yrs >= 10)      prong2 += 12;
  else if (yrs >= 5)  prong2 += 8;
  else if (yrs >= 2)  prong2 += 4;

  // Documented record of success in related efforts (max 8)
  // Counts: publications, patents, products/portfolio, judging, speaking, awards
  const successItems = [
    hasPublications,
    hasAwards,
    hasSpeakingEngagements,
    hasJudgingExperience,
    patents,
    hasPortfolio,
  ].filter(Boolean).length;

  if (successItems >= 3)      prong2 += 8;   // strong evidence
  else if (successItems >= 1) prong2 += 4;   // moderate evidence

  // Concrete plan or model for future U.S. activities (+2)
  // Proxy: near-term timeline + green-card goal signals preparedness
  const hasConcretePlan =
    longTermGoal === "permanent_residency" ||
    longTermGoal === "citizenship_path"    ||
    desiredTimeline === "asap"             ||
    desiredTimeline === "6months"          ||
    desiredTimeline === "1year";
  if (hasConcretePlan) prong2 += 2;

  prong2 = Math.min(40, prong2);

  // ──────────────────────────────────────────────────────────────────────────
  // PRONG 3 — Beneficial to Waive Job Offer Requirement (0–27)
  //
  // Dhanasar: balance national interest in waiver vs. PERM labor protections.
  // Does NOT require showing harm to national interest or comparison against
  // U.S. workers (unlike old NYSDOT standard).
  // Most common RFE trigger in 2025-2026.
  // ──────────────────────────────────────────────────────────────────────────
  let prong3 = 0;

  // Self-employed / founder / entrepreneur → PERM impractical (+12)
  // Dhanasar explicitly identified self-employment as case where labor
  // certification is impractical
  if (isSelfEmployed) {
    prong3 += 12;
  } else if (hasPublications || hasSpeakingEngagements || hasJudgingExperience) {
    // Employee whose work demonstrably transcends current employer (+6)
    prong3 += 6;
  }
  // If neither: no Prong 3 base score; notice added to riskFactors below

  // Unique expertise that PERM process would not adequately capture (+8/+4)
  if (patents || publicationsCount === "10+" || hasJudgingExperience) {
    prong3 += 8;
  } else if (publicationsCount === "4-10" || hasAwards) {
    prong3 += 4;
  }

  // Even if U.S. workers available, U.S. still benefits from this person (+4)
  // Documented by: citations, adoption by third parties, demand signals
  if (hasUsBusinessPartner || (hasMediaCoverage && isDefined)) prong3 += 4;

  // National interest urgency — field has documented labor shortage
  // or is a strategic national priority (+3)
  if (isStem || isHealthcare) prong3 += 3;

  // ── Risk deductions ────────────────────────────────────────────────────
  // Work indistinguishable from general U.S. workforce → -5
  const hasAnyAchievement = hasPublications || hasAwards || hasSpeakingEngagements ||
                             hasJudgingExperience || patents || hasPortfolio;
  if (!isSelfEmployed && !hasAnyAchievement) prong3 -= 5;

  // No documentation of why waiver benefits U.S. → -8
  if (!hasUsBusinessPartner && !hasMediaCoverage && !hasPublications) prong3 -= 8;

  prong3 = Math.max(0, Math.min(27, prong3));

  // ──────────────────────────────────────────────────────────────────────────
  // TOTAL SCORE (0–100)
  // Three prongs sum directly to 100 (maxes: 33 + 40 + 27 = 100)
  // ──────────────────────────────────────────────────────────────────────────
  const total = Math.min(100, prong1 + prong2 + prong3);

  // ──────────────────────────────────────────────────────────────────────────
  // RFE RISK ASSESSMENT
  // ──────────────────────────────────────────────────────────────────────────
  let rfeRiskLevel: "low" | "medium" | "high";

  if (
    prong1 < 10 ||
    prong3 < 8  ||
    (!isStem && !isHealthcare && !hasUsBusinessPartner && !hasMediaCoverage) ||
    !hasConcretePlan
  ) {
    rfeRiskLevel = "high";
  } else if (prong1 >= 18 && prong3 >= 14 && prong2 >= 25) {
    rfeRiskLevel = "low";
  } else {
    rfeRiskLevel = "medium";
  }

  // ──────────────────────────────────────────────────────────────────────────
  // WEAKEST PRONG — as percentage of that prong's maximum
  // ──────────────────────────────────────────────────────────────────────────
  const p1Pct = prong1 / 33;
  const p2Pct = prong2 / 40;
  const p3Pct = prong3 / 27;
  const weakestProng: "prong1" | "prong2" | "prong3" =
    p1Pct <= p2Pct && p1Pct <= p3Pct ? "prong1" :
    p2Pct <= p3Pct                    ? "prong2" :
                                        "prong3";

  // ──────────────────────────────────────────────────────────────────────────
  // BUILD RESULT ARRAYS (all locale-aware; strings also catalogued in
  // messages/en.json and messages/es.json under results.niw.*)
  // ──────────────────────────────────────────────────────────────────────────

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const riskFactors: string[] = [];
  const nextSteps: string[] = [];
  const recommendedEvidence: string[] = [];

  // ── Strengths ─────────────────────────────────────────────────────────────
  strengths.push(isEs
    ? "No se requiere empleador patrocinador — puedes presentar una autopetición (I-140)"
    : "No employer sponsor required — you can self-petition (I-140)"
  );
  if (ed === "phd" || ed === "masters") strengths.push(isEs
    ? "Tu título avanzado respalda sólidamente la calificación EB-2 base"
    : "Your advanced degree strongly supports the underlying EB-2 qualification"
  );
  if (hasPublications) strengths.push(isEs
    ? "Las publicaciones son evidencia directa de los tres pilares de Dhanasar: mérito, posicionamiento e impacto"
    : "Publications directly address all three Dhanasar prongs: merit, positioning, and impact"
  );
  if (isSelfEmployed) strengths.push(isEs
    ? "El trabajo por cuenta propia hace impracticable el proceso PERM — Dhanasar lo reconoce explícitamente como caso de exención"
    : "Self-employment makes PERM impractical — Dhanasar explicitly recognizes this as a waiver case"
  );
  if (isStem) strengths.push(isEs
    ? "Los campos STEM tienen ventaja comparativa en aprobaciones NIW según patrones de adjudicación 2025-2026"
    : "STEM fields have a comparative advantage in NIW approvals per 2025-2026 adjudication patterns"
  );
  if (isHealthcare) strengths.push(isEs
    ? "Los emprendimientos de salud pública tienen fuerte respaldo bajo el análisis de importancia nacional de Dhanasar"
    : "Public health endeavors have strong support under Dhanasar's national importance analysis"
  );
  if (hasSpeakingEngagements) strengths.push(isEs
    ? "Las conferencias demuestran reconocimiento de pares y apoyan el Prong 2 (bien posicionado)"
    : "Speaking engagements demonstrate peer recognition and support Prong 2 (well positioned)"
  );
  if (hasJudgingExperience) strengths.push(isEs
    ? "La experiencia como evaluador/jurado es evidencia directa de expertise reconocida en el campo"
    : "Judging or reviewing experience is direct evidence of recognized expertise in the field"
  );
  if (patents) strengths.push(isEs
    ? "Las patentes demuestran contribuciones originales — fortalece tanto el Prong 2 como el Prong 3"
    : "Patents demonstrate original contributions — strengthens both Prong 2 and Prong 3"
  );
  if (hasUsBusinessPartner) strengths.push(isEs
    ? "Un socio de negocios en EE.UU. es evidencia de interés de entidades estadounidenses en tu trabajo"
    : "A U.S. business partner is evidence of interest from U.S. entities in your work"
  );

  // ── Weaknesses ────────────────────────────────────────────────────────────
  if (!isDefined) weaknesses.push(isEs
    ? "El emprendimiento propuesto no está claramente definido — USCIS exige un plan específico y concreto, no una descripción general de tu profesión"
    : "Proposed endeavor is not clearly defined — USCIS requires a specific, concrete plan, not a general description of your profession"
  );
  if (ed === "none" || ed === "high_school" || ed === "other") weaknesses.push(isEs
    ? "Sin título avanzado, la elegibilidad EB-2 debe demostrarse por habilidad excepcional (al menos 3 de 6 criterios regulatorios) — un umbral más difícil de satisfacer"
    : "Without an advanced degree, EB-2 eligibility must be demonstrated through exceptional ability (at least 3 of 6 regulatory criteria) — a more difficult threshold"
  );
  if (ed === "bachelors" && yrs < 5) weaknesses.push(isEs
    ? "Un título de maestría o doctorado, o al menos 5 años de experiencia progresiva, fortalecería significativamente la calificación EB-2 base"
    : "A master's or doctoral degree, or at least 5 years of progressive experience, would significantly strengthen the underlying EB-2 qualification"
  );
  if (successItems === 0) weaknesses.push(isEs
    ? "Un historial documentado de logros — publicaciones, premios, resultados medibles — es crítico para satisfacer el Prong 2 (bien posicionado)"
    : "A documented record of achievement — publications, awards, measurable outcomes — is critical to satisfying Prong 2 (well positioned)"
  );
  if (!isSelfEmployed && !hasAnyAchievement) weaknesses.push(isEs
    ? "Como empleado sin logros documentados más allá de tu empleador, el Prong 3 (waiver) es difícil de establecer: USCIS necesita entender por qué dispensar el PERM sirve al interés nacional"
    : "As an employee without documented achievements beyond your employer, Prong 3 (waiver) is difficult to establish: USCIS needs to understand why bypassing PERM serves the national interest"
  );
  if (!isStem && !isHealthcare && isDefined) weaknesses.push(isEs
    ? "En 2025-2026, los campos no-STEM y no-salud requieren documentación de impacto nacional sustancialmente más sólida para superar el escrutinio actual de USCIS"
    : "In 2025-2026, non-STEM and non-healthcare fields require substantially stronger national impact documentation to overcome current USCIS scrutiny"
  );

  // ── Risk factors ──────────────────────────────────────────────────────────
  if (!isSelfEmployed && !hasAnyAchievement && !hasUsBusinessPartner) riskFactors.push(isEs
    ? "Prong 3 sin base sólida: USCIS necesita entender por qué dispensar la certificación laboral — en lugar de presentar EB-2 PERM estándar — sirve específicamente al interés nacional"
    : "Prong 3 without strong foundation: USCIS needs to understand why waiving labor certification — rather than filing standard EB-2 PERM — specifically serves the national interest"
  );
  if (!isStem && !isHealthcare && !isEducation && isDefined) riskFactors.push(isEs
    ? "Contexto 2025-2026: Las tasas de negación NIW superaron las aprobaciones en Q4 2025. Los emprendimientos no-STEM y no-salud con documentación de impacto nacional limitada enfrentan el mayor riesgo"
    : "2025-2026 context: NIW denial rates exceeded approvals in Q4 2025. Non-STEM, non-healthcare endeavors with limited national impact documentation face the highest denial risk"
  );
  if (!isDefined) riskFactors.push(isEs
    ? "Un emprendimiento vago o no definido es causa común de negación directa — USCIS aplica escrutinio elevado en el Prong 1 desde 2024"
    : "A vague or undefined endeavor is a common cause of outright denial — USCIS has applied heightened Prong 1 scrutiny since 2024"
  );
  if (rfeRiskLevel === "high") riskFactors.push(isEs
    ? "Tu perfil muestra potencial para esta opción, pero una o más áreas pueden necesitar fortalecimiento antes de presentar. Un abogado de inmigración puede ayudarte a identificar las brechas."
    : "Your profile shows potential for this pathway, but one or more areas may need strengthening before filing. An immigration attorney can help identify the gaps."
  );
  if (hasDenial) riskFactors.push(isEs
    ? "Una negativa previa de visa debe abordarse proactivamente en la carta de presentación del I-140"
    : "Prior visa denial should be addressed proactively in the I-140 cover letter"
  );
  if (hasOverstay) riskFactors.push(isEs
    ? "Un overstay previo puede afectar la adjudicación del I-485 — consulta con un abogado antes de presentar"
    : "Prior overstay may affect I-485 adjudication — consult an attorney before filing"
  );

  // ── Contextual notice — targeted weakest-prong message ────────────────────
  let contextualNotice: string | undefined;
  if (weakestProng === "prong1") {
    contextualNotice = isEs
      ? "Los casos NIW más sólidos definen claramente un emprendimiento propuesto específico y lo conectan a prioridades nacionales documentadas. Las descripciones genéricas de tu profesión son una razón común de negación en 2025-2026."
      : "The strongest NIW cases clearly define a specific proposed endeavor and connect it to documented national priorities. Generic descriptions of your profession are a common denial reason in 2025-2026.";
  } else if (weakestProng === "prong2") {
    contextualNotice = isEs
      ? "Construir un historial documentado de éxito — a través de publicaciones, resultados medibles o reconocimiento de entidades estadounidenses — fortalece significativamente esta área."
      : "Building a documented record of success — through publications, measurable outcomes, or recognition from U.S. entities — significantly strengthens this prong.";
  } else {
    contextualNotice = isEs
      ? "Esta es la parte más comúnmente cuestionada. Requiere mostrar no solo que tu trabajo es valioso, sino específicamente por qué EE.UU. se beneficia más de dispensar el requisito de oferta de empleo que de exigir el proceso estándar de certificación laboral."
      : "This is the most commonly challenged prong. It requires showing not just that your work is valuable, but specifically why the U.S. benefits more from waiving the job offer requirement than from requiring the standard labor certification process.";
  }

  // ── Next steps ────────────────────────────────────────────────────────────
  nextSteps.push(isEs
    ? "Consulta con un abogado especializado en peticiones EB-2 NIW — las tasas de negación superan el 50% en algunos centros de servicio de USCIS en 2025"
    : "Consult an immigration attorney experienced in EB-2 NIW — denial rates exceed 50% at some USCIS service centers in 2025"
  );
  nextSteps.push(isEs
    ? "Redacta una declaración de emprendimiento propuesto específica y concreta — debe describir qué harás, para quién y con qué impacto proyectado (no una descripción de tu profesión)"
    : "Draft a specific, concrete proposed endeavor statement — describe what you will do, for whom, and with what projected impact (not a description of your profession)"
  );
  nextSteps.push(isEs
    ? "Reúne cartas de referencia de expertos en EE.UU. que describan el impacto de tu trabajo, no solo tus credenciales"
    : "Compile reference letters from U.S. experts that describe the impact of your work, not just your credentials"
  );
  if (!hasPublications) nextSteps.push(isEs
    ? "Publica artículos, investigaciones o estudios de caso para establecer un historial documentado de contribuciones al campo"
    : "Publish articles, research, or case studies to establish a documented record of contributions to the field"
  );
  nextSteps.push(isEs
    ? "Documenta señales de interés de entidades de EE.UU.: cartas de organizaciones, invitaciones, acuerdos de colaboración"
    : "Document signals of interest from U.S. entities: letters from organizations, invitations, collaboration agreements"
  );

  // ── Recommended evidence — filtered by weakest prong ─────────────────────
  if (weakestProng === "prong1") {
    recommendedEvidence.push(
      isEs ? "Descripción específica del emprendimiento propuesto en EE.UU. (no tu cargo o campo general)" : "Specific description of proposed U.S. endeavor (not your job title or general field)",
      isEs ? "Informes de la industria o datos gubernamentales que muestren demanda nacional en tu campo" : "Industry reports or government data showing national demand in your field",
      isEs ? "Datos del BLS, NIH, DOE u otras agencias que vinculen tu campo a prioridades nacionales" : "BLS, NIH, DOE, or other agency data linking your field to national priorities",
      isEs ? "Evidencia de interés de instituciones o empresas de EE.UU. en tu trabajo (cartas, acuerdos, invitaciones)" : "Evidence of interest from U.S. institutions or companies in your work (letters, agreements, invitations)",
      isEs ? "Publicaciones o cobertura de noticias sobre la importancia nacional de tu campo específico de emprendimiento" : "Publications or news coverage about the national importance of your specific endeavor field",
    );
  } else if (weakestProng === "prong2") {
    recommendedEvidence.push(
      isEs ? "Diplomas de títulos avanzados y transcripciones oficiales (Maestría, Doctorado o equivalente)" : "Advanced degree diplomas and official transcripts (Master's, PhD, or equivalent)",
      isEs ? "Cartas de empleo que muestren responsabilidad progresiva y roles de liderazgo en el campo" : "Employment letters showing progressive responsibility and leadership roles in the field",
      isEs ? "Publicaciones, patentes u otros resultados documentados de proyectos con impacto medible" : "Publications, patents, or other documented project outcomes with measurable impact",
      isEs ? "Cartas de expertos de EE.UU. que describan específicamente tu expertise y su impacto" : "Letters from U.S. experts specifically describing your expertise and its impact",
      isEs ? "Métricas cuantificables: citas, usuarios, ingresos generados, tasas de adopción, alcance de proyectos" : "Quantifiable metrics: citations, users, revenue generated, adoption rates, project reach",
    );
  } else {
    recommendedEvidence.push(
      isEs ? "Evidencia de trabajo por cuenta propia, contratos con múltiples clientes, o que el proceso PERM es impracticable para tu situación" : "Evidence of self-employment, contracts with multiple clients, or that the PERM process is impractical for your situation",
      isEs ? "Cartas de entidades de EE.UU. que expresen necesidad específica de tu expertise (no simplemente referencias de carácter)" : "Letters from U.S. entities expressing specific need for your expertise (not simply character references)",
      isEs ? "Documentación de que tus contribuciones benefician a EE.UU. independientemente de la disponibilidad de trabajadores competidores" : "Documentation that your contributions benefit the U.S. regardless of competing U.S. worker availability",
      isEs ? "Plan de negocios concreto o plan de actividades en EE.UU. con hitos específicos" : "Concrete business plan or U.S. activities plan with specific milestones",
      isEs ? "Evidencia de urgencia o singularidad: escasez documentada en el campo, impacto de tiempo-crítico, adopción por terceros" : "Evidence of urgency or uniqueness: documented field shortage, time-critical impact, third-party adoption",
    );
  }

  // Always append standard base evidence
  recommendedEvidence.push(
    isEs ? "Diplomas y transcripciones del título avanzado relacionado" : "Diplomas and transcripts of the related advanced degree",
    isEs ? "Cartas de referencia de expertos reconocidos en tu campo que no sean tus empleadores directos" : "Reference letters from recognized experts in your field who are not your direct employers",
    isEs ? "Evidencia de reconocimiento (premios, cobertura de medios especializados, citas de tu trabajo)" : "Evidence of recognition (awards, specialized media coverage, citations of your work)",
    isEs ? "Declaración narrativa del emprendimiento propuesto y su importancia nacional" : "Narrative statement of proposed endeavor and its national importance",
  );

  // ──────────────────────────────────────────────────────────────────────────
  // SCORING FACTORS (normalized to 0–100 per factor; weights reflect
  // each prong's share of the 100-point total)
  // ──────────────────────────────────────────────────────────────────────────
  const factors: VisaScoringFactor[] = [
    {
      factor: "prong1_merit_national_importance",
      weight: 0.33,
      score: Math.round((prong1 / 33) * 100),
      label: isEs
        ? "Prong 1 — Mérito sustancial e importancia nacional del emprendimiento"
        : "Prong 1 — Substantial merit and national importance of endeavor",
      present: prong1 >= 10,
    },
    {
      factor: "prong2_well_positioned",
      weight: 0.40,
      score: Math.round((prong2 / 40) * 100),
      label: isEs
        ? "Prong 2 — Bien posicionado para avanzar el emprendimiento"
        : "Prong 2 — Well positioned to advance the endeavor",
      present: prong2 >= 20,
    },
    {
      factor: "prong3_waiver_benefit",
      weight: 0.27,
      score: Math.round((prong3 / 27) * 100),
      label: isEs
        ? "Prong 3 — Beneficioso dispensar el requisito de oferta de empleo"
        : "Prong 3 — Beneficial to waive job offer requirement",
      present: prong3 >= 8,
    },
  ];

  return {
    visaType: "EB-2-NIW",
    totalScore: Math.round(total),
    confidence: mapConfidence(total),
    meetsMinimumThreshold: total >= MINIMUM_THRESHOLD,
    ageOutWarning: !!answers.dependentAges?.some((age) => age >= 19 && age <= 21),
    contextualNotice,
    factors,
    strengths,
    weaknesses,
    riskFactors,
    nextSteps,
    recommendedEvidence,
    processingTimeMonths: [12, 36],
    estimatedCostUsd: [3000, 10000],
  };
}
