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
    // ── L-1 ─────────────────────────────────────────────────────────────────
    "l1-visa-founders": {
      faqs: isEs ? [
        { question: "¿Cuál es la diferencia entre L-1A y L-1B?", answer: "La L-1A es para gerentes y ejecutivos — quienes establecen objetivos de la empresa, toman decisiones de alto nivel o supervisan una función esencial. La L-1B es para empleados con conocimiento especializado y propietario de los sistemas, productos o metodologías de la empresa. Los titulares de L-1A pueden solicitar la green card EB-1C; los titulares de L-1B no tienen esta vía directa." },
        { question: "¿Puedo abrir una nueva empresa en EE.UU. para la L-1?", answer: "Sí, pero la entidad extranjera debe haber operado al menos 1 año, debes haber trabajado allí 1 año en un rol calificado, y la entidad de EE.UU. debe tener una relación corporativa calificada. La aprobación inicial es de solo 1 año con requisitos de evidencia estrictos en la renovación. Los RFEs son especialmente comunes en peticiones de nueva oficina." },
        { question: "¿La L-1 lleva a una green card?", answer: "Los titulares de L-1A están bien posicionados para la green card EB-1C (ejecutivo/gerente multinacional), con una tasa de aprobación del 97% en FY2025 y sin requisito de certificación laboral PERM. La L-1B no tiene un equivalente directo." },
        { question: "¿Puede venir mi familia?", answer: "Sí. Tu cónyuge e hijos solteros menores de 21 vienen en estatus L-2. Los cónyuges en L-2 están autorizados a trabajar para cualquier empleador en EE.UU. sin restricciones." },
      ] : [
        { question: "What is the difference between L-1A and L-1B?", answer: "L-1A is for managers and executives — those who set company goals, make high-level decisions, or oversee an essential function. L-1B is for employees with specialized, proprietary knowledge of the company's systems, products, or methodologies. L-1A holders can pursue the EB-1C green card; L-1B holders cannot use the same path." },
        { question: "Can I open a new U.S. company for the L-1?", answer: "Yes, but the foreign entity must have operated for at least 1 year, you must have worked there for 1 year in a qualifying role, and the U.S. entity must have a qualifying corporate relationship. Initial approval is 1 year with strict evidence requirements on renewal. RFEs are especially common in new office filings." },
        { question: "Does L-1 lead to a green card?", answer: "L-1A holders are well-positioned for the EB-1C green card (multinational executive/manager), which has a 97% approval rate in FY2025 and requires no PERM labor certification. L-1B does not have a direct equivalent." },
        { question: "Can my family come with me?", answer: "Yes. Your spouse and unmarried children under 21 come on L-2 status. L-2 spouses are authorized to work for any U.S. employer without restriction." },
      ],
      eligibilityFactors: isEs ? [
        { label: "1 año de empleo calificado en el exterior", description: "Debes haber trabajado continuamente al menos 1 año dentro de los últimos 3 años para una empresa extranjera afiliada al empleador de EE.UU., en capacidad gerencial, ejecutiva o de conocimiento especializado." },
        { label: "Relación corporativa calificada", description: "La empresa de EE.UU. debe ser empresa matriz, subsidiaria, afiliada o sucursal del empleador extranjero. Ambas entidades deben estar activamente en funcionamiento. La relación debe documentarse con organigramas, registros de propiedad y estados financieros." },
        { label: "L-1A (gerentes y ejecutivos) vs. L-1B (conocimiento especializado)", description: "L-1A es para ejecutivos que establecen objetivos y toman decisiones de alto nivel, y para gerentes funcionales que supervisan una función esencial. L-1B es para empleados con conocimiento propietario o único de los sistemas, productos o servicios internos de la empresa. La distinción importa significativamente — L-1A lleva al EB-1C; L-1B no." },
        { label: "L-1 para nueva oficina", description: "Si abrís una nueva oficina en EE.UU., la aprobación inicial es de solo 1 año (vs. 3 años para oficinas establecidas). Debes proporcionar un contrato de arrendamiento físico, plan de negocios detallado, prueba de capitalización y un cronograma de contratación realista. Los RFEs son especialmente comunes en peticiones de nueva oficina." },
        { label: "Intención dual permitida", description: "Los titulares de L-1 pueden buscar residencia permanente mientras mantienen el estatus L-1, sin poner en riesgo su visa. La L-1A es el trampolín principal para la green card EB-1C." },
      ] : [
        { label: "1 year of qualifying employment abroad", description: "You must have worked continuously for at least 1 year within the last 3 years for a foreign company affiliated with the U.S. employer, in a managerial, executive, or specialized knowledge capacity." },
        { label: "Qualifying corporate relationship", description: "The U.S. company must be a parent, subsidiary, affiliate, or branch of the foreign employer. Both entities must be actively doing business. The relationship must be documented with org charts, ownership records, and financial statements." },
        { label: "L-1A (managers & executives) vs. L-1B (specialized knowledge)", description: "L-1A is for executives who set goals and make high-level decisions, and functional managers who oversee an essential function. L-1B is for employees with proprietary or unique knowledge of the company's internal systems, products, or services. The distinction matters significantly — L-1A leads to EB-1C; L-1B does not." },
        { label: "New office L-1", description: "If opening a new U.S. office, initial approval is only 1 year (vs. 3 years for established offices). Must provide a physical lease, detailed business plan, capitalization proof, and a realistic staffing timeline. RFEs are especially common in new office filings." },
        { label: "Dual intent allowed", description: "L-1 holders can pursue permanent residence while maintaining L-1 status, without jeopardizing their visa. L-1A is the primary stepping stone to the EB-1C green card." },
      ],
      commonMistakes: isEs ? [
        "Presentar como L-1A cuando el rol es principalmente operativo o técnico — USCIS requiere que la gestión sea la función principal, no secundaria. Los 'gerentes que trabajan' y pasan la mayor parte del día en tareas prácticas enfrentan altas tasas de denegación.",
        "No documentar la relación corporativa calificada con evidencia consistente y creíble — los registros de propiedad, estados financieros y organigramas deben alinearse en todos los documentos presentados.",
        "Para peticiones de nueva oficina: subestimar la evidencia requerida y no demostrar que la entidad de EE.UU. podrá mantener al empleado transferido dentro de 1 año.",
        "No rastrear el máximo de estadía de 5 años para L-1B (L-1A son 7 años) — una vez alcanzado el límite, debes salir y volver a calificar en el exterior antes de regresar.",
        "Olvidar la nueva tarifa de integridad de visa de $250 (vigente FY2025) — no puede ser eximida.",
      ] : [
        "Filing as L-1A when the role is primarily operational or technical — USCIS requires management to be the primary function, not secondary. 'Working managers' who spend most of their day on hands-on tasks face high denial rates.",
        "Not documenting the qualifying corporate relationship with credible, consistent evidence — ownership records, financial statements, and org charts must align across all submitted documents.",
        "For new office petitions: underestimating the evidence required and failing to show the U.S. entity will support the transferred employee within 1 year.",
        "Not tracking the L-1B 5-year maximum stay (L-1A is 7 years) — once you reach the cap, you must leave and re-qualify abroad before returning.",
        "Forgetting the new $250 visa integrity fee (effective FY2025) — it cannot be waived.",
      ],
      relatedSlugs: [
        { slug: "us-visa-startup-founders", label: "Startup Founders" },
        { slug: "eb2-niw-engineers", label: "EB-2 NIW" },
        { slug: "e2-investor-visa-guide", label: "E-2 Investor Visa" },
      ],
    },
    // ── E-2 ─────────────────────────────────────────────────────────────────
    "e2-investor-visa-guide": {
      faqs: isEs ? [
        { question: "¿Es Argentina un país con tratado E-2?", answer: "Sí. Los nacionales argentinos califican para la E-2. La entrevista consular suele realizarse en la Embajada de EE.UU. en Buenos Aires. El tratado de Argentina está en vigor desde 1994." },
        { question: "¿Hay un monto mínimo de inversión?", answer: "No hay un mínimo fijo por ley, pero se aplica el test de proporcionalidad. La mayoría de los casos exitosos involucran entre $80,000 y $300,000 o más. Una inversión de $20,000 rara vez es aprobada." },
        { question: "¿Cuánto tiempo es válida la E-2?", answer: "La visa inicial generalmente se emite por hasta 5 años con múltiples entradas (varía por país según reciprocidad). Puede renovarse indefinidamente mientras el negocio permanezca activo y el inversionista mantenga su rol." },
        { question: "¿Puede trabajar mi cónyuge con E-2?", answer: "Sí. Los cónyuges dependientes de E-2 reciben un EAD (Documento de Autorización de Empleo) y pueden trabajar para cualquier empleador en EE.UU., no solo el negocio del inversionista." },
      ] : [
        { question: "Is Argentina an E-2 treaty country?", answer: "Yes. Argentine nationals qualify for E-2. The consular interview is typically held at the U.S. Embassy in Buenos Aires. Argentina's treaty has been in force since 1994." },
        { question: "Is there a minimum investment amount?", answer: "No fixed minimum by law, but the proportionality test applies. Most successful cases involve $80,000–$300,000+. A $20,000 investment is very rarely approved unless the business model has exceptionally low total startup costs." },
        { question: "How long is the E-2 valid?", answer: "The initial visa is typically issued for up to 5 years with multiple entries (varies by country based on reciprocity). It can be renewed indefinitely as long as the business remains active and the investor maintains their role." },
        { question: "Can my spouse work on E-2?", answer: "Yes. E-2 dependent spouses receive an Employment Authorization Document (EAD) and can work for any employer in the U.S., not just the investor's business." },
      ],
      eligibilityFactors: isEs ? [
        { label: "Nacionalidad de país con tratado — test de proporcionalidad", description: "Solo los nacionales de países con tratado bilateral de inversión con EE.UU. califican. Más de 80 países son elegibles. Argentina, Colombia, México, España, Alemania, Reino Unido, Canadá y la mayoría de Europa califican. Brasil y Venezuela NO tienen tratados E-2." },
        { label: "Inversión sustancial — test de proporcionalidad", description: "No hay mínimo fijo por ley. Los funcionarios aplican un test de proporcionalidad: la inversión debe ser sustancial en relación al costo total del negocio. En la práctica, los casos aprobados suelen involucrar $80,000–$300,000+ según la industria. Las inversiones bajo $50,000 enfrentan mucho escrutinio." },
        { label: "Inversión comprometida y en riesgo", description: "Los fondos deben estar completamente comprometidos y en riesgo en la empresa al momento de la solicitud. Los fondos prometidos o condicionales no califican. El negocio debe ser real, activo y operacional — no una empresa fantasma o especulativa." },
        { label: "Empresa no marginal", description: "El negocio debe generar ingresos más allá de lo suficiente para sostener al inversionista y su familia, o mostrar un plan creíble de creación de empleo. Una consultoría unipersonal sin empleados ni plan de crecimiento generalmente no supera este test." },
        { label: "Dirigiendo y desarrollando la empresa", description: "Debes ser propietario de al menos el 50% de la empresa y estar en un rol ejecutivo o directivo. Los inversores pasivos no califican. Se permiten co-inversiones de múltiples nacionales del país con tratado, pero cada uno debe mostrar control operativo sobre su rol." },
      ] : [
        { label: "Nationality from a treaty country — proportionality test", description: "Only nationals of countries with a bilateral investment treaty with the U.S. qualify. Over 80 countries are eligible. Argentina, Colombia, Mexico, Spain, Germany, UK, Canada, Japan, and most of Europe qualify. Brazil and Venezuela do NOT have E-2 treaties." },
        { label: "Substantial investment — proportionality test", description: "There is no fixed minimum by law. Officers apply a proportionality test: the investment must be substantial relative to the total cost of the business. Approved cases commonly involve $80,000–$300,000+ depending on industry. Investments under $50,000 face heavy scrutiny and are rarely approved." },
        { label: "Investment at risk", description: "The funds must be fully committed and at risk in the enterprise at the time of application. Pledged or conditional funds do not qualify. The business must be real, active, and operational — not a shell company or speculative venture." },
        { label: "Non-marginal enterprise", description: "The business must generate income beyond what is merely sufficient to support the investor and their family, or show a credible plan to contribute economically through job creation. A sole-proprietor consulting firm with no employees typically fails this test." },
        { label: "Directing and developing the enterprise", description: "You must own at least 50% of the enterprise and be in an executive or directing role. Passive investors do not qualify. Multiple treaty nationals co-investing together is permitted, but each must show operational control over their respective role." },
      ],
      commonMistakes: isEs ? [
        "Invertir desde un país sin tratado E-2 — esto descalifica al solicitante independientemente del monto de la inversión. Siempre verificar el estatus del tratado antes de estructurar la inversión.",
        "No poder rastrear y documentar el origen de los fondos — los oficiales consulares examinan el origen de los fondos de cerca. Se requieren estados de cuenta bancarios, registros de venta de propiedades, préstamos y documentación de herencias.",
        "Construir un negocio 'marginal' sin empleados y sin plan de crecimiento creíble — el test de no marginalidad se aplica estrictamente.",
        "Solicitar antes de que la inversión esté sustancialmente completa — los fondos deben estar comprometidos y en riesgo al momento de la solicitud, no solo prometidos.",
        "Tratar la E-2 como residencia permanente: es una visa de no inmigrante. No hay un camino integrado a la green card a través de la E-2 sola, aunque puede renovarse indefinidamente mientras el negocio permanezca activo.",
      ] : [
        "Investing from a country without an E-2 treaty — this disqualifies the applicant regardless of investment size. Always verify treaty status before structuring the investment.",
        "Not being able to trace and document the source of funds — consular officers scrutinize fund origin closely. Bank statements, property sales records, loans, and inheritance documentation are all required.",
        "Building a 'marginal' business with no employees and no credible growth plan — the non-marginality test is strictly applied.",
        "Applying before the investment is substantially complete — funds must be committed and at risk at the time of application, not just pledged.",
        "Treating the E-2 as permanent residency: it is a non-immigrant visa. There is no built-in path to a green card through E-2 alone, though E-2 can be renewed indefinitely as long as the business remains active.",
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
        "Trabajar sin autorización — la F-1 permite solo trabajo en el campus (hasta 20 horas/semana durante la escuela, tiempo completo durante los recesos) y trabajo fuera del campus autorizado mediante CPT u OPT. El trabajo no autorizado fuera del campus es una violación grave de estatus y puede resultar en deportación y prohibiciones futuras de visa.",
        "Perder la ventana de solicitud del OPT — solicitar no antes de 90 días antes de la graduación. El procesamiento de USCIS tarda 3–5 meses, así que solicitá temprano. Si tu EAD no llegó para la fecha de inicio del OPT, podés trabajar hasta 90 días mientras la solicitud esté pendiente, pero solo si fue presentada a tiempo.",
        "Superar los 90 días de desempleo durante el OPT — el reloj comienza inmediatamente en la fecha de inicio del OPT, no cuando conseguís trabajo. Reportá todos los cambios de empleo dentro de los 10 días a través del portal SEVP.",
        "Dejar vencer el I-20 — solicitá una extensión oportuna a tu DSO antes de la fecha de finalización del programa si tu título tarda más de lo esperado.",
        "Transferirse de escuela sin la transferencia de SEVIS adecuada — debes notificar a tu DSO actual antes de inscribirte en una nueva institución. No hacerlo termina tu registro SEVIS.",
      ] : [
        "Working without authorization — F-1 allows only on-campus work (up to 20 hours/week during school, full-time during breaks) and authorized off-campus work via CPT or OPT. Unauthorized off-campus work is a serious status violation and can result in deportation and future visa bars.",
        "Missing the OPT application window — apply no earlier than 90 days before graduation. USCIS processing takes 3–5 months, so apply early. If your EAD hasn't arrived by your OPT start date, you can work up to 90 days while the application is pending, but only if filed on time.",
        "Exceeding 90 days of unemployment during OPT — the clock starts immediately on your OPT start date, not when you find a job. Report all employment changes within 10 days through the SEVP portal.",
        "Letting the I-20 expire — request a timely extension from your DSO before the program end date if your degree takes longer than expected.",
        "Transferring schools without proper SEVIS transfer — you must notify your current DSO before enrolling at a new institution. Failure to do so terminates your SEVIS record.",
      ],
      relatedSlugs: [
        { slug: "h1b-visa-specialty-occupations", label: "H-1B Visa" },
        { slug: "o1-visa-guide", label: "O-1 Visa" },
        { slug: "eb2-niw-engineers", label: "EB-2 NIW" },
      ],
    },
    // ── TN ──────────────────────────────────────────────────────────────────
    "tn-visa-usmca-professionals": {
      faqs: isEs ? [
        { question: "¿Pueden los argentinos u otros latinoamericanos obtener una visa TN?", answer: "No. La TN es exclusivamente para ciudadanos mexicanos y canadienses bajo el USMCA. Los nacionales de todos los demás países, incluidos Argentina, Colombia, Brasil y el resto de Latinoamérica, no califican." },
        { question: "¿Hay límite o lotería para la TN?", answer: "No. La TN no tiene cupo anual, no tiene lotería y no requiere certificación laboral PERM — lo que la convierte en uno de los caminos de autorización de trabajo más rápidos y accesibles para los profesionales elegibles." },
        { question: "¿Cuánto tiempo es válida la TN?", answer: "3 años por admisión, renovable indefinidamente saliendo y reingresando. No hay un límite máximo de estadía acumulada. A diferencia de la H-1B, no hay límite de 6 años." },
        { question: "¿Puede venir mi familia?", answer: "Sí. Tu cónyuge e hijos solteros menores de 21 entran en estatus TD (Dependiente Comercial). Los dependientes TD no pueden trabajar en EE.UU. — no reciben autorización de trabajo automáticamente y deben solicitar una visa de trabajo diferente si desean trabajar." },
      ] : [
        { question: "Can Argentines or other Latin Americans get a TN visa?", answer: "No. TN is exclusively for Mexican and Canadian citizens under the USMCA. Nationals of all other countries, including Argentina, Colombia, Brazil, and the rest of Latin America, do not qualify." },
        { question: "Is there a cap or lottery?", answer: "No. TN has no annual cap, no lottery, and no labor certification requirement — making it one of the fastest and most accessible work authorization pathways for eligible professionals." },
        { question: "How long is TN valid?", answer: "3 years per admission, renewable indefinitely by leaving and re-entering. There is no cumulative maximum stay limit. Unlike H-1B, there is no 6-year cap." },
        { question: "Can my family come with me?", answer: "Yes. Your spouse and unmarried children under 21 enter on TD (Trade Dependent) status. TD dependents cannot work in the U.S. — they do not receive work authorization automatically and must apply separately for a different work visa if they wish to work." },
      ],
      eligibilityFactors: isEs ? [
        { label: "Ciudadanía mexicana o canadiense — puerta de nacionalidad", description: "La TN está disponible SOLO para ciudadanos de México y Canadá. Los residentes permanentes o nacionales de cualquier otro país no califican, independientemente de dónde vivan." },
        { label: "Ocupación en la lista del Apéndice 1603.D.1 del USMCA (63 profesiones)", description: "Tu trabajo debe coincidir con una de las 63 ocupaciones TN aprobadas. Categorías comunes: contador, arquitecto, analista de sistemas computacionales, ingeniero, abogado, médico (solo investigación/enseñanza), científico, farmacéutico, enfermero. Los títulos de trabajo modernos deben asignarse a categorías USMCA oficiales — 'Ingeniero de Software' se asigna a 'Programador de Computadoras'; 'Científico de Datos' a 'Estadístico' o 'Analista de Sistemas Computacionales'." },
        { label: "Educación requerida para cada ocupación", description: "La mayoría de las categorías TN requieren una licenciatura (o Licenciatura) en un campo directamente relacionado con la ocupación. Algunas categorías permiten calificaciones alternativas (ej. Consultor de Gestión permite 'diploma post-secundario' más 5 años de experiencia). La correspondencia del título debe documentarse." },
        { label: "Oferta de trabajo de un empleador de EE.UU.", description: "Necesitás una carta detallada del empleador describiendo: la ocupación TN específica, las funciones del puesto, los requisitos educativos, tus calificaciones, la duración del empleo y que el puesto es de no inmigrante (temporal)." },
        { label: "Autorización específica del empleador, no inmigrante", description: "La TN es específica del empleador. No podés trabajar freelance ni para múltiples empleadores sin aprobaciones TN separadas para cada uno. La TN no tiene intención dual — buscar una green card mientras estás en TN puede crear problemas de intención." },
      ] : [
        { label: "Mexican or Canadian citizenship — nationality gate", description: "TN is available ONLY to citizens of Mexico and Canada. Permanent residents or nationals of any other country do not qualify, regardless of where they live." },
        { label: "Occupation on the USMCA Appendix 1603.D.1 list (63 professions)", description: "Your job must match one of the 63 approved TN occupations. Common categories include: accountant, architect, computer systems analyst, engineer, lawyer, physician (research/teaching only), scientist, pharmacist, registered nurse. Modern job titles must be mapped to official USMCA categories — 'Software Engineer' maps to 'Computer Programmer'; 'Data Scientist' maps to 'Statistician' or 'Computer Systems Analyst'." },
        { label: "Required education for each occupation", description: "Most TN categories require a baccalaureate degree (or Licenciatura) in a field directly related to the occupation. Some categories allow alternative qualifications (e.g., Management Consultant allows 'post-secondary diploma' plus 5 years of experience). The degree match must be documented." },
        { label: "Job offer from a U.S. employer", description: "You need a detailed employer letter describing: the specific TN occupation, the duties of the position, the educational requirements, your qualifications, the duration of employment, and that the position is non-immigrant (temporary)." },
        { label: "Employer-specific, non-immigrant authorization", description: "TN is employer-specific. You cannot freelance or work for multiple employers without separate TN approvals for each. TN does not have dual intent — pursuing a green card while on TN can create intent issues and should be discussed with an attorney." },
      ],
      commonMistakes: isEs ? [
        "No hacer coincidir el título del trabajo con la lista del USMCA — la carta del empleador debe explicar cómo las funciones del rol se alinean con la ocupación TN listada, incluso si los títulos difieren. 'Desarrollador de Software' no está en la lista TN; la carta debe explicar por qué el rol califica como 'Programador de Computadoras'.",
        "Canadienses que olvidan que pueden solicitar en el puerto de entrada (POE) — no se necesita cita consular. El oficial adjudica en el momento. Sin embargo, la documentación completa debe estar lista en la frontera; sin ella, se negará la admisión.",
        "Mexicanos que solicitan sin el sello de visa TN válido de un consulado de EE.UU. — los mexicanos deben primero obtener el sello de visa TN en un consulado de EE.UU. en México antes de entrar. No pueden solicitar en el POE como los canadienses.",
        "Asumir que la TN es equivalente a la H-1B en términos de flexibilidad — la TN no tiene intención dual, es específica del empleador y no puede extenderse después de la admisión de 3 años sin salir y volver a solicitar (aunque las reentradas son ilimitadas).",
        "No prepararse para la H-1B como alternativa — si la TN ya no está disponible o el rol no califica, la H-1B es la principal alternativa. Tener una estrategia de transición es importante para la planificación de carrera en EE.UU. a largo plazo.",
      ] : [
        "Mismatching the job title to the USMCA list — the employer letter must explain how the role's duties align with the listed TN occupation, even if titles differ. 'Software Developer' is not on the TN list; the letter must explain why the role qualifies as 'Computer Programmer.'",
        "Canadians forgetting they can apply at the port of entry (POE) — no consular appointment needed. The officer adjudicates on the spot. However, full documentation must be ready at the border; without it, admission will be denied.",
        "Mexicans applying without a valid U.S. consular TN stamp — Mexicans must first obtain a TN visa stamp at a U.S. consulate in Mexico before entering. They cannot apply at the POE like Canadians.",
        "Assuming TN is equivalent to H-1B in terms of flexibility — TN has no dual intent, is employer-specific, and cannot be extended after the 3-year admission without leaving and re-applying (though re-entries are unlimited).",
        "Not preparing for the H-1B as a backup — if TN is no longer available or the role doesn't qualify, H-1B is the primary alternative. Having a transition strategy is important for long-term U.S. career planning.",
      ],
      relatedSlugs: [
        { slug: "h1b-visa-specialty-occupations", label: "H-1B Visa" },
        { slug: "l1-visa-founders", label: "L-1 Visa" },
        { slug: "o1-visa-guide", label: "O-1 Visa" },
      ],
    },
    // ── B-1/B-2 ─────────────────────────────────────────────────────────────
    "b1b2-tourist-visa-strong-ties": {
      faqs: isEs ? [
        { question: "¿Cuánto tiempo puedo quedarme con B-1/B-2?", answer: "La admisión generalmente se otorga por hasta 6 meses. Podés solicitar una extensión (Formulario I-539, tarifa de $370) por hasta 6 meses adicionales. Las extensiones no están garantizadas y deben solicitarse antes de que venza la estadía autorizada actual." },
        { question: "¿Qué es ESTA y aplica a los latinoamericanos?", answer: "ESTA permite a los nacionales de 42 países del Programa de Exención de Visa visitar EE.UU. por hasta 90 días sin visa. Argentina, México, Colombia, Brasil y la mayoría de Latinoamérica NO están en el Programa de Exención de Visa — los nacionales de estos países deben solicitar una visa B-1/B-2 en un consulado de EE.UU." },
        { question: "¿Cuál es el nuevo requisito de fianza?", answer: "A partir de agosto de 2025, el Departamento de Estado lanzó un programa piloto que requiere que ciertos solicitantes de países con altas tasas de permanencia excesiva depositen una fianza de $5,000–$15,000. La fianza se reembolsa al confirmarse la salida. Verificar la lista oficial del Departamento de Estado para qué países están sujetos a este requisito." },
        { question: "¿La B-2 permite tratamiento médico en EE.UU.?", answer: "Sí. Viajar para tratamiento médico es un propósito B-2 válido. Debes tener documentación del proveedor médico de EE.UU., costo estimado del tratamiento y prueba de fondos suficientes para cubrir los costos del tratamiento." },
      ] : [
        { question: "How long can I stay on B-1/B-2?", answer: "Admission is typically granted for up to 6 months. You may request an extension (Form I-539, $370 fee) for up to 6 additional months. Extensions are not guaranteed and must be filed before the current authorized stay expires." },
        { question: "What is ESTA and does it apply to Latin Americans?", answer: "ESTA allows nationals of 42 Visa Waiver Program countries to visit the U.S. for up to 90 days without a visa. Argentina, Mexico, Colombia, Brazil, and most of Latin America are NOT in the Visa Waiver Program — nationals of these countries must apply for a B-1/B-2 visa at a U.S. consulate." },
        { question: "What is the new bond requirement?", answer: "As of August 2025, the State Department launched a pilot program requiring select applicants from high-overstay-rate countries to post a $5,000–$15,000 bond at visa issuance. The bond is refunded upon confirmed departure. Check the official State Department list for which countries are currently subject to this requirement." },
        { question: "Does B-2 allow medical treatment in the U.S.?", answer: "Yes. Traveling for medical treatment is a valid B-2 purpose. Documentation from the U.S. medical provider, estimated cost of treatment, and evidence of funds to cover treatment costs should be prepared for the consular interview." },
      ],
      eligibilityFactors: isEs ? [
        { label: "Intención de no inmigrante — vínculos sólidos con el país de origen", description: "La razón más común de denegación de B-1/B-2 (Sección 214(b)) es la falta de vínculos suficientes con el país de origen. Los oficiales buscan conexiones sociales, económicas y familiares que obliguen al retorno: empleo actual con carta del empleador, propiedad, dependientes familiares, activos financieros y otras obligaciones en el país de origen." },
        { label: "Propósito temporal — B-1 vs B-2", description: "B-1 es para actividades de negocios únicamente (reuniones, conferencias, negociaciones) — no empleo ni prestación de servicios para un empleador de EE.UU. B-2 es para turismo, tratamiento médico o visita a familiares. Debes poder articular claramente tu propósito y debe alinearse con tu documentación." },
        { label: "Fondos suficientes", description: "Debes demostrar que podés cubrir tus gastos durante la visita sin necesidad de trabajar en EE.UU. Se usan comúnmente estados de cuenta bancarios, registros de propiedad, cartas de patrocinio y talones de pago." },
        { label: "Sin violaciones de inmigración previas", description: "Las permanencias excesivas previas crean una prohibición de 3 años (180 días–1 año de presencia ilegal) o de 10 años (más de 1 año de presencia ilegal). Cualquier historial de trabajo no autorizado o tergiversación ante funcionarios de inmigración puede resultar en una prohibición permanente." },
        { label: "Requisito de fianza (nuevo, 2025)", description: "A partir del 20 de agosto de 2025, un programa piloto requiere que ciertos solicitantes B-1/B-2 de países con altas tasas de permanencia excesiva depositen una fianza de $5,000, $10,000 o $15,000. México, Canadá y los 40 países del Programa de Exención de Visa están exentos." },
      ] : [
        { label: "Nonimmigrant intent — strong home country ties", description: "The single most common reason for B-1/B-2 denial (Section 214(b)) is failure to demonstrate sufficient ties to the home country. Officers look for social, economic, and family connections that compel return: current employment with an employer letter, property ownership, family dependents, financial assets, and other obligations in the home country." },
        { label: "Temporary purpose — B-1 vs B-2", description: "B-1 is for business activities only (meetings, conferences, contract negotiations, trade shows) — not employment or providing services for a U.S. employer. B-2 is for tourism, medical treatment, or visiting family. You must be able to clearly articulate your purpose and it must align with your documentation." },
        { label: "Sufficient funds", description: "You must show you can cover your expenses during the visit without needing to work in the U.S. Bank statements, property records, sponsorship letters, and pay stubs are commonly used." },
        { label: "No prior immigration violations", description: "Prior overstays create a 3-year (180 days–1 year unlawful presence) or 10-year (over 1 year unlawful presence) bar from re-entry. Any history of unauthorized work or misrepresentation to immigration officers can result in a permanent bar." },
        { label: "Bond requirement (new, August 2025)", description: "As of August 20, 2025, a pilot program requires select B-1/B-2 applicants from countries with high overstay rates to post a $5,000, $10,000, or $15,000 bond. Mexico, Canada, and the 40 Visa Waiver Program countries are exempt." },
      ],
      commonMistakes: isEs ? [
        "Quedarse más tiempo del permitido en una visa o admisión I-94 anterior — incluso un día de permanencia excesiva crea un registro migratorio que aumenta dramáticamente las tasas de rechazo futuras y puede activar una prohibición de varios años.",
        "Trabajar en EE.UU. con estatus B — proporcionar servicios para un empleador, cliente o plataforma de EE.UU. (incluyendo trabajo freelance remoto para clientes de EE.UU.) está explícitamente prohibido y constituye una violación de estatus.",
        "Tergiversar el propósito de la visita — declarar 'turismo' cuando la intención real es entrevistar para trabajos, explorar oportunidades de negocio en EE.UU. o asistir a consultas de inmigración es tergiversación bajo INA § 212(a)(6)(C), lo que crea una prohibición permanente de EE.UU.",
        "Llegar al puerto de entrada sin documentación suficiente — una visa B-1/B-2 válida no garantiza la admisión. Los oficiales de CBP pueden negar la entrada si los vínculos o el propósito no son creíbles. Llevar documentación de viaje de regreso, alojamiento, finanzas y vínculos con el país de origen.",
        "Volver a solicitar inmediatamente después de una denegación 214(b) con las mismas circunstancias — los oficiales buscan 'circunstancias nuevas y convincentes.' Volver a solicitar sin cambios genuinos en tu situación generalmente resulta en una segunda denegación.",
      ] : [
        "Overstaying a previous visa or I-94 admission — even one day of overstay creates an immigration record that dramatically increases future refusal rates and may trigger a multi-year bar.",
        "Working in the U.S. on B status — providing services for a U.S. employer, client, or platform (including remote freelance work for U.S. clients) is explicitly prohibited and constitutes a status violation.",
        "Misrepresenting the purpose of the visit — stating 'tourism' when the actual intent is to interview for jobs, scout U.S. business opportunities, or attend immigration consultations is misrepresentation under INA § 212(a)(6)(C), which creates a permanent bar from the U.S.",
        "Arriving at the port of entry without sufficient documentation — a valid B-1/B-2 visa does not guarantee admission. CBP officers can deny entry if ties or purpose are not credible. Carry documentation of your return travel, accommodation, finances, and home country ties.",
        "Reapplying immediately after a 214(b) denial with the same circumstances — officers look for 'new and compelling circumstances.' Reapplying without genuine changes to your situation typically results in a second denial.",
      ],
      relatedSlugs: [
        { slug: "o1-visa-guide", label: "O-1 Visa" },
        { slug: "e2-investor-visa-guide", label: "E-2 Investor Visa" },
        { slug: "f1-student-visa-guide", label: "F-1 Student" },
      ],
    },
    // ── EB-3 ─────────────────────────────────────────────────────────────────
    "eb3-skilled-workers-professionals": {
      faqs: isEs ? [
        { question: "¿Cuál es la diferencia entre EB-3A, EB-3B y EB-3C?", answer: "EB-3A requiere una licenciatura para el puesto específico. EB-3B requiere al menos 2 años de formación o experiencia (trabajadores calificados). EB-3C es para puestos que requieren menos de 2 años de experiencia — tiene los retrasos más severos y rara vez es práctica fuera de industrias específicas." },
        { question: "¿Cuánto tiempo tarda el proceso completo del EB-3?", answer: "Para la mayoría de los países (Resto del Mundo): aproximadamente 3.5–5 años en total (24–30 meses para PERM, más tiempo de espera para disponibilidad de visa, más 9–24 meses para ajuste de estatus o procesamiento consular). Para India: 15+ años en escenarios realistas. Para China: 6–10 años." },
        { question: "¿Puedo trabajar mientras espero?", answer: "Sí, si estás en un estatus temporal válido (H-1B, L-1, F-1 OPT, etc.). Una vez que el Formulario I-485 esté pendiente, podés solicitar un EAD que te permite trabajar para cualquier empleador mientras esperas la green card." },
        { question: "¿Puedo actualizar de EB-3 a EB-2?", answer: "Sí. Si luego calificas para EB-2 (ej. obtenés una maestría o tu empleador presenta un nuevo I-140 bajo EB-2), a veces podés portar tu fecha de prioridad anterior del EB-3 al nuevo EB-2 — esto se llama retención de fecha de prioridad y puede acelerar significativamente tu caso." },
      ] : [
        { question: "What is the difference between EB-3A, EB-3B, and EB-3C?", answer: "EB-3A requires a bachelor's degree for the specific position. EB-3B requires at least 2 years of training or experience (skilled workers). EB-3C is for unskilled positions requiring less than 2 years of experience — it has the most severe backlogs and is rarely practical outside of specific industries." },
        { question: "How long does the full EB-3 process take?", answer: "For most countries (Rest of World): approximately 3.5–5 years total (24–30 months for PERM, plus wait time for visa availability, plus 9–24 months for adjustment of status or consular processing). For India: 15+ years in realistic scenarios. For China: 6–10 years." },
        { question: "Can I work while waiting?", answer: "Yes, if you are in a valid temporary status (H-1B, L-1, F-1 OPT, etc.). Once Form I-485 is pending, you can apply for an Employment Authorization Document (EAD) that allows you to work for any employer while waiting for the green card." },
        { question: "Can I upgrade from EB-3 to EB-2?", answer: "Yes. If you later qualify for EB-2 (e.g., you obtain a master's degree or your employer files a new I-140 under EB-2), you can sometimes port your earlier priority date from the EB-3 petition to the new EB-2 petition — this is called priority date retention and can significantly accelerate your case." },
      ],
      eligibilityFactors: isEs ? [
        { label: "Tres subcategorías EB-3", description: "EB-3A (Profesionales): requiere una licenciatura de EE.UU. o equivalente extranjero para el puesto específico. EB-3B (Trabajadores Calificados): requiere al menos 2 años de formación o experiencia. EB-3C (Otros/No Calificados): para puestos que requieren menos de 2 años de formación o experiencia — esta subcategoría tiene los retrasos más prolongados y generalmente no es práctica para la mayoría de los solicitantes." },
        { label: "Empleador de EE.UU. dispuesto a patrocinar un puesto permanente", description: "El EB-3 no puede ser autopeticionado. El empleador debe estar dispuesto a ofrecer un puesto permanente a tiempo completo y asumir los costos del proceso PERM (honorarios de abogados, costos de publicidad, presentación ante el DOL). Este compromiso es el prerequisito central." },
        { label: "Certificación laboral PERM (Formulario ETA-9089)", description: "El empleador debe demostrar al Departamento de Trabajo que no hay trabajadores calificados de EE.UU. disponibles para el puesto ofrecido. El proceso implica: (1) Determinación de salario prevaleciente: 6–8 meses; (2) Reclutamiento obligatorio: 2–3 meses; (3) Adjudicación del DOL: ~16 meses a finales de 2025. Tiempo total de PERM: 24–30 meses. Cualquier error de procedimiento en el reclutamiento reinicia el reloj del PERM." },
        { label: "Sin retraso per país (para la mayoría de las nacionalidades)", description: "La mayoría de los países (Argentina, Colombia, Brasil, México, Europa, etc.) actualmente enfrentan aproximadamente 2.5 años de tiempo de espera después de la aprobación del PERM e I-140. Solo India (12+ años) y China (4–6 años) enfrentan retrasos prolongados." },
        { label: "Portabilidad de trabajo después de 180 días", description: "Una vez que el Formulario I-485 ha estado pendiente por 180+ días, podés cambiar de empleador o trabajo si el nuevo puesto tiene la misma clasificación ocupacional 'igual o similar'. Esto requiere una planificación legal cuidadosa para no poner en riesgo la green card pendiente." },
      ] : [
        { label: "Three EB-3 subcategories", description: "EB-3A (Professionals): requires a U.S. bachelor's degree or foreign equivalent for the specific position. EB-3B (Skilled Workers): requires at least 2 years of training or experience. EB-3C (Other/Unskilled Workers): for positions requiring less than 2 years of training or experience — this subcategory has the longest backlogs and is typically not practical for most applicants." },
        { label: "U.S. employer willing to sponsor a permanent position", description: "EB-3 cannot be self-petitioned. The employer must be willing to offer a permanent, full-time position and bear the costs of the PERM process (attorney fees, advertising costs, DOL filing). This commitment is the core prerequisite." },
        { label: "PERM labor certification (Form ETA-9089)", description: "The employer must prove to the Department of Labor that no qualified U.S. workers are available for the offered position. The process involves: (1) Prevailing wage determination: 6–8 months; (2) Mandatory recruitment: 2–3 months; (3) DOL adjudication: ~16 months as of late 2025. Total PERM timeline: 24–30 months. Any procedural error in recruitment resets the PERM clock." },
        { label: "No per-country backlog (for most nationalities)", description: "Most countries (Argentina, Colombia, Brazil, Mexico, Europe, etc.) currently face approximately 2.5 years of wait time after PERM and I-140 approval. Only India (12+ years) and China (4–6 years) face extended backlogs." },
        { label: "Job portability after 180 days", description: "Once Form I-485 has been pending for 180+ days, you may change employers or jobs if the new position is in the 'same or similar' occupational classification. This requires careful legal planning to avoid jeopardizing the pending green card." },
      ],
      commonMistakes: isEs ? [
        "Comenzar el proceso PERM sin un abogado de inmigración — cualquier error de procedimiento en la documentación de reclutamiento (aviso de periódico incorrecto, campos del formulario faltantes, respuesta de auditoría incompleta) reinicia el reloj del PERM y cuesta 500+ días adicionales.",
        "No documentar meticulosamente el proceso de reclutamiento — las auditorías de PERM son comunes. Cada anuncio, solicitud recibida, entrevista realizada y razón de no selección debe documentarse y conservarse durante 5 años.",
        "Los nacionales indios y chinos que aceptan patrocinio de empleador EB-3 sin evaluar primero EB-1A o EB-2 NIW — el retraso de EB-3 India de 12+ años hace que el patrocinio PERM convencional sea extremadamente poco atractivo para la mayoría de los profesionales indios.",
        "No comparar las fechas de prioridad EB-3 vs. EB-2 — en algunos meses del Boletín de Visas, EB-3 Resto del Mundo avanza más rápido que EB-2. Los empleadores y empleados deben monitorear ambas categorías.",
        "Cambiar de trabajo antes de que la green card se finalice sin evaluar la portabilidad — la portabilidad de trabajo es posible después de 180 días de I-485 pendiente, pero requiere una clasificación ocupacional 'igual o similar' y análisis legal escrito.",
      ] : [
        "Starting the PERM process without an immigration attorney — any procedural error in recruitment documentation (wrong newspaper ad, missing form fields, incomplete audit response) resets the PERM clock and costs 500+ additional days.",
        "Not documenting the recruitment process meticulously — PERM audits are common. Every advertisement, application received, interview conducted, and reason for non-selection must be documented and retained for 5 years.",
        "Indian and Chinese nationals accepting EB-3 employer sponsorship without first evaluating EB-1A or EB-2 NIW — the 12+ year EB-3 India backlog makes conventional PERM sponsorship extremely unattractive for most Indian professionals.",
        "Not comparing EB-3 vs. EB-2 priority dates — in some Visa Bulletin months, EB-3 Rest of World moves faster than EB-2. Employers and employees should monitor both categories and consider filing both if possible.",
        "Changing jobs before the green card is finalized without assessing portability — job portability is possible after 180 days of I-485 pending, but requires a 'same or similar' occupational classification and written legal analysis.",
      ],
      relatedSlugs: [
        { slug: "eb2-niw-engineers", label: "EB-2 NIW" },
        { slug: "h1b-visa-specialty-occupations", label: "H-1B Visa" },
        { slug: "o1-visa-guide", label: "O-1 Visa" },
      ],
    },
    // ── J-1 ─────────────────────────────────────────────────────────────────
    "j1-visa-exchange-visitor": {
      faqs: isEs ? [
        { question: "¿Cómo sé si estoy sujeto al requisito de residencia de 2 años?", answer: "Verificá tu DS-2019 y el sello de visa J-1 — si dicen 'Sujeto a la Sección 212(e)', estás sujeto. Factores desencadenantes comunes: (1) tu programa de intercambio fue financiado por el gobierno de EE.UU. o tu gobierno de origen; (2) tu campo está en la Lista de Habilidades de Visitantes de Intercambio del Departamento de Estado para tu país; (3) sos un graduado médico extranjero que participa en formación médica de posgrado." },
        { question: "¿Puedo obtener una exención del requisito de 2 años?", answer: "Sí, pero es un proceso complejo. Los motivos de exención incluyen: Declaración de No Objeción del gobierno de tu país de origen (más común); Solicitud de una Agencia del Gobierno de EE.UU. Interesada; Dificultades Excepcionales para un cónyuge o hijo ciudadano de EE.UU. o residente permanente; Temor a la Persecución; o Exención Conrad 30 (para médicos extranjeros que acuerdan trabajar en áreas con escasez médica). Las exenciones actualmente tardan más de 8 meses." },
        { question: "¿La regla de 2 años me impide obtener cualquier visa?", answer: "No. La regla de 2 años específicamente te impide obtener visas H-1B o L-1, o residencia permanente, hasta que hayas estado físicamente presente en tu país de origen por 2 años u obtengas una exención. Aún podés solicitar otras visas de no inmigrante (F-1, B-1/B-2, O-1) incluso mientras estás sujeto al 212(e)." },
        { question: "¿Puede trabajar mi cónyuge en J-2?", answer: "Sí, pero solo con un EAD separado (Formulario I-765). La autorización de trabajo J-2 no es automática — debe solicitarse. Los cónyuges J-2 pueden trabajar para cualquier empleador una vez aprobado el EAD. El EAD está vinculado a la validez del programa J-1." },
      ] : [
        { question: "How do I know if I'm subject to the two-year home residency requirement?", answer: "Check your DS-2019 and J-1 visa stamp — if they show 'Subject to Section 212(e),' you are subject. Common triggers: (1) your exchange program was funded by the U.S. government or your home government; (2) your field is on the State Department's Exchange Visitor Skills List for your country; (3) you are a foreign medical graduate participating in graduate medical training." },
        { question: "Can I get a waiver of the two-year requirement?", answer: "Yes, but it is a complex process. Waiver grounds include: No Objection Statement from your home country government (most common); Request by an Interested U.S. Government Agency; Exceptional Hardship to a U.S. citizen or permanent resident spouse or child; Fear of Persecution; or Conrad 30 Waiver (for alien physicians agreeing to work in medically underserved areas). Waivers currently take 8+ months." },
        { question: "Does the two-year rule prevent me from getting any visa?", answer: "No. The two-year rule specifically prevents you from obtaining H-1B or L-1 visas, or permanent residence, until you have been physically present in your home country for 2 years or obtained a waiver. You can still apply for other nonimmigrant visas (F-1, B-1/B-2, O-1) even while subject to 212(e)." },
        { question: "Can my J-2 spouse work?", answer: "Yes, but only with a separate EAD (Form I-765). J-2 work authorization is not automatic — it must be applied for. J-2 spouses can work for any employer once the EAD is approved. The EAD is tied to the J-1 holder's program validity." },
      ],
      eligibilityFactors: isEs ? [
        { label: "Organización patrocinadora y DS-2019", description: "Debes ser patrocinado por un programa de intercambio designado por el gobierno de EE.UU. (universidad, institución de investigación, agencia gubernamental u organización privada). Tu patrocinador emite el Formulario DS-2019, que se requiere para solicitar la visa J-1. No todas las organizaciones son patrocinadores J-1 — confirmar la designación antes de solicitar." },
        { label: "Categorías del programa J-1", description: "La J-1 cubre una amplia gama de programas de intercambio incluyendo: Investigador Residente, Profesor, Estudiante (grado/posgrado), Académico de Corto Plazo, Pasante, Interno, Consejero de Campamento, Au Pair y Médico Extranjero (solo para educación médica de posgrado). Cada categoría tiene diferentes límites de duración y requisitos de elegibilidad." },
        { label: "Requisito de residencia en el país de origen de 2 años (Sección 212(e)) — el factor crítico", description: "Algunos titulares de J-1 están legalmente obligados a regresar a su país de origen por 2 años antes de poder solicitar H-1B, L-1 o residencia permanente. Estás sujeto si: (a) tu programa de intercambio fue financiado directa o indirectamente por el gobierno de EE.UU. o tu país de origen; (b) tu campo de especialización aparece en la Lista de Habilidades del Departamento de Estado para tu país; o (c) viniste a EE.UU. para educación o formación médica de posgrado (todos los graduados médicos extranjeros están automáticamente sujetos)." },
        { label: "Límites de duración y barras de 12/24 meses", description: "Los investigadores residentes y profesores están sujetos a una barra de 12 meses (no pueden regresar como investigador residente J-1 dentro de los 12 meses de un programa J-1 anterior) y una barra de 24 meses (deben esperar 24 meses entre programas de investigador residente). Estas barras son separadas e independientes de la regla de los dos años." },
        { label: "Tarifa SEVIS y cumplimiento del programa", description: "Los solicitantes J-1 pagan una tarifa SEVIS de $220 (Formulario I-901) antes de la entrevista de visa. Debes mantener un estatus J-1 válido durante todo tu programa, lo que incluye permanecer en actividades autorizadas por el programa y cumplir con los requisitos de informe a tu patrocinador/DSO." },
      ] : [
        { label: "Sponsoring organization and DS-2019", description: "You must be sponsored by a U.S. government-designated exchange program sponsor (university, research institution, government agency, or private organization). Your sponsor issues a Form DS-2019 (Certificate of Eligibility), which is required to apply for the J-1 visa. Not all organizations are J-1 sponsors — confirm your host institution's designation before applying." },
        { label: "J-1 program categories", description: "J-1 covers a wide range of exchange programs including: Research Scholar, Professor, Student (undergraduate/graduate), Short-term Scholar, Trainee, Intern, Camp Counselor, Au Pair, and Alien Physician (for graduate medical education only). Each category has different duration limits and eligibility requirements." },
        { label: "Two-year home residency requirement (Section 212(e)) — the critical factor", description: "Some J-1 holders are legally required to return to their home country for 2 years before they can apply for H-1B, L-1, or permanent residence. You are subject to this requirement if: (a) your exchange program was funded directly or indirectly by the U.S. or your home country government; (b) your field of specialization appears on the State Department's Exchange Visitor Skills List for your country; or (c) you came to the U.S. for graduate medical education or training (all foreign medical graduates are automatically subject)." },
        { label: "Duration limits and 12/24-month bars", description: "Research scholars and professors are subject to a 12-month bar (cannot return as a J-1 research scholar within 12 months of a previous J-1 research scholar program) and a 24-month bar (must wait 24 months between research scholar programs). These bars are separate from and in addition to the two-year rule." },
        { label: "SEVIS fee and program compliance", description: "J-1 applicants pay a $220 SEVIS fee (Form I-901) before the visa interview. You must maintain valid J-1 status throughout your program, which includes remaining in program-authorized activities and reporting requirements to your sponsor/DSO." },
      ],
      commonMistakes: isEs ? [
        "No verificar si estás sujeto al 212(e) antes de aceptar una oferta J-1 — este es el error más grave. Si estás sujeto y no lo tuviste en cuenta, la transición a H-1B o la búsqueda de una green card puede bloquearse durante 2 años o requerir un costoso y lento proceso de exención.",
        "Asumir que la regla de 2 años solo aplica a investigadores — aplica a cualquier titular de J-1 si su intercambio fue financiado por el gobierno, su habilidad está en la Lista de Habilidades de su país, o es un graduado médico extranjero. Los estudiantes con becas gubernamentales (Fulbright, becas del gobierno de origen) frecuentemente están sujetos.",
        "Confundir la regla de 2 años con las barras de 12 y 24 meses — las barras solo aplican a las categorías de Investigador Residente y Profesor y limitan la participación repetida en J-1. La regla de 2 años es un requisito separado que bloquea ciertos beneficios migratorios.",
        "No actuar con suficiente rapidez en una solicitud de exención — las solicitudes de exención actualmente tardan más de 8 meses en recibir la aprobación final de USCIS. Si necesitás una H-1B para una fecha de inicio específica, el momento debe planificarse cuidadosamente.",
        "Depender del estatus de cónyuge J-2 para autorización de trabajo sin confirmar la elegibilidad — los cónyuges J-2 deben solicitar por separado un EAD (Formulario I-765) para trabajar. Los EAD J-2 están sujetos a la duración del programa J-1 y solo son válidos mientras el titular J-1 mantenga su estatus.",
      ] : [
        "Not checking whether you are subject to 212(e) before accepting a J-1 offer — this is the most consequential mistake. If you are subject and haven't accounted for it, transitioning to H-1B or pursuing a green card may be blocked for 2 years or require an expensive, time-consuming waiver process.",
        "Assuming the two-year rule applies only to researchers — it applies to any J-1 holder if their exchange was government-funded, their skill is on the Skills List for their country, or they are a foreign medical graduate. Students on government scholarships (Fulbright, home country government grants) are frequently subject.",
        "Confusing the two-year rule with the 12-month and 24-month bars — the bars only apply to Research Scholar and Professor categories and limit repeat J-1 participation. The two-year rule is a separate requirement that blocks certain immigration benefits.",
        "Not acting quickly enough on a waiver application — waiver applications currently take over 8 months to receive final USCIS approval. If you need an H-1B for a specific start date, the timing must be carefully planned.",
        "Relying on J-2 spouse status for work authorization without confirming eligibility — J-2 spouses must apply separately for an EAD (Form I-765) to work. J-2 EADs are subject to the J-1 program duration and are only valid while the J-1 holder maintains status.",
      ],
      relatedSlugs: [
        { slug: "f1-student-visa-guide", label: "F-1 Student Visa" },
        { slug: "o1-visa-guide", label: "O-1 Visa" },
        { slug: "eb2-niw-engineers", label: "EB-2 NIW" },
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
