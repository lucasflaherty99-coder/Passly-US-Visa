import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales } from "@/i18n/config";
import type { Metadata } from "next";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";

  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_APP_URL ?? "https://passly.ai"
    ),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        es: "/es",
        "x-default": "/en",
      },
    },
    title: {
      template: `%s | Passly AI`,
      default: isEn
        ? "Passly AI — Find Your U.S. Visa Path"
        : "Passly AI — Encuentra tu camino hacia una visa de EE.UU.",
    },
    description: isEn
      ? "Discover which U.S. visas you may qualify for based on your profile. Free, fast, and educational."
      : "Descubre qué visas de EE.UU. podrías calificar según tu perfil. Gratis, rápido y educativo.",
    openGraph: {
      siteName: "Passly AI",
      locale: locale === "es" ? "es_ES" : "en_US",
      alternateLocale: locale === "es" ? "en_US" : "es_ES",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(locales, locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
