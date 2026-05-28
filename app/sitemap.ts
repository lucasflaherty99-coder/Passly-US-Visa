import { MetadataRoute } from "next";
import { SLUG_MANIFEST } from "@/lib/seo/slugManifest";
import { VISA_PAGE_MANIFEST } from "@/lib/seo/generateVisaPageData";
import { locales } from "@/i18n/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://passly.ai";
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    // Home
    entries.push({ url: `${appUrl}/${locale}`, lastModified: now, changeFrequency: "weekly", priority: 1.0 });

    // Questionnaire flows
    entries.push({ url: `${appUrl}/${locale}/quiz`, lastModified: now, changeFrequency: "monthly", priority: 0.9 });
    entries.push({ url: `${appUrl}/${locale}/check`, lastModified: now, changeFrequency: "monthly", priority: 0.9 });

    // Old [visa-slug] SEO pages
    for (const entry of SLUG_MANIFEST) {
      entries.push({ url: `${appUrl}/${locale}/${entry.slug}`, lastModified: now, changeFrequency: "monthly", priority: 0.7 });
    }

    // New /visas/[slug] pages
    for (const page of VISA_PAGE_MANIFEST) {
      entries.push({ url: `${appUrl}/${locale}/visas/${page.slug}`, lastModified: now, changeFrequency: "monthly", priority: 0.8 });
    }
  }

  return entries;
}
