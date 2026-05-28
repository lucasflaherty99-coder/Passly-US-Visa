"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import Link from "next/link";
import { motion } from "framer-motion";
import { ResultCard } from "@/components/results/ResultCard";
import { PasslyLogo } from "@/components/ui/PasslyLogo";
import { DisclaimerBanner } from "@/components/ui/DisclaimerBanner";
import { CTAButton } from "@/components/ui/CTAButton";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import type { AnalysisResponse } from "@/lib/types";

export default function CheckResultsPage() {
  const t = useTranslations("check.results");
  const tLeads = useTranslations("check.leads");
  const tNav = useTranslations("nav");
  const locale = useLocale();
  const [results, setResults] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const showCrossPathwayNotice = (results?.allResults ?? []).some(
    (r) => r.visaType === "eb1a" && r.totalScore >= 65
  ) && (results?.allResults ?? []).some(
    (r) => r.visaType === "EB-2-NIW" && r.totalScore >= 65
  );

  // Lead form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadLoading, setLeadLoading] = useState(false);
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("passly_check_results");
    if (stored) {
      try {
        setResults(JSON.parse(stored));
      } catch { /* ignore */ }
    }
    setLoading(false);
  }, []);

  async function handleLeadSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setLeadLoading(true);
    try {
      const sessionId = localStorage.getItem("passly_check_session");
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, whatsapp, locale, sessionId }),
      });
      setLeadSubmitted(true);
      if (name) setDisplayName(name.split(" ")[0]);
    } catch { /* ignore */ } finally {
      setLeadLoading(false);
    }
  }

  if (loading) return <LoadingSpinner fullScreen />;

  if (!results || results.topResults.length === 0) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-lg text-text mb-6">{t("noResults")}</p>
          <CTAButton href={`/${locale}/check`}>{t("retake")}</CTAButton>
        </div>
      </div>
    );
  }

  const headerTitle = displayName
    ? t("titlePersonalized", { name: displayName })
    : t("title");

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <div className="bg-navy text-white py-10 px-4">
        <div className="max-w-2xl mx-auto">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm transition-colors mb-6"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>{tNav("home")}</span>
          </Link>
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-center mb-5">
                <PasslyLogo variant="passport" size={64} showWordmark={false} dark />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{headerTitle}</h1>
              <p className="text-white/70 text-sm">{t("subtitle")}</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="max-w-2xl mx-auto px-4 pt-6">
        <DisclaimerBanner variant="inline" />
      </div>

      {/* Result cards */}
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
        {results.topResults.map((visa, i) => (
          <ResultCard
            key={visa.visaType}
            visa={visa}
            rank={(i + 1) as 1 | 2 | 3}
            defaultExpanded={i === 0}
            index={i}
          />
        ))}

        {/* Cross-pathway notice: EB-1A + EB-2 NIW dual strategy */}
        {showCrossPathwayNotice && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl bg-indigo-50 border border-indigo-200 p-5"
          >
            <div className="flex gap-3">
              <span className="text-2xl shrink-0">⚡</span>
              <div>
                <p className="text-sm font-semibold text-indigo-900 mb-1">{t("crossPathwayTitle")}</p>
                <p className="text-sm text-indigo-800 leading-relaxed">{t("crossPathwayNotice")}</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Lead capture */}
      <div className="max-w-2xl mx-auto px-4 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl bg-white border border-border shadow-card p-6"
        >
          {leadSubmitted ? (
            <div className="text-center py-4">
              <div className="text-3xl mb-3">✅</div>
              <p className="font-semibold text-navy">{tLeads("success")}</p>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-navy mb-1">{tLeads("title")}</h2>
              <p className="text-sm text-muted mb-5">{tLeads("subtitle")}</p>
              <form onSubmit={handleLeadSubmit} className="space-y-3" autoComplete="off">
                <input
                  type="text"
                  autoComplete="name"
                  className="w-full rounded-xl border-2 border-border bg-white px-4 py-3 text-text focus:border-primary focus:outline-none transition-colors text-sm"
                  placeholder={tLeads("namePlaceholder")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  className="w-full rounded-xl border-2 border-border bg-white px-4 py-3 text-text focus:border-primary focus:outline-none transition-colors text-sm"
                  placeholder={tLeads("emailPlaceholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="tel"
                  autoComplete="tel"
                  className="w-full rounded-xl border-2 border-border bg-white px-4 py-3 text-text focus:border-primary focus:outline-none transition-colors text-sm"
                  placeholder={tLeads("whatsappPlaceholder")}
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                />
                <CTAButton
                  type="submit"
                  loading={leadLoading}
                  disabled={!email}
                  fullWidth
                  size="lg"
                >
                  {leadLoading ? tLeads("submitting") : tLeads("submit")}
                </CTAButton>
                <p className="text-xs text-center text-muted">{tLeads("privacy")}</p>
              </form>
            </>
          )}
        </motion.div>
      </div>

      {/* Retake */}
      <div className="max-w-2xl mx-auto px-4 pb-12 text-center">
        <Link href={`/${locale}/check`} className="text-sm text-muted hover:text-primary transition-colors">
          {t("retake")} →
        </Link>
      </div>
    </div>
  );
}
