export type VisaPageContent = {
  slug: string;
  visaType: string;
  titleEn: string;
  titleEs: string;
  descriptionEn: string;
  descriptionEs: string;
  introEn: string;
  introEs: string;
  eligibilityFactors: { labelEn: string; labelEs: string; descEn: string; descEs: string }[];
  commonMistakes: { en: string; es: string }[];
  faqs: { questionEn: string; questionEs: string; answerEn: string; answerEs: string }[];
  relatedSlugs: string[];
};

const VISA_PAGES: VisaPageContent[] = [
  {
    slug: "o1-visa-for-creatives",
    visaType: "O-1B",
    titleEn: "O-1 Visa for Creative Professionals",
    titleEs: "Visa O-1 para Creativos y Artistas",
    descriptionEn: "Designers, artists, filmmakers, and creative directors can qualify for the O-1B visa. Learn what USCIS considers extraordinary achievement in arts.",
    descriptionEs: "Diseñadores, artistas, cineastas y directores creativos pueden calificar para la visa O-1B. Conoce qué considera USCIS logro extraordinario en artes.",
    introEn: "The O-1B visa is the pathway for individuals with extraordinary achievement in the arts, motion picture, or television industries. If your creative work has received sustained recognition in your field — through awards, press coverage, major clients, or high compensation — you may qualify.",
    introEs: "La visa O-1B es el camino para personas con logros extraordinarios en artes, cine o televisión. Si tu trabajo creativo ha recibido reconocimiento sostenido — a través de premios, cobertura de prensa, clientes importantes o alta compensación — podrías calificar.",
    eligibilityFactors: [
      { labelEn: "Awards or prizes in your creative field", labelEs: "Premios en tu campo creativo", descEn: "National or international recognition for your work — industry awards, jury prizes, competition wins.", descEs: "Reconocimiento nacional o internacional de tu trabajo — premios de la industria, premios de jurado, concursos." },
      { labelEn: "Critical role for prominent organizations", labelEs: "Rol crítico en organizaciones prominentes", descEn: "Leading creative roles at studios, agencies, publications, or companies with a distinguished reputation.", descEs: "Roles creativos líderes en estudios, agencias, publicaciones o empresas con reputación distinguida." },
      { labelEn: "Media coverage of your work", labelEs: "Cobertura mediática de tu trabajo", descEn: "Articles, features, or interviews in major trade publications, mainstream media, or industry outlets.", descEs: "Artículos, reportajes o entrevistas en publicaciones especializadas, medios principales u outlets de la industria." },
      { labelEn: "High remuneration relative to peers", labelEs: "Alta remuneración en relación a pares", descEn: "Commanding fees or salaries significantly above average for creative professionals in your field.", descEs: "Honorarios o salarios significativamente superiores al promedio para profesionales creativos en tu campo." },
    ],
    commonMistakes: [
      { en: "Applying for O-1A (sciences/business) when you need O-1B (arts) — they have different criteria.", es: "Solicitar O-1A (ciencias/negocios) cuando necesitas O-1B (artes) — tienen criterios diferentes." },
      { en: "Not securing a peer group consultation letter from a relevant union or guild.", es: "No obtener una carta de consulta del grupo de pares de un sindicato o gremio relevante." },
      { en: "Underestimating the importance of an agent — O-1B petitioners often need an agent rather than a single employer.", es: "Subestimar la importancia de un agente — los solicitantes de O-1B suelen necesitar un agente en lugar de un único empleador." },
      { en: "Failing to document every speaking engagement, exhibition, or collaboration with evidence.", es: "No documentar cada conferencia, exposición o colaboración con evidencia." },
    ],
    faqs: [
      { questionEn: "What's the difference between O-1A and O-1B?", questionEs: "¿Cuál es la diferencia entre O-1A y O-1B?", answerEn: "O-1A is for extraordinary ability in sciences, business, education, or athletics. O-1B is for extraordinary achievement in the arts, motion picture, or television. Creative professionals typically file under O-1B.", answerEs: "O-1A es para habilidad extraordinaria en ciencias, negocios, educación o atletismo. O-1B es para logros extraordinarios en artes, cine o televisión. Los creativos generalmente solicitan bajo O-1B." },
      { questionEn: "Do I need to be famous to qualify for O-1B?", questionEs: "¿Necesito ser famoso para calificar para la O-1B?", answerEn: "Not necessarily. 'Extraordinary' means being at the top of your field as evidenced by sustained recognition — not necessarily mainstream fame. Many O-1B holders are well-known within their industry but not household names.", answerEs: "No necesariamente. 'Extraordinario' significa estar en la cima de tu campo según lo evidencia el reconocimiento sostenido — no necesariamente fama masiva. Muchos titulares de O-1B son conocidos en su industria pero no son figuras públicas." },
      { questionEn: "Can a freelance creative apply for O-1B?", questionEs: "¿Puede un creativo freelance solicitar la O-1B?", answerEn: "Yes. Freelancers can file through an agent who aggregates multiple engagements. The agent files the petition on your behalf, covering the full duration of your upcoming work.", answerEs: "Sí. Los freelancers pueden solicitar a través de un agente que agrupa múltiples contratos. El agente presenta la petición en tu nombre, cubriendo la duración total de tu próximo trabajo." },
      { questionEn: "How long does O-1B processing take?", questionEs: "¿Cuánto tarda el procesamiento de la O-1B?", answerEn: "Standard processing takes 2-3 months. Premium processing ($2,805 fee) guarantees a decision within 15 business days.", answerEs: "El procesamiento estándar tarda 2-3 meses. El premium processing ($2,805) garantiza una decisión en 15 días hábiles." },
    ],
    relatedSlugs: ["o1-visa-for-engineers", "o1-visa-for-researchers", "b1b2-visitor-visa"],
  },
  {
    slug: "o1-visa-for-engineers",
    visaType: "O-1A",
    titleEn: "O-1 Visa for Engineers & Tech Professionals",
    titleEs: "Visa O-1 para Ingenieros y Profesionales de Tecnología",
    descriptionEn: "Software engineers, AI researchers, and tech founders can qualify for the O-1A visa. Open source contributions, patents, and speaking count as evidence.",
    descriptionEs: "Ingenieros de software, investigadores de IA y fundadores tech pueden calificar para la visa O-1A. Contribuciones open source, patentes y conferencias cuentan como evidencia.",
    introEn: "The O-1A visa recognizes extraordinary ability in sciences and business, making it a strong pathway for senior engineers, researchers, and technical founders. Unlike the H-1B, there is no lottery. If your work has had significant impact — through high-profile projects, patents, open source contributions, or speaking invitations — you may have a compelling case.",
    introEs: "La visa O-1A reconoce la habilidad extraordinaria en ciencias y negocios, convirtiéndola en un camino sólido para ingenieros senior, investigadores y fundadores técnicos. A diferencia de la H-1B, no hay lotería. Si tu trabajo ha tenido un impacto significativo — a través de proyectos de alto perfil, patentes, contribuciones open source o invitaciones para hablar — podrías tener un caso convincente.",
    eligibilityFactors: [
      { labelEn: "High compensation (top of field)", labelEs: "Alta compensación (tope del campo)", descEn: "Total compensation (salary + equity) significantly above average for engineers in your specialization.", descEs: "Compensación total (salario + equity) significativamente superior al promedio para ingenieros en tu especialización." },
      { labelEn: "Critical role at well-known company", labelEs: "Rol crítico en empresa conocida", descEn: "Staff engineer, principal, VP Engineering, or technical co-founder role at a company with a distinguished reputation.", descEs: "Rol de staff engineer, principal, VP de Ingeniería o co-fundador técnico en una empresa con reputación distinguida." },
      { labelEn: "Patents or original technical contributions", labelEs: "Patentes o contribuciones técnicas originales", descEn: "Filed or granted patents, or original technical work with demonstrable real-world impact.", descEs: "Patentes presentadas o concedidas, o trabajo técnico original con impacto demostrable en el mundo real." },
      { labelEn: "Invited speaking at technical conferences", labelEs: "Conferenciante invitado en eventos técnicos", descEn: "Speaker invitations at major conferences (PyCon, NeurIPS, re:Invent, etc.) or prominent industry events.", descEs: "Invitaciones como conferenciante en conferencias importantes (PyCon, NeurIPS, re:Invent, etc.) o eventos destacados de la industria." },
    ],
    commonMistakes: [
      { en: "Confusing GitHub stars or LinkedIn followers with nationally recognized contributions — USCIS wants impact, not vanity metrics.", es: "Confundir GitHub stars o seguidores de LinkedIn con contribuciones reconocidas nacionalmente — USCIS busca impacto, no métricas de vanidad." },
      { en: "Not requesting support letters from senior engineers at well-known companies who can attest to your impact.", es: "No solicitar cartas de apoyo de ingenieros senior en empresas conocidas que puedan dar testimonio de tu impacto." },
      { en: "Undervaluing equity in compensation documentation — total compensation matters, not just base salary.", es: "Subestimar el equity en la documentación de compensación — importa la compensación total, no solo el salario base." },
      { en: "Applying too early in your career — most successful O-1A engineers have 7+ years of experience or demonstrable industry recognition.", es: "Aplicar demasiado pronto en tu carrera — la mayoría de ingenieros exitosos con O-1A tienen 7+ años de experiencia o reconocimiento demostrable." },
    ],
    faqs: [
      { questionEn: "Do open source contributions count for O-1A?", questionEs: "¿Cuentan las contribuciones open source para la O-1A?", answerEn: "Yes, if they show significant impact. A widely-used library, a contribution to a major project, or maintainer status on an influential repo can all serve as evidence. Document download counts, stars, and citations from other projects.", answerEs: "Sí, si muestran un impacto significativo. Una librería de uso generalizado, una contribución a un proyecto importante o el estatus de maintainer en un repositorio influyente pueden ser evidencia. Documenta conteos de descargas, stars y citas de otros proyectos." },
      { questionEn: "Can a startup founder apply for O-1A?", questionEs: "¿Puede un fundador de startup solicitar la O-1A?", answerEn: "Yes. Founders can qualify based on founding a notable company, raising significant investment from recognized VCs, media coverage of the company, and advisory roles. The company's success and the founder's critical role both contribute.", answerEs: "Sí. Los fundadores pueden calificar basándose en fundar una empresa notable, recaudar inversión significativa de VCs reconocidos, cobertura mediática de la empresa y roles de asesoría. El éxito de la empresa y el rol crítico del fundador contribuyen." },
      { questionEn: "Is O-1A better than H-1B for engineers?", questionEs: "¿Es la O-1A mejor que la H-1B para ingenieros?", answerEn: "If you qualify, O-1A is generally preferable: no lottery, no annual cap, renewable indefinitely, and dual intent is not an automatic disqualifier. The tradeoff is a higher evidence bar.", answerEs: "Si calificas, la O-1A es generalmente preferible: sin lotería, sin cupo anual, renovable indefinidamente, y la intención dual no es un descalificador automático. La contrapartida es un listón de evidencia más alto." },
      { questionEn: "What salary qualifies as 'high compensation'?", questionEs: "¿Qué salario califica como 'alta compensación'?", answerEn: "USCIS looks at your pay relative to others in the same field and geography. In tech, total compensation in the top 10-15% for your specialization and seniority level is a good benchmark. Use industry surveys (Levels.fyi, Bureau of Labor Statistics) as reference.", answerEs: "USCIS analiza tu pago en relación a otros en el mismo campo y geografía. En tecnología, una compensación total en el top 10-15% para tu especialización y nivel de antigüedad es un buen parámetro. Usa encuestas de la industria (Levels.fyi, BLS) como referencia." },
    ],
    relatedSlugs: ["o1-visa-for-researchers", "h1b-visa-specialty-occupation", "eb2-niw-engineers"],
  },
  {
    slug: "o1-visa-for-researchers",
    visaType: "O-1A",
    titleEn: "O-1 Visa for Researchers & Scientists",
    titleEs: "Visa O-1 para Investigadores y Científicos",
    descriptionEn: "Academics and researchers with publications, citations, and peer recognition can qualify for the O-1A. Learn how to build your petition.",
    descriptionEs: "Académicos e investigadores con publicaciones, citas y reconocimiento de pares pueden calificar para la O-1A. Aprende a construir tu petición.",
    introEn: "Researchers and scientists are among the strongest O-1A candidates. A track record of publications in peer-reviewed journals, citation counts, invited talks at conferences, grant awards, and editorial or review roles all map directly to USCIS's extraordinary ability criteria.",
    introEs: "Los investigadores y científicos están entre los candidatos más fuertes para la O-1A. Un historial de publicaciones en revistas revisadas por pares, recuentos de citas, charlas invitadas en conferencias, premios de subvenciones y roles editoriales o de revisión se corresponden directamente con los criterios de habilidad extraordinaria de USCIS.",
    eligibilityFactors: [
      { labelEn: "Peer-reviewed publications", labelEs: "Publicaciones revisadas por pares", descEn: "Articles in peer-reviewed journals, especially high-impact journals in your field. Citation count and h-index strengthen this criterion.", descEs: "Artículos en revistas revisadas por pares, especialmente revistas de alto impacto en tu campo. El recuento de citas y el h-index refuerzan este criterio." },
      { labelEn: "Invited speaker or reviewer", labelEs: "Conferenciante invitado o revisor", descEn: "Invited talks at academic conferences, symposia, or workshops. Serving as a peer reviewer or editorial board member also qualifies.", descEs: "Charlas invitadas en conferencias académicas, simposios o talleres. Actuar como revisor o miembro de un consejo editorial también califica." },
      { labelEn: "Research grants and funding awards", labelEs: "Subvenciones y premios de financiamiento", descEn: "Competitively awarded grants from recognized funding bodies (NSF, NIH, ERC, etc.) demonstrate peer judgment of your work's importance.", descEs: "Subvenciones competitivas de organismos de financiamiento reconocidos (NSF, NIH, ERC, etc.) demuestran el juicio de pares sobre la importancia de tu trabajo." },
      { labelEn: "Membership in distinguished associations", labelEs: "Membresía en asociaciones distinguidas", descEn: "Membership in scientific societies that require outstanding achievement for admission (e.g., elected fellowships, honor societies).", descEs: "Membresía en sociedades científicas que requieren logros sobresalientes para la admisión (ej. becas electas, sociedades de honor)." },
    ],
    commonMistakes: [
      { en: "Counting publications without emphasizing citations — a single highly-cited paper outweighs many uncited ones in USCIS's view.", es: "Contar publicaciones sin enfatizar las citas — un artículo altamente citado supera a muchos sin citas en la visión de USCIS." },
      { en: "Not documenting peer review invitations — save every email from journal editors inviting you to review.", es: "No documentar invitaciones de revisión por pares — guarda todos los correos de editores de revistas invitándote a revisar." },
      { en: "Ignoring the 'judging the work of others' criterion — serving as a thesis committee member or conference paper reviewer qualifies.", es: "Ignorar el criterio de 'juzgar el trabajo de otros' — servir en un comité de tesis o como revisor de artículos de conferencias califica." },
      { en: "Not explaining the significance of your research in plain language — USCIS officers are not domain experts.", es: "No explicar la importancia de tu investigación en lenguaje sencillo — los oficiales de USCIS no son expertos en el dominio." },
    ],
    faqs: [
      { questionEn: "How many publications do I need for O-1A?", questionEs: "¿Cuántas publicaciones necesito para la O-1A?", answerEn: "There's no minimum number. Quality and impact matter more than quantity. A researcher with 5 highly-cited publications in top journals may have a stronger case than one with 30 obscure papers.", answerEs: "No hay un número mínimo. La calidad y el impacto importan más que la cantidad. Un investigador con 5 publicaciones muy citadas en revistas de primer nivel puede tener un caso más sólido que uno con 30 artículos poco conocidos." },
      { questionEn: "Can a postdoc apply for O-1A?", questionEs: "¿Puede un postdoc solicitar la O-1A?", answerEn: "Yes, if their publication record and recognition meet the extraordinary ability standard. Many postdocs at research universities have strong enough profiles, especially in competitive fields like AI, genomics, or materials science.", answerEs: "Sí, si su historial de publicaciones y reconocimiento cumple el estándar de habilidad extraordinaria. Muchos postdocs en universidades de investigación tienen perfiles suficientemente sólidos, especialmente en campos competitivos como IA, genómica o ciencia de materiales." },
      { questionEn: "Does O-1A allow dual intent (applying for green card)?", questionEs: "¿Permite la O-1A la intención dual (solicitar green card)?", answerEn: "O-1A does not explicitly require nonimmigrant intent, unlike B or F visas. Having an EB-1A or EB-2 NIW petition pending while on O-1 status is generally acceptable and common for researchers.", answerEs: "La O-1A no requiere explícitamente intención de no inmigrante, a diferencia de las visas B o F. Tener una petición EB-1A o EB-2 NIW pendiente mientras se está en estatus O-1 es generalmente aceptable y común para investigadores." },
      { questionEn: "Is the EB-1A green card similar to O-1A?", questionEs: "¿Es la green card EB-1A similar a la O-1A?", answerEn: "Yes — the EB-1A green card (Alien of Extraordinary Ability) uses the same evidentiary standard as the O-1A. A strong O-1A petition is often a solid foundation for an EB-1A self-petition.", answerEs: "Sí — la green card EB-1A (Extranjero con Habilidad Extraordinaria) utiliza el mismo estándar probatorio que la O-1A. Una petición O-1A sólida es a menudo una buena base para una autopetición EB-1A." },
    ],
    relatedSlugs: ["eb2-niw-researchers", "o1-visa-for-engineers", "h1b-visa-specialty-occupation"],
  },
  {
    slug: "h1b-visa-specialty-occupation",
    visaType: "H-1B",
    titleEn: "H-1B Visa: Specialty Occupation Worker",
    titleEs: "Visa H-1B: Trabajador en Ocupación Especializada",
    descriptionEn: "The most common U.S. work visa for professionals. Learn about the annual lottery, employer sponsorship, and how to improve your odds.",
    descriptionEs: "La visa de trabajo más común en EE.UU. para profesionales. Aprende sobre la lotería anual, el patrocinio del empleador y cómo mejorar tus probabilidades.",
    introEn: "The H-1B is the primary work visa for professionals in specialty occupations — roles that require at least a bachelor's degree in a specific field. It's employer-sponsored and subject to an annual cap with a random lottery. Understanding the process helps you plan effectively, whether you're a first-time applicant or optimizing your chances.",
    introEs: "La H-1B es la visa de trabajo principal para profesionales en ocupaciones especializadas — roles que requieren al menos una licenciatura en un campo específico. Está patrocinada por el empleador y sujeta a un cupo anual con lotería aleatoria. Entender el proceso te ayuda a planificar eficazmente.",
    eligibilityFactors: [
      { labelEn: "Bachelor's degree in a specialty field", labelEs: "Licenciatura en un campo especializado", descEn: "U.S. bachelor's or foreign equivalent, in a field directly related to the job duties.", descEs: "Licenciatura de EE.UU. o equivalente extranjero, en un campo directamente relacionado con las funciones del puesto." },
      { labelEn: "Job offer from a U.S. employer", labelEs: "Oferta de trabajo de un empleador de EE.UU.", descEn: "The employer files the I-129 petition and Labor Condition Application. No H-1B without a sponsor.", descEs: "El empleador presenta la petición I-129 y la Solicitud de Condición Laboral. No hay H-1B sin patrocinador." },
      { labelEn: "Specialty occupation role", labelEs: "Puesto en ocupación especializada", descEn: "The position must theoretically and practically require a bachelor's degree in a specific specialty per DOL guidelines.", descEs: "El puesto debe requerir teórica y prácticamente una licenciatura en una especialidad específica según las pautas del DOL." },
      { labelEn: "Prevailing wage compliance", labelEs: "Cumplimiento del salario prevaleciente", descEn: "Employer must pay at least the prevailing wage for the role, location, and level (I through IV) per DOL standards.", descEs: "El empleador debe pagar al menos el salario prevaleciente para el rol, ubicación y nivel (I al IV) según los estándares del DOL." },
    ],
    commonMistakes: [
      { en: "Missing the March registration window — it opens in early March for ~2 weeks. There is no extension.", es: "Perder la ventana de registro de marzo — se abre a principios de marzo por ~2 semanas. No hay extensión." },
      { en: "Not verifying cap-exempt status — employers at universities, affiliated nonprofits, and certain research orgs are exempt from the lottery.", es: "No verificar el estatus de exención del cupo — los empleadores en universidades, ONGs afiliadas y ciertos orgs de investigación están exentos de la lotería." },
      { en: "Filing an LCA for the wrong wage level — too low triggers an RFE and signals bad faith to USCIS.", es: "Presentar un LCA para el nivel salarial incorrecto — demasiado bajo genera un RFE y señala mala fe ante USCIS." },
      { en: "Not starting the H-1B transfer process before leaving a previous employer — portability requires a pending petition.", es: "No iniciar el proceso de transferencia H-1B antes de dejar un empleador anterior — la portabilidad requiere una petición pendiente." },
    ],
    faqs: [
      { questionEn: "What is the H-1B lottery and what are the odds?", questionEs: "¿Qué es la lotería H-1B y cuáles son las probabilidades?", answerEn: "USCIS receives ~300,000-500,000 registrations for ~85,000 slots (65,000 regular cap + 20,000 U.S. master's exemption). Selection is random. Odds vary by year and cap utilization but historically run 20-35%.", answerEs: "USCIS recibe ~300,000-500,000 registros para ~85,000 plazas (65,000 cupo regular + 20,000 exención de maestría de EE.UU.). La selección es aleatoria. Las probabilidades varían pero históricamente rondan el 20-35%." },
      { questionEn: "Can I have multiple employers register me for H-1B?", questionEs: "¿Puede más de un empleador registrarme para la H-1B?", answerEn: "Yes, multiple employers can file registrations for you in the same cap year. Each registration gives you an independent selection chance, improving your overall odds.", answerEs: "Sí, múltiples empleadores pueden presentar registros para ti en el mismo año del cupo. Cada registro te da una oportunidad de selección independiente, mejorando tus probabilidades generales." },
      { questionEn: "What happens if I'm not selected in the lottery?", questionEs: "¿Qué pasa si no soy seleccionado en la lotería?", answerEn: "You can reapply the following year. In the meantime, consider O-1 (no lottery), working for a cap-exempt employer, or maintaining current status (F-1 OPT/STEM OPT, L-1, etc.).", answerEs: "Puedes volver a aplicar el año siguiente. Mientras tanto, considera la O-1 (sin lotería), trabajar para un empleador exento del cupo, o mantener tu estatus actual (F-1 OPT/STEM OPT, L-1, etc.)." },
      { questionEn: "Does my H-1B employer own my visa?", questionEs: "¿Mi empleador H-1B es dueño de mi visa?", answerEn: "No — H-1B is tied to the position, not the person. You can transfer to a new employer via H-1B portability, which takes effect as soon as the new petition is filed (not approved). You can even start working for the new employer immediately.", answerEs: "No — la H-1B está ligada al puesto, no a la persona. Puedes transferirte a un nuevo empleador mediante la portabilidad H-1B, que entra en vigor en cuanto se presenta la nueva petición (no al aprobarse). Incluso puedes empezar a trabajar para el nuevo empleador inmediatamente." },
    ],
    relatedSlugs: ["o1-visa-for-engineers", "eb2-niw-engineers", "f1-student-visa"],
  },
  {
    slug: "eb2-niw-researchers",
    visaType: "EB-2 NIW",
    titleEn: "EB-2 NIW for Researchers & Scientists",
    titleEs: "EB-2 NIW para Investigadores y Científicos",
    descriptionEn: "Researchers and scientists are ideal EB-2 NIW candidates. Learn how to structure your petition using the Matter of Dhanasar framework.",
    descriptionEs: "Los investigadores y científicos son candidatos ideales para el EB-2 NIW. Aprende a estructurar tu petición usando el marco de Matter of Dhanasar.",
    introEn: "The EB-2 National Interest Waiver (NIW) is one of the most accessible green card pathways for researchers. Unlike employer-sponsored green cards, you self-petition — no job offer required. USCIS evaluates your case under the Matter of Dhanasar framework: your work has substantial merit and national importance, you are well positioned to advance it, and the benefits outweigh the normal requirements.",
    introEs: "El EB-2 National Interest Waiver (NIW) es uno de los caminos hacia la green card más accesibles para investigadores. A diferencia de las green cards patrocinadas por empleadores, te autopeticionas — no se requiere oferta de trabajo. USCIS evalúa tu caso bajo el marco de Matter of Dhanasar: tu trabajo tiene mérito sustancial e importancia nacional, estás bien posicionado para avanzarlo, y los beneficios superan los requisitos normales.",
    eligibilityFactors: [
      { labelEn: "Advanced degree (Master's or PhD)", labelEs: "Grado avanzado (maestría o doctorado)", descEn: "Or bachelor's plus 5 years of progressive experience. The degree must be in a field related to your research.", descEs: "O licenciatura más 5 años de experiencia progresiva. El grado debe ser en un campo relacionado con tu investigación." },
      { labelEn: "Substantial merit and national importance", labelEs: "Mérito sustancial e importancia nacional", descEn: "Your research area must be significant beyond local or employer-specific impact — public health, STEM fields, energy, economic development.", descEs: "Tu área de investigación debe ser significativa más allá del impacto local o específico del empleador — salud pública, campos STEM, energía, desarrollo económico." },
      { labelEn: "Well-positioned to advance the endeavor", labelEs: "Bien posicionado para avanzar el esfuerzo", descEn: "Education, publications, citations, grants, collaborations, and institutional affiliations all show you're the right person.", descEs: "Educación, publicaciones, citas, subvenciones, colaboraciones y afiliaciones institucionales demuestran que eres la persona adecuada." },
      { labelEn: "Waiver is in the national interest", labelEs: "La exención es de interés nacional", descEn: "Why the U.S. benefits from not requiring PERM labor certification — typically because the research has broad implications.", descEs: "Por qué EE.UU. se beneficia de no requerir la certificación laboral PERM — típicamente porque la investigación tiene amplias implicaciones." },
    ],
    commonMistakes: [
      { en: "Writing a generic cover letter instead of a structured argument for each of the 3 Dhanasar prongs.", es: "Escribir una carta de presentación genérica en lugar de un argumento estructurado para cada uno de los 3 pilares de Dhanasar." },
      { en: "Using only co-authors as recommenders — USCIS looks for independent experts who can objectively evaluate your impact.", es: "Usar solo co-autores como recomendantes — USCIS busca expertos independientes que puedan evaluar objetivamente tu impacto." },
      { en: "Not explaining citations in plain language — if you have 500 citations, say what that means relative to your field's average.", es: "No explicar las citas en lenguaje sencillo — si tienes 500 citas, di qué significa eso en relación al promedio de tu campo." },
      { en: "Ignoring the 'well-positioned' prong — list all your grants, collaborations, and upcoming projects as evidence.", es: "Ignorar el pilar de 'bien posicionado' — lista todas tus subvenciones, colaboraciones y proyectos próximos como evidencia." },
    ],
    faqs: [
      { questionEn: "Can I file EB-2 NIW while on an H-1B or O-1?", questionEs: "¿Puedo presentar EB-2 NIW mientras estoy en H-1B o O-1?", answerEn: "Yes. Filing a green card petition does not affect your nonimmigrant status. Many researchers maintain H-1B or O-1 status while their I-140 (EB-2 NIW) is pending.", answerEs: "Sí. Presentar una petición de green card no afecta tu estatus de no inmigrante. Muchos investigadores mantienen el estatus H-1B u O-1 mientras su I-140 (EB-2 NIW) está pendiente." },
      { questionEn: "How long does EB-2 NIW take?", questionEs: "¿Cuánto tiempo tarda el EB-2 NIW?", answerEn: "The I-140 itself takes 6-24 months (or 15 business days with premium processing). After I-140 approval, visa number availability depends on your country of birth — citizens of most countries have no wait, but India and China face multi-year backlogs.", answerEs: "El I-140 en sí tarda 6-24 meses (o 15 días hábiles con premium processing). Tras la aprobación del I-140, la disponibilidad de número de visa depende de tu país de nacimiento — los ciudadanos de la mayoría de países no tienen espera, pero India y China enfrentan retrasos de varios años." },
      { questionEn: "Do I need a job offer for EB-2 NIW?", questionEs: "¿Necesito una oferta de trabajo para el EB-2 NIW?", answerEn: "No — that's the 'waiver' in NIW. You waive the normal job offer and PERM labor certification requirements by demonstrating national interest. You can be self-employed, between jobs, or in academia.", answerEs: "No — eso es la 'exención' en NIW. Renuncias a los requisitos normales de oferta de trabajo y certificación laboral PERM demostrando interés nacional. Puedes ser autónomo, estar entre trabajos o estar en academia." },
      { questionEn: "What fields qualify most easily for EB-2 NIW?", questionEs: "¿Qué campos califican más fácilmente para el EB-2 NIW?", answerEn: "STEM fields (especially AI, biotechnology, renewable energy, public health), education, and economic development tend to receive favorable treatment. National security-related research also has a strong national interest argument.", answerEs: "Los campos STEM (especialmente IA, biotecnología, energía renovable, salud pública), educación y desarrollo económico tienden a recibir un tratamiento favorable. La investigación relacionada con la seguridad nacional también tiene un sólido argumento de interés nacional." },
    ],
    relatedSlugs: ["eb2-niw-engineers", "eb2-niw-doctors", "o1-visa-for-researchers"],
  },
  {
    slug: "eb2-niw-engineers",
    visaType: "EB-2 NIW",
    titleEn: "EB-2 NIW for Engineers: Green Card Without Employer Sponsor",
    titleEs: "EB-2 NIW para Ingenieros: Green Card Sin Patrocinador",
    descriptionEn: "Engineers in critical fields can self-petition for a green card. No employer sponsorship needed. Learn the 3-prong Dhanasar test.",
    descriptionEs: "Ingenieros en campos críticos pueden autopeticionarse para una green card. Sin necesidad de patrocinador. Aprende la prueba de 3 pilares Dhanasar.",
    introEn: "Engineers — especially in software, AI, civil infrastructure, clean energy, and aerospace — are frequently approved for the EB-2 National Interest Waiver. The key is framing your work's broader impact: why does your engineering contribute to U.S. national interest beyond your employer's bottom line?",
    introEs: "Los ingenieros — especialmente en software, IA, infraestructura civil, energía limpia y aeroespacial — son frecuentemente aprobados para el EB-2 National Interest Waiver. La clave es enmarcar el impacto más amplio de tu trabajo: ¿por qué tu ingeniería contribuye al interés nacional de EE.UU. más allá de los beneficios de tu empleador?",
    eligibilityFactors: [
      { labelEn: "Engineering in a critical or nationally important field", labelEs: "Ingeniería en un campo crítico o de importancia nacional", descEn: "AI safety, infrastructure, clean energy, defense, biomedical devices, and semiconductor design tend to receive favorable NIW treatment.", descEs: "Seguridad en IA, infraestructura, energía limpia, defensa, dispositivos biomédicos y diseño de semiconductores tienden a recibir tratamiento favorable en NIW." },
      { labelEn: "Advanced degree or equivalent experience", labelEs: "Grado avanzado o experiencia equivalente", descEn: "Master's or PhD in engineering preferred. Bachelor's + 5 years of progressive specialized experience also qualifies.", descEs: "Se prefiere maestría o doctorado en ingeniería. Licenciatura + 5 años de experiencia especializada progresiva también califica." },
      { labelEn: "Documented technical impact", labelEs: "Impacto técnico documentado", descEn: "Patents, deployed systems at scale, research publications, or projects that demonstrably improve public welfare, safety, or efficiency.", descEs: "Patentes, sistemas desplegados a escala, publicaciones de investigación o proyectos que mejoran demostrablemente el bienestar público, la seguridad o la eficiencia." },
      { labelEn: "Industry recognition", labelEs: "Reconocimiento de la industria", descEn: "Speaking at technical conferences, advisory roles, media coverage, or awards from engineering societies.", descEs: "Conferencias técnicas, roles de asesoría, cobertura mediática o premios de sociedades de ingeniería." },
    ],
    commonMistakes: [
      { en: "Not connecting your specific engineering work to broader U.S. national interests — every argument must link to national impact.", es: "No conectar tu trabajo específico de ingeniería con intereses nacionales más amplios de EE.UU. — cada argumento debe vincularse al impacto nacional." },
      { en: "Failing to address why a waiver of the job offer requirement benefits the U.S. (not just you).", es: "No abordar por qué una exención del requisito de oferta de trabajo beneficia a EE.UU. (no solo a ti)." },
      { en: "Relying solely on job title — describe the actual impact of your engineering work with numbers and outcomes.", es: "Depender únicamente del título de trabajo — describe el impacto real de tu trabajo de ingeniería con números y resultados." },
      { en: "Not including a detailed future work plan — USCIS wants to see what you will contribute going forward.", es: "No incluir un plan de trabajo futuro detallado — USCIS quiere ver qué contribuirás en el futuro." },
    ],
    faqs: [
      { questionEn: "Can a software engineer qualify for EB-2 NIW?", questionEs: "¿Puede un ingeniero de software calificar para el EB-2 NIW?", answerEn: "Yes, but the national interest argument requires care. Working on AI safety, critical infrastructure, public health tech, or national security systems is stronger than building a consumer app. Frame your work's societal impact carefully.", answerEs: "Sí, pero el argumento de interés nacional requiere cuidado. Trabajar en seguridad de IA, infraestructura crítica, tecnología de salud pública o sistemas de seguridad nacional es más sólido que construir una app de consumo. Enmarca cuidadosamente el impacto social de tu trabajo." },
      { questionEn: "How is EB-2 NIW different from EB-2 with PERM?", questionEs: "¿En qué se diferencia el EB-2 NIW del EB-2 con PERM?", answerEn: "Standard EB-2 requires employer sponsorship and PERM labor certification (a process proving no qualified U.S. worker is available). NIW waives both requirements — you self-petition with no PERM, no job offer needed.", answerEs: "El EB-2 estándar requiere patrocinio del empleador y certificación laboral PERM (un proceso que demuestra que no hay trabajador de EE.UU. calificado disponible). NIW exime ambos requisitos — te autopeticionas sin PERM, sin necesidad de oferta de trabajo." },
      { questionEn: "Can I file EB-2 NIW while unemployed?", questionEs: "¿Puedo presentar EB-2 NIW mientras estoy desempleado?", answerEn: "Yes. Because NIW requires no job offer, you can self-petition regardless of current employment status. However, you need to demonstrate that your future work in the U.S. will serve the national interest.", answerEs: "Sí. Debido a que NIW no requiere oferta de trabajo, puedes autopeticionarte independientemente de tu estatus laboral actual. Sin embargo, debes demostrar que tu trabajo futuro en EE.UU. servirá al interés nacional." },
      { questionEn: "Do I need a U.S. master's for EB-2 NIW?", questionEs: "¿Necesito una maestría de EE.UU. para el EB-2 NIW?", answerEn: "No. Foreign master's degrees from accredited universities qualify. You'll need a credential evaluation from a NACES-approved evaluator (like ECE or WES) to establish equivalency.", answerEs: "No. Las maestrías extranjeras de universidades acreditadas califican. Necesitarás una evaluación de credenciales de un evaluador aprobado por NACES (como ECE o WES) para establecer la equivalencia." },
    ],
    relatedSlugs: ["eb2-niw-researchers", "eb2-niw-doctors", "o1-visa-for-engineers"],
  },
  {
    slug: "eb2-niw-doctors",
    visaType: "EB-2 NIW",
    titleEn: "EB-2 NIW for Physicians & Healthcare Professionals",
    titleEs: "EB-2 NIW para Médicos y Profesionales de la Salud",
    descriptionEn: "Physicians who commit to underserved areas can access expedited NIW processing. Learn about the Conrad 30 waiver and other options.",
    descriptionEs: "Los médicos que se comprometen a áreas desatendidas pueden acceder a procesamiento NIW acelerado. Aprende sobre el waiver Conrad 30 y otras opciones.",
    introEn: "Healthcare professionals — especially physicians in underserved specialties and geographic areas — have a particularly strong national interest argument for the EB-2 NIW. USCIS has historically viewed medical services in shortage areas favorably. Foreign-trained doctors have multiple pathways including the standard NIW, the Conrad 30 waiver (for J-1 waiver physicians), and state-sponsored programs.",
    introEs: "Los profesionales de la salud — especialmente médicos en especialidades y áreas geográficas desatendidas — tienen un argumento de interés nacional particularmente sólido para el EB-2 NIW. USCIS históricamente ha visto favorablemente los servicios médicos en áreas con escasez. Los médicos formados en el extranjero tienen múltiples rutas incluyendo el NIW estándar, el waiver Conrad 30 (para médicos con waiver J-1) y programas estatales.",
    eligibilityFactors: [
      { labelEn: "Medical degree and licensure", labelEs: "Título médico y licencia", descEn: "Foreign medical degree must be evaluated for U.S. equivalency. USMLE passage and state licensing are typically required for clinical practice.", descEs: "El título médico extranjero debe evaluarse para equivalencia en EE.UU. Generalmente se requiere aprobar el USMLE y obtener licencia estatal para la práctica clínica." },
      { labelEn: "Service in underserved area (HPSA/MUA)", labelEs: "Servicio en área desatendida (HPSA/MUA)", descEn: "Committing to practice in a Health Professional Shortage Area or Medically Underserved Area significantly strengthens the national interest argument.", descEs: "Comprometerse a practicar en un Área de Escasez de Profesionales de Salud o Área Médicamente Desatendida fortalece significativamente el argumento de interés nacional." },
      { labelEn: "Specialty in a shortage area", labelEs: "Especialidad en un área de escasez", descEn: "Primary care, psychiatry, geriatrics, and certain surgical subspecialties are in shortage. These specializations make national interest arguments more compelling.", descEs: "Atención primaria, psiquiatría, geriatría y ciertas subespecialidades quirúrgicas están en escasez. Estas especializaciones hacen más convincentes los argumentos de interés nacional." },
      { labelEn: "Research or teaching appointment", labelEs: "Nombramiento de investigación o enseñanza", descEn: "Faculty positions at medical schools or research appointments at academic medical centers also support NIW national interest arguments.", descEs: "Los puestos de facultad en escuelas de medicina o nombramientos de investigación en centros médicos académicos también apoyan los argumentos de interés nacional NIW." },
    ],
    commonMistakes: [
      { en: "Not checking if Conrad 30 applies — J-1 physicians may have faster options through their state's Conrad 30 program.", es: "No verificar si aplica el Conrad 30 — los médicos J-1 pueden tener opciones más rápidas a través del programa Conrad 30 de su estado." },
      { en: "Skipping the credentials evaluation step — a ECFMG certificate or equivalent is required before USCIS can evaluate a foreign medical degree.", es: "Omitir el paso de evaluación de credenciales — se requiere un certificado ECFMG o equivalente antes de que USCIS pueda evaluar un título médico extranjero." },
      { en: "Not documenting the shortage in the target area — include HRSA data on HPSA designation and physician-to-population ratios.", es: "No documentar la escasez en el área objetivo — incluye datos de HRSA sobre la designación HPSA y las relaciones médico-población." },
      { en: "Assuming any medical specialty qualifies equally — shortage specialties have a much easier national interest argument.", es: "Asumir que cualquier especialidad médica califica igualmente — las especialidades en escasez tienen un argumento de interés nacional mucho más sencillo." },
    ],
    faqs: [
      { questionEn: "What is the Conrad 30 waiver?", questionEs: "¿Qué es el waiver Conrad 30?", answerEn: "The Conrad 30 program allows states to sponsor up to 30 J-1 physician waivers per year. Physicians who complete 3 years of service in an underserved area can have the J-1 2-year home residency requirement waived and apply for a green card.", answerEs: "El programa Conrad 30 permite a los estados patrocinar hasta 30 waivers de médicos J-1 por año. Los médicos que completan 3 años de servicio en un área desatendida pueden obtener la exención del requisito de residencia doméstica de 2 años de la J-1 y solicitar una green card." },
      { questionEn: "Can a foreign-trained physician work in the U.S. without USMLE?", questionEs: "¿Puede un médico formado en el extranjero trabajar en EE.UU. sin el USMLE?", answerEn: "For clinical practice, USMLE passage and state licensure are required. Research or non-clinical academic roles may not require clinical licensure. The EB-2 NIW petition itself doesn't require licensure if the intent is research, but clinical practice does.", answerEs: "Para la práctica clínica, se requiere aprobar el USMLE y obtener licencia estatal. Los roles de investigación o académicos no clínicos pueden no requerir licencia clínica. La petición EB-2 NIW en sí no requiere licencia si la intención es investigación, pero la práctica clínica sí." },
      { questionEn: "How does the NIW timeline work for physicians?", questionEs: "¿Cómo funciona el cronograma NIW para médicos?", answerEn: "I-140 processing: 6-18 months (or 15 days with premium). If born outside China/India, no visa backlog. Adjustment of Status or consular processing adds 6-24 months. Total typical timeline: 1-3 years.", answerEs: "Procesamiento I-140: 6-18 meses (o 15 días con premium). Si naciste fuera de China/India, no hay retraso de visa. El ajuste de estatus o procesamiento consular añade 6-24 meses. Cronograma total típico: 1-3 años." },
      { questionEn: "Does a physician need to be practicing in the U.S. to file EB-2 NIW?", questionEs: "¿Necesita un médico estar ejerciendo en EE.UU. para presentar el EB-2 NIW?", answerEn: "No. Foreign-trained physicians can self-petition from abroad. The petition needs to show the intent to practice in a shortage area or conduct nationally important research upon receiving the green card.", answerEs: "No. Los médicos formados en el extranjero pueden autopeticionarse desde el exterior. La petición debe mostrar la intención de practicar en un área de escasez o realizar investigaciones de importancia nacional al recibir la green card." },
    ],
    relatedSlugs: ["eb2-niw-researchers", "eb2-niw-engineers", "h1b-visa-specialty-occupation"],
  },
  {
    slug: "f1-student-visa",
    visaType: "F-1",
    titleEn: "F-1 Student Visa: Complete Guide",
    titleEs: "Visa F-1 de Estudiante: Guía Completa",
    descriptionEn: "Everything you need to know about studying in the U.S.: SEVIS, DS-160, visa interview, OPT, and STEM extension.",
    descriptionEs: "Todo lo que necesitas saber sobre estudiar en EE.UU.: SEVIS, DS-160, entrevista de visa, OPT y extensión STEM.",
    introEn: "The F-1 student visa allows international students to pursue full-time academic study at accredited U.S. universities, colleges, language programs, and seminaries. Once approved, F-1 status permits on-campus work, Curricular Practical Training (CPT), Optional Practical Training (OPT), and potentially a 24-month STEM OPT extension.",
    introEs: "La visa F-1 de estudiante permite a los estudiantes internacionales realizar estudios académicos de tiempo completo en universidades, colegios, programas de idiomas y seminarios acreditados de EE.UU. Una vez aprobado, el estatus F-1 permite trabajar en el campus, Entrenamiento Práctico Curricular (CPT), Entrenamiento Práctico Opcional (OPT) y potencialmente una extensión de 24 meses de STEM OPT.",
    eligibilityFactors: [
      { labelEn: "Acceptance at a SEVP-certified school", labelEs: "Aceptación en una escuela certificada por SEVP", descEn: "You must have an I-20 form from a Student and Exchange Visitor Program (SEVP)-certified institution before applying for the visa.", descEs: "Debes tener el formulario I-20 de una institución certificada por el Programa de Visitantes de Estudiantes e Intercambio (SEVP) antes de solicitar la visa." },
      { labelEn: "Sufficient financial resources", labelEs: "Recursos financieros suficientes", descEn: "Proof of funds to cover tuition, living expenses, and related costs for the full duration of your program.", descEs: "Prueba de fondos para cubrir matrícula, gastos de vida y costos relacionados durante toda la duración de tu programa." },
      { labelEn: "Nonimmigrant intent", labelEs: "Intención de no inmigrante", descEn: "The consular officer must believe you intend to return home after graduation. Strong home country ties strengthen this.", descEs: "El oficial consular debe creer que tienes intención de regresar a tu país después de graduarte. Los vínculos sólidos con tu país de origen refuerzan esto." },
      { labelEn: "English proficiency", labelEs: "Dominio del inglés", descEn: "Most U.S. universities require TOEFL or IELTS scores for admission. Some programs accept DUOLINGO. Language schools admit students at all levels.", descEs: "La mayoría de las universidades de EE.UU. requieren puntuaciones de TOEFL o IELTS para la admisión. Algunos programas aceptan DUOLINGO. Las escuelas de idiomas admiten estudiantes de todos los niveles." },
    ],
    commonMistakes: [
      { en: "Applying for the F-1 visa before receiving the I-20 — the I-20 is required at the visa interview.", es: "Solicitar la visa F-1 antes de recibir el I-20 — el I-20 es requerido en la entrevista de visa." },
      { en: "Not paying the SEVIS fee ($350) before the visa interview — the embassy will verify payment.", es: "No pagar la tarifa SEVIS ($350) antes de la entrevista de visa — la embajada verificará el pago." },
      { en: "Being unable to explain your study plans and career goals convincingly at the interview.", es: "No poder explicar convincentemente tus planes de estudio y objetivos profesionales en la entrevista." },
      { en: "Starting OPT application too late — apply 90 days before your program end date, not after graduation.", es: "Comenzar la solicitud de OPT demasiado tarde — solicita 90 días antes de la fecha de finalización de tu programa, no después de graduarte." },
    ],
    faqs: [
      { questionEn: "Can I work in the U.S. on an F-1 visa?", questionEs: "¿Puedo trabajar en EE.UU. con visa F-1?", answerEn: "On campus: yes (up to 20 hours/week during school, full-time during breaks). Off campus: only through CPT (curriculum-required work) or OPT (post-graduation). Unauthorized work is a serious violation and can result in deportation.", answerEs: "En el campus: sí (hasta 20 horas/semana durante clases, tiempo completo en recesos). Fuera del campus: solo a través de CPT (trabajo requerido por el plan de estudios) u OPT (post-graduación). El trabajo no autorizado es una violación grave y puede resultar en deportación." },
      { questionEn: "What is OPT and how long does it last?", questionEs: "¿Qué es el OPT y cuánto dura?", answerEn: "Optional Practical Training is 12 months of work authorization in your field of study after graduation. STEM degree graduates can apply for a 24-month STEM OPT extension, giving up to 36 months total. Many F-1 graduates use OPT to transition to H-1B.", answerEs: "El Entrenamiento Práctico Opcional son 12 meses de autorización de trabajo en tu campo de estudio después de graduarte. Los graduados con títulos STEM pueden solicitar una extensión de 24 meses de STEM OPT, dando hasta 36 meses en total. Muchos graduados F-1 usan el OPT para hacer la transición a H-1B." },
      { questionEn: "Can I bring my family on F-1?", questionEs: "¿Puedo traer a mi familia con F-1?", answerEn: "Your spouse and unmarried children under 21 can accompany you on F-2 dependent visas. F-2 dependents cannot work but can study part-time.", answerEs: "Tu cónyuge e hijos solteros menores de 21 años pueden acompañarte con visas F-2 de dependiente. Los dependientes F-2 no pueden trabajar pero sí estudiar a tiempo parcial." },
      { questionEn: "What happens if I drop below full-time enrollment?", questionEs: "¿Qué pasa si bajo de la matrícula de tiempo completo?", answerEn: "Full-time enrollment is a requirement for maintaining F-1 status. Exceptions require authorization from your Designated School Official (DSO) in advance. Dropping below without authorization can trigger SEVIS termination.", answerEs: "La matrícula de tiempo completo es un requisito para mantener el estatus F-1. Las excepciones requieren autorización previa de tu Funcionario Escolar Designado (DSO). Bajar sin autorización puede desencadenar la terminación de SEVIS." },
    ],
    relatedSlugs: ["h1b-visa-specialty-occupation", "o1-visa-for-engineers", "b1b2-visitor-visa"],
  },
  {
    slug: "l1-intracompany-transfer",
    visaType: "L-1",
    titleEn: "L-1 Visa: Intracompany Transferee Guide",
    titleEs: "Visa L-1: Guía para Transferencia Intracorporativa",
    descriptionEn: "Managers, executives, and specialized knowledge workers can transfer to a U.S. entity on L-1. No lottery, no cap. Learn L-1A vs L-1B.",
    descriptionEs: "Gerentes, ejecutivos y trabajadores de conocimiento especializado pueden transferirse a una entidad en EE.UU. con L-1. Sin lotería, sin cupo. Aprende L-1A vs L-1B.",
    introEn: "The L-1 visa allows multinational companies to transfer employees to a U.S. parent, subsidiary, affiliate, or branch. It's cap-exempt and lottery-free, making it more predictable than H-1B. L-1A (managers and executives) has a direct pathway to the EB-1C green card. L-1B covers specialized knowledge workers.",
    introEs: "La visa L-1 permite a las empresas multinacionales transferir empleados a una oficina matriz, subsidiaria, afiliada o sucursal en EE.UU. Está exenta del cupo y sin lotería, lo que la hace más predecible que la H-1B. La L-1A (gerentes y ejecutivos) tiene un camino directo hacia la green card EB-1C. La L-1B cubre trabajadores de conocimiento especializado.",
    eligibilityFactors: [
      { labelEn: "Qualifying relationship between employers", labelEs: "Relación calificada entre empleadores", descEn: "The foreign and U.S. entities must be parent, subsidiary, affiliate, or branch of the same company.", descEs: "Las entidades extranjera y de EE.UU. deben ser matriz, subsidiaria, afiliada o sucursal de la misma empresa." },
      { labelEn: "1 year of qualifying employment in past 3 years", labelEs: "1 año de empleo calificado en los últimos 3 años", descEn: "You must have worked for the foreign entity for at least 1 year within the 3 years before the petition.", descEs: "Debes haber trabajado para la entidad extranjera durante al menos 1 año dentro de los 3 años anteriores a la petición." },
      { labelEn: "Managerial/executive (L-1A) or specialized knowledge (L-1B)", labelEs: "Gerencial/ejecutivo (L-1A) o conocimiento especializado (L-1B)", descEn: "L-1A: managing people or functions, controlling decisions. L-1B: proprietary company knowledge that is essential to company operations.", descEs: "L-1A: gestión de personas o funciones, control de decisiones. L-1B: conocimiento propietario de la empresa que es esencial para las operaciones." },
      { labelEn: "U.S. entity is operational or newly established", labelEs: "La entidad de EE.UU. está operativa o recién establecida", descEn: "For new U.S. offices, L-1 is initially granted for 1 year (extendable after showing viable operations).", descEs: "Para nuevas oficinas en EE.UU., la L-1 se otorga inicialmente por 1 año (extensible después de mostrar operaciones viables)." },
    ],
    commonMistakes: [
      { en: "L-1B applicants not clearly defining what makes their knowledge 'specialized' and not generally available in the labor market.", es: "Los solicitantes L-1B no definen claramente qué hace que su conocimiento sea 'especializado' y no disponible en el mercado laboral en general." },
      { en: "Not documenting the qualifying corporate relationship between the entities with org charts, ownership records, and financial statements.", es: "No documentar la relación corporativa calificada entre las entidades con organigramas, registros de propiedad y estados financieros." },
      { en: "For new U.S. offices: not having a realistic business plan showing the entity will support L-1A/managerial capacity within the first year.", es: "Para nuevas oficinas en EE.UU.: no tener un plan de negocios realista que muestre que la entidad apoyará la capacidad L-1A/gerencial dentro del primer año." },
      { en: "Applying for L-1A when the role is more L-1B — USCIS scrutinizes 'manager' titles carefully to ensure actual managerial duties.", es: "Solicitar L-1A cuando el rol es más L-1B — USCIS examina cuidadosamente los títulos de 'gerente' para garantizar funciones gerenciales reales." },
    ],
    faqs: [
      { questionEn: "Can a startup founder use L-1 to come to the U.S.?", questionEs: "¿Puede un fundador de startup usar la L-1 para ir a EE.UU.?", answerEn: "Yes — if you have an existing foreign company and establish a U.S. subsidiary. You transfer yourself as a manager/executive (L-1A). USCIS will want to see that the foreign company is operational and that the U.S. entity has a viable business plan.", answerEs: "Sí — si tienes una empresa extranjera existente y estableces una subsidiaria en EE.UU. Te transfieres como gerente/ejecutivo (L-1A). USCIS querrá ver que la empresa extranjera está operativa y que la entidad de EE.UU. tiene un plan de negocios viable." },
      { questionEn: "What's the maximum duration of L-1?", questionEs: "¿Cuál es la duración máxima de la L-1?", answerEn: "L-1A: initial 3 years (1 year for new offices), extendable to 7 years maximum. L-1B: initial 3 years (1 year for new offices), extendable to 5 years maximum.", answerEs: "L-1A: 3 años inicial (1 año para nuevas oficinas), extensible hasta 7 años máximo. L-1B: 3 años inicial (1 año para nuevas oficinas), extensible hasta 5 años máximo." },
      { questionEn: "Does L-1A lead to a green card?", questionEs: "¿La L-1A lleva a una green card?", answerEn: "Yes — L-1A holders often qualify for the EB-1C (Multinational Manager/Executive) green card, which has no PERM requirement and often has shorter processing times than other employment-based categories.", answerEs: "Sí — los titulares de L-1A a menudo califican para la green card EB-1C (Gerente/Ejecutivo Multinacional), que no tiene requisito de PERM y a menudo tiene tiempos de procesamiento más cortos que otras categorías basadas en empleo." },
      { questionEn: "Can my family come with me on L-1?", questionEs: "¿Puede mi familia venir conmigo con L-1?", answerEn: "Your spouse and unmarried children under 21 can join you on L-2 visas. Importantly, L-2 spouses have automatic employment authorization — they can work without a separate EAD since 2022.", answerEs: "Tu cónyuge e hijos solteros menores de 21 años pueden unirse a ti con visas L-2. Importante: los cónyuges L-2 tienen autorización de empleo automática — pueden trabajar sin un EAD separado desde 2022." },
    ],
    relatedSlugs: ["o1-visa-for-engineers", "h1b-visa-specialty-occupation", "e2-treaty-investor"],
  },
  {
    slug: "e2-treaty-investor",
    visaType: "E-2",
    titleEn: "E-2 Treaty Investor Visa: Complete Guide",
    titleEs: "Visa E-2 de Inversionista: Guía Completa",
    descriptionEn: "Invest in a U.S. business and direct its operations. Available to nationals of treaty countries. Learn the investment requirements and process.",
    descriptionEs: "Invierte en un negocio en EE.UU. y dirige sus operaciones. Disponible para nacionales de países con tratado. Aprende los requisitos de inversión y el proceso.",
    introEn: "The E-2 treaty investor visa allows nationals of countries that maintain treaties of commerce with the U.S. to invest in and manage a U.S. business. Unlike the EB-5 green card (minimum $800,000), E-2 has no statutory minimum investment — but the investment must be 'substantial' relative to the total business cost and the business must not be marginal.",
    introEs: "La visa E-2 de inversionista permite a los nacionales de países que mantienen tratados de comercio con EE.UU. invertir en y gestionar un negocio en EE.UU. A diferencia de la green card EB-5 (mínimo $800,000), la E-2 no tiene un mínimo de inversión establecido — pero la inversión debe ser 'sustancial' en relación al costo total del negocio y el negocio no debe ser marginal.",
    eligibilityFactors: [
      { labelEn: "Nationality of a treaty country", labelEs: "Nacionalidad de un país con tratado", descEn: "You must be a national of a country with an E-2 treaty with the U.S. Common treaty countries: Mexico, Colombia, Germany, Japan, UK, Spain, Italy, Chile, Turkey. Brazil, Russia, India, and China are notably NOT treaty countries.", descEs: "Debes ser nacional de un país con tratado E-2 con EE.UU. Países con tratado comunes: México, Colombia, Alemania, Japón, UK, España, Italia, Chile, Turquía. Brasil, Rusia, India y China NO son países con tratado." },
      { labelEn: "Substantial investment", labelEs: "Inversión sustancial", descEn: "No hard minimum, but typically $100,000+ for established businesses. For lower-cost businesses (under $500k total cost), the investment proportion must be higher (often 75-100% of total cost).", descEs: "Sin mínimo fijo, pero típicamente $100,000+ para negocios establecidos. Para negocios de menor costo (menos de $500k costo total), la proporción de inversión debe ser mayor (a menudo 75-100% del costo total)." },
      { labelEn: "Investment must be 'at risk'", labelEs: "La inversión debe estar 'en riesgo'", descEn: "Funds must be actively deployed or committed — not just sitting in a bank account. Buying an existing business or launching a new one both qualify.", descEs: "Los fondos deben estar activamente desplegados o comprometidos — no simplemente en una cuenta bancaria. Comprar un negocio existente o lanzar uno nuevo ambos califican." },
      { labelEn: "Non-marginal business", labelEs: "Negocio no marginal", descEn: "The business must generate enough income to support more than just yourself — it must create jobs for U.S. workers or have significant economic impact.", descEs: "El negocio debe generar suficientes ingresos para apoyar más que solo a ti mismo — debe crear empleos para trabajadores de EE.UU. o tener un impacto económico significativo." },
    ],
    commonMistakes: [
      { en: "Investing in a business before applying — investment before visa approval can create problems; consult an attorney on sequencing.", es: "Invertir en un negocio antes de aplicar — la inversión antes de la aprobación de la visa puede crear problemas; consulta a un abogado sobre la secuencia." },
      { en: "Not having a comprehensive business plan showing job creation projections and revenue forecasts.", es: "No tener un plan de negocios integral que muestre proyecciones de creación de empleo y pronósticos de ingresos." },
      { en: "Underestimating the 'marginality' test — a business that only supports you and your family will likely be denied.", es: "Subestimar la prueba de 'marginalidad' — un negocio que solo te apoya a ti y a tu familia probablemente será rechazado." },
      { en: "Not verifying your country's treaty status before investing — not all countries have E-2 treaties.", es: "No verificar el estatus de tratado de tu país antes de invertir — no todos los países tienen tratados E-2." },
    ],
    faqs: [
      { questionEn: "What countries qualify for E-2?", questionEs: "¿Qué países califican para E-2?", answerEn: "The U.S. Department of State maintains the official list of E-2 treaty countries. Key LATAM countries with treaties: Mexico, Colombia, Chile, Argentina, Ecuador, Honduras, Panama. Brazil and Venezuela do NOT have E-2 treaties.", answerEs: "El Departamento de Estado de EE.UU. mantiene la lista oficial de países con tratado E-2. Países clave de LATAM con tratados: México, Colombia, Chile, Argentina, Ecuador, Honduras, Panamá. Brasil y Venezuela NO tienen tratados E-2." },
      { questionEn: "How much do I need to invest for E-2?", questionEs: "¿Cuánto necesito invertir para la E-2?", answerEn: "There's no statutory minimum, but USCIS uses a proportionality test. For a $1M business: $100,000 may suffice. For a $50,000 business: you may need to invest most of the total cost. Typical E-2 investments range from $80,000 to $500,000.", answerEs: "No hay un mínimo legal, pero USCIS usa una prueba de proporcionalidad. Para un negocio de $1M: $100,000 puede ser suficiente. Para un negocio de $50,000: puede ser necesario invertir la mayor parte del costo total. Las inversiones E-2 típicas oscilan entre $80,000 y $500,000." },
      { questionEn: "Can E-2 lead to a green card?", questionEs: "¿Puede la E-2 llevar a una green card?", answerEn: "Not directly — E-2 is a nonimmigrant visa. However, successful E-2 investors sometimes transition to EB-5 (investor green card) or EB-1C (if they create a sufficient U.S. enterprise and then transfer within it). Consult an attorney for green card planning.", answerEs: "No directamente — la E-2 es una visa de no inmigrante. Sin embargo, los inversionistas E-2 exitosos a veces hacen la transición al EB-5 (green card de inversionista) o EB-1C (si crean una empresa de EE.UU. suficiente y luego se transfieren dentro de ella). Consulta a un abogado para la planificación de green card." },
      { questionEn: "Can I buy a franchise on E-2?", questionEs: "¿Puedo comprar una franquicia con E-2?", answerEn: "Yes — purchasing a franchise is one of the most common E-2 investment strategies. The franchise must meet all E-2 requirements (substantial investment, non-marginal, investor directs operations). Many franchise brands have E-2 experience.", answerEs: "Sí — comprar una franquicia es una de las estrategias de inversión E-2 más comunes. La franquicia debe cumplir todos los requisitos E-2 (inversión sustancial, no marginal, el inversionista dirige las operaciones). Muchas marcas de franquicias tienen experiencia con E-2." },
    ],
    relatedSlugs: ["l1-intracompany-transfer", "o1-visa-for-engineers", "us-visas-for-mexican-professionals"],
  },
  {
    slug: "b1b2-visitor-visa",
    visaType: "B1/B2",
    titleEn: "B-1/B-2 Visitor Visa: How to Get Approved",
    titleEs: "Visa B-1/B-2 de Visitante: Cómo Obtener la Aprobación",
    descriptionEn: "For tourism, business meetings, and medical visits. Learn how to demonstrate home country ties and avoid common denial reasons.",
    descriptionEs: "Para turismo, reuniones de negocios y visitas médicas. Aprende a demostrar vínculos con tu país de origen y evitar las razones comunes de rechazo.",
    introEn: "The B-1/B-2 visitor visa is the most commonly issued U.S. nonimmigrant visa. It allows temporary visits for tourism (B-2), business meetings (B-1), or medical treatment. Despite its commonality, denial rates in some countries exceed 30%. The consular officer must be convinced you have strong reasons to return home and will not overstay.",
    introEs: "La visa B-1/B-2 de visitante es la visa de no inmigrante de EE.UU. más comúnmente emitida. Permite visitas temporales para turismo (B-2), reuniones de negocios (B-1) o tratamiento médico. A pesar de su frecuencia, las tasas de rechazo en algunos países superan el 30%. El oficial consular debe estar convencido de que tienes razones sólidas para regresar a tu país y que no te quedarás más tiempo del permitido.",
    eligibilityFactors: [
      { labelEn: "Strong home country ties", labelEs: "Vínculos sólidos con tu país de origen", descEn: "Employment, business ownership, property, family (especially spouse/children), and financial assets all demonstrate reasons to return.", descEs: "Empleo, propiedad de negocio, bienes raíces, familia (especialmente cónyuge/hijos) y activos financieros demuestran razones para regresar." },
      { labelEn: "Clear and specific travel purpose", labelEs: "Propósito de viaje claro y específico", descEn: "A defined itinerary, invitation letter, conference registration, or medical appointment referral strengthens the application.", descEs: "Un itinerario definido, carta de invitación, registro de conferencia o referido de cita médica fortalece la solicitud." },
      { labelEn: "Sufficient financial resources", labelEs: "Recursos financieros suficientes", descEn: "Ability to fund the entire trip without needing to work — bank statements, salary records, or sponsor letter.", descEs: "Capacidad de financiar todo el viaje sin necesidad de trabajar — estados de cuenta bancarios, registros de salario o carta de patrocinador." },
      { labelEn: "No prior overstays or violations", labelEs: "Sin estadías excesivas o violaciones previas", descEn: "Prior U.S. overstays, visa violations, or denied applications create significant negative presumptions that are difficult to overcome.", descEs: "Estadías excesivas previas en EE.UU., violaciones de visa o solicitudes denegadas crean presunciones negativas significativas que son difíciles de superar." },
    ],
    commonMistakes: [
      { en: "Vague or overly general answers at the visa interview — be specific about where you're going, when, and why.", es: "Respuestas vagas o demasiado generales en la entrevista de visa — sé específico sobre adónde vas, cuándo y por qué." },
      { en: "Having family members or a U.S. sponsor without other strong home country ties — family in the U.S. can raise dual intent concerns.", es: "Tener miembros de la familia o un patrocinador en EE.UU. sin otros vínculos sólidos con el país de origen — la familia en EE.UU. puede generar preocupaciones de intención dual." },
      { en: "Applying immediately after a denial without addressing the reason for denial — officers see your application history.", es: "Solicitar inmediatamente después de una denegación sin abordar la razón del rechazo — los oficiales ven tu historial de solicitudes." },
      { en: "Not having documented proof of employment (letter from employer, payslips) or business ownership at the interview.", es: "No tener prueba documentada de empleo (carta del empleador, recibos de pago) o propiedad de negocio en la entrevista." },
    ],
    faqs: [
      { questionEn: "How long can I stay in the U.S. on B-1/B-2?", questionEs: "¿Cuánto tiempo puedo quedarme en EE.UU. con B-1/B-2?", answerEn: "The visa itself doesn't determine your authorized stay — the CBP officer at the port of entry sets it (usually 6 months). You can request an extension (Form I-539) for up to 6 more months if needed.", answerEs: "La visa en sí no determina tu estadía autorizada — el oficial de CBP en el punto de entrada la establece (generalmente 6 meses). Puedes solicitar una extensión (Formulario I-539) por hasta 6 meses adicionales si es necesario." },
      { questionEn: "Can I work remotely for a foreign company on B-1/B-2?", questionEs: "¿Puedo trabajar remotamente para una empresa extranjera con B-1/B-2?", answerEn: "This is a gray area. The official position is that B-2 is for tourism only. However, incidental remote work for a foreign employer that doesn't compete in the U.S. market is generally tolerated. Actively conducting business, earning U.S.-sourced income, or providing services to U.S. clients is not permitted.", answerEs: "Esta es un área gris. La posición oficial es que la B-2 es solo para turismo. Sin embargo, el trabajo remoto incidental para un empleador extranjero que no compite en el mercado de EE.UU. generalmente se tolera. Realizar activamente negocios, ganar ingresos de fuente de EE.UU. o proporcionar servicios a clientes de EE.UU. no está permitido." },
      { questionEn: "Can I convert from B-2 to another status inside the U.S.?", questionEs: "¿Puedo convertir de B-2 a otro estatus dentro de EE.UU.?", answerEn: "Sometimes. Change of status (Form I-539 or I-129) is possible for certain categories. However, you must file before your authorized stay expires, and preconceived intent to change status at entry can be grounds for denial.", answerEs: "A veces. El cambio de estatus (Formulario I-539 o I-129) es posible para ciertas categorías. Sin embargo, debes presentar antes de que expire tu estadía autorizada, y la intención preconcebida de cambiar de estatus al entrar puede ser motivo de denegación." },
      { questionEn: "Why was my B-1/B-2 denied under Section 214(b)?", questionEs: "¿Por qué fue denegada mi B-1/B-2 bajo la Sección 214(b)?", answerEn: "Section 214(b) means the consular officer was not convinced you have sufficient ties to your home country to guarantee your return. To reapply, address the specific weakness in your application — typically by strengthening documentation of employment, assets, or family obligations.", answerEs: "La Sección 214(b) significa que el oficial consular no quedó convencido de que tienes vínculos suficientes con tu país de origen para garantizar tu regreso. Para volver a solicitar, aborda la debilidad específica en tu solicitud — típicamente fortaleciendo la documentación de empleo, activos u obligaciones familiares." },
    ],
    relatedSlugs: ["f1-student-visa", "e2-treaty-investor", "us-visas-for-mexican-professionals"],
  },
  {
    slug: "us-visas-for-argentine-professionals",
    visaType: "O-1",
    titleEn: "U.S. Visas for Argentine Professionals",
    titleEs: "Visas de EE.UU. para Profesionales Argentinos",
    descriptionEn: "Best U.S. visa options for Argentine professionals: O-1, EB-2 NIW, E-2. Argentina's E-2 treaty and high skilled workforce make multiple pathways viable.",
    descriptionEs: "Mejores opciones de visa de EE.UU. para profesionales argentinos: O-1, EB-2 NIW, E-2. El tratado E-2 de Argentina y la fuerza laboral altamente calificada hacen viables múltiples rutas.",
    introEn: "Argentine professionals have access to several strong U.S. immigration pathways. Argentina has an E-2 treaty, making the investor visa available. The country also produces a high concentration of technology workers, engineers, physicians, and creative professionals who regularly qualify for O-1 and EB-2 NIW. The B-1/B-2 visa is widely issued to Argentinians with solid economic ties.",
    introEs: "Los profesionales argentinos tienen acceso a varias rutas de inmigración a EE.UU. Argentina tiene tratado E-2, lo que hace disponible la visa de inversionista. El país también produce una alta concentración de trabajadores tecnológicos, ingenieros, médicos y profesionales creativos que regularmente califican para O-1 y EB-2 NIW. La visa B-1/B-2 se emite ampliamente a argentinos con sólidos vínculos económicos.",
    eligibilityFactors: [
      { labelEn: "E-2 treaty country (Argentina qualifies)", labelEs: "País con tratado E-2 (Argentina califica)", descEn: "Argentine nationals can invest in a U.S. business on E-2. Typical minimum investment: $80,000-$150,000. Business must be non-marginal and investor must direct operations.", descEs: "Los nacionales argentinos pueden invertir en un negocio de EE.UU. con E-2. Inversión mínima típica: $80,000-$150,000. El negocio debe ser no marginal y el inversionista debe dirigir las operaciones." },
      { labelEn: "Strong tech & creative sector", labelEs: "Sólido sector tech y creativo", descEn: "Argentina's software engineers, UX designers, architects, and film professionals frequently meet O-1A/O-1B criteria, especially those with international client portfolios.", descEs: "Los ingenieros de software, diseñadores UX, arquitectos y profesionales de cine argentinos frecuentemente cumplen los criterios O-1A/O-1B, especialmente aquellos con portafolios de clientes internacionales." },
      { labelEn: "EB-2 NIW viability", labelEs: "Viabilidad EB-2 NIW", descEn: "Argentine researchers, engineers, and healthcare professionals with graduate degrees and publications regularly self-petition for EB-2 NIW. No employer sponsor required.", descEs: "Los investigadores, ingenieros y profesionales de la salud argentinos con títulos de posgrado y publicaciones regularmente se autopeticionan para EB-2 NIW. No se requiere patrocinador." },
      { labelEn: "B-1/B-2 approval rates", labelEs: "Tasas de aprobación B-1/B-2", descEn: "Argentina has reasonable B-1/B-2 approval rates for applicants with stable employment, property ownership, and prior U.S. travel history.", descEs: "Argentina tiene tasas de aprobación B-1/B-2 razonables para solicitantes con empleo estable, propiedad de bienes raíces e historial previo de viajes a EE.UU." },
    ],
    commonMistakes: [
      { en: "Not considering E-2 despite Argentina's treaty status — many Argentine entrepreneurs overlook this option.", es: "No considerar la E-2 a pesar del estatus de tratado de Argentina — muchos emprendedores argentinos pasan por alto esta opción." },
      { en: "Undervaluing international client work as O-1 evidence — work for U.S. companies from Argentina demonstrates extraordinary ability on the international stage.", es: "Subestimar el trabajo con clientes internacionales como evidencia para O-1 — trabajar para empresas de EE.UU. desde Argentina demuestra habilidad extraordinaria en el escenario internacional." },
      { en: "For H-1B: waiting for lottery selection when O-1 or EB-2 NIW may be achievable — these have no cap or lottery.", es: "Para H-1B: esperar la selección de lotería cuando la O-1 o EB-2 NIW puede ser alcanzable — estas no tienen cupo ni lotería." },
      { en: "Not documenting professional achievements in English — USCIS cannot evaluate Spanish-only portfolios without certified translations.", es: "No documentar logros profesionales en inglés — USCIS no puede evaluar portafolios solo en español sin traducciones certificadas." },
    ],
    faqs: [
      { questionEn: "Does Argentina have a U.S. visa lottery (H-1B) advantage?", questionEs: "¿Tiene Argentina alguna ventaja en la lotería de visa H-1B?", answerEn: "No special advantage for H-1B. However, Argentine IT talent is in high demand, meaning many find employer sponsors. The better path for senior Argentine professionals is often O-1A (no lottery) or EB-2 NIW (no PERM, no sponsor).", answerEs: "No hay ventaja especial para la H-1B. Sin embargo, el talento tech argentino tiene alta demanda, lo que significa que muchos encuentran patrocinadores. La mejor ruta para profesionales argentinos senior es a menudo la O-1A (sin lotería) o el EB-2 NIW (sin PERM, sin patrocinador)." },
      { questionEn: "Can Argentine professionals access TN visas?", questionEs: "¿Pueden los profesionales argentinos acceder a visas TN?", answerEn: "No. TN visas are available only to Canadian and Mexican nationals under the USMCA (formerly NAFTA). Argentinians must use other pathways.", answerEs: "No. Las visas TN están disponibles solo para nacionales canadienses y mexicanos bajo el USMCA (antes TLCAN). Los argentinos deben usar otras rutas." },
      { questionEn: "Are Argentine degrees recognized in the U.S.?", questionEs: "¿Son reconocidos los títulos argentinos en EE.UU.?", answerEn: "For immigration purposes, foreign degrees must be evaluated by a NACES-approved credential evaluator (e.g., ECE, WES, SpanTran). Argentine university degrees are generally evaluated well.", answerEs: "Para propósitos de inmigración, los títulos extranjeros deben ser evaluados por un evaluador de credenciales aprobado por NACES (ej. ECE, WES, SpanTran). Los títulos universitarios argentinos generalmente se evalúan bien." },
      { questionEn: "What U.S. cities have the largest Argentine communities?", questionEs: "¿Qué ciudades de EE.UU. tienen las comunidades argentinas más grandes?", answerEn: "Miami, New York, and Los Angeles have the largest Argentine communities. Miami in particular has become a hub for Argentine tech professionals and entrepreneurs due to its Latin business environment and time zone alignment.", answerEs: "Miami, Nueva York y Los Ángeles tienen las comunidades argentinas más grandes. Miami en particular se ha convertido en un hub para profesionales tech y emprendedores argentinos debido a su entorno empresarial latino y alineación de zona horaria." },
    ],
    relatedSlugs: ["e2-treaty-investor", "o1-visa-for-engineers", "eb2-niw-engineers"],
  },
  {
    slug: "us-visas-for-mexican-professionals",
    visaType: "E-2",
    titleEn: "U.S. Visas for Mexican Professionals",
    titleEs: "Visas de EE.UU. para Profesionales Mexicanos",
    descriptionEn: "Mexico has special advantages: TN visa via USMCA, E-2 treaty, and strong H-1B sponsorship in tech. Find your best U.S. visa path.",
    descriptionEs: "México tiene ventajas especiales: visa TN vía USMCA, tratado E-2 y fuerte patrocinio H-1B en tech. Encuentra tu mejor camino a EE.UU.",
    introEn: "Mexican professionals have some of the broadest U.S. immigration options among Latin American nationals. The USMCA provides access to TN visas (fast, low-cost, no lottery). Mexico's E-2 treaty enables investor visas. Strong bilateral ties mean high H-1B sponsorship in tech and manufacturing. O-1 and EB-2 NIW are also viable for top-tier professionals.",
    introEs: "Los profesionales mexicanos tienen algunas de las opciones de inmigración a EE.UU. más amplias entre los nacionales latinoamericanos. El USMCA proporciona acceso a visas TN (rápidas, de bajo costo, sin lotería). El tratado E-2 de México habilita las visas de inversionista. Los fuertes lazos bilaterales significan un alto patrocinio H-1B en tecnología y manufactura. La O-1 y el EB-2 NIW también son viables para profesionales de primer nivel.",
    eligibilityFactors: [
      { labelEn: "TN visa (USMCA) — no lottery, no cap", labelEs: "Visa TN (USMCA) — sin lotería, sin cupo", descEn: "Available to Mexican professionals in listed occupations (engineers, scientists, accountants, lawyers, etc.). Processed at the border or by petition. Renewable indefinitely.", descEs: "Disponible para profesionales mexicanos en ocupaciones listadas (ingenieros, científicos, contadores, abogados, etc.). Procesado en la frontera o mediante petición. Renovable indefinidamente." },
      { labelEn: "E-2 treaty investor", labelEs: "Inversionista E-2 por tratado", descEn: "Mexico has an E-2 treaty. Mexican nationals can invest in a U.S. business with typically $80,000-$200,000 and obtain E-2 status to manage it.", descEs: "México tiene tratado E-2. Los nacionales mexicanos pueden invertir en un negocio de EE.UU. con típicamente $80,000-$200,000 y obtener estatus E-2 para gestionarlo." },
      { labelEn: "H-1B with strong sponsorship market", labelEs: "H-1B con mercado de patrocinio sólido", descEn: "U.S.-Mexico border tech hubs and nearshore development firms actively sponsor H-1B for Mexican professionals in software, engineering, and finance.", descEs: "Los hubs tech de la frontera EE.UU.-México y firmas de desarrollo nearshore patrocinan activamente H-1B para profesionales mexicanos en software, ingeniería y finanzas." },
      { labelEn: "O-1 and EB-2 NIW for top talent", labelEs: "O-1 y EB-2 NIW para talento de élite", descEn: "Senior Mexican engineers, researchers, physicians, artists, and founders regularly qualify for O-1 and EB-2 NIW pathways.", descEs: "Los ingenieros, investigadores, médicos, artistas y fundadores mexicanos senior regularmente califican para las rutas O-1 y EB-2 NIW." },
    ],
    commonMistakes: [
      { en: "Not using TN when eligible — it's faster and cheaper than H-1B for USMCA-listed professions.", es: "No usar la TN cuando se es elegible — es más rápida y económica que la H-1B para las profesiones listadas en el USMCA." },
      { en: "Assuming DACA recipients can access TN or H-1B — status and work authorization must be verified on a case-by-case basis.", es: "Asumir que los beneficiarios de DACA pueden acceder a TN o H-1B — el estatus y la autorización de trabajo deben verificarse caso por caso." },
      { en: "For E-2: not documenting the source of funds — USCIS requires showing how the investment was acquired.", es: "Para E-2: no documentar la fuente de fondos — USCIS requiere mostrar cómo se adquirió la inversión." },
      { en: "Underestimating the consular wait times at U.S. consulates in Mexico City, Guadalajara, and Monterrey — book well in advance.", es: "Subestimar los tiempos de espera consular en los consulados de EE.UU. en Ciudad de México, Guadalajara y Monterrey — reserva con bastante anticipación." },
    ],
    faqs: [
      { questionEn: "What is the TN visa and who qualifies?", questionEs: "¿Qué es la visa TN y quién califica?", answerEn: "TN (Trade NAFTA/USMCA) is a nonimmigrant visa for Canadian and Mexican professionals in specific occupations listed in the USMCA. Common qualifying professions: engineers, scientists, computer systems analysts, accountants, management consultants, lawyers, nurses, and pharmacists.", answerEs: "La TN (Trade NAFTA/USMCA) es una visa de no inmigrante para profesionales canadienses y mexicanos en ocupaciones específicas listadas en el USMCA. Profesiones calificadas comunes: ingenieros, científicos, analistas de sistemas informáticos, contadores, consultores de gestión, abogados, enfermeras y farmacéuticos." },
      { questionEn: "Can TN holders apply for a green card?", questionEs: "¿Pueden los titulares de TN solicitar una green card?", answerEn: "Technically yes, but TN requires nonimmigrant intent — having an approved I-140 or visible green card intent can cause TN renewal problems. Many TN holders switch to H-1B to safely pursue permanent residence. Consult an attorney if you want to pursue both simultaneously.", answerEs: "Técnicamente sí, pero la TN requiere intención de no inmigrante — tener un I-140 aprobado o intención visible de green card puede causar problemas en la renovación de la TN. Muchos titulares de TN cambian a H-1B para buscar residencia permanente de manera segura. Consulta a un abogado si deseas hacer ambas cosas simultáneamente." },
      { questionEn: "Is B-1/B-2 widely approved for Mexican nationals?", questionEs: "¿Se aprueba ampliamente la B-1/B-2 para nacionales mexicanos?", answerEn: "Denial rates vary significantly by consulate and applicant profile. Applicants with stable employment, property ownership, a U.S. visa history, and a clear travel purpose have much higher approval rates. First-time applicants with no U.S. history and minimal home country ties face the highest denial risk.", answerEs: "Las tasas de rechazo varían significativamente según el consulado y el perfil del solicitante. Los solicitantes con empleo estable, propiedad de bienes raíces, historial de visa de EE.UU. y un propósito de viaje claro tienen tasas de aprobación mucho más altas. Los solicitantes por primera vez sin historial en EE.UU. y con vínculos mínimos con su país enfrentan el mayor riesgo de rechazo." },
      { questionEn: "Can Mexican physicians practice in the U.S.?", questionEs: "¿Pueden los médicos mexicanos ejercer en EE.UU.?", answerEn: "Yes, but foreign medical graduates must pass all USMLE steps and obtain state medical licensure. TN does not cover physicians in most circumstances. H-1B with employer sponsorship, EB-2 NIW (Conrad 30 for J-1 physicians), or O-1A for top researchers are the main paths.", answerEs: "Sí, pero los graduados médicos extranjeros deben aprobar todos los pasos del USMLE y obtener licencia médica estatal. La TN no cubre a los médicos en la mayoría de las circunstancias. H-1B con patrocinio del empleador, EB-2 NIW (Conrad 30 para médicos J-1) u O-1A para investigadores de élite son las principales rutas." },
    ],
    relatedSlugs: ["e2-treaty-investor", "h1b-visa-specialty-occupation", "b1b2-visitor-visa"],
  },
  {
    slug: "us-visas-for-colombian-professionals",
    visaType: "O-1",
    titleEn: "U.S. Visas for Colombian Professionals",
    titleEs: "Visas de EE.UU. para Profesionales Colombianos",
    descriptionEn: "Colombia is an E-2 treaty country. Tech and creative professionals often qualify for O-1. Learn the best U.S. visa paths for Colombians.",
    descriptionEs: "Colombia es país con tratado E-2. Los profesionales tech y creativos frecuentemente califican para O-1. Aprende las mejores rutas de visa de EE.UU. para colombianos.",
    introEn: "Colombian professionals have strong immigration options to the United States. Colombia has an E-2 treaty (enabling the investor visa), and its growing tech sector produces many O-1 candidates. Major U.S. cities — particularly Miami, New York, and Atlanta — have significant Colombian business communities that facilitate sponsorship and networking for H-1B and other visa categories.",
    introEs: "Los profesionales colombianos tienen sólidas opciones de inmigración a Estados Unidos. Colombia tiene tratado E-2 (habilitando la visa de inversionista), y su creciente sector tech produce muchos candidatos para O-1. Ciudades importantes de EE.UU. — particularmente Miami, Nueva York y Atlanta — tienen comunidades empresariales colombianas significativas que facilitan el patrocinio y networking para H-1B y otras categorías.",
    eligibilityFactors: [
      { labelEn: "E-2 treaty (Colombia qualifies)", labelEs: "Tratado E-2 (Colombia califica)", descEn: "Colombian nationals can apply for E-2 investor visa with a substantial investment in a U.S. business. Typical range: $100,000-$300,000.", descEs: "Los nacionales colombianos pueden solicitar la visa E-2 de inversionista con una inversión sustancial en un negocio de EE.UU. Rango típico: $100,000-$300,000." },
      { labelEn: "Growing tech and creative talent", labelEs: "Creciente talento tech y creativo", descEn: "Colombian software developers, designers, and digital marketers frequently meet O-1A/O-1B criteria with international client portfolios and speaking engagements.", descEs: "Los desarrolladores de software, diseñadores y marketers digitales colombianos frecuentemente cumplen los criterios O-1A/O-1B con portafolios de clientes internacionales y participaciones como conferenciantes." },
      { labelEn: "Professional networks in U.S. cities", labelEs: "Redes profesionales en ciudades de EE.UU.", descEn: "Large Colombian communities in Miami, New York, and New Jersey facilitate H-1B sponsorship and business connections for E-2 investments.", descEs: "Las grandes comunidades colombianas en Miami, Nueva York y Nueva Jersey facilitan el patrocinio H-1B y conexiones empresariales para inversiones E-2." },
      { labelEn: "B-1/B-2 for establishing connections", labelEs: "B-1/B-2 para establecer conexiones", descEn: "Many Colombian professionals use B-1/B-2 visits to explore U.S. business opportunities before pursuing longer-term visa options.", descEs: "Muchos profesionales colombianos usan visitas B-1/B-2 para explorar oportunidades de negocios en EE.UU. antes de buscar opciones de visa a largo plazo." },
    ],
    commonMistakes: [
      { en: "Not considering E-2 — Colombia's treaty status is an advantage many professionals don't use.", es: "No considerar la E-2 — el estatus de tratado de Colombia es una ventaja que muchos profesionales no usan." },
      { en: "Applying for B-1/B-2 without clear documentation of home country ties — Colombian consular officers scrutinize this carefully.", es: "Solicitar B-1/B-2 sin documentación clara de vínculos con el país de origen — los oficiales consulares colombianos examinan esto cuidadosamente." },
      { en: "Not having professional achievements documented in English with certified translations before applying for O-1.", es: "No tener logros profesionales documentados en inglés con traducciones certificadas antes de solicitar la O-1." },
      { en: "Underestimating Miami as a base for U.S. professional activity — many Colombian professionals find it easier to establish U.S. business ties from Miami.", es: "Subestimar Miami como base para actividad profesional en EE.UU. — muchos profesionales colombianos encuentran más fácil establecer lazos empresariales en EE.UU. desde Miami." },
    ],
    faqs: [
      { questionEn: "Does Colombia have TN visa access?", questionEs: "¿Tiene Colombia acceso a la visa TN?", answerEn: "No. TN is only for Mexican and Canadian nationals under USMCA. Colombian professionals must use H-1B, O-1, E-2, EB-2 NIW, or other standard pathways.", answerEs: "No. La TN es solo para nacionales mexicanos y canadienses bajo el USMCA. Los profesionales colombianos deben usar H-1B, O-1, E-2, EB-2 NIW u otras rutas estándar." },
      { questionEn: "What's the B-1/B-2 approval rate for Colombians?", questionEs: "¿Cuál es la tasa de aprobación de B-1/B-2 para colombianos?", answerEn: "It varies significantly by applicant profile. Professionals with stable employment, property, and prior U.S. travel history have high approval rates. First-time applicants with weaker home ties face higher denial risk.", answerEs: "Varía significativamente según el perfil del solicitante. Los profesionales con empleo estable, propiedad y historial previo de viajes a EE.UU. tienen altas tasas de aprobación. Los solicitantes por primera vez con vínculos domésticos más débiles enfrentan mayor riesgo de rechazo." },
      { questionEn: "Can Colombian entrepreneurs come to the U.S. without huge capital?", questionEs: "¿Pueden los emprendedores colombianos ir a EE.UU. sin un gran capital?", answerEn: "The E-2 visa has no minimum, but practical investments typically start around $80,000-$100,000. For entrepreneurs with less capital, O-1A (based on achievements, not investment) may be an alternative if the profile is strong.", answerEs: "La visa E-2 no tiene mínimo, pero las inversiones prácticas generalmente comienzan alrededor de $80,000-$100,000. Para emprendedores con menos capital, la O-1A (basada en logros, no en inversión) puede ser una alternativa si el perfil es sólido." },
      { questionEn: "What documents do Colombians need for a B-1/B-2 interview?", questionEs: "¿Qué documentos necesitan los colombianos para la entrevista B-1/B-2?", answerEn: "DS-160 confirmation, passport, photo, appointment confirmation, SEVIS receipt (if applicable), proof of employment or business (letters, payslips, certificates), bank statements, property ownership documents, and a clear travel itinerary or invitation letter.", answerEs: "Confirmación DS-160, pasaporte, foto, confirmación de cita, recibo SEVIS (si aplica), prueba de empleo o negocio (cartas, recibos de pago, certificados), estados de cuenta bancarios, documentos de propiedad y un itinerario de viaje claro o carta de invitación." },
    ],
    relatedSlugs: ["e2-treaty-investor", "o1-visa-for-creatives", "us-visas-for-mexican-professionals"],
  },
  {
    slug: "us-visas-for-brazilian-professionals",
    visaType: "EB-2 NIW",
    titleEn: "U.S. Visas for Brazilian Professionals",
    titleEs: "Visas de EE.UU. para Profesionales Brasileños",
    descriptionEn: "Brazil is not an E-2 treaty country, but EB-2 NIW, O-1, and H-1B are strong options. Learn the best pathways for Brazilian nationals.",
    descriptionEs: "Brasil no es país con tratado E-2, pero el EB-2 NIW, O-1 y H-1B son opciones sólidas. Aprende las mejores rutas para nacionales brasileños.",
    introEn: "Brazilian professionals are among the fastest-growing groups of U.S. immigration applicants. Brazil is notably NOT an E-2 treaty country, which closes off the investor visa route. However, Brazilian engineers, IT professionals, researchers, and healthcare workers regularly succeed with O-1, EB-2 NIW, and H-1B. The EB-2 NIW is particularly attractive because Brazil has no visa backlog (unlike India/China).",
    introEs: "Los profesionales brasileños están entre los grupos de solicitantes de inmigración a EE.UU. de más rápido crecimiento. Brasil notablemente NO es un país con tratado E-2, lo que cierra la ruta de la visa de inversionista. Sin embargo, los ingenieros, profesionales de TI, investigadores y trabajadores de salud brasileños regularmente tienen éxito con O-1, EB-2 NIW y H-1B. El EB-2 NIW es particularmente atractivo porque Brasil no tiene retraso en la cola de visas (a diferencia de India/China).",
    eligibilityFactors: [
      { labelEn: "No visa backlog for Brazil (EB-2 NIW)", labelEs: "Sin retraso de visa para Brasil (EB-2 NIW)", descEn: "Unlike applicants from India or China, Brazilian nationals can get their I-485 (green card) processed relatively quickly after I-140 approval — often within 1-2 years total.", descEs: "A diferencia de los solicitantes de India o China, los nacionales brasileños pueden obtener su I-485 (green card) procesado relativamente rápido después de la aprobación del I-140 — a menudo en 1-2 años en total." },
      { labelEn: "Strong tech and engineering talent", labelEs: "Sólido talento tech e ingenieril", descEn: "Brazil's software development, fintech, and engineering sectors produce many O-1A and EB-2 NIW candidates, especially from São Paulo's tech ecosystem.", descEs: "Los sectores de desarrollo de software, fintech e ingeniería de Brasil producen muchos candidatos para O-1A y EB-2 NIW, especialmente del ecosistema tech de São Paulo." },
      { labelEn: "H-1B sponsorship opportunities", labelEs: "Oportunidades de patrocinio H-1B", descEn: "Many U.S. technology companies actively recruit Brazilian engineers, especially those already working with U.S. clients or at multinational companies.", descEs: "Muchas empresas tecnológicas de EE.UU. reclutan activamente a ingenieros brasileños, especialmente aquellos que ya trabajan con clientes de EE.UU. o en empresas multinacionales." },
      { labelEn: "O-1 for exceptional professionals", labelEs: "O-1 para profesionales excepcionales", descEn: "Brazilian engineers, researchers, designers, athletes, and music/entertainment professionals frequently qualify for O-1A or O-1B based on sustained international recognition.", descEs: "Los ingenieros, investigadores, diseñadores, atletas y profesionales de música/entretenimiento brasileños frecuentemente califican para O-1A u O-1B basándose en reconocimiento internacional sostenido." },
    ],
    commonMistakes: [
      { en: "Pursuing E-2 — Brazil is NOT an E-2 treaty country. This route is not available to Brazilian nationals.", es: "Buscar la E-2 — Brasil NO es un país con tratado E-2. Esta ruta no está disponible para los nacionales brasileños." },
      { en: "Not taking advantage of Brazil's lack of EB-2 NIW backlog — this is a significant advantage over applicants from India and China.", es: "No aprovechar la falta de retraso EB-2 NIW de Brasil — esta es una ventaja significativa sobre los solicitantes de India y China." },
      { en: "Waiting for H-1B lottery when O-1 may be achievable — many Brazilian senior engineers qualify for O-1A without realizing it.", es: "Esperar la lotería H-1B cuando la O-1 puede ser alcanzable — muchos ingenieros senior brasileños califican para O-1A sin darse cuenta." },
      { en: "Not documenting work for U.S. companies as international recognition evidence for O-1 applications.", es: "No documentar el trabajo para empresas de EE.UU. como evidencia de reconocimiento internacional para solicitudes de O-1." },
    ],
    faqs: [
      { questionEn: "Why can't Brazilians use E-2?", questionEs: "¿Por qué los brasileños no pueden usar la E-2?", answerEn: "The E-2 visa requires a bilateral investment treaty between Brazil and the U.S. No such treaty exists. Brazilian nationals must use EB-5 (investor green card, $800,000+ minimum) for investment-based immigration.", answerEs: "La visa E-2 requiere un tratado bilateral de inversión entre Brasil y EE.UU. Dicho tratado no existe. Los nacionales brasileños deben usar EB-5 (green card de inversionista, mínimo $800,000+) para inmigración basada en inversión." },
      { questionEn: "What's special about the EB-2 NIW for Brazilians?", questionEs: "¿Qué tiene de especial el EB-2 NIW para los brasileños?", answerEn: "Brazil's 'rest of world' priority date for EB-2 is generally current — meaning no wait between I-140 approval and being able to file I-485 for adjustment of status. This makes the entire green card process much faster for Brazilians than for Indians or Chinese.", answerEs: "La fecha de prioridad 'resto del mundo' de Brasil para EB-2 es generalmente actual — lo que significa que no hay espera entre la aprobación del I-140 y poder presentar el I-485 para el ajuste de estatus. Esto hace que todo el proceso de green card sea mucho más rápido para los brasileños que para los indios o chinos." },
      { questionEn: "Can Brazilian athletes or entertainers come on O-1?", questionEs: "¿Pueden los atletas o artistas brasileños venir con O-1?", answerEn: "Yes. Brazil produces world-class athletes, musicians, and entertainment professionals who regularly qualify for O-1B. Brazilian athletes in professional leagues (soccer, volleyball, MMA, etc.) are among the most common O-1B recipients.", answerEs: "Sí. Brasil produce atletas, músicos y profesionales del entretenimiento de clase mundial que regularmente califican para O-1B. Los atletas brasileños en ligas profesionales (fútbol, voleibol, MMA, etc.) están entre los receptores de O-1B más comunes." },
      { questionEn: "What's the fastest U.S. visa for a Brazilian software engineer?", questionEs: "¿Cuál es la visa de EE.UU. más rápida para un ingeniero de software brasileño?", answerEn: "For experienced engineers: O-1A with premium processing (decision in 15 business days) is fastest. For engineers seeking permanent residency: EB-2 NIW with premium I-140 then immediate I-485 filing (no backlog for Brazil) can achieve a green card in 18-24 months.", answerEs: "Para ingenieros con experiencia: la O-1A con premium processing (decisión en 15 días hábiles) es la más rápida. Para ingenieros que buscan residencia permanente: EB-2 NIW con I-140 premium y luego presentación inmediata del I-485 (sin retraso para Brasil) puede lograr una green card en 18-24 meses." },
    ],
    relatedSlugs: ["eb2-niw-engineers", "o1-visa-for-engineers", "h1b-visa-specialty-occupation"],
  },

  // ── EB-1A: Extraordinary Ability Green Card ───────────────────────────────
  {
    slug: "eb1a-extraordinary-ability",
    visaType: "eb1a",
    titleEn: "EB-1A Green Card: Extraordinary Ability",
    titleEs: "Green Card EB-1A: Habilidad Extraordinaria",
    descriptionEn: "The EB-1A is a self-petitioned green card for individuals at the very top of their field. No employer sponsor required. Based on the same legal standard as the O-1A visa.",
    descriptionEs: "La EB-1A es una green card por autopetición para personas en la cima de su campo. No se requiere empleador patrocinador. Comparte el mismo estándar legal que la visa O-1A.",
    introEn: "The EB-1A is one of the most direct paths to a U.S. green card for exceptional professionals. Unlike most employment-based green cards, it requires no job offer, no employer sponsor, and no labor certification. You self-petition by demonstrating extraordinary ability through documented evidence across the USCIS regulatory criteria — awards, publications, judging, media coverage, high salary, or original contributions. Under the Kazarian two-step analysis, you must first satisfy at least 3 of the 10 criteria, then show that your evidence as a whole supports a final merits finding of extraordinary ability.",
    introEs: "La EB-1A es uno de los caminos más directos hacia una green card de EE.UU. para profesionales excepcionales. A diferencia de la mayoría de las green cards de base laboral, no requiere oferta de empleo, empleador patrocinador ni certificación laboral. Se presenta por autopetición demostrando habilidad extraordinaria mediante evidencia documentada en los criterios regulatorios de USCIS — premios, publicaciones, evaluación de pares, cobertura mediática, salario alto o contribuciones originales. Bajo el análisis de dos pasos Kazarian, primero debes satisfacer al menos 3 de los 10 criterios, y luego mostrar que tu evidencia en conjunto apoya una determinación final de habilidad extraordinaria.",
    eligibilityFactors: [
      {
        labelEn: "National or international awards",
        labelEs: "Premios nacionales o internacionales",
        descEn: "Awards or prizes specifically limited to outstanding achievements in the field, with documentation of the selection criteria, judging process, and geographic scope.",
        descEs: "Premios específicamente limitados a logros sobresalientes en el campo, con documentación de los criterios de selección, proceso de evaluación y alcance geográfico.",
      },
      {
        labelEn: "Membership in elite associations",
        labelEs: "Membresía en asociaciones de élite",
        descEn: "Membership in associations requiring outstanding achievements as a prerequisite — judged by recognized experts, not open to general application.",
        descEs: "Membresía en asociaciones que exigen logros sobresalientes como prerequisito — evaluados por expertos reconocidos, no abiertos a solicitud general.",
      },
      {
        labelEn: "Published media about you and your work",
        labelEs: "Cobertura mediática publicada sobre vos y tu trabajo",
        descEn: "Published material about you in professional publications, major trade journals, or mainstream media — not press releases you issued or social media posts.",
        descEs: "Material publicado sobre vos en publicaciones profesionales, revistas especializadas o medios principales — no comunicados de prensa que vos generaste ni publicaciones en redes sociales.",
      },
      {
        labelEn: "Judging or evaluating others' work",
        labelEs: "Evaluación del trabajo de otros en tu campo",
        descEn: "Participation as a judge, reviewer, or committee member evaluating the work of others — with documentation from the organizer and description of your role.",
        descEs: "Participación como jurado, evaluador o miembro de comité para evaluar el trabajo de otros — con documentación del organizador y descripción de tu rol.",
      },
      {
        labelEn: "Original contributions of major significance",
        labelEs: "Contribuciones originales de importancia mayor",
        descEn: "Patents, published findings, or other original contributions that have had significant impact on your field — documented through citations, adoption by others, or expert letters describing the impact.",
        descEs: "Patentes, hallazgos publicados u otras contribuciones originales con impacto significativo en tu campo — documentadas mediante citas, adopción por otros o cartas de expertos describiendo el impacto.",
      },
    ],
    commonMistakes: [
      { en: "Confusing EB-1A with EB-1B (outstanding researcher) — EB-1B requires an employer sponsor and is for researchers/professors specifically.", es: "Confundir EB-1A con EB-1B (investigador destacado) — EB-1B requiere un empleador patrocinador y es específicamente para investigadores y profesores." },
      { en: "Filing before meeting 3+ criteria clearly — meeting 2 criteria (even with strong evidence) results in automatic denial at Kazarian step one.", es: "Presentar antes de cumplir claramente 3+ criterios — cumplir 2 criterios (incluso con evidencia sólida) resulta en negación automática en el paso uno de Kazarian." },
      { en: "Listing achievements without contemporaneous evidence — USCIS requires contemporaneous documentation, not self-reported summaries.", es: "Listar logros sin evidencia contemporánea — USCIS exige documentación contemporánea, no resúmenes autoreportados." },
      { en: "Using only high salary without comparison data — salary must be shown relative to others in the same occupation and geography using BLS or industry surveys.", es: "Usar solo salario alto sin datos comparativos — el salario debe mostrarse en relación a otros en la misma ocupación y geografía usando BLS o encuestas de la industria." },
      { en: "Assuming a strong O-1 approval guarantees EB-1A approval — they share the legal standard but I-140 review is more rigorous than O-1 at many USCIS service centers.", es: "Asumir que una aprobación O-1 sólida garantiza la aprobación EB-1A — comparten el estándar legal pero la revisión del I-140 es más rigurosa que la de O-1 en muchos centros de servicio de USCIS." },
    ],
    faqs: [
      {
        questionEn: "What are the 10 EB-1A criteria?",
        questionEs: "¿Cuáles son los 10 criterios de EB-1A?",
        answerEn: "Under 8 CFR 204.5(h)(3), the criteria are: (1) awards/prizes, (2) elite membership, (3) published material about you, (4) judging others' work, (5) original contributions, (6) scholarly articles, (7) artistic exhibitions, (8) critical role in distinguished organizations, (9) high remuneration, (10) commercial success in performing arts. You must satisfy at least 3.",
        answerEs: "Bajo 8 CFR 204.5(h)(3), los criterios son: (1) premios/distinciones, (2) membresía en asociaciones de élite, (3) material publicado sobre vos, (4) evaluación del trabajo de otros, (5) contribuciones originales, (6) artículos académicos, (7) exposiciones artísticas, (8) rol crítico en organizaciones distinguidas, (9) alta remuneración, (10) éxito comercial en artes escénicas. Debes satisfacer al menos 3.",
      },
      {
        questionEn: "How is EB-1A different from EB-2 NIW?",
        questionEs: "¿En qué se diferencia EB-1A de EB-2 NIW?",
        answerEn: "Both are self-petitioned. EB-1A requires demonstrating you are at the very top of your field (extraordinary ability) and meeting 3+ specific criteria. EB-2 NIW requires an advanced degree or exceptional ability plus showing your work benefits the national interest. EB-1A has a higher bar but priority dates are generally current for all countries (no backlog).",
        answerEs: "Ambas son por autopetición. EB-1A requiere demostrar que estás en la cima de tu campo (habilidad extraordinaria) y cumplir 3+ criterios específicos. EB-2 NIW requiere un título avanzado o habilidad excepcional más mostrar que tu trabajo beneficia el interés nacional. EB-1A tiene un nivel más alto pero las fechas de prioridad son generalmente actuales para todos los países (sin retraso).",
      },
      {
        questionEn: "Can artists and musicians qualify for EB-1A?",
        questionEs: "¿Pueden artistas y músicos calificar para EB-1A?",
        answerEn: "Yes. EB-1A covers extraordinary ability in 'the arts' broadly. However, criterion 7 (artistic exhibitions) specifically requires exhibitions or showcases of artistic work — not performances. Musicians and performing artists typically qualify under other criteria (awards, critical role, high salary, media coverage).",
        answerEs: "Sí. EB-1A cubre habilidad extraordinaria en 'las artes' ampliamente. Sin embargo, el criterio 7 (exposiciones artísticas) requiere específicamente exposiciones o muestras de obra artística — no actuaciones. Los músicos y artistas escénicos típicamente califican bajo otros criterios (premios, rol crítico, alto salario, cobertura mediática).",
      },
      {
        questionEn: "Is there a country backlog for EB-1A?",
        questionEs: "¿Hay retraso por país para EB-1A?",
        answerEn: "EB-1A priority dates are almost always current for all countries, including India and China. This makes it particularly attractive for Indian and Chinese nationals who face multi-year backlogs in EB-2 and EB-3 categories.",
        answerEs: "Las fechas de prioridad EB-1A son casi siempre actuales para todos los países, incluidos India y China. Esto lo hace especialmente atractivo para nacionales indios y chinos que enfrentan retrasos de varios años en las categorías EB-2 y EB-3.",
      },
      {
        questionEn: "What processing times should I expect?",
        questionEs: "¿Qué tiempos de procesamiento debo esperar?",
        answerEn: "I-140 standard processing: 6–9 months. I-140 premium processing: 15 business days ($2,805 fee). After I-140 approval, if priority dates are current (typical for EB-1A), you can file I-485 adjustment of status immediately. Total timeline: 8–18 months typical.",
        answerEs: "Procesamiento estándar del I-140: 6–9 meses. Premium processing del I-140: 15 días hábiles (tarifa $2,805). Tras la aprobación del I-140, si las fechas de prioridad son actuales (típico para EB-1A), puedes presentar el I-485 de ajuste de estatus inmediatamente. Cronograma total: 8–18 meses típicamente.",
      },
    ],
    relatedSlugs: ["o1-visa-for-engineers", "o1-visa-for-researchers", "eb2-niw-engineers"],
  },

  // ── EB-2 PERM: Employer-Sponsored Advanced Degree Green Card ─────────────
  {
    slug: "eb2-perm-employer-sponsored",
    visaType: "eb2perm",
    titleEn: "EB-2 PERM: Employer-Sponsored Green Card",
    titleEs: "EB-2 PERM: Green Card por Patrocinio de Empleador",
    descriptionEn: "A permanent green card sponsored by a U.S. employer for professionals with advanced degrees. Requires a job offer and PERM labor certification through the Department of Labor.",
    descriptionEs: "Una green card permanente patrocinada por un empleador de EE.UU. para profesionales con títulos avanzados. Requiere una oferta de empleo y certificación laboral PERM ante el Departamento de Trabajo.",
    introEn: "The EB-2 PERM is the most common employer-sponsored path to a green card for advanced-degree professionals. The process involves three stages: (1) PERM labor certification — your employer must prove no qualified U.S. workers are available for the role; (2) I-140 immigrant petition filed by your employer; and (3) adjustment of status (I-485) or consular processing once a visa number is available. For most countries (all except India and China), the process typically takes 2.5–4 years. For Indian nationals, the per-country backlog currently exceeds 12 years.",
    introEs: "La EB-2 PERM es el camino de patrocinio de empleador más común hacia una green card para profesionales con títulos avanzados. El proceso tiene tres etapas: (1) certificación laboral PERM — tu empleador debe probar que no hay trabajadores calificados de EE.UU. disponibles para el puesto; (2) petición inmigratoria I-140 presentada por tu empleador; y (3) ajuste de estatus (I-485) o procesamiento consular una vez que hay un número de visa disponible. Para la mayoría de los países (todos excepto India y China), el proceso tarda aproximadamente 2.5–4 años. Para nacionales indios, el retraso por país actualmente supera los 12 años.",
    eligibilityFactors: [
      {
        labelEn: "U.S. employer willing to sponsor a permanent position",
        labelEs: "Empleador de EE.UU. dispuesto a patrocinar un puesto permanente",
        descEn: "The employer must be willing to commit to a permanent, full-time position and bear the costs of PERM (attorney fees, advertising, filing). This is the core prerequisite — EB-2 PERM cannot be self-petitioned.",
        descEs: "El empleador debe estar dispuesto a comprometerse con un puesto permanente y a tiempo completo y asumir los costos de PERM (honorarios de abogado, publicidad, presentación). Este es el prerrequisito central — EB-2 PERM no puede presentarse por autopetición.",
      },
      {
        labelEn: "Advanced degree (Master's or higher)",
        labelEs: "Título avanzado (Maestría o superior)",
        descEn: "The position must require a Master's degree or higher. Alternatively, a Bachelor's degree plus 5 years of progressive post-degree experience may be equivalent. A PhD significantly strengthens the application.",
        descEs: "El puesto debe requerir una Maestría o superior. Alternativamente, una Licenciatura más 5 años de experiencia progresiva post-título puede ser equivalente. Un doctorado fortalece significativamente la solicitud.",
      },
      {
        labelEn: "Specialty occupation match",
        labelEs: "Coincidencia con ocupación especializada",
        descEn: "The job must be a specialty occupation with established precedent for EB-2 approval. STEM fields (engineering, medicine, computer science), legal, financial, and academic positions have the most favorable precedent.",
        descEs: "El trabajo debe ser una ocupación especializada con precedente establecido para aprobación EB-2. Los campos STEM (ingeniería, medicina, informática), jurídico, financiero y académico tienen el precedente más favorable.",
      },
      {
        labelEn: "No country-of-birth backlog (Rest of World)",
        labelEs: "Sin retraso por país de nacimiento (Resto del Mundo)",
        descEn: "Priority dates for EB-2 are typically current for most countries (Argentina, Colombia, Brazil, Mexico, Europe, etc.). Only India and China face significant multi-year backlogs due to annual per-country caps.",
        descEs: "Las fechas de prioridad para EB-2 son típicamente actuales para la mayoría de los países (Argentina, Colombia, Brasil, México, Europa, etc.). Solo India y China enfrentan retrasos significativos de varios años debido a los límites anuales por país.",
      },
    ],
    commonMistakes: [
      { en: "Starting the PERM process without an immigration attorney — any procedural error in recruitment or filing resets the PERM clock, costing 500+ additional days.", es: "Iniciar el proceso PERM sin un abogado de inmigración — cualquier error procesal en el reclutamiento o la presentación reinicia el contador de PERM, costando 500+ días adicionales." },
      { en: "Not documenting the recruitment process carefully — PERM audits are common and require meticulous records of every advertisement, application received, and reason for non-selection.", es: "No documentar cuidadosamente el proceso de reclutamiento — las auditorías de PERM son comunes y requieren registros meticulosos de cada anuncio, solicitud recibida y motivo de no selección." },
      { en: "Indian and Chinese nationals accepting employer sponsorship without evaluating EB-1A or EB-2 NIW as alternatives — the 12+ year EB-2 India backlog makes PERM extremely unattractive for most Indian professionals.", es: "Nacionales indios y chinos que aceptan patrocinio de empleador sin evaluar EB-1A o EB-2 NIW como alternativas — el retraso EB-2 India de 12+ años hace que PERM sea extremadamente poco atractivo para la mayoría de los profesionales indios." },
      { en: "Changing jobs before the green card is finalized — porting to a new employer is possible after I-485 has been pending 180+ days, but requires careful legal planning.", es: "Cambiar de trabajo antes de que se finalice la green card — la portabilidad a un nuevo empleador es posible después de que el I-485 haya estado pendiente 180+ días, pero requiere una planificación legal cuidadosa." },
      { en: "Not filing I-140 concurrently with the I-485 when priority date is current — concurrent filing locks in an earlier priority date and speeds up the process.", es: "No presentar el I-140 de forma concurrente con el I-485 cuando la fecha de prioridad es actual — la presentación concurrente fija una fecha de prioridad más temprana y acelera el proceso." },
    ],
    faqs: [
      {
        questionEn: "What is PERM labor certification?",
        questionEs: "¿Qué es la certificación laboral PERM?",
        answerEn: "PERM (Program Electronic Review Management) is the U.S. Department of Labor's process to verify that hiring a foreign worker won't displace or harm U.S. workers. Your employer must advertise the position, interview U.S. applicants, and document why none were qualified before DOL certifies the labor market test. Current processing time is approximately 500 calendar days (no premium processing available).",
        answerEs: "PERM (Program Electronic Review Management) es el proceso del Departamento de Trabajo de EE.UU. para verificar que contratar a un trabajador extranjero no desplazará ni perjudicará a trabajadores de EE.UU. Tu empleador debe anunciar el puesto, entrevistar a solicitantes de EE.UU. y documentar por qué ninguno estaba calificado antes de que el DOL certifique la prueba del mercado laboral. El tiempo de procesamiento actual es aproximadamente 500 días calendario (no disponible premium processing).",
      },
      {
        questionEn: "What happens to my green card if I change jobs?",
        questionEs: "¿Qué pasa con mi green card si cambio de trabajo?",
        answerEn: "Under AC21 portability, if your I-485 has been pending 180+ days, you can change employers as long as the new job is in the same or similar occupational classification. The underlying I-140 remains valid and your priority date is preserved. Consult an attorney before any job change during an active green card process.",
        answerEs: "Bajo la portabilidad AC21, si tu I-485 ha estado pendiente 180+ días, puedes cambiar de empleador siempre que el nuevo trabajo sea en la misma clasificación ocupacional o similar. El I-140 subyacente permanece válido y se preserva tu fecha de prioridad. Consulta a un abogado antes de cualquier cambio de trabajo durante un proceso activo de green card.",
      },
      {
        questionEn: "How long does the full EB-2 PERM process take?",
        questionEs: "¿Cuánto tarda todo el proceso EB-2 PERM?",
        answerEn: "For Rest of World countries (Argentina, Colombia, Brazil, Mexico, etc.): PERM (~500 days) + I-140 (6–9 months standard, 15 business days premium) + I-485 (6–18 months) = approximately 2.5–4 years total. For India: add 12+ year backlog after I-140 approval. For China: add 3–5 year backlog.",
        answerEs: "Para países del Resto del Mundo (Argentina, Colombia, Brasil, México, etc.): PERM (~500 días) + I-140 (6–9 meses estándar, 15 días hábiles premium) + I-485 (6–18 meses) = aproximadamente 2.5–4 años en total. Para India: agregar retraso de 12+ años después de la aprobación del I-140. Para China: agregar retraso de 3–5 años.",
      },
      {
        questionEn: "Can I self-petition for EB-2 without an employer?",
        questionEs: "¿Puedo autopeticionarme para EB-2 sin empleador?",
        answerEn: "Not for EB-2 PERM. However, EB-2 National Interest Waiver (NIW) allows self-petition without an employer. If you have an advanced degree or exceptional ability, EB-2 NIW may be a better option — especially if you don't have a permanent U.S. job offer or if you're from India or China (both NIW and EB-1A avoid the country-specific EB-2 PERM backlog).",
        answerEs: "No para EB-2 PERM. Sin embargo, la Exención por Interés Nacional EB-2 (NIW) permite la autopetición sin empleador. Si tienes un título avanzado o habilidad excepcional, EB-2 NIW puede ser una mejor opción — especialmente si no tienes una oferta de trabajo permanente en EE.UU. o si eres de India o China (tanto NIW como EB-1A evitan el retraso por país específico de EB-2 PERM).",
      },
      {
        questionEn: "What is EB-2 Exceptional Ability, and how is it different from an advanced degree?",
        questionEs: "¿Qué es la Habilidad Excepcional EB-2, y en qué se diferencia de un título avanzado?",
        answerEn: "EB-2 has two qualifying bases: (1) advanced degree (Master's+, or Bachelor's + 5 years progressive experience), or (2) exceptional ability — demonstrated by meeting 3 of 6 regulatory criteria including degree, certifications, membership, employment letters, high salary, or other recognition. Exceptional ability allows applicants without a Master's to qualify if they have a strong professional record.",
        answerEs: "EB-2 tiene dos bases de calificación: (1) título avanzado (Maestría+, o Licenciatura + 5 años de experiencia progresiva), o (2) habilidad excepcional — demostrada cumpliendo 3 de 6 criterios regulatorios incluyendo título, certificaciones, membresía, cartas de empleo, salario alto u otro reconocimiento. La habilidad excepcional permite calificar a solicitantes sin Maestría si tienen un sólido historial profesional.",
      },
    ],
    relatedSlugs: ["eb2-niw-engineers", "eb1a-extraordinary-ability", "h1b-visa-specialty-occupation"],
  },
  {
    slug: "j1-visa-exchange-visitor",
    visaType: "j1",
    titleEn: "J-1 Exchange Visitor Visa: Researchers, Professors, Trainees & Interns",
    titleEs: "Visa J-1 de Visitante de Intercambio: Investigadores, Profesores, Pasantes y Especialistas",
    descriptionEn:
      "The J-1 visa enables cultural and educational exchange through approved programs. Used by researchers, professors, trainees, interns, and specialists. Critical: the two-year home residency rule (INA § 212(e)) may prevent H-1B or green card applications.",
    descriptionEs:
      "La visa J-1 permite el intercambio cultural y educativo a través de programas aprobados. Usada por investigadores, profesores, pasantes y especialistas. Importante: la regla de residencia de dos años (INA § 212(e)) puede impedir solicitudes de H-1B o green card.",
    introEn:
      "The J-1 Exchange Visitor Visa (INA § 101(a)(15)(J)) is administered by the U.S. Department of State — not USCIS — and is issued under 12 subcategories including Research Scholar, Professor, Trainee, Intern, Specialist, and Teacher. Over 310,000 exchange visitors participate annually from 200+ countries, with an 88.8% visa approval rate in FY2022. Unlike most other U.S. visas, J-1 eligibility is controlled primarily by the sponsoring exchange organization, which issues the DS-2019 form. Without an approved sponsor, no J-1 application is possible. The single most important factor for J-1 applicants planning a long-term U.S. career is the two-year home residency requirement (INA § 212(e)) — which can block access to H-1B, L-1, and green card applications for years. A December 9, 2024 State Department update (Public Notice 12555) removed China, India, Brazil, and other countries from the Exchange Visitor Skills List, potentially eliminating this requirement retroactively for many current and former J-1 holders.",
    introEs:
      "La Visa J-1 de Visitante de Intercambio (INA § 101(a)(15)(J)) es administrada por el Departamento de Estado de EE.UU. — no por USCIS — y se emite bajo 12 subcategorías incluyendo Investigador, Profesor, Pasante en Entrenamiento, Pasante, Especialista y Maestro. Más de 310,000 visitantes de intercambio participan anualmente de más de 200 países, con una tasa de aprobación del 88.8% en FY2022. A diferencia de la mayoría de las visas de EE.UU., la elegibilidad J-1 está controlada principalmente por la organización de intercambio patrocinadora, que emite el formulario DS-2019. Sin un patrocinador aprobado, ninguna solicitud J-1 es posible. El factor más importante para los solicitantes de J-1 que planean una carrera a largo plazo en EE.UU. es el requisito de residencia de dos años en el país de origen (INA § 212(e)) — que puede bloquear el acceso a solicitudes de H-1B, L-1 y green card durante años. Una actualización del Departamento de Estado del 9 de diciembre de 2024 (Aviso Público 12555) eliminó a China, India, Brasil y otros países de la Lista de Habilidades de Visitantes de Intercambio, potencialmente eliminando este requisito retroactivamente para muchos titulares actuales y anteriores de J-1.",
    eligibilityFactors: [
      {
        labelEn: "Acceptance into a State Dept-approved exchange program (DS-2019)",
        labelEs: "Aceptación en un programa de intercambio aprobado por el Departamento de Estado (DS-2019)",
        descEn:
          "J-1 requires acceptance into a designated exchange program. The sponsoring organization issues the DS-2019 form, which defines your subcategory, funding source, and program dates. Sponsors include universities, research institutes, hospitals, government agencies, and private exchange organizations.",
        descEs:
          "El J-1 requiere aceptación en un programa de intercambio designado. La organización patrocinadora emite el formulario DS-2019, que define tu subcategoría, fuente de financiamiento y fechas del programa. Los patrocinadores incluyen universidades, institutos de investigación, hospitales, agencias gubernamentales y organizaciones privadas de intercambio.",
      },
      {
        labelEn: "Meeting the qualification requirements for your J-1 subcategory",
        labelEs: "Cumplir los requisitos de calificación para tu subcategoría J-1",
        descEn:
          "Each subcategory has specific requirements: Research Scholar and Professor require advanced degrees and academic credentials. Trainee requires a degree plus 1 year of experience (or 5 years without a degree). Intern requires current enrollment or graduation within the past 12 months. Specialist requires recognized expertise in a specialized field.",
        descEs:
          "Cada subcategoría tiene requisitos específicos: Investigador y Profesor requieren títulos avanzados y credenciales académicas. Pasante en Entrenamiento requiere un título más 1 año de experiencia (o 5 años sin título). Pasante requiere inscripción actual o graduación en los últimos 12 meses. Especialista requiere experiencia reconocida en un campo especializado.",
      },
      {
        labelEn: "Understanding and managing the two-year home residency requirement",
        labelEs: "Comprender y gestionar el requisito de residencia de dos años en el país de origen",
        descEn:
          "INA § 212(e) may require you to return to your home country for 2 years before applying for H-1B, L-1, or a green card. This applies if you received U.S. or home government funding, if your field appears on the Skills List, or if you are in a graduate medical education program. The December 2024 Skills List update retroactively removed China, India, Brazil, and others.",
        descEs:
          "INA § 212(e) puede requerirte regresar a tu país de origen por 2 años antes de solicitar H-1B, L-1 o una green card. Aplica si recibiste financiamiento del gobierno de EE.UU. o de tu país, si tu campo aparece en la Lista de Habilidades, o si estás en un programa de formación médica de posgrado. La actualización de diciembre de 2024 eliminó retroactivamente a China, India, Brasil y otros.",
      },
      {
        labelEn: "Demonstrating nonimmigrant intent and ties to home country",
        labelEs: "Demostrar intención de no inmigrante y vínculos con el país de origen",
        descEn:
          "J-1 is a nonimmigrant visa — dual intent is not explicitly protected. You must show intent to return to your home country after the exchange program ends. Evidence of ties (employment, family, property) strengthens your application at the consular interview.",
        descEs:
          "J-1 es una visa de no inmigrante — la intención dual no está explícitamente protegida. Debes demostrar intención de regresar a tu país de origen después del programa de intercambio. La evidencia de vínculos (empleo, familia, propiedad) fortalece tu solicitud en la entrevista consular.",
      },
    ],
    commonMistakes: [
      {
        en: "Not understanding the two-year home residency requirement before accepting a J-1 program — especially a government-funded one. Once you participate in a 212(e)-triggering program, the requirement applies retroactively. Always confirm your 212(e) status before accepting any exchange program offer.",
        es: "No comprender el requisito de residencia de dos años antes de aceptar un programa J-1 — especialmente uno financiado por el gobierno. Una vez que participas en un programa que activa el 212(e), el requisito aplica retroactivamente. Siempre confirma tu estatus 212(e) antes de aceptar cualquier oferta de programa de intercambio.",
      },
      {
        en: "Accepting government funding (Fulbright, USAID, home government grants) without understanding that this automatically triggers INA § 212(e) — regardless of your nationality or field of study. The Skills List is only one of three triggers; government funding is the most common.",
        es: "Aceptar financiamiento gubernamental (Fulbright, USAID, becas del gobierno de origen) sin entender que esto activa automáticamente INA § 212(e) — independientemente de tu nacionalidad o campo de estudio. La Lista de Habilidades es solo uno de los tres activadores; el financiamiento gubernamental es el más común.",
      },
      {
        en: "Ignoring the 12/24-month bar for Research Scholar and Professor categories — you cannot begin a new J-1 program in these categories within 12 or 24 months of completing a prior J-1 in the same category. Plan your program timeline accordingly.",
        es: "Ignorar la restricción de 12/24 meses para las categorías de Investigador y Profesor — no puedes comenzar un nuevo programa J-1 en estas categorías dentro de los 12 o 24 meses de haber completado un J-1 anterior en la misma categoría. Planifica tu cronograma de programa en consecuencia.",
      },
      {
        en: "Assuming the December 2024 Skills List removal eliminates all 212(e) risk — the update removes the skills list trigger for China, India, Brazil, and others, but government funding and GME still independently trigger 212(e). Get a written confirmation from your program sponsor.",
        es: "Asumir que la eliminación de la Lista de Habilidades de diciembre de 2024 elimina todo riesgo de 212(e) — la actualización elimina el activador de la lista de habilidades para China, India, Brasil y otros, pero el financiamiento gubernamental y el GME siguen activando independientemente el 212(e). Obtén una confirmación escrita de tu patrocinador del programa.",
      },
    ],
    faqs: [
      {
        questionEn: "What is the J-1 two-year home residency requirement?",
        questionEs: "¿Qué es el requisito de residencia de dos años de la J-1?",
        answerEn:
          "INA § 212(e) requires some J-1 visa holders to return to their home country for two years after their exchange program before they can apply for H-1B, L-1, or any immigrant visa. It applies if: (1) you received U.S. government funding (Fulbright, USAID, etc.), (2) your home government funded your exchange, (3) your field of study appears on your country's Exchange Visitor Skills List, or (4) you participated in graduate medical education (GME) training.",
        answerEs:
          "INA § 212(e) requiere que algunos titulares de visa J-1 regresen a su país de origen por dos años después de su programa de intercambio antes de poder solicitar H-1B, L-1 o cualquier visa de inmigrante. Aplica si: (1) recibiste financiamiento del gobierno de EE.UU. (Fulbright, USAID, etc.), (2) tu gobierno de origen financió tu intercambio, (3) tu campo de estudio aparece en la Lista de Habilidades de Visitantes de Intercambio de tu país, o (4) participaste en formación médica de posgrado (GME).",
      },
      {
        questionEn: "Can I get a waiver of the two-year requirement?",
        questionEs: "¿Puedo obtener una exención del requisito de dos años?",
        answerEn:
          "Yes — four waiver paths exist: (1) No objection statement from your home government; (2) Interested U.S. government agency waiver (if a U.S. agency can demonstrate your work serves its interests); (3) Persecution or exceptional hardship waiver (Form I-612, filed with USCIS); (4) Conrad State 30 program — available only to physicians who agree to practice for 3 years in a medically underserved area sponsored by a state health department. Waivers can take 12–18 months to process.",
        answerEs:
          "Sí — existen cuatro rutas de exención: (1) Declaración de no objeción de tu gobierno de origen; (2) Exención de agencia gubernamental de EE.UU. interesada; (3) Exención por persecución o dificultad excepcional (Formulario I-612, presentado ante USCIS); (4) Programa Conrad State 30 — disponible solo para médicos que acuerdan ejercer durante 3 años en un área médicamente desatendida patrocinada por un departamento de salud estatal. Las exenciones pueden tardar 12-18 meses en procesarse.",
      },
      {
        questionEn: "Does the December 2024 Skills List update affect me?",
        questionEs: "¿Me afecta la actualización de la Lista de Habilidades de diciembre de 2024?",
        answerEn:
          "Possibly — and retroactively. The December 9, 2024 State Department update (Public Notice 12555) removed China, India, Brazil, Turkey, South Korea, and others from the Exchange Visitor Skills List. If your 212(e) status was based solely on the Skills List (not government funding or GME), you may no longer be subject to the two-year requirement. This applies to J-1 holders already in the U.S. Get written confirmation from your program sponsor or DS-2019 issuer, and consult an attorney.",
        answerEs:
          "Posiblemente — y de forma retroactiva. La actualización del Departamento de Estado del 9 de diciembre de 2024 (Aviso Público 12555) eliminó a China, India, Brasil, Turquía, Corea del Sur y otros de la Lista de Habilidades de Visitantes de Intercambio. Si tu estatus 212(e) se basaba únicamente en la Lista de Habilidades (no en financiamiento gubernamental o GME), es posible que ya no estés sujeto al requisito de dos años. Esto aplica a titulares de J-1 ya en EE.UU. Obtén confirmación escrita de tu patrocinador del programa o emisor del DS-2019, y consulta a un abogado.",
      },
      {
        questionEn: "Can J-1 lead to a green card?",
        questionEs: "¿Puede la J-1 llevar a una green card?",
        answerEn:
          "Yes — but it's complex. J-1 does not directly lead to a green card, and the two-year home residency requirement can block immigrant visa applications if it applies. If you are not subject to 212(e), you can pursue a green card through the standard employment-based categories (EB-1A, EB-2 NIW, EB-3, etc.) while on J-1 status or after completing your program. If you are subject to 212(e), you must fulfill the requirement or obtain a waiver first.",
        answerEs:
          "Sí — pero es complejo. La J-1 no lleva directamente a una green card, y el requisito de residencia de dos años puede bloquear las solicitudes de visa de inmigrante si aplica. Si no estás sujeto al 212(e), puedes buscar una green card a través de las categorías estándar basadas en empleo (EB-1A, EB-2 NIW, EB-3, etc.) mientras estás en estatus J-1 o después de completar tu programa. Si estás sujeto al 212(e), primero debes cumplir el requisito u obtener una exención.",
      },
      {
        questionEn: "What is the difference between J-1 and F-1?",
        questionEs: "¿Cuál es la diferencia entre J-1 y F-1?",
        answerEn:
          "F-1 is a student visa for degree-seeking students enrolled in USCIS-approved schools. J-1 is an exchange visitor visa for a broader range of programs — research, teaching, training, internships — that promote cultural exchange. Key differences: (1) J-1 may carry the two-year home residency requirement; F-1 does not. (2) J-1 is sponsored by an exchange organization (DS-2019); F-1 by a school (I-20). (3) J-1 covers non-degree programs; F-1 requires degree enrollment. (4) J-1 dependents (J-2 holders) can obtain work authorization; F-2 dependents generally cannot.",
        answerEs:
          "F-1 es una visa de estudiante para estudiantes que buscan un título inscriptos en escuelas aprobadas por USCIS. J-1 es una visa de visitante de intercambio para una gama más amplia de programas — investigación, enseñanza, entrenamiento, pasantías — que promueven el intercambio cultural. Diferencias clave: (1) J-1 puede conllevar el requisito de residencia de dos años; F-1 no. (2) J-1 es patrocinada por una organización de intercambio (DS-2019); F-1 por una escuela (I-20). (3) J-1 cubre programas sin título; F-1 requiere inscripción en un título. (4) Los dependientes J-1 (titulares de J-2) pueden obtener autorización de trabajo; los dependientes F-2 generalmente no.",
      },
    ],
    relatedSlugs: [
      "f1-student-visa-guide",
      "h1b-visa-specialty-occupations",
      "eb2-niw-engineers",
    ],
  },
  {
    slug: "eb3-skilled-workers-professionals",
    visaType: "eb3",
    titleEn: "EB-3 Green Card: Skilled Workers and Professionals",
    titleEs: "Green Card EB-3: Trabajadores Calificados y Profesionales",
    descriptionEn:
      "The EB-3 green card is the most accessible employer-sponsored path for workers who don't qualify for EB-1 or EB-2. Covers professionals with bachelor's degrees (EB-3A) and skilled workers with 2+ years of experience (EB-3B).",
    descriptionEs:
      "La green card EB-3 es la ruta más accesible patrocinada por empleador para trabajadores que no califican para EB-1 o EB-2. Cubre profesionales con título universitario (EB-3A) y trabajadores calificados con 2+ años de experiencia (EB-3B).",
    introEn:
      "The EB-3 green card (INA § 203(b)(3)) is the third employment-based preference category, designed for a broad range of workers who are not eligible for the more restrictive EB-1 or EB-2 categories. It has three subcategories: EB-3A (Professionals — bachelor's degree required), EB-3B (Skilled Workers — 2+ years of training or experience), and EB-3C (Other Workers — unskilled, with a very long backlog that makes it impractical for most applicants). All EB-3 subcategories require employer sponsorship and PERM labor certification from the Department of Labor — with one important exception: nurses and physical therapists qualify under Schedule A, which skips PERM entirely and allows direct I-140 filing.",
    introEs:
      "La green card EB-3 (INA § 203(b)(3)) es la tercera categoría de preferencia basada en empleo, diseñada para una amplia gama de trabajadores que no son elegibles para las categorías más restrictivas EB-1 o EB-2. Tiene tres subcategorías: EB-3A (Profesionales — título universitario requerido), EB-3B (Trabajadores Calificados — 2+ años de entrenamiento o experiencia), y EB-3C (Otros Trabajadores — no calificados, con una lista de espera muy larga que la hace poco práctica para la mayoría). Todas las subcategorías EB-3 requieren patrocinio de empleador y certificación laboral PERM del Departamento de Trabajo — con una excepción importante: enfermeros y fisioterapeutas califican bajo el Anexo A, que omite el PERM por completo y permite presentar el I-140 directamente.",
    eligibilityFactors: [
      {
        labelEn: "Permanent, full-time U.S. employer sponsor",
        labelEs: "Patrocinador empleador permanente y a tiempo completo en EE.UU.",
        descEn:
          "A U.S. employer must offer you a permanent, full-time position and be willing to sponsor the full EB-3 process: PERM labor certification, I-140 petition, and adjustment of status. The employer must also demonstrate financial ability to pay the offered wage.",
        descEs:
          "Un empleador de EE.UU. debe ofrecerte un puesto permanente y a tiempo completo y estar dispuesto a patrocinar el proceso completo EB-3: certificación laboral PERM, petición I-140 y ajuste de estatus. El empleador también debe demostrar capacidad financiera para pagar el salario ofrecido.",
      },
      {
        labelEn: "Bachelor's degree (EB-3A) or 2+ years of skilled experience (EB-3B)",
        labelEs: "Título universitario (EB-3A) o 2+ años de experiencia calificada (EB-3B)",
        descEn:
          "EB-3A requires a bachelor's degree in a field where the job normally requires one. Education and experience cannot substitute for the degree. EB-3B covers workers whose jobs require at least 2 years of training or experience — no degree required.",
        descEs:
          "EB-3A requiere un título universitario en un campo donde el trabajo normalmente lo requiere. La educación y la experiencia no pueden sustituir el título. EB-3B cubre trabajadores cuyos trabajos requieren al menos 2 años de entrenamiento o experiencia — sin necesidad de título universitario.",
      },
      {
        labelEn: "PERM labor certification (or Schedule A exemption)",
        labelEs: "Certificación laboral PERM (o exención del Anexo A)",
        descEn:
          "The employer must conduct good-faith recruitment to show no qualified U.S. workers are available, then file a PERM application with DOL. Current processing times are approximately 500 days (2025–2026). Nurses and physical therapists skip this step entirely under Schedule A.",
        descEs:
          "El empleador debe realizar reclutamiento de buena fe para demostrar que no hay trabajadores calificados de EE.UU. disponibles, luego presentar una solicitud PERM ante el DOL. Los tiempos de procesamiento actuales son de aproximadamente 500 días (2025-2026). Enfermeros y fisioterapeutas omiten este paso bajo el Anexo A.",
      },
      {
        labelEn: "Priority date availability (country-specific backlog)",
        labelEs: "Disponibilidad de fecha de prioridad (lista de espera por país)",
        descEn:
          "Once PERM is approved and I-140 filed, your priority date determines when you can apply for a visa number. For most nationalities (including Latin America and Europe), EB-3 dates are typically current. India and China face significant backlogs due to per-country annual visa limits.",
        descEs:
          "Una vez aprobado el PERM y presentado el I-140, tu fecha de prioridad determina cuándo puedes solicitar un número de visa. Para la mayoría de las nacionalidades (incluidas Latinoamérica y Europa), las fechas EB-3 suelen estar corrientes. India y China enfrentan listas de espera significativas por los límites anuales de visas por país.",
      },
    ],
    commonMistakes: [
      {
        en: "Assuming EB-3 works like EB-2 NIW — EB-3 cannot be self-petitioned. There is no National Interest Waiver for EB-3. An employer must sponsor every EB-3 petition.",
        es: "Asumir que EB-3 funciona como EB-2 NIW — el EB-3 no puede autopeticionarse. No existe Exención por Interés Nacional para EB-3. Un empleador debe patrocinar cada petición EB-3.",
      },
      {
        en: "Underestimating the PERM timeline — DOL analyst review currently takes approximately 500 days, and audits can add another 12–18 months. The full EB-3 process (PERM + I-140 + visa + AOS) can take 3–5+ years even for nationalities with no backlog.",
        es: "Subestimar el tiempo del PERM — la revisión del analista del DOL actualmente toma aproximadamente 500 días, y las auditorías pueden agregar otros 12-18 meses. El proceso completo EB-3 (PERM + I-140 + visa + AOS) puede tomar 3-5+ años incluso para nacionalidades sin lista de espera.",
      },
      {
        en: "Choosing EB-3C (Other Workers / unskilled) without understanding the extreme backlog — wait times can exceed 10 years for some nationalities. If your job requires less than 2 years of training, explore other visa options first.",
        es: "Elegir EB-3C (Otros Trabajadores / no calificados) sin entender la lista de espera extrema — los tiempos de espera pueden superar los 10 años para algunas nacionalidades. Si tu trabajo requiere menos de 2 años de entrenamiento, explora otras opciones de visa primero.",
      },
      {
        en: "Not telling nurses or physical therapists about Schedule A — this special category skips PERM entirely, potentially saving 14–18 months in processing time. If you are a nurse or PT, always ask your attorney about Schedule A.",
        es: "No informar a enfermeros o fisioterapeutas sobre el Anexo A — esta categoría especial omite el PERM por completo, ahorrando potencialmente 14-18 meses en tiempo de procesamiento. Si eres enfermero/a o fisioterapeuta, siempre pregúntale a tu abogado sobre el Anexo A.",
      },
    ],
    faqs: [
      {
        questionEn: "Can I self-petition for EB-3 without an employer?",
        questionEs: "¿Puedo autopeticionarme para EB-3 sin un empleador?",
        answerEn:
          "No. EB-3 requires an employer to sponsor the petition and file both the PERM labor certification and the I-140 petition. Unlike EB-2 NIW (which allows self-petition) or EB-1A (extraordinary ability), there is no self-petition route in EB-3. If you need a self-petition option, explore EB-2 NIW or EB-1A.",
        answerEs:
          "No. EB-3 requiere que un empleador patrocine la petición y presente tanto la certificación laboral PERM como la petición I-140. A diferencia de EB-2 NIW (que permite autopetición) o EB-1A (habilidad extraordinaria), no existe ruta de autopetición en EB-3. Si necesitas una opción de autopetición, explora EB-2 NIW o EB-1A.",
      },
      {
        questionEn: "How long does the PERM process take?",
        questionEs: "¿Cuánto tiempo tarda el proceso PERM?",
        answerEn:
          "DOL analyst review currently takes approximately 500 days (over 16 months) as of 2025–2026. If your case is audited, add another 12–18 months. This is before the I-140, visa availability wait, and adjustment of status. The full end-to-end EB-3 process (excluding backlog waits) typically takes 3–5 years. Schedule A occupations (nurses, PTs) skip PERM and can reduce the timeline significantly.",
        answerEs:
          "La revisión del analista del DOL actualmente toma aproximadamente 500 días (más de 16 meses) a partir de 2025-2026. Si tu caso es auditado, agrega otros 12-18 meses. Esto es antes del I-140, la espera de disponibilidad de visa y el ajuste de estatus. El proceso completo EB-3 de principio a fin (excluyendo esperas por lista de espera) típicamente toma 3-5 años. Las ocupaciones del Anexo A (enfermeros, fisioterapeutas) omiten el PERM y pueden reducir significativamente el tiempo.",
      },
      {
        questionEn: "What is the difference between EB-3A and EB-3B?",
        questionEs: "¿Cuál es la diferencia entre EB-3A y EB-3B?",
        answerEn:
          "EB-3A (Professionals) requires a bachelor's degree in a field where the job normally requires one. The job offer must be for a position that requires a bachelor's. EB-3B (Skilled Workers) covers jobs that require at least 2 years of training or experience — no degree required. EB-3B is particularly useful for tradespeople, chefs, technicians, and other skilled workers who have documented experience but may not hold a bachelor's degree.",
        answerEs:
          "EB-3A (Profesionales) requiere un título universitario en un campo donde el trabajo normalmente lo requiere. La oferta de trabajo debe ser para un puesto que requiera licenciatura. EB-3B (Trabajadores Calificados) cubre trabajos que requieren al menos 2 años de entrenamiento o experiencia — sin necesidad de título universitario. EB-3B es particularmente útil para trabajadores de oficios, chefs, técnicos y otros trabajadores calificados que tienen experiencia documentada pero pueden no tener un título universitario.",
      },
      {
        questionEn: "Are nurses faster in EB-3? What is Schedule A?",
        questionEs: "¿Son más rápidos los enfermeros en EB-3? ¿Qué es el Anexo A?",
        answerEn:
          "Yes — significantly faster. Nurses (RNs) and physical therapists qualify under Schedule A Group I (20 CFR § 656.5), which allows the employer to skip the PERM labor certification entirely and file the I-140 petition directly with USCIS. This eliminates 14–18+ months from the normal EB-3 timeline. To use Schedule A, nurses must have a CGFNS certificate (or equivalent), a state RN license, and meet English proficiency requirements.",
        answerEs:
          "Sí — significativamente más rápidos. Los enfermeros (RN) y fisioterapeutas califican bajo el Anexo A Grupo I (20 CFR § 656.5), que permite al empleador omitir completamente la certificación laboral PERM y presentar la petición I-140 directamente ante USCIS. Esto elimina 14-18+ meses del tiempo normal del EB-3. Para usar el Anexo A, los enfermeros deben tener un certificado CGFNS (o equivalente), una licencia RN estatal y cumplir los requisitos de competencia en inglés.",
      },
      {
        questionEn: "Can I change jobs after the I-140 is approved?",
        questionEs: "¿Puedo cambiar de trabajo después de que se aprueba el I-140?",
        answerEn:
          "Under the American Competitiveness in the Twenty-First Century Act (AC21), you can change employers after the I-140 is approved and your adjustment of status application has been pending for 180+ days — as long as the new job is in the same or similar occupational classification. This portability protection is a key feature of EB-3 that allows flexibility once the long PERM and I-140 phase is complete.",
        answerEs:
          "Bajo la Ley de Competitividad Americana en el Siglo XXI (AC21), puedes cambiar de empleador después de que se aprueba el I-140 y tu solicitud de ajuste de estatus ha estado pendiente por 180+ días — siempre que el nuevo trabajo sea de la misma clasificación ocupacional o similar. Esta protección de portabilidad es una característica clave del EB-3 que permite flexibilidad una vez que la larga fase de PERM e I-140 está completa.",
      },
    ],
    relatedSlugs: [
      "eb2-niw-engineers",
      "h1b-visa-specialty-occupations",
      "visas/eb2-perm-employer-sponsored",
    ],
  },
  {
    slug: "tn-visa-usmca-professionals",
    visaType: "tn",
    titleEn: "TN Visa: USMCA Professional Work Visa (Mexico & Canada)",
    titleEs: "Visa TN: Visa de Trabajo Profesional USMCA (México y Canadá)",
    descriptionEn:
      "The TN visa allows Mexican and Canadian professionals in 63 specific occupations to work in the U.S. No lottery, no cap, no PERM — one of the fastest work visa paths available.",
    descriptionEs:
      "La visa TN permite a profesionales mexicanos y canadienses en 63 ocupaciones específicas trabajar en EE.UU. Sin lotería, sin cupo, sin PERM — uno de los caminos más rápidos disponibles.",
    introEn:
      "The TN visa (Trade NAFTA / USMCA) is a nonimmigrant work status available exclusively to citizens of Mexico and Canada under the United States-Mexico-Canada Agreement (USMCA). It allows professionals in 63 specified occupations to work for a U.S. employer without a lottery, annual cap, or PERM labor certification — making it one of the most efficient work visa pathways available. Canadian citizens can apply directly at the U.S. port of entry; Mexican citizens must obtain a TN visa stamp at a U.S. consulate. The June 4, 2025 USCIS Policy Manual update narrowed interpretations for Engineer, Economist, Computer Systems Analyst, and Scientific Technician categories — making precise occupation mapping more critical than ever.",
    introEs:
      "La visa TN (Trade NAFTA / USMCA) es un estatus de trabajo no inmigrante disponible exclusivamente para ciudadanos de México y Canadá bajo el Acuerdo entre Estados Unidos, México y Canadá (USMCA). Permite a profesionales en 63 ocupaciones específicas trabajar para un empleador estadounidense sin lotería, cupo anual ni certificación laboral PERM — lo que la convierte en una de las rutas de visa de trabajo más eficientes disponibles. Los ciudadanos canadienses pueden aplicar directamente en el puerto de entrada de EE.UU.; los ciudadanos mexicanos deben obtener el sello de visa TN en un consulado americano. La actualización del Manual de Políticas de USCIS del 4 de junio de 2025 restringió las interpretaciones para las categorías de Ingeniero, Economista, Analista de Sistemas Computacionales y Técnico Científico — haciendo que la asignación precisa de ocupación sea más crítica que nunca.",
    eligibilityFactors: [
      {
        labelEn: "Mexican or Canadian citizenship (nationality gate)",
        labelEs: "Ciudadanía mexicana o canadiense (requisito de nacionalidad)",
        descEn:
          "TN is available ONLY to citizens of Mexico and Canada. Permanent residents or nationals of any other country do not qualify, regardless of where they live.",
        descEs:
          "El TN está disponible SOLO para ciudadanos de México y Canadá. Los residentes permanentes o nacionales de cualquier otro país no califican, independientemente de dónde vivan.",
      },
      {
        labelEn: "Qualifying profession from the 63-occupation USMCA list",
        labelEs: "Profesión calificada de la lista de 63 ocupaciones del USMCA",
        descEn:
          "Your actual job duties — not just your job title — must clearly match one of the 63 occupations in USMCA Appendix 2. Per June 2025 guidance, officers apply a four-part test for the Engineer category: degree match, OOH alignment, duties match, and title clarity.",
        descEs:
          "Tus funciones reales — no solo tu título de trabajo — deben corresponder claramente a una de las 63 ocupaciones del Apéndice 2 del USMCA. Según la guía de junio de 2025, los oficiales aplican una prueba de cuatro partes para la categoría de Ingeniero: coincidencia de título, alineación OOH, coincidencia de funciones y claridad del título.",
      },
      {
        labelEn: "Required educational credential (or qualifying experience)",
        labelEs: "Credencial educativa requerida (o experiencia calificada)",
        descEn:
          "Most TN professions require a specific bachelor's degree or professional license. Per the June 2025 policy update, experience substitution is no longer permitted for most categories. Exception: Management Consultant can qualify based on professional experience alone.",
        descEs:
          "La mayoría de las profesiones TN requieren un título universitario específico o licencia profesional. Según la actualización de política de junio de 2025, la sustitución por experiencia ya no está permitida para la mayoría de las categorías. Excepción: Management Consultant puede calificar solo con experiencia profesional.",
      },
      {
        labelEn: "Prearranged job offer from a U.S. employer",
        labelEs: "Oferta de trabajo prearreglada de un empleador estadounidense",
        descEn:
          "TN requires a confirmed job offer from a U.S. employer. Self-employment is NOT permitted. The offer letter must specify the job title (matching the TN profession), duties, salary, and anticipated duration. No USCIS petition is required for Canadians — the offer letter is presented directly at the port of entry.",
        descEs:
          "El TN requiere una oferta de trabajo confirmada de un empleador de EE.UU. El autoempleo NO está permitido. La carta de oferta debe especificar el título del puesto (coincidiendo con la profesión TN), las funciones, el salario y la duración anticipada. No se requiere petición ante USCIS para los canadienses — la carta de oferta se presenta directamente en el puerto de entrada.",
      },
    ],
    commonMistakes: [
      {
        en: "Assuming 'Software Engineer' automatically qualifies as an Engineer — per June 2025 USCIS guidance, you must have a bachelor's in an engineering discipline (not just CS) AND duties must involve true engineering work, not primarily software development.",
        es: "Asumir que 'Ingeniero de Software' califica automáticamente como Ingeniero — según la guía de USCIS de junio de 2025, debes tener una licenciatura en ingeniería (no solo CS) Y tus funciones deben involucrar verdadera ingeniería, no principalmente desarrollo de software.",
      },
      {
        en: "Submitting a vague offer letter that doesn't clearly describe duties matching the TN profession — this is the primary reason for the 42.63% Mexican consular denial rate in FY2024.",
        es: "Presentar una carta de oferta vaga que no describe claramente las funciones que corresponden a la profesión TN — esta es la razón principal de la tasa de rechazo consular mexicana del 42.63% en FY2024.",
      },
      {
        en: "Mapping a 'Financial Analyst' role to the TN Economist category — per June 2025 USCIS guidance, this is explicitly excluded. Only traditional economic analysis roles qualify.",
        es: "Asignar un rol de 'Analista Financiero' a la categoría TN de Economista — según la guía de USCIS de junio de 2025, esto está explícitamente excluido. Solo califican los roles tradicionales de análisis económico.",
      },
      {
        en: "Relying on experience substitution for categories like Engineer or Pharmacist — the June 2025 update eliminated this for most TN professions. You need the actual educational credential, not years of experience instead of it.",
        es: "Confiar en la sustitución por experiencia para categorías como Ingeniero o Farmacéutico — la actualización de junio de 2025 eliminó esto para la mayoría de las profesiones TN. Necesitas la credencial educativa real, no años de experiencia en su lugar.",
      },
    ],
    faqs: [
      {
        questionEn: "Can I self-petition for TN or work as a freelancer?",
        questionEs: "¿Puedo autopeticionarme para el TN o trabajar como freelancer?",
        answerEn:
          "No. TN requires a prearranged job offer from a U.S. employer, and self-employment is explicitly prohibited. You must be an employee of a U.S. company, not an independent contractor working for your own business. If you are self-employed or a freelancer, TN is not available — consider O-1A or EB-2 NIW.",
        answerEs:
          "No. El TN requiere una oferta de trabajo prearreglada de un empleador de EE.UU., y el autoempleo está explícitamente prohibido. Debes ser empleado de una empresa de EE.UU., no un contratista independiente que trabaja para su propio negocio. Si eres autoempleado o freelancer, el TN no está disponible — considera O-1A o EB-2 NIW.",
      },
      {
        questionEn: "My job title isn't exactly on the TN list — can I still qualify?",
        questionEs: "Mi título de trabajo no está exactamente en la lista TN — ¿puedo calificar de todas formas?",
        answerEn:
          "Yes — TN is evaluated based on job duties, not job title. If your actual duties match a listed TN profession (even under a different title), you may qualify. The offer letter must describe the duties in detail and explain how they align with the specific TN occupation. An immigration attorney can help map non-standard titles to the 63-occupation list.",
        answerEs:
          "Sí — el TN se evalúa en función de las funciones del trabajo, no del título. Si tus funciones reales coinciden con una profesión TN listada (incluso bajo un título diferente), puedes calificar. La carta de oferta debe describir las funciones en detalle y explicar cómo se alinean con la ocupación TN específica. Un abogado de inmigración puede ayudar a mapear títulos no estándar a la lista de 63 ocupaciones.",
      },
      {
        questionEn: "Can TN lead to a green card?",
        questionEs: "¿Puede el TN llevar a una green card?",
        answerEn:
          "TN is a nonimmigrant status and does not directly lead to a green card. However, dual intent is not explicitly prohibited — many TN holders simultaneously pursue EB-2 NIW, EB-3, or O-1A green card paths. You can be on TN while your employer files an I-140, and adjust status once a visa number is available. Consult an attorney to structure this correctly.",
        answerEs:
          "El TN es un estatus de no inmigrante y no lleva directamente a una green card. Sin embargo, la intención dual no está explícitamente prohibida — muchos titulares de TN persiguen simultáneamente rutas de green card como EB-2 NIW, EB-3 o O-1A. Puedes estar en TN mientras tu empleador presenta un I-140, y ajustar estatus una vez que haya un número de visa disponible. Consulta a un abogado para estructurar esto correctamente.",
      },
      {
        questionEn: "What changed for TN in 2025?",
        questionEs: "¿Qué cambió para el TN en 2025?",
        answerEn:
          "The June 4, 2025 USCIS Policy Manual update made several significant clarifications: (1) Engineer now requires a bachelor's in a specific engineering discipline — 'Software Engineer' without an engineering degree no longer automatically qualifies; (2) Computer Systems Analyst explicitly excludes primarily coding-focused roles; (3) Economist excludes financial analysts, market research analysts, and marketing specialists; (4) Experience substitution is no longer permitted for most categories, with Management Consultant as the main exception.",
        answerEs:
          "La actualización del Manual de Políticas de USCIS del 4 de junio de 2025 hizo varias aclaraciones significativas: (1) Ingeniero ahora requiere una licenciatura en una disciplina de ingeniería específica — 'Ingeniero de Software' sin título en ingeniería ya no califica automáticamente; (2) Analista de Sistemas Computacionales excluye explícitamente los roles principalmente de codificación; (3) Economista excluye a analistas financieros, analistas de investigación de mercado y especialistas en marketing; (4) La sustitución por experiencia ya no está permitida para la mayoría de las categorías, con Management Consultant como excepción principal.",
      },
      {
        questionEn: "What is the difference between TN and H-1B?",
        questionEs: "¿Cuál es la diferencia entre TN y H-1B?",
        answerEn:
          "TN advantages: no lottery, no annual cap, no PERM labor certification, fast processing (same-day for Canadians), renewable indefinitely. TN limitations: available only to Mexican and Canadian citizens, limited to 63 specific occupations, no direct path to green card, self-employment not permitted. H-1B advantages: available to any nationality, broader occupation coverage, more established employer-sponsored path. H-1B limitations: annual lottery (65,000 + 20,000 exemptions), 6-year maximum stay (unless green card is in progress).",
        answerEs:
          "Ventajas del TN: sin lotería, sin cupo anual, sin certificación laboral PERM, procesamiento rápido (mismo día para canadienses), renovable indefinidamente. Limitaciones del TN: disponible solo para ciudadanos mexicanos y canadienses, limitado a 63 ocupaciones específicas, sin ruta directa a la green card, autoempleo no permitido. Ventajas del H-1B: disponible para cualquier nacionalidad, cobertura de ocupaciones más amplia, ruta más establecida patrocinada por el empleador. Limitaciones del H-1B: lotería anual (65,000 + 20,000 exenciones), estancia máxima de 6 años (a menos que haya una green card en proceso).",
      },
    ],
    relatedSlugs: [
      "h1b-visa-specialty-occupations",
      "o1-visa-guide",
      "eb2-niw-engineers",
    ],
  },
  {
    slug: "eb1c-multinational-executive",
    visaType: "eb1c",
    titleEn: "EB-1C Green Card: Multinational Executives & Managers",
    titleEs: "Green Card EB-1C: Ejecutivos y Gerentes Multinacionales",
    descriptionEn: "The EB-1C is an employment-based first-preference green card for multinational executives and managers. No PERM labor certification. FY2025 approval rate: 97%.",
    descriptionEs: "La EB-1C es una green card de primera preferencia basada en empleo para ejecutivos y gerentes multinacionales. Sin certificación laboral PERM. Tasa de aprobación FY2025: 97%.",
    introEn: "The EB-1C green card (INA § 203(b)(1)(C)) is reserved for multinational executives and managers transferring to a U.S. parent, subsidiary, affiliate, or branch. It carries the highest approval rate of any EB-1 subcategory — 97.08% in FY2025 — and requires no PERM labor certification. For L-1A visa holders, EB-1C is the natural next step on the path to permanent residence.",
    introEs: "La green card EB-1C (INA § 203(b)(1)(C)) está reservada para ejecutivos y gerentes multinacionales que se transfieren a una matriz, subsidiaria, afiliada o sucursal en EE.UU. Tiene la tasa de aprobación más alta de cualquier subcategoría EB-1 — 97.08% en FY2025 — y no requiere certificación laboral PERM. Para los titulares de visa L-1A, la EB-1C es el siguiente paso natural hacia la residencia permanente.",
    eligibilityFactors: [
      {
        labelEn: "Qualifying corporate relationship",
        labelEs: "Relación corporativa calificada",
        descEn: "The U.S. employer must be a parent, subsidiary, affiliate, or branch of the foreign entity you worked for — with at least 50% common ownership or control. Both entities must be actively doing business.",
        descEs: "El empleador de EE.UU. debe ser una matriz, subsidiaria, afiliada o sucursal de la entidad extranjera para la que trabajaste — con al menos el 50% de propiedad o control en común. Ambas entidades deben estar activamente en operación.",
      },
      {
        labelEn: "One year of qualifying employment abroad",
        labelEs: "Un año de empleo calificado en el exterior",
        descEn: "You must have been employed abroad for at least 1 continuous year within the 3 years preceding the I-140 petition — in a managerial or executive capacity with the qualifying organization.",
        descEs: "Debes haber trabajado en el exterior durante al menos 1 año continuo dentro de los 3 años anteriores a la petición I-140 — en capacidad gerencial o ejecutiva con la organización calificada.",
      },
      {
        labelEn: "Genuine managerial or executive role in the U.S.",
        labelEs: "Rol gerencial o ejecutivo genuino en EE.UU.",
        descEn: "The U.S. position must be a bona fide executive or managerial role. USCIS scrutinizes whether management duties are primary — not split with operational or technical tasks.",
        descEs: "El puesto en EE.UU. debe ser un rol ejecutivo o gerencial de buena fe. USCIS examina si las funciones gerenciales son las principales — no divididas con tareas operativas o técnicas.",
      },
      {
        labelEn: "U.S. entity in business for at least 1 year",
        labelEs: "Entidad de EE.UU. en operación por al menos 1 año",
        descEn: "The U.S. employer must have been doing business for at least 1 year before the EB-1C petition can be filed. Newly established U.S. entities do not qualify until this requirement is met.",
        descEs: "El empleador de EE.UU. debe haber estado en operación durante al menos 1 año antes de que se pueda presentar la petición EB-1C. Las entidades de EE.UU. recién establecidas no califican hasta que se cumpla este requisito.",
      },
    ],
    commonMistakes: [
      {
        en: "Filing as a 'working manager' who spends most of their day on operational tasks — USCIS requires management to be the primary function, not a secondary one.",
        es: "Solicitar como 'gerente trabajador' que pasa la mayor parte del día en tareas operativas — USCIS requiere que la gestión sea la función principal, no secundaria.",
      },
      {
        en: "Not documenting the qualifying corporate relationship with credible, consistent corporate evidence — ownership records, financial statements, and org charts must align.",
        es: "No documentar la relación corporativa calificada con evidencia corporativa creíble y coherente — los registros de propiedad, estados financieros y organigramas deben alinearse.",
      },
      {
        en: "L-1A holders waiting too long to file EB-1C — after 3 years on L-1A in the U.S., the qualifying year abroad may fall outside the 3-year lookback window.",
        es: "Los titulares de L-1A esperando demasiado para presentar EB-1C — después de 3 años en L-1A en EE.UU., el año calificante en el exterior puede caer fuera del período de 3 años de retrospectiva.",
      },
      {
        en: "Submitting a generic job description — USCIS requires detailed evidence of decision-making authority, budget control, and organizational policy-setting.",
        es: "Enviar una descripción de trabajo genérica — USCIS requiere evidencia detallada de autoridad de toma de decisiones, control presupuestario y establecimiento de políticas organizacionales.",
      },
    ],
    faqs: [
      {
        questionEn: "What is the difference between EB-1C and L-1A?",
        questionEs: "¿Cuál es la diferencia entre EB-1C y L-1A?",
        answerEn: "L-1A is a temporary nonimmigrant visa (up to 7 years) for intracompany transferees. EB-1C is the permanent green card equivalent — it uses the same multinational manager/executive standard but grants permanent residence. Most L-1A holders use their status to build the record needed to file EB-1C.",
        answerEs: "L-1A es una visa de no inmigrante temporal (hasta 7 años) para transferencias intracorporativas. EB-1C es el equivalente permanente de green card — usa el mismo estándar de gerente/ejecutivo multinacional pero otorga residencia permanente. La mayoría de los titulares de L-1A usan su estatus para construir el historial necesario para presentar EB-1C.",
      },
      {
        questionEn: "Does EB-1C require a PERM labor certification?",
        questionEs: "¿Requiere la EB-1C una certificación laboral PERM?",
        answerEn: "No. EB-1C is exempt from the PERM labor market test — this is one of its greatest advantages. The employer files an I-140 petition directly with USCIS, without the lengthy PERM process that can take 12-24+ months.",
        answerEs: "No. La EB-1C está exenta de la prueba de mercado laboral PERM — esta es una de sus mayores ventajas. El empleador presenta una petición I-140 directamente ante USCIS, sin el largo proceso PERM que puede tardar 12-24+ meses.",
      },
      {
        questionEn: "How long does EB-1C take to get approved?",
        questionEs: "¿Cuánto tarda en aprobarse la EB-1C?",
        answerEn: "The I-140 takes 6-12 months in standard processing, or 15 business days with premium processing ($2,805). After I-140 approval, most nationalities have no backlog and can proceed immediately to adjustment of status or consular processing (another 6-18 months). India and China face shorter EB-1 backlogs than EB-2/EB-3 — typically 1-3 years vs. decades.",
        answerEs: "El I-140 tarda 6-12 meses en procesamiento estándar, o 15 días hábiles con premium processing ($2,805). Tras la aprobación del I-140, la mayoría de las nacionalidades no tienen retraso y pueden proceder inmediatamente al ajuste de estatus o procesamiento consular (otros 6-18 meses). India y China enfrentan retrasos EB-1 más cortos que EB-2/EB-3 — típicamente 1-3 años vs. décadas.",
      },
      {
        questionEn: "Can a startup founder use EB-1C?",
        questionEs: "¿Puede un fundador de startup usar EB-1C?",
        answerEn: "Yes, if they have a qualifying corporate structure — meaning both the foreign company and the U.S. entity must be actively operating, with at least 50% common ownership. The founder must also have been employed abroad in a qualifying capacity for 1 year within the past 3 years. Many founders build this structure intentionally to access the L-1A and EB-1C pathway.",
        answerEs: "Sí, si tienen una estructura corporativa calificada — lo que significa que tanto la empresa extranjera como la entidad de EE.UU. deben estar activamente operando, con al menos el 50% de propiedad en común. El fundador también debe haber estado empleado en el exterior en una capacidad calificada durante 1 año dentro de los últimos 3 años. Muchos fundadores construyen esta estructura intencionalmente para acceder a la ruta L-1A y EB-1C.",
      },
    ],
    relatedSlugs: ["l1-intracompany-transfer", "eb1a-extraordinary-ability", "e2-treaty-investor"],
  },
];

export const VISA_PAGE_MANIFEST = VISA_PAGES;
export const VALID_VISA_SLUGS = new Set(VISA_PAGES.map((p) => p.slug));

export function getVisaPageData(slug: string): VisaPageContent | undefined {
  return VISA_PAGES.find((p) => p.slug === slug);
}

export function getVisaPageDataByLocale(slug: string, locale: string) {
  const page = getVisaPageData(slug);
  if (!page) return null;

  const isEs = locale === "es";
  return {
    slug: page.slug,
    visaType: page.visaType,
    title: isEs ? page.titleEs : page.titleEn,
    description: isEs ? page.descriptionEs : page.descriptionEn,
    intro: isEs ? page.introEs : page.introEn,
    eligibilityFactors: page.eligibilityFactors.map((f) => ({
      label: isEs ? f.labelEs : f.labelEn,
      description: isEs ? f.descEs : f.descEn,
    })),
    commonMistakes: page.commonMistakes.map((m) => (isEs ? m.es : m.en)),
    faqs: page.faqs.map((f) => ({
      question: isEs ? f.questionEs : f.questionEn,
      answer: isEs ? f.answerEs : f.answerEn,
    })),
    relatedSlugs: page.relatedSlugs,
  };
}
