"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { ResultCard } from "@/components/results/ResultCard";
import { DisclaimerBanner } from "@/components/ui/DisclaimerBanner";
import { CTAButton } from "@/components/ui/CTAButton";
import type { VisaResult } from "@/lib/types";

type AssessmentData = {
  topResults: VisaResult[];
  locale: string;
  generatedAt: string;
};

export default function SharedResultsPage() {
  const { locale, assessmentId } = useParams<{ locale: string; assessmentId: string }>();
  const t = useTranslations("results");
  const [data, setData] = useState<AssessmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!assessmentId) return;
    fetch(`/api/assessments/${assessmentId}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json() as Promise<AssessmentData>;
      })
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [assessmentId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted text-sm">{t("loading" as never) ?? "Loading results..."}</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center space-y-4 max-w-sm px-4">
          <p className="text-navy font-semibold text-lg">{t("noResults")}</p>
          <CTAButton href={`/${locale}/quiz`} size="md">
            {t("retake")}
          </CTAButton>
        </div>
      </div>
    );
  }

  const top3 = data.topResults.slice(0, 3);

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <div className="gradient-hero py-14 px-4 text-center">
        <h1 className="text-2xl md:text-4xl font-bold text-navy mb-3">{t("title")}</h1>
        <p className="text-muted max-w-xl mx-auto text-sm md:text-base">{t("subtitle")}</p>
        <div className="mt-6 flex justify-center">
          <DisclaimerBanner variant="inline" />
        </div>
      </div>

      {/* Results */}
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
        {top3.map((visa, i) => (
          <ResultCard
            key={visa.visaType}
            visa={visa}
            rank={(i + 1) as 1 | 2 | 3}
            defaultExpanded={i === 0}
          />
        ))}

        <div className="pt-6 text-center space-y-4">
          <p className="text-sm text-muted">
            Want your own personalized analysis?
          </p>
          <CTAButton href={`/${locale}/quiz`} size="lg">
            Check My Eligibility →
          </CTAButton>
        </div>
      </div>
    </div>
  );
}
