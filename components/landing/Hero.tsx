"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { CTAButton } from "@/components/ui/CTAButton";
import { DisclaimerBanner } from "@/components/ui/DisclaimerBanner";

export function Hero() {
  const t = useTranslations("landing.hero");
  const locale = useLocale();

  return (
    <section className="relative gradient-hero overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-navy/5 blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 py-20 md:py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 mb-8">
            <span className="text-xs font-semibold text-primary uppercase tracking-wide">
              {t("badge")}
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-bold text-navy leading-tight tracking-tight mb-6">
            {t("headline")}
          </h1>

          {/* Sub-headline */}
          <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
            {t("subheadline")}
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <CTAButton href={`/${locale}/quiz`} size="lg">
              {t("cta")} →
            </CTAButton>
          </div>
          <p className="mt-4 text-xs text-muted">{t("ctaSub")}</p>

          {/* Disclaimer */}
          <div className="mt-8 flex justify-center">
            <DisclaimerBanner variant="inline" />
          </div>
        </motion.div>

      </div>
    </section>
  );
}
