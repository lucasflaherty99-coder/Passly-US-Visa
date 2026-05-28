// Legal basis: INA § 101(a)(15)(O)(i); 8 CFR § 214.2(o)
// Two-step framework: Kazarian v. USCIS, 596 F.3d 1115
// (9th Cir. 2010)
// Preponderance of evidence standard: Matter of Chawathe,
// 25 I&N Dec. 369 (AAO 2010)
// Oct 2, 2024 USCIS Policy Alert: team awards count if beneficiary
// is named; exhibitions must be "artistic" for criterion 7;
// comparable evidence permitted when standard criterion doesn't
// apply to the field.
// FY2025: O-1 approval rate ~94%; RFE rate ~18.7%
// (down from 30% in 2020). Strongest stable category in 2025-2026.
// O-1 is nonimmigrant (3 years, renewable indefinitely).
// No annual cap, no lottery. Self-petition possible via agent.
// O-1A and EB-1A share identical legal standard — strong O-1A
// profile strongly predicts EB-1A eligibility.
// This scoring covers O-1A (sciences, education, business,
// athletics). O-1B (arts, motion picture, TV) is a separate
// category with different criteria.
// This scoring is educational only — not legal advice.

import type { QuizAnswers, VisaResult, VisaScoringFactor } from "@/lib/types";
import { mapConfidence } from "./engine";

// Display threshold per spec; criteria-count gate overrides this
const DISPLAY_THRESHOLD = 45;

// ─── Criterion Scorer ─────────────────────────────────────────────────────────
// Each of the 8 O-1A criteria scored 0 (not met), ~5 (weak), or 10 (strong).
// Criterion 7 (artistic exhibitions) is O-1B specific; always 0 for O-1A.
//
// Max criteria contribution: 8 × 10 = 80
// Max final merits:                    35
// Total raw max:                      115
// Normalization: raw / 115 × 100 → 0–100

