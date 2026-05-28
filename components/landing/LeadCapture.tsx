"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { CTAButton } from "@/components/ui/CTAButton";

export function LeadCapture() {
  const t = useTranslations("landing.leadCapture");
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(t("invalidEmail"));
      return;
    }
    setLoading(true);
    setError("");
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale, attorneyInterest: false }),
      });
      setSubmitted(true);
    } catch {
      setError(t("submitError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-20 px-4 bg-card">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">{t("title")}</h2>
          <p className="text-muted mb-10">{t("subtitle")}</p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl bg-white border border-border p-8"
            >
              <div className="text-4xl mb-4">✅</div>
              <p className="font-semibold text-navy text-lg">{t("successTitle")}</p>
              <p className="text-muted text-sm mt-2">{t("successSub")}</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("placeholder")}
                className="flex-1 rounded-xl border border-border bg-white px-4 py-3 text-sm text-text placeholder:text-muted focus:outline-none focus:border-primary transition-colors"
              />
              <CTAButton type="submit" disabled={loading}>
                {loading ? "..." : t("cta")}
              </CTAButton>
            </form>
          )}

          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

          {!submitted && (
            <p className="mt-4 text-xs text-muted">{t("privacy")}</p>
          )}

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <CTAButton href={`/${locale}/quiz`} variant="primary" size="lg">
              {t("quizCta")} →
            </CTAButton>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
