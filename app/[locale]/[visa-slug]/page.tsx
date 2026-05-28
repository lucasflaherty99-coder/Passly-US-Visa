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
    title: `${title} | Passly AI`,
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
