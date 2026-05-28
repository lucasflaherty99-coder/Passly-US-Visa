"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { CTAButton } from "@/components/ui/CTAButton";
import { PasslyLogo } from "@/components/ui/PasslyLogo";
import { motion } from "framer-motion";

export function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 bg-bg/90 backdrop-blur-sm border-b border-border"
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link href={`/${locale}`} className="flex items-center">
          <PasslyLogo variant="passport" size={30} />
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link href="#how-it-works" className="text-sm text-muted hover:text-text transition-colors">
            {t("howItWorks")}
          </Link>
          <Link href="#visas" className="text-sm text-muted hover:text-text transition-colors">
            {t("visaTypes")}
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <LanguageToggle />
          <CTAButton href={`/${locale}/quiz`} size="sm">
            {t("startQuiz")}
          </CTAButton>
        </div>
      </div>
    </motion.nav>
  );
}
