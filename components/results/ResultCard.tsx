"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import type { VisaResult } from "@/lib/types";
import { VisaScoreBadge } from "./VisaScoreBadge";
import { DisclaimerBanner } from "@/components/ui/DisclaimerBanner";

const VISA_LABELS: Record<string, { name: string; emoji: string; tagline: string }> = {
  "O-1": { name: "O-1 Visa", emoji: "⭐", tagline: "Extraordinary Ability" },
  "H-1B": { name: "H-1B Visa", emoji: "💼", tagline: "Specialty Occupation" },
  "EB-2-NIW": { name: "EB-2 NIW", emoji: "🌟", tagline: "National Interest Waiver" },
  "F-1": { name: "F-1 Visa", emoji: "🎓", tagline: "Student Visa" },
  "L-1": { name: "L-1 Visa", emoji: "🏢", tagline: "Intracompany Transfer" },
  "E-2": { name: "E-2 Visa", emoji: "💰", tagline: "Treaty Investor" },
  "B1/B2": { name: "B-1/B-2 Visa", emoji: "✈️", tagline: "Visitor Visa" },
  "eb1a": { name: "EB-1A Green Card", emoji: "🏆", tagline: "Extraordinary Ability — No Employer Sponsor" },
  "eb2perm": { name: "EB-2 PERM", emoji: "🤝", tagline: "Employer-Sponsored Green Card" },
  "eb1c": { name: "EB-1C Green Card", emoji: "🏛️", tagline: "Multinational Executive or Manager" },
  "tn": { name: "TN Visa", emoji: "🍁", tagline: "USMCA Professional — Mexico & Canada Only" },
  "eb3": { name: "EB-3 Green Card", emoji: "⚙️", tagline: "Employer-Sponsored — Skilled Workers & Professionals" },
  "j1": { name: "J-1 Visa", emoji: "🌍", tagline: "Exchange Visitor — Research, Teaching & Training" },
};

const RANK_LABELS: Record<number, string> = {
  1: "results.topMatch",
  2: "results.secondMatch",
  3: "results.thirdMatch",
};

interface ResultCardProps {
  visa: VisaResult;
  rank: 1 | 2 | 3;
  defaultExpanded?: boolean;
  index?: number;
}

export function ResultCard({ visa, rank, defaultExpanded = false, index = 0 }: ResultCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const t = useTranslations("results");
  const visaLabel = VISA_LABELS[visa.visaType] || { name: visa.visaType, emoji: "📋", tagline: "" };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={[
        "rounded-2xl border overflow-hidden",
        rank === 1 ? "border-primary shadow-elevated" : "border-border shadow-card",
        "bg-white",
      ].join(" ")}
    >
      {/* Rank badge */}
      {rank === 1 && (
        <div className="bg-primary px-4 py-2 flex items-center gap-2">
          <span className="text-white text-sm font-semibold">✨ {t("topMatch")}</span>
        </div>
      )}

      {/* Card header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-6"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-4">
          <div className="text-3xl">{visaLabel.emoji}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xl font-bold text-navy">{visaLabel.name}</h3>
              {visa.lotteryRisk && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                  ⚠️ Lottery
                </span>
              )}
              {visa.l1AEligible && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                  L-1A eligible
                </span>
              )}
            </div>
            <p className="text-sm text-muted mt-0.5">{visaLabel.tagline}</p>
            {visa.processingTimeMonths && (
              <p className="text-xs text-muted mt-1">
                ⏱ {t("analysisMonths", { min: visa.processingTimeMonths[0], max: visa.processingTimeMonths[1] })} ·
                💵 ${visa.estimatedCostUsd[0].toLocaleString()}–${visa.estimatedCostUsd[1].toLocaleString()} USD
              </p>
            )}
          </div>
          <div className="shrink-0 flex flex-col items-center gap-2">
            <VisaScoreBadge
              score={visa.totalScore}
              confidence={visa.confidence}
              size="md"
              animated={rank === 1}
            />
          </div>
          <div className="shrink-0 text-muted ml-2">
            <motion.svg
              animate={{ rotate: expanded ? 180 : 0 }}
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </motion.svg>
          </div>
        </div>
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 space-y-5 border-t border-border pt-5">
              {/* Risk warnings */}
              {visa.lotteryRisk && (
                <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
                  <p className="text-sm text-amber-800">{t("lotteryWarning")}</p>
                </div>
              )}
              {visa.ageOutWarning && (
                <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
                  <p className="text-sm text-amber-800">{t("ageOutWarning")}</p>
                </div>
              )}

              {/* Contextual notice — informational, not a warning */}
              {visa.contextualNotice && (
                <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 flex gap-2">
                  <span className="shrink-0 text-blue-500 mt-0.5">ℹ️</span>
                  <p className="text-sm text-blue-800 leading-relaxed">{visa.contextualNotice}</p>
                </div>
              )}

              {/* Strengths */}
              {visa.strengths.length > 0 && (
                <Section title={t("strengths")} icon="💪" color="emerald">
                  <ul className="space-y-1.5">
                    {visa.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-text">
                        <span className="text-success mt-0.5 shrink-0">✓</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {/* Weaknesses */}
              {visa.weaknesses.length > 0 && (
                <Section title={t("weaknesses")} icon="🔧" color="amber">
                  <ul className="space-y-1.5">
                    {visa.weaknesses.map((w, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-text">
                        <span className="text-warning mt-0.5 shrink-0">→</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {/* Risk factors */}
              {visa.riskFactors.length > 0 && (
                <Section title={t("riskFactors")} icon="⚠️" color="red">
                  <ul className="space-y-1.5">
                    {visa.riskFactors.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-text">
                        <span className="text-danger mt-0.5 shrink-0">!</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {/* Next steps */}
              {visa.nextSteps.length > 0 && (
                <Section title={t("nextSteps")} icon="🚀" color="blue">
                  <ol className="space-y-1.5">
                    {visa.nextSteps.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-text">
                        <span className="text-primary font-semibold mt-0.5 shrink-0">{i + 1}.</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ol>
                </Section>
              )}

              {/* Evidence */}
              {visa.recommendedEvidence.length > 0 && (
                <Section title={t("evidence")} icon="📋" color="purple">
                  <ul className="space-y-1.5">
                    {visa.recommendedEvidence.map((e, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-text">
                        <span className="text-purple-400 mt-0.5 shrink-0">·</span>
                        <span>{e}</span>
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {/* Disclaimer */}
              <DisclaimerBanner variant="inline" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Section({
  title,
  icon,
  color,
  children,
}: {
  title: string;
  icon: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="flex items-center gap-2 text-sm font-semibold text-text mb-3">
        <span>{icon}</span>
        <span>{title}</span>
      </h4>
      {children}
    </div>
  );
}