export function scoreO1(answers: Partial<QuizAnswers>, locale = "en"): VisaResult {
  const {
    hasAwards = false,
    hasMediaCoverage = false,
    hasJudgingExperience = false,
    hasPublications = false,
    publicationsCount,
    hasMemberships = false,
    hasSpeakingEngagements = false,
    hasPortfolio = false,
    patents = false,
    recognitionBeyondEmployer,
    incomeRange = "<30k",
    yearsExperience = 0,
    isFounder = false,
    hasManagementExperience = false,
    longTermGoal,
    hasOverstay = false,
    hasDenial = false,
  } = answers;

  const isEs = locale === "es";
  const recog = recognitionBeyondEmployer; // undefined = unanswered, false = employer-only, true = field-wide

  // ──────────────────────────────────────────────────────────────────────────
  // STEP 1 — CRITERIA ASSESSMENT
  // 8 CFR § 214.2(o)(3)(iii): must satisfy at least 3 of 8 criteria
  // Each scored 0 / weak (~3–5) / strong (6–10)
  // ──────────────────────────────────────────────────────────────────────────

  // CRITERION 1 — Awards or prizes for excellence
  // AAO notes: research grants ≠ awards; patents ≠ awards unless nationally
  // recognized as such. Team awards count if beneficiary is named (Oct 2024).
  // Forbes 30U30, MacArthur Fellows = strong. "Employee of the month" = invalid.
  const c1 = (() => {
    if (!hasAwards) return 0;
    // Strong: national/international scope evidenced by media coverage + beyond-employer recognition
    if (recog === true && hasMediaCoverage) return 10;
    // Weak: award exists but scope unclear or regional
    return 3;
  })();

  // CRITERION 2 — Membership in elite associations requiring outstanding achievements
  // AAO notes: fee-based memberships do not qualify. Open-enrollment with degree
  // requirement does not qualify. Must show: association requires outstanding
  // achievements AND selection is judged by recognized experts.
  // IEEE Fellow, NAE Member = strong. LinkedIn Premium = invalid.
  const c2 = (() => {
    if (!hasMemberships) return 0;
    // Strong: beyond-employer recognition signals selection by recognized experts
    if (recog === true) return 10;
    // Weak: membership exists but selection criteria unclear
    return 3;
  })();

  // CRITERION 3 — Published material ABOUT the beneficiary (not BY the beneficiary)
  // AAO notes: literature citing someone's paper ≠ material about them. USCIS wants
  // substantial discussion. Paid/sponsored PR articles carry less weight than
  // independent editorial coverage. Blogs without editorial process: weak.
  const c3 = (() => {
    if (!hasMediaCoverage) return 0;
    // Strong: multiple independent editorial pieces; beyond-employer recognition
    // confirms field-level coverage rather than internal press
    if (recog === true) return 10;
    // Moderate: coverage exists but independence/scope uncertain
    return 6;
  })();

  // CRITERION 4 — Judging or reviewing work of others in same or allied field
  // AAO notes: peer review with editor letters = valid. Grant panels = valid.
  // Competition judging = valid. Must have DOCUMENTATION of actual service.
  // Easiest criterion to document but frequently submitted with insufficient evidence.
  const c4 = (() => {
    if (!hasJudgingExperience) return 0;
    // Strong: beyond-employer recognition suggests documented invitations from
    // recognized external organizations (editors, conference chairs, grant panels)
    if (recog === true) return 10;
    // Weak: claimed but full documentation uncertain
    return 5;
  })();

  // CRITERION 5 — Original contributions of major significance to the field
  // Most impactful AND hardest to satisfy criterion.
  // AAO notes: generic letters without impact evidence routinely dismissed.
  // Strongest evidence: citations, third-party adoption, measurable field impact.
  // Letters must identify specific contribution, explain impact with data, and
  // come from UNAFFILIATED experts. RFE trigger: "contributions are limited."
  const c5 = (() => {
    if (!hasPublications && !patents) return 0;
    const hasManyPubs = publicationsCount === "4-10" || publicationsCount === "10+";
    // Strong (10): patents + substantial publications = objective corroboration;
    // or 10+ pubs with field-wide recognition
    if ((patents && hasManyPubs) || (publicationsCount === "10+" && recog === true)) return 10;
    // Moderate (6): objective evidence with some recognition
    if ((patents || hasManyPubs) && recog === true) return 6;
    // Weak (2): evidence exists but impact documentation likely insufficient
    return 2;
  })();

  // CRITERION 6 — Authorship of scholarly articles in professional/major publications
  // AAO notes: quality over quantity; journal impact factor matters.
  // Field alignment required. LinkedIn articles / unvetted posts: insufficient.
  const c6 = (() => {
    if (!hasPublications) return 0;
    if (publicationsCount === "10+") return 10;
    if (publicationsCount === "4-10") return 7;
    if (publicationsCount === "1-3") return 4;
    return 2; // hasPublications but count unspecified
  })();

  // CRITERION 7 — Work displayed at artistic exhibitions or showcases
  // Per USCIS Policy Alert Oct 2, 2024: ONLY artistic exhibitions qualify.
  // Non-artistic exhibitions may qualify as comparable evidence with justification.
  // This criterion is O-1B specific. For O-1A: always 0 unless petitioner
  // is in a field where portfolio exhibitions are the field standard (e.g., design).
  // We use portfolio as a very partial comparable-evidence signal.
  const c7 = 0; // N/A for O-1A — artistic exhibitions criterion applies to O-1B

  // CRITERION 8 — Critical or leading role in organizations with distinguished reputation
  // AAO notes: must show BOTH (a) critical/leading role AND (b) distinguished org.
  // Honorary titles without authority: insufficient. Must involve decision-making.
  // Founders of notable companies often satisfy if company has distinguished reputation.
  const c8 = (() => {
    if (!isFounder && !hasManagementExperience) return 0;
    // Strong: beyond-employer recognition suggests org has distinguished reputation
    // (media coverage, rankings, notable clients independently documented)
    if (recog === true) return 10;
    // Moderate: role documented but org's distinguished reputation unclear
    return 5;
  })();

  // CRITERION 9 — High remuneration relative to others in the field
  // AAO notes: salary alone without comparative data is insufficient.
  // Must show COMPARISON against peers, not just the salary figure.
  // For freelancers: document rates vs. market rates.
  // Feb 2024 AAO non-precedent: near-90th-percentile salary failed without
  // methodology showing it was "high relative to others."
  const c9 = (() => {
    if (incomeRange === "200k+") return 10; // self-evidently above field median; BLS readily confirms
    if (incomeRange === "100k-200k") return 7; // above median for most STEM fields; comparative data needed
    if (incomeRange === "60k-100k") return 5; // borderline; field-dependent; requires BLS comparison
    return 0;
  })();

  // ──────────────────────────────────────────────────────────────────────────
  // CRITERIA SUMMARY
  // Count the 8 O-1A criteria only (exclude c7 exhibitions)
  // ──────────────────────────────────────────────────────────────────────────
  const criteriaValues = [c1, c2, c3, c4, c5, c6, c8, c9]; // 8 O-1A criteria
  const criteriaSum = c1 + c2 + c3 + c4 + c5 + c6 + c7 + c8 + c9;
  const criteriaCount = criteriaValues.filter((v) => v > 0).length;
  const strongCriteria = criteriaValues.filter((v) => v >= 6).length;
  const allMetAreWeak = criteriaValues.filter((v) => v > 0).every((v) => v < 6);

  // Criteria not yet met — for targeted next-step advice
  const criteriaNotMet: string[] = [];
  if (c1 === 0) criteriaNotMet.push(isEs ? "Premios nacionales o internacionales de excelencia" : "National or international awards for excellence");
  if (c2 === 0) criteriaNotMet.push(isEs ? "Membresía en asociación de élite (con selección por expertos)" : "Elite association membership (with expert-judged selection)");
  if (c3 === 0) criteriaNotMet.push(isEs ? "Material publicado SOBRE ti y tu trabajo (no por ti)" : "Published material ABOUT you and your work (not by you)");
  if (c4 === 0) criteriaNotMet.push(isEs ? "Evaluación documentada del trabajo de otros (revisión por pares, jurado)" : "Documented judging of others' work (peer review, competition judging)");
  if (c5 === 0) criteriaNotMet.push(isEs ? "Contribuciones originales de importancia mayor (con cartas de expertos no afiliados)" : "Original contributions of major significance (with unaffiliated expert letters)");
  if (c6 === 0) criteriaNotMet.push(isEs ? "Artículos académicos en publicaciones reconocidas del campo" : "Scholarly articles in recognized field publications");
  if (c8 === 0) criteriaNotMet.push(isEs ? "Rol crítico o de liderazgo en organización con reputación distinguida" : "Critical or leading role in a distinguished-reputation organization");
  if (c9 === 0) criteriaNotMet.push(isEs ? "Alta remuneración relativa a pares en el campo (con datos comparativos)" : "High remuneration relative to field peers (with comparative data)");

  // ──────────────────────────────────────────────────────────────────────────
  // STEP 2 — FINAL MERITS DETERMINATION (0–35)
  // Kazarian step two: holistic assessment of sustained acclaim and
  // top-of-field standing. Only runs if criteriaCount >= 3.
  // ──────────────────────────────────────────────────────────────────────────
  let finalMeritsScore = 0;

  if (criteriaCount >= 3) {
    // Sustained acclaim across multiple years (not one-off achievement)
    if (yearsExperience >= 3)      finalMeritsScore += 10;
    else if (yearsExperience >= 1) finalMeritsScore += 5;

    // Recognition extends beyond current employer/local area
    if (recog === true) finalMeritsScore += 10;
    else if (hasMediaCoverage || hasSpeakingEngagements) finalMeritsScore += 5;

    // Impact traceable by third parties — not self-reported
    // Proxy: many pubs (citations exist), peer review involvement, or media coverage
    const hasThirdPartyProof =
      (hasPublications && (publicationsCount === "4-10" || publicationsCount === "10+")) ||
      (patents && hasMediaCoverage) ||
      hasJudgingExperience;
    if (hasThirdPartyProof)                              finalMeritsScore += 10;
    else if (hasPublications || hasMediaCoverage)        finalMeritsScore += 5;

    // Demonstrated intent to continue in field in the U.S.
    // Proxy: has U.S. sponsor, business partner, or job offer
    // AAO 2024: demonstrated U.S. intent reversed initial denial for
    // digital marketing professional who provided LLC + U.S. client contracts
    const hasUsIntent =
      answers.hasUsSponsor === true  ||
      answers.hasUsBusinessPartner === true ||
      answers.temporaryJobSponsor === true;
    if (hasUsIntent) finalMeritsScore += 5;

    finalMeritsScore = Math.min(35, finalMeritsScore);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // TOTAL SCORE — normalized to 0–100
  // Max raw: 8 criteria × 10 = 80, finalMerits = 35 → max raw = 115
  // ──────────────────────────────────────────────────────────────────────────
  const MAX_RAW = 115;
  const raw = criteriaSum + finalMeritsScore;
  const total = Math.min(100, Math.round((raw / MAX_RAW) * 100));

  // ──────────────────────────────────────────────────────────────────────────
  // RFE RISK ASSESSMENT
  // ──────────────────────────────────────────────────────────────────────────
  let rfeRiskLevel: "low" | "medium" | "high";

  if (
    c5 < 6 ||                                          // contributions evidence weak
    (criteriaCount === 3 && strongCriteria < 2) ||     // borderline count, low quality
    allMetAreWeak ||                                   // all criteria are weak-evidence
    finalMeritsScore < 15                              // holistic picture doesn't hold
  ) {
    rfeRiskLevel = "high";
  } else if (
    criteriaCount >= 5 ||
    (criteriaCount >= 3 && strongCriteria >= 2 && finalMeritsScore >= 25)
  ) {
    rfeRiskLevel = "low";
  } else {
    rfeRiskLevel = "medium";
  }

  // ──────────────────────────────────────────────────────────────────────────
  // GATE: fewer than 3 criteria — do NOT surface as a result
  // Per spec: "Do NOT show O-1A as result. Instead show notice in
  // 'Consider building toward' section."
  // Implementation: set confidence = not_applicable → engine sorts to bottom
  // ──────────────────────────────────────────────────────────────────────────
  const belowCriteriaGate = criteriaCount < 3;
  const effectiveConfidence = belowCriteriaGate ? "not_applicable" : mapConfidence(total);
  const meetsMinimumThreshold = !belowCriteriaGate && total >= DISPLAY_THRESHOLD;

  // ──────────────────────────────────────────────────────────────────────────
  // CONTEXTUAL NOTICE
  // ──────────────────────────────────────────────────────────────────────────
  let contextualNotice: string | undefined;

  if (belowCriteriaGate) {
    // "Building toward" notice — list top 2 unmet criteria gaps
    const topGaps = criteriaNotMet.slice(0, 2).join(isEs ? " y " : " and ");
    contextualNotice = isEs
      ? `Tu perfil aún no alcanza el umbral mínimo para O-1A (3 de 8 criterios), pero estás construyendo en la dirección correcta. Enfocarte en: ${topGaps} podría hacer viable esta opción.`
      : `Your profile doesn't yet meet the minimum threshold for O-1A (3 of 8 criteria), but you're building in the right direction. Focusing on: ${topGaps} could make this pathway viable.`;
  } else if (rfeRiskLevel === "high" && total >= DISPLAY_THRESHOLD) {
    contextualNotice = isEs
      ? "Tu perfil cumple el umbral mínimo de criterios, pero la calidad de la evidencia en una o más áreas puede generar una RFE. Un abogado especializado en O-1A puede ayudarte a identificar y fortalecer los puntos débiles antes de presentar."
      : "Your profile meets the minimum criteria threshold, but evidence quality in one or more areas may trigger an RFE. An O-1A specialist attorney can help identify and strengthen weak points before filing.";
  } else if (c5 < 6 && criteriaCount >= 3) {
    contextualNotice = isEs
      ? "El criterio de contribuciones originales (Criterio 5) es el más frecuentemente cuestionado en RFEs de O-1A. Cartas de expertos no afiliados con declaraciones de impacto específicas — no genéricas — son esenciales."
      : "The original contributions criterion (Criterion 5) is most frequently challenged in O-1A RFEs. Unaffiliated expert letters with specific impact statements — not generic praise — are essential.";
  }

  // ──────────────────────────────────────────────────────────────────────────
  // NARRATIVE ARRAYS
  // ──────────────────────────────────────────────────────────────────────────
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const riskFactors: string[] = [];
  const nextSteps: string[] = [];
  const recommendedEvidence: string[] = [];

  // ── Strengths ─────────────────────────────────────────────────────────────
  if (criteriaCount >= 3) strengths.push(isEs
    ? `${criteriaCount} de los 8 criterios O-1A identificados — supera el umbral mínimo de Kazarian paso uno`
    : `${criteriaCount} of 8 O-1A criteria identified — meets Kazarian step-one minimum threshold`
  );
  if (strongCriteria >= 2) strengths.push(isEs
    ? `${strongCriteria} criterios con evidencia sólida — perfil competitivo para la determinación de méritos finales`
    : `${strongCriteria} criteria with strong evidence — competitive profile for final merits determination`
  );
  if (hasAwards && c1 === 10) strengths.push(isEs
    ? "Premios con reconocimiento nacional o internacional documentado — uno de los criterios más sólidos ante USCIS"
    : "Awards with documented national or international recognition — one of the strongest O-1A criteria"
  );
  if (c3 === 10) strengths.push(isEs
    ? "Cobertura mediática independiente sobre tu trabajo — evidencia directa de reconocimiento externo por terceros"
    : "Independent media coverage about your work — direct evidence of external third-party recognition"
  );
  if (hasJudgingExperience && c4 >= 5) strengths.push(isEs
    ? "Experiencia como evaluador/jurado con documentación — criterio frecuentemente probado y altamente considerado"
    : "Judging or peer review experience with documentation — frequently proven and highly regarded criterion"
  );
  if (c5 >= 6) strengths.push(isEs
    ? "Contribuciones originales respaldadas por evidencia objetiva — criterio más difícil y más impactante en O-1A"
    : "Original contributions backed by objective evidence — hardest and most impactful criterion in O-1A"
  );
  if (publicationsCount === "10+" || publicationsCount === "4-10") strengths.push(isEs
    ? "Historial sólido de publicaciones académicas — apoya criterios 5 (contribuciones) y 6 (artículos) simultáneamente"
    : "Solid scholarly publication record — supports criteria 5 (contributions) and 6 (articles) simultaneously"
  );
  if (patents) strengths.push(isEs
    ? "Patentes presentadas o concedidas — evidencia objetiva de contribuciones originales que no requiere cartas de expertos"
    : "Filed or granted patents — objective evidence of original contributions that doesn't rely on expert letters"
  );
  if (c8 === 10) strengths.push(isEs
    ? "Rol crítico o de liderazgo en organización con reputación distinguida — criterio satisfecho con documentación sólida"
    : "Critical or leading role in a distinguished-reputation organization — criterion satisfied with strong documentation"
  );
  if (c9 >= 7) strengths.push(isEs
    ? "Alta remuneración — evidencia de compensación significativamente superior al promedio del campo"
    : "High remuneration — evidence of compensation significantly above field average"
  );
  if (!isEs) strengths.push("No annual cap, no lottery — O-1A petitions can be filed year-round");
  else strengths.push("Sin cupo anual, sin lotería — las peticiones O-1A pueden presentarse todo el año");

  // ── Weaknesses ────────────────────────────────────────────────────────────
  if (belowCriteriaGate) weaknesses.push(isEs
    ? `Solo ${criteriaCount} de 8 criterios O-1A identificados — USCIS requiere al menos 3 para pasar al análisis de méritos finales`
    : `Only ${criteriaCount} of 8 O-1A criteria identified — USCIS requires at least 3 to proceed to final merits analysis`
  );
  if (c5 < 6 && (hasPublications || patents)) weaknesses.push(isEs
    ? "Las contribuciones originales necesitan corroboración objetiva — citaciones, adopción por terceros o cartas de expertos no afiliados con impacto específico"
    : "Original contributions need objective corroboration — citations, third-party adoption, or unaffiliated expert letters with specific impact"
  );
  if (c5 === 0) weaknesses.push(isEs
    ? "Sin evidencia de contribuciones originales — este es el criterio más importante de O-1A y el más frecuentemente cuestionado en RFEs"
    : "No evidence of original contributions — this is the most important O-1A criterion and most frequently challenged in RFEs"
  );
  if (c1 === 3) weaknesses.push(isEs
    ? "Los premios identificados pueden ser regionales o sin alcance documentado — se necesitan premios de nivel nacional o internacional con criterios de selección documentados"
    : "Identified awards may be regional or lack documented scope — national or international awards with documented selection criteria are needed"
  );
  if (c2 === 3) weaknesses.push(isEs
    ? "La membresía identificada puede no cumplir el estándar de 'logros sobresalientes evaluados por expertos' — evita asociaciones con inscripción abierta o pagadas"
    : "Identified membership may not meet the 'outstanding achievements judged by experts' standard — avoid open-enrollment or fee-based associations"
  );
  if (recog === false) weaknesses.push(isEs
    ? "El reconocimiento parece limitado al empleador actual — el reconocimiento externo e independiente del campo es esencial para el análisis de méritos finales"
    : "Recognition appears limited to current employer — independent field-wide recognition is essential for the final merits determination"
  );
  if (!hasJudgingExperience) weaknesses.push(isEs
    ? "El criterio de evaluación (revisión por pares, paneles de becas, jurado de concursos) es uno de los más fáciles de documentar y frecuentemente subestimado"
    : "The judging criterion (peer review, grant panels, competition judging) is one of the easiest to document and frequently overlooked"
  );
  if (c9 === 0) weaknesses.push(isEs
    ? "Sin evidencia de alta remuneración — incluso si el salario es alto, se necesitan datos comparativos (BLS, encuestas de la industria) para satisfacer este criterio"
    : "No evidence of high remuneration — even if salary is high, comparative data (BLS, industry surveys) is needed to satisfy this criterion"
  );

  // ── Risk factors ──────────────────────────────────────────────────────────
  if (rfeRiskLevel === "high" && !belowCriteriaGate) riskFactors.push(isEs
    ? "Riesgo elevado de RFE: la evidencia en uno o más criterios puede ser insuficiente bajo el escrutinio actual de USCIS — la preparación con un abogado es altamente recomendada antes de presentar"
    : "High RFE risk: evidence in one or more criteria may be insufficient under current USCIS scrutiny — attorney preparation is strongly recommended before filing"
  );
  if (allMetAreWeak && criteriaCount >= 3) riskFactors.push(isEs
    ? "Todos los criterios cumplidos tienen evidencia débil (< 6/10) — USCIS puede concluir que ningún criterio está satisfecho individualmente aunque se presenten múltiples"
    : "All met criteria have weak evidence (< 6/10) — USCIS may conclude no individual criterion is satisfied even if multiple are presented"
  );
  if (c5 < 6 && criteriaCount >= 3) riskFactors.push(isEs
    ? "Criterio 5 (contribuciones) con evidencia débil: trigger frecuente de RFE en 2024-2025. USCIS exige evidencia específica de impacto — cartas genéricas de elogio son rutinariamente descartadas"
    : "Criterion 5 (contributions) with weak evidence: frequent RFE trigger in 2024-2025. USCIS requires specific impact evidence — generic praise letters are routinely dismissed"
  );
  if (hasOverstay) riskFactors.push(isEs
    ? "Overstay previo: debe divulgarse en la petición y puede complicar la admisión, incluso con petición O-1A aprobada"
    : "Prior overstay: must be disclosed in petition and may complicate admission even with approved O-1A"
  );
  if (hasDenial) riskFactors.push(isEs
    ? "Negativa previa de visa: debe abordarse proactivamente en la carta de apoyo — explicar qué ha cambiado desde la negativa"
    : "Prior visa denial: must be addressed proactively in the support letter — explain what has changed since the denial"
  );

  // ── Next steps ────────────────────────────────────────────────────────────
  nextSteps.push(isEs
    ? "Consulta con un abogado especializado en peticiones O-1A — la tasa de aprobación FY2025 (~94%) refleja peticiones bien preparadas, no el universo de solicitantes elegibles"
    : "Consult an attorney specializing in O-1A petitions — the FY2025 approval rate (~94%) reflects well-prepared petitions, not all eligible applicants"
  );
  nextSteps.push(isEs
    ? "Mapea cada logro a uno de los 8 criterios regulatorios con evidencia de documentación específica para ese criterio"
    : "Map each achievement to one of the 8 regulatory criteria with evidence documentation specific to that criterion"
  );
  if (c5 < 6) nextSteps.push(isEs
    ? "Prioriza el Criterio 5 (contribuciones originales): solicita a 3+ expertos no afiliados cartas que describan el impacto específico de tu trabajo — no cartas de elogio genéricas"
    : "Prioritize Criterion 5 (original contributions): ask 3+ unaffiliated experts for letters describing specific impact of your work — not generic praise"
  );
  if (!hasJudgingExperience) nextSteps.push(isEs
    ? "Busca oportunidades de revisión por pares, paneles de becas o jurado de concursos — es el criterio más fácil de documentar"
    : "Seek peer review, grant panel, or competition judging opportunities — it is the easiest criterion to document"
  );
  if (!hasMediaCoverage) nextSteps.push(isEs
    ? "Busca cobertura editorial independiente: entrevistas en publicaciones del sector, artículos sobre tu trabajo — diferente de comunicados de prensa que tú generas"
    : "Seek independent editorial coverage: interviews in trade publications, articles about your work — distinct from press releases you generate"
  );
  if (criteriaCount >= 3) nextSteps.push(isEs
    ? "Identifica un empleador, agente o patrocinador en EE.UU. para presentar la petición I-129 — los agentes pueden representarte en múltiples contratos"
    : "Identify a U.S. employer, agent, or sponsor to file the I-129 petition — agents can represent you across multiple engagements"
  );

  // ── Recommended evidence — targeted to weakest criteria areas ─────────────
  // Evidence for unmet / weak criteria (priority order)
  if (c5 < 6) {
    recommendedEvidence.push(
      isEs ? "Cartas de expertos no afiliados con declaraciones de impacto ESPECÍFICAS (no genéricas): qué contribución, cómo afectó el campo, con datos cuantificables" : "Unaffiliated expert letters with SPECIFIC impact statements (not generic): what contribution, how it affected the field, with quantifiable data",
      isEs ? "Datos de citaciones (Google Scholar, Scopus, Web of Science) y evidencia de adopción por terceros" : "Citation data (Google Scholar, Scopus, Web of Science) and evidence of third-party adoption",
      isEs ? "Métricas de uso real: descargas, usuarios activos, ingresos generados, estándares de la industria adoptados" : "Real-world usage metrics: downloads, active users, revenue generated, industry standards adopted",
    );
  }
  if (c1 < 6 && hasAwards) {
    recommendedEvidence.push(
      isEs ? "Certificados de premios + información de la organización otorgante + documentación de criterios de selección + cobertura mediática del premio" : "Award certificates + granting organization info + selection criteria documentation + media coverage of the award",
    );
  }
  if (c4 === 0 || c4 === 5) {
    recommendedEvidence.push(
      isEs ? "Cartas de invitación de editores u organizadores + confirmación de que la revisión se completó + ejemplos de trabajos revisados (anonimizados)" : "Invitation letters from editors or organizers + confirmation of completed review + examples of work reviewed (anonymized)",
    );
  }
  if (c9 < 7) {
    recommendedEvidence.push(
      isEs ? "Cartas de oferta/talones de pago + datos BLS de comparación + encuesta salarial de la industria por rol y ubicación (Levels.fyi, Glassdoor, Radford)" : "Offer letters/pay stubs + BLS comparison data + industry salary survey by role and location (Levels.fyi, Glassdoor, Radford)",
    );
  }
  if (c8 < 5) {
    recommendedEvidence.push(
      isEs ? "Organigrama + cartas de liderazgo de la organización + evidencia de reputación distinguida de la organización (ingresos, clasificaciones, cobertura mediática, premios, clientes notables)" : "Org chart + letters from organizational leadership + evidence of org's distinguished reputation (revenue, rankings, media coverage, awards, notable clients)",
    );
  }
  // Always include
  recommendedEvidence.push(
    isEs ? "Copias completas de publicaciones con factor de impacto de la revista y conteos de citaciones" : "Full copies of publications with journal impact factor and citation counts",
    isEs ? "Cartas de expertos que describan tu posición en el campo — no solo tu rol en un proyecto concreto" : "Expert letters describing your standing in the field — not just your role in a specific project",
    isEs ? "Evidencia de contratos de trabajo, clientes u oportunidades de trabajo en EE.UU. (refuerza el análisis de méritos finales)" : "Evidence of U.S. work contracts, clients, or job opportunities (strengthens the final merits determination)",
  );

  // ── Scoring factors (normalized to 0–100 per factor) ──────────────────────
  const factors: VisaScoringFactor[] = [
    { factor: "c1_awards",        weight: 0.11, score: c1 * 10,                     label: isEs ? "Criterio 1 — Premios de excelencia" : "Criterion 1 — Awards for excellence",       present: c1 > 0 },
    { factor: "c2_membership",    weight: 0.10, score: c2 * 10,                     label: isEs ? "Criterio 2 — Membresía en asociación de élite" : "Criterion 2 — Elite association membership",  present: c2 > 0 },
    { factor: "c3_media",         weight: 0.11, score: Math.round((c3 / 10) * 100), label: isEs ? "Criterio 3 — Material publicado sobre ti" : "Criterion 3 — Published material about you",       present: c3 > 0 },
    { factor: "c4_judging",       weight: 0.11, score: c4 * 10,                     label: isEs ? "Criterio 4 — Evaluación del trabajo de otros" : "Criterion 4 — Judging others' work",          present: c4 > 0 },
    { factor: "c5_contributions", weight: 0.15, score: Math.round((c5 / 10) * 100), label: isEs ? "Criterio 5 — Contribuciones originales de importancia mayor" : "Criterion 5 — Original contributions of major significance", present: c5 > 0 },
    { factor: "c6_articles",      weight: 0.13, score: Math.round((c6 / 10) * 100), label: isEs ? "Criterio 6 — Artículos académicos" : "Criterion 6 — Scholarly articles",              present: c6 > 0 },
    { factor: "c8_role",          weight: 0.12, score: c8 * 10,                     label: isEs ? "Criterio 8 — Rol crítico en organización distinguida" : "Criterion 8 — Critical role in distinguished org",  present: c8 > 0 },
    { factor: "c9_salary",        weight: 0.10, score: Math.round((c9 / 10) * 100), label: isEs ? "Criterio 9 — Alta remuneración relativa a pares" : "Criterion 9 — High remuneration relative to peers",   present: c9 > 0 },
    { factor: "final_merits",     weight: 0.07, score: Math.round((finalMeritsScore / 35) * 100), label: isEs ? "Méritos finales — Kazarian paso dos" : "Final merits — Kazarian step two", present: finalMeritsScore > 0 },
  ];

  return {
    visaType: "O-1",
    totalScore: Math.round(total),
    confidence: effectiveConfidence,
    meetsMinimumThreshold,
    lotteryRisk: false,         // no lottery, no cap
    dualIntentRisk: false,      // O-1 allows dual intent; concurrent immigrant petition permitted
    ageOutWarning: checkAgeOut(answers.dependentAges),
    contextualNotice,
    factors,
    strengths,
    weaknesses,
    riskFactors,
    nextSteps,
    recommendedEvidence,
    processingTimeMonths: [3, 8],
    estimatedCostUsd: [3000, 8000],
  };
}

function checkAgeOut(ages?: number[]): boolean {
  return !!ages?.some((age) => age >= 19 && age <= 21);
}
