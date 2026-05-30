import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { VISA_PAGE_MANIFEST, VALID_VISA_SLUGS, getVisaPageDataByLocale } from "@/lib/seo/generateVisaPageData";
import { SEOPageTemplate } from "@/components/seo/SEOPageTemplate";
import { buildFAQSchema, buildArticleSchema } from "@/lib/seo/structuredData";
import { locales } from "@/i18n/config";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of locales) {
    for (const page of VISA_PAGE_MANIFEST) {
      params.push({ locale, slug: page.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const content = getVisaPageDataByLocale(slug, locale);
  if (!content) return {};

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://passly.ai";
  const canonical = `${appUrl}/${locale}/visas/${slug}`;
  const alternate = locale === "en" ? "es" : "en";
  const altContent = getVisaPageDataByLocale(slug, alternate);

  return {
    title: content.title,
    description: content.description,
    alternates: {
      canonical,
      languages: {
        [locale === "en" ? "en-US" : "es-419"]: canonical,
        [alternate === "en" ? "en-US" : "es-419"]: `${appUrl}/${alternate}/visas/${slug}`,
      },
    },
    openGraph: {
      title: content.title,
      description: content.description,
      url: canonical,
      siteName: "Passly AI",
      images: [
        {
          url: `${appUrl}/api/og?title=${encodeURIComponent(content.title)}&visa=${encodeURIComponent(content.visaType)}`,
          width: 1200,
          height: 630,
          alt: content.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: content.title,
      description: content.description,
    },
  };

  void altContent;
}

export default async function VisaPage({ params }: Props) {
  const { locale, slug } = await params;

  if (!VALID_VISA_SLUGS.has(slug)) {
    notFound();
  }

  const content = getVisaPageDataByLocale(slug, locale)!;
  const t = await getTranslations({ locale, namespace: "seo" });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://passly.ai";
  const faqSchema = buildFAQSchema(content.faqs);
  const articleSchema = buildArticleSchema({
    title: content.title,
    description: content.description,
    url: `${appUrl}/${locale}/visas/${slug}`,
    locale,
  });

  const relatedSlugLabels = content.relatedSlugs.map((s) => ({
    slug: `visas/${s}`,
    label: s
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()),
  }));

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
        title={content.title}
        visaType={content.visaType}
        intro={content.intro}
        eligibilityFactors={content.eligibilityFactors}
        commonMistakes={content.commonMistakes}
        faqs={content.faqs}
        relatedSlugs={relatedSlugLabels}
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
