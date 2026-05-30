import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { SLUG_MANIFEST, VALID_SLUGS, getSlugEntry } from "@/lib/seo/slugManifest";
import { SEOPageTemplate } from "@/components/seo/SEOPageTemplate";
import { buildFAQSchema, buildArticleSchema } from "@/lib/seo/structuredData";
import { locales } from "@/i18n/config";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

type Props = {
  params: Promise<{ locale: string; "visa-slug": string }>;
};

export async function generateStaticParams() {
  const params: { locale: string; "visa-slug": string }[] = [];
  for (const locale of locales) {
    for (const entry of SLUG_MANIFEST) {
      params.push({ locale, "visa-slug": entry.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, "visa-slug": slug } = await params;
  const entry = getSlugEntry(slug);
  if (!entry) return {};

  const title = locale === "es" ? entry.titleEs : entry.titleEn;
  const description = locale === "es" ? entry.descriptionEs : entry.descriptionEn;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://passly.ai";
  const canonical = `${appUrl}/${locale}/${slug}`;
  const alternate = locale === "en" ? "es" : "en";

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        [locale === "en" ? "en-US" : "es-419"]: canonical,
        [alternate === "en" ? "en-US" : "es-419"]: `${appUrl}/${alternate}/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Passly AI",
    },
  };
}

// Per-slug content — returns bilingual FAQ and eligibility data
function getSlugContent(slug: string, locale: string) {
  const isEs = locale === "es";

  const content: Record<string, {
    faqs: { question: string; answer: string }[];
    eligibilityFactors: { label: string; description: string }[];
    commonMistakes: string[];
    relatedSlugs: { slug: string; label: string }[];
  }> = {
    "o1-visa-guide": {
      faqs: isEs ? [
        { question: "¿Qué significa 'habilidad extraordinaria'?", answer: "USCIS define habilidad extraordinaria como estar en el pequeño porcentaje que ha alcanzado la cima de su campo profesional." },
        { question: "¿Necesito un empleador patrocinador para la O-1?", answer: "No directamente. Puedes tener un agente que te represente en múltiples contrataciones, lo cual es común para freelancers y artistas." },
        { question: "¿Cuánto tiempo dura la O-1?", answer: "La O-1 se otorga inicialmente por hasta 3 años y puede renovarse en incrementos de 1 año sin límite." },
        { question: "¿La O-1 lleva a la green card?", answer: "No directamente, pero una O-1 fuerte puede ser una plataforma para una petición EB-1A (que tiene los mismos estándares de habilidad extraordinaria)." },
      ] : [
        { question: "What does 'extraordinary ability' mean?", answer: "USCIS defines extraordinary ability as being in the small percentage who have risen to the very top of their field." },
        { question: "Do I need an employer sponsor for O-1?", answer: "Not directly. You can have an agent representing you across multiple engagements, which is common for freelancers and artists." },
        { question: "How long does O-1 last?", answer: "O-1 is initially granted for up to 3 years and can be extended in 1-year increments with no set limit." },
        { question: "Does O-1 lead to a green card?", answer: "Not directly, but a strong O-1 can be a platform for an EB-1A petition (which has the same extraordinary ability standard)." },
      ],
      eligibilityFactors: isEs ? [
        { label: "Premio o reconocimiento nacional/internacional", description: "Premios de distinción en tu campo que demuestran que eres reconocido como destacado." },
        { label: "Cobertura mediática", description: "Artículos en publicaciones de la industria, medios principales u otros canales profesionales sobre tu trabajo." },
        { label: "Rol crítico en organizaciones de prestigio", description: "Haber ocupado posiciones de liderazgo o roles críticos en organizaciones con reputación distinguida." },
        { label: "Remuneración alta", description: "Ganar un salario o compensación significativamente superior al promedio de tu campo." },
        { label: "Publicaciones académicas o juzgar el trabajo de otros", description: "Haber publicado en revistas especializadas o sido seleccionado para juzgar el trabajo de otros profesionales." },
        { label: "Contribuciones originales de importancia mayor", description: "Trabajo original que ha tenido un impacto significativo y reconocido en tu campo." },
      ] : [
        { label: "National/international award or prize", description: "Awards of distinction in your field showing you are recognized as outstanding." },
        { label: "Media coverage", description: "Articles in trade publications, major media, or other professional channels about your work." },
        { label: "Critical role in prestigious organizations", description: "Having held leadership or critical roles at organizations with a distinguished reputation." },
        { label: "High remuneration", description: "Earning a salary or compensation significantly above the average in your field." },
        { label: "Scholarly articles or judging others", description: "Publishing in peer-reviewed journals or being selected to judge the work of other professionals." },
        { label: "Original contributions of major significance", description: "Original work that has had a significant recognized impact in your field." },
      ],
      commonMistakes: isEs ? [
        "Confundir premios locales o de empresa con reconocimiento nacional o internacional de la industria.",
        "No documentar la cobertura mediática existente — guarda capturas, links y artículos impresos.",
        "Solicitar sin 3 de los 8 criterios USCIS claramente documentados.",
        "No obtener cartas de apoyo de expertos reconocidos en tu campo.",
      ] : [
        "Confusing local or company awards with national or international industry recognition.",
        "Failing to document existing media coverage — save screenshots, links, and printed articles.",
        "Filing without at least 3 of USCIS's 8 criteria clearly documented.",
        "Not obtaining support letters from recognized experts in your field.",
      ],
      relatedSlugs: [
        { slug: "o1-visa-software-engineers", label: "O-1 for Engineers" },
        { slug: "o1-visa-designers", label: "O-1 for Designers" },
        { slug: "eb2-niw-engineers", label: "EB-2 NIW" },
      ],
    },
    "h1b-visa-specialty-occupations": {
      faqs: isEs ? [
        { question: "¿Qué es la lotería H-1B?", answer: "USCIS recibe más solicitudes de las que puede aprobar cada año. Las selecciona aleatoriamente — la tasa de selección ronda el 20-25% anualmente." },
        { question: "¿Mi profesión califica como 'ocupación especializada'?", answer: "Generalmente sí si requiere un título universitario en un campo específico relacionado directamente con el trabajo." },
        { question: "¿Puedo cambiar de empleador con H-1B?", answer: "Sí, mediante la portabilidad H-1B. Tu nuevo empleador debe presentar una nueva petición antes de que dejes el trabajo anterior." },
        { question: "¿Cuánto cuesta la H-1B?", answer: "Entre $5,000 y $10,000 en tarifas y honorarios legales, mayormente pagados por el empleador." },
      ] : [
        { question: "What is the H-1B lottery?", answer: "USCIS receives more petitions than it can approve each year. It randomly selects among them — the selection rate is around 20-25% annually." },
        { question: "Does my profession qualify as a 'specialty occupation'?", answer: "Generally yes if it requires a bachelor's degree in a specific field directly related to the job duties." },
        { question: "Can I change employers on H-1B?", answer: "Yes, via H-1B portability. Your new employer must file a new petition before you leave your current job." },
        { question: "How much does H-1B cost?", answer: "Between $5,000 and $10,000 in fees and legal costs, mostly paid by the employer." },
      ],
      eligibilityFactors: isEs ? [
        { label: "Título universitario en campo especializado", description: "Se requiere mínimo una licenciatura o equivalente en un campo directamente relacionado con el trabajo." },
        { label: "Empleador patrocinador en EE.UU.", description: "Necesitas una empresa estadounidense que presente la petición I-129 en tu nombre." },
        { label: "Oferta de trabajo en ocupación especializada", description: "El puesto debe requerir un título especializado según las guías del DOL." },
        { label: "Salario según nivel de posición", description: "El empleador debe pagar el salario prevaleciente (Nivel I-IV) según el DOL para esa ocupación y ubicación." },
      ] : [
        { label: "Bachelor's degree in specialized field", description: "Minimum bachelor's or equivalent in a field directly related to the job duties." },
        { label: "U.S. employer sponsor", description: "You need a U.S. company to file the I-129 petition on your behalf." },
        { label: "Job offer in specialty occupation", description: "The position must require a specialized degree per DOL guidelines." },
        { label: "Prevailing wage salary", description: "Employer must pay the prevailing wage (Level I-IV) per DOL for that occupation and location." },
      ],
      commonMistakes: isEs ? [
        "No registrarse en el período de registro de marzo — la ventana es de 2 semanas y no hay segunda oportunidad en ese ciclo.",
        "Asumir que ser seleccionado garantiza la aprobación — la selección es solo el primer paso.",
        "Cambiar de empleador sin iniciar el proceso de portabilidad correctamente.",
        "No verificar si la ocupación aparece en la lista de 'cap-exempt' (universidades, ONGs de investigación).",
      ] : [
        "Missing the March registration window — it's 2 weeks and there's no second chance that cycle.",
        "Assuming selection guarantees approval — selection is just the first step.",
        "Changing employers without properly initiating the portability process.",
        "Not checking if the occupation is cap-exempt (universities, research nonprofits).",
      ],
      relatedSlugs: [
        { slug: "o1-visa-guide", label: "O-1 Visa" },
        { slug: "eb2-niw-engineers", label: "EB-2 NIW" },
        { slug: "us-visa-startup-founders", label: "Startup Founders" },
      ],
    },
    "eb2-niw-engineers": {
      faqs: isEs ? [
        { question: "¿Qué significa NIW?", answer: "National Interest Waiver — exención de interés nacional. Te permite prescindir del requisito de oferta de trabajo y del proceso PERM." },
        { question: "¿Cuánto tiempo tarda el proceso EB-2 NIW?", answer: "Con procesamiento estándar, entre 12 y 24 meses. Con premium processing (I-140), la decisión llega en 15 días hábiles." },
        { question: "¿Necesito un abogado para el EB-2 NIW?", answer: "No es obligatorio, pero la mayoría de los solicitantes usan uno. La petición requiere un argumento legal cuidadoso." },
        { question: "¿En qué se diferencia el EB-2 del EB-1A?", answer: "El EB-1A (como la O-1) requiere el nivel más alto de logros. El EB-2 NIW es más accesible para profesionales con doctorado o maestría." },
      ] : [
        { question: "What does NIW stand for?", answer: "National Interest Waiver — it lets you bypass the job offer requirement and the PERM labor certification process." },
        { question: "How long does EB-2 NIW take?", answer: "With standard processing, 12-24 months. With premium processing (I-140), you get a decision in 15 business days." },
        { question: "Do I need a lawyer for EB-2 NIW?", answer: "It's not required, but most applicants use one. The petition requires a careful legal argument." },
        { question: "How is EB-2 different from EB-1A?", answer: "EB-1A (like O-1) requires the highest level of achievement. EB-2 NIW is more accessible for professionals with a PhD or master's." },
      ],
      eligibilityFactors: isEs ? [
        { label: "Grado avanzado (maestría o doctorado)", description: "O licenciatura más 5 años de experiencia progresiva en el campo." },
        { label: "Mérito sustancial e importancia nacional", description: "Tu trabajo debe tener implicaciones más allá del empleador — salud pública, STEM, educación, economía." },
        { label: "Bien posicionado para avanzar el esfuerzo", description: "Debes demostrar que eres la persona indicada: publicaciones, proyectos, reconocimiento de pares." },
        { label: "Interés nacional supera el requisito", description: "Que Estados Unidos se beneficia de permitirte quedarte sin proceso PERM estándar." },
      ] : [
        { label: "Advanced degree (master's or PhD)", description: "Or bachelor's plus 5 years of progressive experience in the field." },
        { label: "Substantial merit and national importance", description: "Your work must have implications beyond the employer — public health, STEM, education, economy." },
        { label: "Well positioned to advance the endeavor", description: "You must show you are the right person: publications, projects, peer recognition." },
        { label: "National interest outweighs requirement", description: "That the U.S. benefits from allowing you to stay without the standard PERM process." },
      ],
      commonMistakes: isEs ? [
        "No articular claramente los 3 pilares de Matter of Dhanasar en la carta de presentación.",
        "Confiar solo en el título académico sin mostrar impacto real del trabajo.",
        "No obtener cartas de reconocimiento de expertos que no te conocen personalmente.",
        "Subestimar la importancia de las citas de publicaciones y el factor h-index.",
      ] : [
        "Not clearly articulating all 3 prongs of Matter of Dhanasar in the cover letter.",
        "Relying solely on the academic degree without showing actual work impact.",
        "Not getting recognition letters from experts who don't know you personally.",
        "Underestimating the importance of publication citations and h-index.",
      ],
      relatedSlugs: [
        { slug: "o1-visa-guide", label: "O-1 Visa" },
        { slug: "eb2-niw-researchers", label: "EB-2 NIW for Researchers" },
        { slug: "h1b-visa-specialty-occupations", label: "H-1B Visa" },
      ],
    },
    "l1-visa-founders": {
      faqs: isEs ? [
        { question: "¿Cuál es la diferencia entre L-1A y L-1B?", answer: "La L-1A es para gerentes y ejecutivos; la L-1B es para empleados con conocimiento especializado de los sistemas, productos o metodologías de la empresa. Los titulares de L-1A pueden autopeticionarse para la green card EB-1C; los titulares de L-1B no." },
        { question: "¿Puedo abrir una nueva empresa en EE.UU. para la L-1?", answer: "Sí, pero la entidad extranjera debe haber operado al menos 1 año, debes haber trabajado allí 1 año y la entidad de EE.UU. debe tener una relación corporativa calificada. La aprobación inicial es de 1 año con expectativa de actividad empresarial demostrada en la renovación." },
        { question: "¿La L-1 lleva a una green card?", answer: "Los titulares de L-1A están bien posicionados para la green card EB-1C (ejecutivo/gerente multinacional), que no tiene lotería y tiene altas tasas de aprobación. La L-1B no tiene un equivalente directo de green card." },
        { question: "¿Puede venir mi familia?", answer: "Sí. Tu cónyuge e hijos solteros menores de 21 pueden entrar en estatus L-2. Los cónyuges en L-2 están autorizados a trabajar en EE.UU." },
      ] : [
        { question: "What is the difference between L-1A and L-1B?", answer: "L-1A is for managers and executives. L-1B is for employees with specialized knowledge of the company's systems, products, or methodologies. L-1A holders can self-petition for an EB-1C green card; L-1B holders cannot." },
        { question: "Can I open a new U.S. company for the L-1?", answer: "Yes, but the foreign entity must have been operating for at least 1 year, you must have worked there for 1 year, and the U.S. entity must have a qualifying corporate relationship. Initial approval is 1 year with the expectation of demonstrated business activity on renewal." },
        { question: "Does L-1 lead to a green card?", answer: "L-1A holders are well-positioned for the EB-1C green card (multinational executive/manager), which has no lottery and high approval rates. L-1B does not have a direct green card equivalent." },
        { question: "Can my family come with me?", answer: "Yes. Your spouse and unmarried children under 21 can come on L-2 status. L-2 spouses are authorized to work in the U.S." },
      ],
      eligibilityFactors: isEs ? [
        { label: "Empleo en organización calificada", description: "Debes haber trabajado para la entidad extranjera al menos 1 año continuo en los últimos 3 años en capacidad gerencial, ejecutiva o de conocimiento especializado." },
        { label: "Relación calificada entre entidades", description: "La empresa de EE.UU. debe ser empresa matriz, subsidiaria, afiliada o sucursal del empleador extranjero, con documentación de la estructura corporativa." },
        { label: "Distinción L-1A vs L-1B", description: "L-1A es para gerentes y ejecutivos y lleva al camino EB-1C. L-1B es para empleados con conocimiento especializado de los sistemas, productos o procedimientos de la empresa." },
        { label: "L-1 para nueva oficina", description: "Si abrís una nueva oficina en EE.UU., la aprobación inicial es de solo 1 año. Debes mostrar instalaciones físicas, plan de negocios y capital suficiente." },
      ] : [
        { label: "Employment with a qualifying organization", description: "You must have worked for the foreign entity for at least 1 continuous year within the last 3 years in a managerial, executive, or specialized knowledge capacity." },
        { label: "Qualifying relationship between entities", description: "The U.S. company must be a parent, subsidiary, affiliate, or branch of the foreign employer, documented with corporate structure evidence." },
        { label: "L-1A vs L-1B distinction", description: "L-1A is for managers and executives and leads to the EB-1C green card path. L-1B is for employees with specialized knowledge of the company's systems, products, or procedures." },
        { label: "New office L-1", description: "If opening a new U.S. office, initial approval is only 1 year. You must show a physical premises, business plan, and sufficient capitalization." },
      ],
      commonMistakes: isEs ? [
        "Solicitar L-1A cuando el rol es realmente de conocimiento especializado (L-1B), o viceversa — la distinción importa significativamente para la aprobación y la estrategia de green card.",
        "No documentar la relación corporativa calificada con organigramas, registros de propiedad y estados financieros.",
        "Para peticiones de nueva oficina: subestimar la evidencia requerida — contrato de arrendamiento físico, plan de negocios detallado, prueba de capitalización y cronograma realista de contratación.",
        "No rastrear el máximo de 5 años de L-1B (L-1A son 7 años) — alcanzar el límite significa salir del país y volver a calificar.",
      ] : [
        "Applying for L-1A when the role is actually specialized knowledge (L-1B), or vice versa — the distinction matters significantly for approval and green card strategy.",
        "Failing to document the qualifying corporate relationship with org charts, ownership records, and financial statements.",
        "For new office petitions, underestimating the evidence required: physical lease, detailed business plan, capitalization proof, and a realistic hiring timeline.",
        "Not tracking the L-1B 5-year maximum (L-1A is 7 years) — once you hit the cap, you cannot extend without leaving and re-qualifying.",
      ],
      relatedSlugs: [
        { slug: "us-visa-startup-founders", label: "Startup Founders" },
        { slug: "eb2-niw-engineers", label: "EB-2 NIW" },
        { slug: "e2-investor-visa-guide", label: "E-2 Investor Visa" },
      ],
    },
    "e2-investor-visa-guide": {
      faqs: isEs ? [
        { question: "¿Es Argentina un país con tratado E-2?", answer: "Sí. Los nacionales argentinos pueden solicitar la E-2. La entrevista consular suele realizarse en Buenos Aires." },
        { question: "¿Hay un monto mínimo de inversión?", answer: "No hay un mínimo fijo por ley, pero en la práctica los oficiales esperan montos proporcionales al negocio. La mayoría de los casos aprobados involucran entre $100,000 y $500,000 o más." },
        { question: "¿Cuánto tiempo es válida la visa E-2?", answer: "Depende del país. Para muchos países son 5 años con múltiples entradas, con renovaciones disponibles mientras la inversión y el negocio permanezcan activos." },
        { question: "¿Puede trabajar mi cónyuge con E-2?", answer: "Sí. Los cónyuges dependientes de E-2 reciben un EAD (Documento de Autorización de Empleo) y pueden trabajar para cualquier empleador en EE.UU." },
      ] : [
        { question: "Is Argentina an E-2 treaty country?", answer: "Yes. Argentine nationals can apply for E-2. The consular interview is typically in Buenos Aires." },
        { question: "Is there a minimum investment amount?", answer: "No fixed minimum by law, but in practice officers expect amounts proportional to the business. Most approved cases involve $100,000–$500,000+." },
        { question: "How long is the E-2 visa valid?", answer: "Depends on the country. For many countries, it's 5 years with multiple entries, with renewals available as long as the investment and business remain active." },
        { question: "Can my spouse work on E-2?", answer: "Yes. E-2 dependent spouses receive an EAD (Employment Authorization Document) and can work for any employer in the U.S." },
      ],
      eligibilityFactors: isEs ? [
        { label: "Nacionalidad de país con tratado", description: "Debes ser nacional de un país con tratado bilateral de inversión con EE.UU. Argentina, México, Colombia, España y la mayoría de Europa califican. Brasil y Venezuela NO tienen tratados E-2." },
        { label: "Inversión sustancial", description: "No hay mínimo fijo, pero se esperan montos proporcionales al costo total del negocio. Típicamente $100K+ para negocios de servicios; $500K+ para negocios con uso intensivo de capital. La inversión debe ser real, comprometida y en riesgo." },
        { label: "Empresa no marginal", description: "El negocio debe generar ingresos más allá de lo necesario para sostener solo a vos y tu familia. Debes mostrar un plan creíble de creación de empleo o contribución a la economía de EE.UU." },
        { label: "Propiedad y rol activo", description: "Debes ser propietario de al menos el 50% de la empresa y estar en un rol directivo o ejecutivo. Los inversores pasivos no califican." },
        { label: "Fondos de fuente lícita", description: "Debes documentar el origen de los fondos invertidos mediante estados de cuenta bancarios, ventas de propiedades, préstamos u otras fuentes verificables." },
      ] : [
        { label: "Nationality from a treaty country", description: "You must be a national of a country with a bilateral investment treaty with the U.S. Argentina, Mexico, Colombia, Spain, and most of Europe qualify. Brazil and Venezuela do NOT have E-2 treaties." },
        { label: "Substantial investment", description: "No fixed minimum, but USCIS expects amounts proportional to the total cost of the business. Typically $100K+ for service businesses; $500K+ for capital-intensive ones. The investment must be real, committed, and at risk." },
        { label: "Non-marginal enterprise", description: "The business must generate income beyond what is needed to support just you and your family. You must show a credible plan to create jobs or contribute to the U.S. economy." },
        { label: "Ownership and active role", description: "You must own at least 50% of the enterprise and be in a directing or executive role. Passive investors do not qualify." },
        { label: "Funds from a lawful source", description: "You must document the origin of the invested funds through bank statements, property sales, loans, or other verifiable sources." },
      ],
      commonMistakes: isEs ? [
        "Invertir desde un país sin tratado E-2 — esto te descalifica independientemente del monto de la inversión.",
        "Invertir en un negocio 'marginal' (ej. consultoría unipersonal sin empleados) sin un plan de crecimiento creíble.",
        "No poder rastrear el origen de los fondos — los oficiales consulares examinan esto con atención.",
        "Tratar la E-2 como permanente: es una visa de no inmigrante. No podés obtener una green card directamente a través de E-2 sin calificar también en otra categoría.",
        "Solicitar antes de que la inversión esté sustancialmente completa — los fondos deben estar comprometidos y en riesgo, no solo prometidos.",
      ] : [
        "Investing from a country without an E-2 treaty — this disqualifies you regardless of investment size.",
        "Investing in a 'marginal' business (e.g., a sole-proprietor consulting firm with no employees) without a credible growth plan.",
        "Not being able to trace the source of funds — consular officers scrutinize this closely.",
        "Treating the E-2 as permanent: it's a non-immigrant visa. You cannot directly get a green card through E-2 alone without also qualifying in another category.",
        "Applying before the investment is substantially complete — funds must be committed and at risk, not just pledged.",
      ],
      relatedSlugs: [
        { slug: "l1-visa-founders", label: "L-1 Visa" },
        { slug: "eb2-niw-engineers", label: "EB-2 NIW" },
        { slug: "us-visa-startup-founders", label: "Startup Founders" },
      ],
    },
    "f1-student-visa-guide": {
      faqs: isEs ? [
        { question: "¿Qué es SEVIS?", answer: "El Sistema de Información sobre Estudiantes y Visitantes de Intercambio es la base de datos del gobierno de EE.UU. que rastrea a los estudiantes con F-1. Debes pagar la tarifa SEVIS ($350) antes de tu entrevista de visa y mantener un estatus activo durante tus estudios." },
        { question: "¿Qué es el OPT?", answer: "La Práctica Profesional Opcional permite a los estudiantes con F-1 trabajar en su campo de estudio por hasta 12 meses después de graduarse. Los graduados en STEM pueden solicitar una extensión de 24 meses, para un total de 36 meses." },
        { question: "¿Puedo trabajar durante mis estudios?", answer: "Empleo en el campus hasta 20 horas por semana mientras las clases están en sesión (tiempo completo durante los recesos). El empleo fuera del campus requiere CPT (durante los estudios, por crédito) u OPT (después de la graduación)." },
        { question: "¿La F-1 lleva a una green card?", answer: "No directamente. Muchos graduados en F-1 pasan a H-1B, O-1 o EB-2 NIW después de completar sus estudios y el período de OPT." },
      ] : [
        { question: "What is SEVIS?", answer: "The Student and Exchange Visitor Information System is the U.S. government database that tracks F-1 students. You must pay the SEVIS fee ($350) before your visa interview and maintain active status throughout your studies." },
        { question: "What is OPT?", answer: "Optional Practical Training allows F-1 students to work in their field of study for up to 12 months after graduation. STEM graduates can apply for a 24-month STEM OPT extension, for a total of 36 months." },
        { question: "Can I work during my studies?", answer: "On-campus employment up to 20 hours/week while school is in session (full-time during breaks). Off-campus work requires CPT (during studies, for credit) or OPT (post-graduation)." },
        { question: "Does F-1 lead to a green card?", answer: "Not directly. Many F-1 graduates transition to H-1B, O-1, or EB-2 NIW after completing their studies and OPT period." },
      ],
      eligibilityFactors: isEs ? [
        { label: "Aceptación en escuela certificada por SEVP", description: "Debes tener un Formulario I-20 de una institución certificada por el Programa de Visitantes Estudiantes e Intercambio. No todas las escuelas de EE.UU. están certificadas." },
        { label: "Inscripción a tiempo completo", description: "La F-1 requiere inscripción a tiempo completo cada semestre, excepto el último semestre antes de graduarse si se necesitan menos créditos." },
        { label: "Apoyo financiero suficiente", description: "Debes demostrar fondos para cubrir matrícula y gastos de vida por al menos el primer año, generalmente mediante estados de cuenta, cartas de becas o declaraciones de patrocinadores." },
        { label: "Vínculos sólidos con tu país de origen", description: "Los oficiales consulares evalúan si tenés intención de regresar después de completar tus estudios. Empleo, propiedad, familia y otros vínculos ayudan a establecer esto." },
        { label: "Dominio del inglés", description: "La mayoría de las escuelas requieren puntajes TOEFL o IELTS. Algunas tienen programas de admisión condicional." },
      ] : [
        { label: "Acceptance at a SEVP-certified school", description: "You must have a Form I-20 from a Student and Exchange Visitor Program (SEVP)-certified institution. Not all U.S. schools are certified." },
        { label: "Full-time enrollment", description: "F-1 requires full-time enrollment each semester, except the last semester before graduation if fewer credits are needed." },
        { label: "Sufficient financial support", description: "You must demonstrate funds to cover tuition and living expenses for at least the first year, through bank statements, scholarship letters, or sponsor affidavits." },
        { label: "Strong ties to home country", description: "Consular officers assess whether you intend to return after completing your studies. Employment, property, family, and other ties help establish this." },
        { label: "English proficiency", description: "Most schools require TOEFL or IELTS scores. Some have conditional admission programs." },
      ],
      commonMistakes: isEs ? [
        "Trabajar sin autorización — la F-1 solo permite trabajo en el campus (hasta 20 horas/semana durante la escuela) y CPT/OPT fuera del campus. El trabajo no autorizado es una violación de estatus.",
        "No solicitar el OPT a tiempo — debes solicitarlo no antes de 90 días antes de la graduación. Perder la ventana significa perder 12 meses de autorización de trabajo post-graduación.",
        "Dejar vencer el I-20 — debes solicitar una extensión oportuna a tu DSO si tu programa tarda más de lo esperado.",
        "Transferirse de escuela sin la transferencia de SEVIS adecuada — no notificar al DSO de tu escuela actual antes de inscribirte en otro lugar puede terminar tu registro SEVIS.",
        "Tomar un permiso de ausencia no autorizado — reducir la carga horaria por debajo del tiempo completo sin autorización del DSO es una violación de estatus.",
      ] : [
        "Working without authorization — F-1 only allows on-campus work (up to 20 hours/week during school) and CPT/OPT off-campus. Unauthorized work is a status violation.",
        "Not applying for OPT on time — you must apply no earlier than 90 days before graduation. Missing the window means losing 12 months of post-graduation work authorization.",
        "Letting the I-20 expire — you must request a timely extension from your DSO if your program takes longer than expected.",
        "Transferring schools without proper SEVIS transfer — failing to notify your current school's DSO before enrolling elsewhere can terminate your SEVIS record.",
        "Taking an unauthorized leave of absence — dropping below full-time without DSO authorization is a status violation.",
      ],
      relatedSlugs: [
        { slug: "h1b-visa-specialty-occupations", label: "H-1B Visa" },
        { slug: "o1-visa-guide", label: "O-1 Visa" },
        { slug: "eb2-niw-engineers", label: "EB-2 NIW" },
      ],
    },
    "tn-visa-usmca-professionals": {
      faqs: isEs ? [
        { question: "¿Pueden los argentinos u otros latinoamericanos obtener una visa TN?", answer: "No. La TN es exclusivamente para ciudadanos mexicanos y canadienses bajo el acuerdo USMCA (antes TLCAN)." },
        { question: "¿Hay límite o lotería para la TN?", answer: "No. La TN no tiene cupo anual, no tiene lotería y no requiere certificación laboral. Es una de las categorías de visa de trabajo más accesibles para los profesionales elegibles." },
        { question: "¿Cuánto tiempo es válida la TN?", answer: "3 años por admisión, renovable indefinidamente. No hay un número máximo de renovaciones." },
        { question: "¿Puede venir mi familia?", answer: "El cónyuge e hijos solteros menores de 21 pueden entrar en estatus TD (Dependiente Comercial). Los dependientes TD no pueden trabajar en EE.UU." },
      ] : [
        { question: "Can Argentines or other Latin Americans get a TN visa?", answer: "No. TN is exclusively for Mexican and Canadian citizens under the USMCA agreement (formerly NAFTA)." },
        { question: "Is there a cap or lottery for TN?", answer: "No. TN has no annual cap, no lottery, and no labor certification requirement. It's one of the most accessible work visa categories for eligible professionals." },
        { question: "How long is TN valid?", answer: "3 years per admission, renewable indefinitely. There is no maximum number of renewals." },
        { question: "Can my family come with me?", answer: "Spouse and unmarried children under 21 can enter on TD (Trade Dependent) status. TD dependents cannot work in the U.S." },
      ],
      eligibilityFactors: isEs ? [
        { label: "Nacionalidad mexicana o canadiense ÚNICAMENTE", description: "Solo los ciudadanos de México y Canadá califican. Los residentes permanentes de esos países NO califican para la TN." },
        { label: "Ocupación en la lista del USMCA", description: "Tu trabajo debe coincidir con una de las 63 ocupaciones TN aprobadas exactamente — contador, ingeniero, abogado, médico (solo investigación/enseñanza), científico, analista de sistemas computacionales, entre otras." },
        { label: "Licenciatura en el campo relevante", description: "La mayoría de las categorías TN requieren un título directamente relacionado con la ocupación. Algunas permiten calificaciones alternativas. Un título general de negocios no califica para todas las ocupaciones." },
        { label: "Oferta de trabajo de un empleador de EE.UU.", description: "Necesitás una carta de un empleador de EE.UU. describiendo el puesto, tu rol, tus calificaciones y la duración del empleo." },
        { label: "Empleo prearreglado", description: "La TN es específica del empleador. No podés trabajar de forma freelance ni para múltiples empleadores simultáneamente sin aprobaciones TN separadas." },
      ] : [
        { label: "Mexican or Canadian nationality ONLY", description: "Only citizens of Mexico and Canada qualify. Permanent residents of those countries do NOT qualify for TN." },
        { label: "Occupation on the USMCA list", description: "Your job must match one of the 63 approved TN occupations exactly — accountant, engineer, lawyer, physician (research/teaching only), scientist, computer systems analyst, and others." },
        { label: "Bachelor's degree in the relevant field", description: "Most TN categories require a degree directly related to the occupation. Some allow alternative qualifications. A general business degree does not qualify for all TN occupations." },
        { label: "Job offer from a U.S. employer", description: "You need a letter from a U.S. employer describing the position, your role, your qualifications, and the duration of employment." },
        { label: "Prearranged employment", description: "TN is employer-specific. You cannot freelance or work for multiple employers simultaneously without separate TN approvals." },
      ],
      commonMistakes: isEs ? [
        "Confundir 'analista de sistemas computacionales' (elegible para TN) con 'desarrollador de software' o 'ingeniero de software' (no en la lista por nombre exacto) — el título del puesto en la carta del empleador debe coincidir con la lista del USMCA.",
        "Canadienses: no saber que pueden solicitar en el puerto de entrada (sin cita consular). Mexicanos: deben solicitar primero en un consulado de EE.UU. en México.",
        "Canadienses: no tener la carta del empleador lista en la frontera — la adjudicación es en el momento en el puerto de entrada; sin documentación, serás rechazado.",
        "Asumir que la TN tiene intención dual — NO la tiene. Solicitar una green card mientras estás en TN puede crear problemas de intención.",
        "No tener en cuenta los requisitos de grado específicos de la profesión — un título general de negocios no califica para todas las ocupaciones TN.",
      ] : [
        "Confusing 'computer systems analyst' (TN-eligible) with 'software developer' or 'software engineer' (not on the TN list by exact name) — the job title in the employer letter must match the USMCA list.",
        "Canadians: not realizing they can apply at the port of entry (no consular appointment needed). Mexicans: must apply at a U.S. consulate in Mexico first.",
        "Canadians: not having the employer letter ready at the border — TN is adjudicated on the spot at POE; without documentation, you will be turned away.",
        "Assuming TN has dual intent — it does NOT. Applying for a green card while on TN can create intent issues. Consult an attorney before pursuing permanent residency on TN.",
        "Not accounting for the profession-specific degree requirements — a general business degree does not qualify for all TN occupations.",
      ],
      relatedSlugs: [
        { slug: "h1b-visa-specialty-occupations", label: "H-1B Visa" },
        { slug: "l1-visa-founders", label: "L-1 Visa" },
        { slug: "o1-visa-guide", label: "O-1 Visa" },
      ],
    },
    "b1b2-tourist-visa-strong-ties": {
      faqs: isEs ? [
        { question: "¿Cuánto tiempo puedo quedarme con B-1/B-2?", answer: "La admisión suele otorgarse por 6 meses. Podés solicitar una extensión (Formulario I-539) por hasta 6 meses adicionales, pero las extensiones no están garantizadas." },
        { question: "¿Puedo solicitar una visa estando en EE.UU. con estatus B?", answer: "No podés solicitar una B-1/B-2 mientras estás en EE.UU. con estatus B. Debes salir del país y solicitar en un consulado de EE.UU. en el exterior." },
        { question: "¿Qué es ESTA?", answer: "Los nacionales de 42 países del Programa de Exención de Visa (principalmente Europa, Japón, Australia) pueden visitar EE.UU. por hasta 90 días sin visa. Argentina, México, Colombia y la mayoría de Latinoamérica NO están en el Programa de Exención de Visa y requieren una visa." },
        { question: "¿La B-2 permite tratamiento médico?", answer: "Sí. Las visitas médicas son un propósito válido para la B-2. Debes tener documentación del proveedor médico en EE.UU. y prueba de fondos suficientes para cubrir el tratamiento." },
      ] : [
        { question: "How long can I stay on B-1/B-2?", answer: "Admission is typically granted for 6 months. You can request an extension (Form I-539) for up to an additional 6 months, but extensions are not guaranteed." },
        { question: "Can I apply for a visa while already in the U.S.?", answer: "You cannot apply for a B-1/B-2 while in the U.S. on B status. You must leave and apply at a U.S. consulate abroad." },
        { question: "What is ESTA?", answer: "Nationals of 42 Visa Waiver Program countries (including most of Europe, Japan, Australia) can visit the U.S. for up to 90 days without a visa. Argentina, Mexico, Colombia, and most of Latin America are NOT in the Visa Waiver Program and require a visa." },
        { question: "Does B-2 allow medical treatment?", answer: "Yes. Medical visits are a valid purpose for B-2. You should have documentation from the medical provider in the U.S. and evidence of sufficient funds to cover treatment." },
      ],
      eligibilityFactors: isEs ? [
        { label: "Intención temporal", description: "Debes demostrar que tu visita es temporal y que tenés intención de regresar a tu país. La razón más común de rechazo es evidencia insuficiente de vínculos con tu país de origen." },
        { label: "Vínculos sólidos con el país de origen", description: "Empleo, propiedad inmueble, responsabilidades familiares y activos financieros en tu país de origen demuestran intención de no inmigrante." },
        { label: "Fondos suficientes para la visita", description: "Debes demostrar que podés cubrir tus gastos durante el viaje sin necesidad de trabajar en EE.UU." },
        { label: "Propósito claro de la visita", description: "B-1 es para actividades de negocios (reuniones, conferencias, negociaciones — no empleo). B-2 es para turismo, tratamiento médico o visita a familiares. La mayoría de las visas se otorgan como B-1/B-2 combinada." },
        { label: "Sin violaciones de visa previas", description: "Permanencias excesivas previas, trabajo no autorizado o tergiversación se ponderan fuertemente en contra de la aprobación." },
      ] : [
        { label: "Temporary intent", description: "You must demonstrate that your visit is temporary and that you intend to return to your home country. The most common reason for refusal is insufficient evidence of ties to your home country." },
        { label: "Strong home country ties", description: "Employment, property ownership, family responsibilities, and financial assets in your home country all help demonstrate non-immigrant intent." },
        { label: "Sufficient funds for the visit", description: "You must show you can cover your expenses during the trip without needing to work in the U.S." },
        { label: "Clear purpose of visit", description: "B-1 is for business activities (meetings, conferences, negotiations — not employment). B-2 is for tourism, medical treatment, or visiting family. Most visas are issued as a combined B-1/B-2." },
        { label: "No prior visa violations", description: "Prior overstays, unauthorized work, or misrepresentation are heavily weighted against approval." },
      ],
      commonMistakes: isEs ? [
        "Quedarse más tiempo del permitido en una visa anterior o en ESTA — esto crea una prohibición de reingreso de 3 o 10 años.",
        "Trabajar en EE.UU. con B-1/B-2 — es una violación grave. El trabajo remoto para un empleador extranjero es un área gris; trabajar para un empleador o clientes de EE.UU. está explícitamente prohibido.",
        "Llegar sin prueba de viaje de regreso o medios económicos — los oficiales en el puerto de entrada pueden negar la admisión incluso con una visa válida si los vínculos o los fondos no son creíbles.",
        "Tergiversar el propósito de la visita — decir 'turismo' cuando la intención real es asistir a entrevistas de trabajo o explorar opciones de inmigración es tergiversación, lo que crea una prohibición permanente de EE.UU.",
        "Solicitar sin historial de viajes y con vínculos débiles — los solicitantes por primera vez sin historial de viajes previos y sin vínculos sólidos con el país de origen enfrentan tasas de rechazo más altas.",
      ] : [
        "Overstaying a previous visa or ESTA — this creates a 3-year or 10-year bar from re-entry.",
        "Working in the U.S. on a B-1/B-2 — this is a serious violation. Remote work for a foreign employer is a gray area; working for a U.S. employer or U.S. clients is explicitly prohibited.",
        "Arriving without proof of onward travel or financial means — officers at the port of entry can deny admission even with a valid visa if ties or funds are not credible.",
        "Misrepresenting the purpose of the visit — saying 'tourism' when the real intent is to attend job interviews or explore immigration options is misrepresentation, which creates a permanent bar from the U.S.",
        "Applying with no travel history and weak ties — first-time applicants with no prior U.S. or international travel history and no strong home country ties face higher refusal rates.",
      ],
      relatedSlugs: [
        { slug: "o1-visa-guide", label: "O-1 Visa" },
        { slug: "e2-investor-visa-guide", label: "E-2 Investor Visa" },
        { slug: "f1-student-visa-guide", label: "F-1 Student" },
      ],
    },
  };

  // Default content for slugs without specific content
  const defaultContent = {
    faqs: isEs ? [
      { question: "¿Cómo sé si califico?", answer: "Utiliza nuestra herramienta de análisis gratuita para obtener una evaluación personalizada de tu elegibilidad en minutos." },
      { question: "¿Cuánto tiempo tarda el proceso?", answer: "Los tiempos varían según el tipo de visa. Consulta con un abogado de inmigración para obtener estimaciones actualizadas." },
      { question: "¿Necesito un abogado?", answer: "No es obligatorio, pero se recomienda especialmente para peticiones complejas. Un abogado puede maximizar tus probabilidades de éxito." },
      { question: "¿Qué documentos necesito?", answer: "Depende del tipo de visa. Nuestra herramienta te indica qué evidencia debes reunir según tu perfil específico." },
    ] : [
      { question: "How do I know if I qualify?", answer: "Use our free analysis tool to get a personalized eligibility assessment in minutes." },
      { question: "How long does the process take?", answer: "Timelines vary by visa type. Consult an immigration attorney for up-to-date estimates." },
      { question: "Do I need a lawyer?", answer: "Not required, but strongly recommended especially for complex petitions. A lawyer can maximize your success chances." },
      { question: "What documents do I need?", answer: "Depends on the visa type. Our tool tells you what evidence to gather based on your specific profile." },
    ],
    eligibilityFactors: isEs ? [
      { label: "Perfil profesional", description: "Tu experiencia, educación y logros son factores clave en la evaluación de elegibilidad." },
      { label: "Historial migratorio", description: "Visas previas, visitas a EE.UU. y cualquier incidente previo afectan tu solicitud." },
      { label: "Vínculos con tu país de origen", description: "Para visas temporales, demostrar lazos con tu país es fundamental para la aprobación." },
      { label: "Propósito del viaje o estancia", description: "Debes poder articular claramente el propósito de tu solicitud." },
    ] : [
      { label: "Professional profile", description: "Your experience, education, and achievements are key factors in the eligibility assessment." },
      { label: "Immigration history", description: "Prior visas, U.S. visits, and any prior incidents affect your application." },
      { label: "Home country ties", description: "For temporary visas, demonstrating ties to your home country is fundamental for approval." },
      { label: "Purpose of visit or stay", description: "You must be able to clearly articulate the purpose of your application." },
    ],
    commonMistakes: isEs ? [
      "No preparar documentación suficiente antes de la solicitud.",
      "Proporcionar información inconsistente entre formularios.",
      "No revelar información relevante sobre el historial migratorio.",
      "Aplicar al tipo de visa incorrecto para tu situación.",
    ] : [
      "Not preparing sufficient documentation before applying.",
      "Providing inconsistent information across forms.",
      "Failing to disclose relevant immigration history information.",
      "Applying for the wrong visa type for your situation.",
    ],
    relatedSlugs: [
      { slug: "o1-visa-guide", label: "O-1 Visa" },
      { slug: "h1b-visa-specialty-occupations", label: "H-1B Visa" },
      { slug: "eb2-niw-engineers", label: "EB-2 NIW" },
    ],
  };

  return content[slug] ?? defaultContent;
}

export default async function VisaSlugPage({ params }: Props) {
  const { locale, "visa-slug": slug } = await params;

  if (!VALID_SLUGS.has(slug)) {
    notFound();
  }

  const entry = getSlugEntry(slug)!;
  const t = await getTranslations({ locale, namespace: "seo" });
  const isEs = locale === "es";

  const title = isEs ? entry.titleEs : entry.titleEn;
  const intro = isEs ? entry.descriptionEs : entry.descriptionEn;
  const content = getSlugContent(slug, locale);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://passly.ai";
  const faqSchema = buildFAQSchema(content.faqs);
  const articleSchema = buildArticleSchema({
    title,
    description: intro,
    url: `${appUrl}/${locale}/${slug}`,
    locale,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Navbar />
      <SEOPageTemplate
        locale={locale}
        title={title}
        visaType={entry.visaType}
        intro={intro}
        eligibilityFactors={content.eligibilityFactors}
        commonMistakes={content.commonMistakes}
        faqs={content.faqs}
        relatedSlugs={content.relatedSlugs}
        ctaLabel={t("ctaLabel")}
        quizLabel={t("quizLabel")}
        mistakesTitle={t("mistakesTitle")}
        eligibilityTitle={t("eligibilityTitle")}
        faqTitle={t("faqTitle")}
        relatedTitle={t("relatedTitle")}
      />
      <Footer />
    </>
  );
}
