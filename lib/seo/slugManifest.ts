export type VisaSlugEntry = {
  slug: string;
  visaType: string;
  profession?: string;
  country?: string;
  titleEn: string;
  titleEs: string;
  descriptionEn: string;
  descriptionEs: string;
};

export const SLUG_MANIFEST: VisaSlugEntry[] = [
  // Generic visa guides
  {
    slug: "o1-visa-guide",
    visaType: "O-1",
    titleEn: "O-1 Visa Guide: Extraordinary Ability",
    titleEs: "Guía de Visa O-1: Habilidad Extraordinaria",
    descriptionEn: "Learn if you qualify for the O-1 visa for individuals with extraordinary ability in science, arts, education, business, or athletics.",
    descriptionEs: "Descubre si calificas para la visa O-1 para personas con habilidad extraordinaria en ciencias, artes, educación, negocios o atletismo.",
  },
  {
    slug: "h1b-visa-specialty-occupations",
    visaType: "H-1B",
    titleEn: "H-1B Visa for Specialty Occupations",
    titleEs: "Visa H-1B para Ocupaciones Especializadas",
    descriptionEn: "Everything you need to know about the H-1B visa: requirements, the annual lottery, and how to find a sponsoring employer.",
    descriptionEs: "Todo lo que necesitas saber sobre la visa H-1B: requisitos, la lotería anual y cómo encontrar un empleador patrocinador.",
  },
  {
    slug: "eb2-niw-engineers",
    visaType: "EB-2-NIW",
    titleEn: "EB-2 NIW: Green Card Without Employer Sponsor",
    titleEs: "EB-2 NIW: Green Card Sin Patrocinador de Empleador",
    descriptionEn: "The EB-2 National Interest Waiver lets qualified professionals self-petition for a green card without an employer sponsor.",
    descriptionEs: "La visa EB-2 Waiver de Interés Nacional permite a profesionales calificados solicitar una green card sin patrocinador.",
  },
  {
    slug: "f1-student-visa-guide",
    visaType: "F-1",
    titleEn: "F-1 Student Visa: Complete Guide",
    titleEs: "Visa F-1 de Estudiante: Guía Completa",
    descriptionEn: "Step-by-step guide to the F-1 student visa: admission, SEVIS, OPT, and maintaining status while studying in the U.S.",
    descriptionEs: "Guía paso a paso de la visa F-1 de estudiante: admisión, SEVIS, OPT y cómo mantener tu estatus mientras estudias en EE.UU.",
  },
  {
    slug: "l1-visa-founders",
    visaType: "L-1",
    titleEn: "L-1 Visa for Founders & Executives",
    titleEs: "Visa L-1 para Fundadores y Ejecutivos",
    descriptionEn: "The L-1 visa allows founders and executives to transfer to a U.S. entity. Learn about L-1A (managers) vs. L-1B (specialized knowledge).",
    descriptionEs: "La visa L-1 permite a fundadores y ejecutivos transferirse a una entidad en EE.UU. Conoce las diferencias entre L-1A y L-1B.",
  },
  {
    slug: "e2-investor-visa-guide",
    visaType: "E-2",
    titleEn: "E-2 Investor Visa: Treaty Country Guide",
    titleEs: "Visa E-2 de Inversionista: Guía de País Tratado",
    descriptionEn: "The E-2 treaty investor visa lets nationals from treaty countries invest and manage a business in the United States.",
    descriptionEs: "La visa E-2 de inversionista permite a nacionales de países con tratado invertir y gestionar un negocio en Estados Unidos.",
  },
  {
    slug: "b1b2-tourist-visa-strong-ties",
    visaType: "B1/B2",
    titleEn: "B1/B2 Visitor Visa: Proving Strong Home Ties",
    titleEs: "Visa B1/B2 de Visitante: Cómo Demostrar Vínculos con tu País",
    descriptionEn: "Learn how to demonstrate strong ties to your home country to successfully obtain a B1/B2 tourist visa for the United States.",
    descriptionEs: "Aprende a demostrar vínculos sólidos con tu país de origen para obtener exitosamente una visa de turista B1/B2 para Estados Unidos.",
  },
  // Profession-specific O-1
  {
    slug: "o1-visa-software-engineers",
    visaType: "O-1",
    profession: "Software Engineer",
    titleEn: "O-1 Visa for Software Engineers",
    titleEs: "Visa O-1 para Ingenieros de Software",
    descriptionEn: "Can software engineers qualify for the O-1 visa? Learn what evidence USCIS looks for: open source contributions, speaking, awards.",
    descriptionEs: "¿Pueden los ingenieros de software calificar para la visa O-1? Conoce qué evidencia busca USCIS: contribuciones open source, charlas, premios.",
  },
  {
    slug: "o1-visa-designers",
    visaType: "O-1",
    profession: "Designer",
    titleEn: "O-1 Visa for Designers & Creative Professionals",
    titleEs: "Visa O-1 para Diseñadores y Creativos",
    descriptionEn: "Designers, art directors, and UX professionals can qualify for the O-1 visa. Here's what extraordinary ability looks like in creative fields.",
    descriptionEs: "Diseñadores, directores de arte y profesionales de UX pueden calificar para la visa O-1. Así se ve la habilidad extraordinaria en campos creativos.",
  },
  {
    slug: "o1-visa-musicians",
    visaType: "O-1",
    profession: "Musician",
    titleEn: "O-1 Visa for Musicians & Performing Artists",
    titleEs: "Visa O-1 para Músicos y Artistas del Espectáculo",
    descriptionEn: "The O-1B visa covers musicians, performers, and artists. Learn about the peer group consultation requirement and qualifying criteria.",
    descriptionEs: "La visa O-1B cubre músicos, artistas y performers. Conoce el requisito de consulta con grupo de pares y los criterios de calificación.",
  },
  {
    slug: "eb2-niw-researchers",
    visaType: "EB-2-NIW",
    profession: "Researcher",
    titleEn: "EB-2 NIW for Researchers & Scientists",
    titleEs: "EB-2 NIW para Investigadores y Científicos",
    descriptionEn: "Researchers and scientists are ideal EB-2 NIW candidates. Learn how to structure your petition using the Matter of Dhanasar framework.",
    descriptionEs: "Los investigadores y científicos son candidatos ideales para el EB-2 NIW. Aprende a estructurar tu petición usando el marco de Matter of Dhanasar.",
  },
  // Country-specific
  {
    slug: "us-visas-for-argentinian-professionals",
    visaType: "O-1",
    country: "Argentina",
    titleEn: "U.S. Visas for Argentine Professionals",
    titleEs: "Visas de EE.UU. para Profesionales Argentinos",
    descriptionEn: "Guide to the best U.S. visa options for Argentine professionals: O-1, EB-2 NIW, H-1B, E-2. Check your eligibility in minutes.",
    descriptionEs: "Guía de las mejores opciones de visa de EE.UU. para profesionales argentinos: O-1, EB-2 NIW, H-1B, E-2. Verifica tu elegibilidad en minutos.",
  },
  {
    slug: "us-visas-for-mexican-professionals",
    visaType: "O-1",
    country: "Mexico",
    titleEn: "U.S. Visas for Mexican Professionals",
    titleEs: "Visas de EE.UU. para Profesionales Mexicanos",
    descriptionEn: "Best U.S. visa paths for Mexican nationals: E-2 investor visa (Mexico is a treaty country), O-1, TN, H-1B. Find your best option.",
    descriptionEs: "Mejores rutas de visa para ciudadanos mexicanos: E-2 (México es país con tratado), O-1, TN, H-1B. Encuentra tu mejor opción.",
  },
  {
    slug: "us-visas-for-colombian-professionals",
    visaType: "O-1",
    country: "Colombia",
    titleEn: "U.S. Visas for Colombian Professionals",
    titleEs: "Visas de EE.UU. para Profesionales Colombianos",
    descriptionEn: "Visa options for Colombian professionals looking to live and work in the United States. Compare O-1, H-1B, EB-2 NIW, and more.",
    descriptionEs: "Opciones de visa para profesionales colombianos que desean vivir y trabajar en Estados Unidos. Compara O-1, H-1B, EB-2 NIW y más.",
  },
  {
    slug: "us-visas-for-brazilian-professionals",
    visaType: "EB-2-NIW",
    country: "Brazil",
    titleEn: "U.S. Visas for Brazilian Professionals",
    titleEs: "Visas de EE.UU. para Profesionales Brasileños",
    descriptionEn: "Visa paths for Brazilian nationals: EB-2 NIW (no employer required), O-1, H-1B. Note: Brazil is not an E-2 treaty country.",
    descriptionEs: "Rutas de visa para ciudadanos brasileños: EB-2 NIW (sin empleador requerido), O-1, H-1B. Nota: Brasil no es país con tratado E-2.",
  },
  {
    slug: "us-visas-for-venezuelan-professionals",
    visaType: "O-1",
    country: "Venezuela",
    titleEn: "U.S. Visas for Venezuelan Professionals",
    titleEs: "Visas de EE.UU. para Profesionales Venezolanos",
    descriptionEn: "U.S. visa options for Venezuelan professionals and their families, including TPS status considerations and long-term pathways.",
    descriptionEs: "Opciones de visa de EE.UU. para profesionales venezolanos y sus familias, incluyendo consideraciones de estatus TPS y rutas a largo plazo.",
  },
  {
    slug: "us-visas-for-peruvian-professionals",
    visaType: "O-1",
    country: "Peru",
    titleEn: "U.S. Visas for Peruvian Professionals",
    titleEs: "Visas de EE.UU. para Profesionales Peruanos",
    descriptionEn: "Find the best U.S. visa for Peruvian professionals: E-2 investor visa (Peru is a treaty country), O-1, H-1B, EB-2 NIW.",
    descriptionEs: "Encuentra la mejor visa de EE.UU. para profesionales peruanos: E-2 (Perú es país con tratado), O-1, H-1B, EB-2 NIW.",
  },
  {
    slug: "us-visas-for-chilean-professionals",
    visaType: "E-2",
    country: "Chile",
    titleEn: "U.S. Visas for Chilean Professionals",
    titleEs: "Visas de EE.UU. para Profesionales Chilenos",
    descriptionEn: "Chile has a Free Trade Agreement with the U.S. — Chileans can access H-1B1, E-1/E-2, and TN-like provisions. Learn more.",
    descriptionEs: "Chile tiene un TLC con EE.UU. — los chilenos pueden acceder a H-1B1, E-1/E-2 y disposiciones similares al TN. Conoce más.",
  },
  // J-1 — Exchange Visitor
  {
    slug: "j1-visa-exchange-visitor",
    visaType: "j1",
    titleEn: "J-1 Exchange Visitor Visa: Researchers, Professors, Trainees & Interns",
    titleEs: "Visa J-1 de Visitante de Intercambio: Investigadores, Profesores, Pasantes y Especialistas",
    descriptionEn:
      "The J-1 visa allows researchers, professors, trainees, and specialists to participate in approved U.S. exchange programs. Critical: some J-1 holders are subject to a two-year home residency requirement before changing visa status.",
    descriptionEs:
      "La visa J-1 permite a investigadores, profesores, pasantes y especialistas participar en programas de intercambio aprobados en EE.UU. Importante: algunos titulares están sujetos al requisito de residencia de dos años antes de cambiar de estatus.",
  },
  // EB-3 — Employment-Based Third Preference
  {
    slug: "eb3-skilled-workers-professionals",
    visaType: "eb3",
    titleEn: "EB-3 Green Card for Skilled Workers and Professionals",
    titleEs: "Green Card EB-3 para Trabajadores Calificados y Profesionales",
    descriptionEn:
      "The EB-3 green card covers professionals (EB-3A), skilled workers (EB-3B), and other workers (EB-3C). Requires employer sponsorship and PERM — except nurses and physical therapists (Schedule A).",
    descriptionEs:
      "La green card EB-3 cubre profesionales (EB-3A), trabajadores calificados (EB-3B) y otros trabajadores (EB-3C). Requiere patrocinio de empleador y PERM — excepto enfermeros y fisioterapeutas (Anexo A).",
  },
  // TN — USMCA Professional
  {
    slug: "tn-visa-usmca-professionals",
    visaType: "tn",
    titleEn: "TN Visa: USMCA Professional Work Visa for Mexico & Canada",
    titleEs: "Visa TN: Visa de Trabajo Profesional USMCA para México y Canadá",
    descriptionEn:
      "The TN visa allows Mexican and Canadian professionals in 63 specific USMCA occupations to work in the U.S. No lottery, no cap, no labor certification — and renewable indefinitely.",
    descriptionEs:
      "La visa TN permite a profesionales mexicanos y canadienses en 63 ocupaciones USMCA específicas trabajar en EE.UU. Sin lotería, sin límite, sin certificación laboral — y renovable indefinidamente.",
  },
  {
    slug: "tn-visa-profesionales-mexicanos",
    visaType: "tn",
    country: "Mexico",
    titleEn: "TN Visa Guide for Mexican Professionals",
    titleEs: "Guía de Visa TN para Profesionales Mexicanos",
    descriptionEn:
      "Mexican professionals in USMCA-listed occupations can work in the U.S. on TN status. Learn about consular processing, the 42% denial rate, and how to build a strong application.",
    descriptionEs:
      "Los profesionales mexicanos en ocupaciones listadas en el USMCA pueden trabajar en EE.UU. con estatus TN. Conoce el procesamiento consular, la tasa de rechazo del 42% y cómo preparar una solicitud sólida.",
  },
  // EB-1C
  {
    slug: "visas/eb1c-multinational-executive",
    visaType: "eb1c",
    titleEn: "EB-1C Green Card for Multinational Executives & Managers",
    titleEs: "Green Card EB-1C para Ejecutivos y Gerentes Multinacionales",
    descriptionEn: "The EB-1C green card is available to multinational executives and managers — no PERM labor certification required. FY2025 approval rate: 97%. L-1A holders are ideally positioned.",
    descriptionEs: "La green card EB-1C está disponible para ejecutivos y gerentes multinacionales — sin certificación laboral PERM. Tasa de aprobación FY2025: 97%. Los titulares de L-1A están idealmente posicionados.",
  },
  // Niche
  {
    slug: "us-visa-startup-founders",
    visaType: "O-1",
    profession: "Founder",
    titleEn: "U.S. Visa Options for Startup Founders",
    titleEs: "Opciones de Visa de EE.UU. para Fundadores de Startups",
    descriptionEn: "Startup founders have multiple U.S. visa paths: O-1A, EB-2 NIW, E-2 (treaty countries), and L-1 for companies with U.S. entities.",
    descriptionEs: "Los fundadores de startups tienen múltiples rutas de visa: O-1A, EB-2 NIW, E-2 (países con tratado) y L-1 para empresas con entidad en EE.UU.",
  },
  {
    slug: "us-visa-digital-nomads",
    visaType: "B1/B2",
    titleEn: "U.S. Visa Options for Digital Nomads",
    titleEs: "Opciones de Visa para Nómadas Digitales",
    descriptionEn: "There is no official U.S. digital nomad visa — but B1/B2, O-1, and other paths exist. Learn what's legal and what's not.",
    descriptionEs: "No existe una visa oficial de nómada digital en EE.UU., pero existen rutas como B1/B2, O-1 y otras. Aprende qué es legal y qué no.",
  },
  {
    slug: "us-visa-content-creators",
    visaType: "O-1",
    profession: "Content Creator",
    titleEn: "U.S. Visa for Content Creators & Influencers",
    titleEs: "Visa de EE.UU. para Creadores de Contenido e Influencers",
    descriptionEn: "Content creators and social media influencers may qualify for the O-1B visa if they demonstrate extraordinary achievement in their field.",
    descriptionEs: "Los creadores de contenido e influencers pueden calificar para la visa O-1B si demuestran logros extraordinarios en su campo.",
  },
];

export const VALID_SLUGS = new Set(SLUG_MANIFEST.map((e) => e.slug));

export function getSlugEntry(slug: string): VisaSlugEntry | undefined {
  return SLUG_MANIFEST.find((e) => e.slug === slug);
}
