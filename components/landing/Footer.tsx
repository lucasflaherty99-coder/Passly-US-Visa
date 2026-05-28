"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { LanguageToggle } from "@/components/ui/LanguageToggle";

export function Footer() {
  const t = useTranslations("landing.footer");
  const locale = useLocale();

  return (
    <footer className="bg-navy text-white/70 py-14 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🛂</span>
              <span className="font-bold text-white text-lg">Passly AI</span>
            </div>
            <p className="text-sm leading-relaxed">{t("tagline")}</p>
          </div>

          <div>
            <p className="font-semibold text-white text-sm mb-4">{t("visasTitle")}</p>
            <ul className="space-y-2 text-sm">
              {[
                { label: "O-1 Visa", slug: "o1-visa-guide" },
                { label: "H-1B Visa", slug: "h1b-visa-specialty-occupations" },
                { label: "EB-2 NIW", slug: "eb2-niw-engineers" },
                { label: "F-1 Student", slug: "f1-student-visa-guide" },
                { label: "L-1 Visa", slug: "l1-visa-founders" },
                { label: "E-2 Investor", slug: "e2-investor-visa-guide" },
              ].map((v) => (
                <li key={v.slug}>
                  <Link href={`/${locale}/${v.slug}`} className="hover:text-white transition-colors">
                    {v.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-semibold text-white text-sm mb-4">{t("linksTitle")}</p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={`/${locale}/quiz`} className="hover:text-white transition-colors">
                  {t("linkQuiz")}
                </Link>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  {t("linkHowItWorks")}
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  {t("linkFaq")}
                </a>
              </li>
            </ul>
            <div className="mt-6">
              <LanguageToggle />
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-xs text-white/40 leading-relaxed">
          <p>{t("disclaimer")}</p>
          <p className="mt-3">© {new Date().getFullYear()} Passly AI. {t("rights")}</p>
        </div>
      </div>
    </footer>
  );
}
