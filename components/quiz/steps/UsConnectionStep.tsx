"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { QuestionCard } from "../QuestionCard";
import { OptionButton } from "../OptionButton";
import { CTAButton } from "@/components/ui/CTAButton";
import { useQuiz } from "@/app/[locale]/quiz/QuizContext";
import { getNextStep, getPrevStep, getTotalSteps, STEP } from "@/lib/quiz/quizState";
import type { InvestmentCapital } from "@/lib/types";

export function UsConnectionStep() {
  const t = useTranslations("quiz.usConnection");
  const tQuiz = useTranslations("quiz");
  const { state, setAnswer, dispatch } = useQuiz();
  const router = useRouter();
  const locale = useLocale();
  const [hasInvestmentCapital, setHasInvestmentCapital] = useState<boolean | undefined>(
    state.answers.investmentCapitalAvailable !== undefined ? true : undefined
  );

  function handleNext() {
    const nextStep = getNextStep(STEP.US_CONNECTION, state.answers);
    if (nextStep !== null) {
      dispatch({ type: "NEXT_STEP", nextStep });
      router.push(`/${locale}/quiz/${nextStep}`);
    }
  }

  function handleBack() {
    const prevStep = getPrevStep(STEP.US_CONNECTION, state.answers);
    if (prevStep !== null) {
      dispatch({ type: "PREV_STEP", prevStep });
      router.push(`/${locale}/quiz/${prevStep}`);
    }
  }

  const canAdvance = state.answers.hasOverstay !== undefined && state.answers.hasDenial !== undefined &&
    state.answers.hasUsSponsor !== undefined;

  return (
    <QuestionCard
      step={STEP.US_CONNECTION}
      totalSteps={getTotalSteps(state.answers)}
      question={t("question")}
      subtitle={t("subtitle")}
      onBack={handleBack}
      navDirection={state.navDirection}
    >
      <div className="space-y-6">
        {/* Prior visits */}
        <div>
          <label className="block text-sm font-medium text-text mb-3">{t("priorVisits")}</label>
          <div className="space-y-2">
            {[
              { value: 0, label: t("never") },
              { value: 1, label: t("once") },
              { value: 3, label: t("several") },
              { value: 10, label: t("frequently") },
            ].map((opt) => (
              <OptionButton
                key={opt.value}
                value={String(opt.value)}
                label={opt.label}
                selected={state.answers.priorUsVisits === opt.value}
                onClick={() => setAnswer("priorUsVisits", opt.value)}
              />
            ))}
          </div>
        </div>

        {/* Overstay */}
        <YesNoQ
          question={t("overstay")}
          value={state.answers.hasOverstay}
          onChange={(v) => setAnswer("hasOverstay", v === "yes")}
          yes={t("yes")}
          no={t("no")}
        />

        {/* Denial */}
        <YesNoQ
          question={t("denial")}
          value={state.answers.hasDenial}
          onChange={(v) => setAnswer("hasDenial", v === "yes")}
          yes={t("yes")}
          no={t("no")}
        />

        {/* US Sponsor */}
        <YesNoQ
          question={t("sponsor")}
          value={state.answers.hasUsSponsor}
          onChange={(v) => setAnswer("hasUsSponsor", v === "yes")}
          yes={t("yes")}
          no={t("no")}
        />

        {/* US Business Partner */}
        <YesNoQ
          question={t("businessPartner")}
          value={state.answers.hasUsBusinessPartner}
          onChange={(v) => setAnswer("hasUsBusinessPartner", v === "yes")}
          yes={t("yes")}
          no={t("no")}
        />

        {/* Family in US */}
        <div>
          <YesNoQ
            question={t("familyInUs")}
            value={state.answers.hasFamilyInUs}
            onChange={(v) => setAnswer("hasFamilyInUs", v === "yes")}
            yes={t("yes")}
            no={t("no")}
          />
          <p className="mt-2 text-xs text-muted">{t("familyNote")}</p>
        </div>

        {/* Investment capital */}
        <YesNoQ
          question={t("investment")}
          value={hasInvestmentCapital}
          onChange={(v) => {
            const isYes = v === "yes";
            setHasInvestmentCapital(isYes);
            if (!isYes) setAnswer("investmentCapitalAvailable", undefined);
          }}
          yes={t("yes")}
          no={t("no")}
        />

        {hasInvestmentCapital === true && (
          <div>
            <label className="block text-sm font-medium text-text mb-3">{t("investmentAmount")}</label>
            <div className="space-y-2">
              {(["<50k", "50k-100k", "100k-500k", "500k+"] as InvestmentCapital[]).map((v, i) => (
                <OptionButton
                  key={v}
                  value={v}
                  label={t(["inv1", "inv2", "inv3", "inv4"][i])}
                  selected={state.answers.investmentCapitalAvailable === v}
                  onClick={(val) => setAnswer("investmentCapitalAvailable", val as InvestmentCapital)}
                />
              ))}
            </div>
          </div>
        )}

        {canAdvance && (
          <CTAButton onClick={handleNext} size="lg" fullWidth>
            {tQuiz("next")}
          </CTAButton>
        )}
      </div>
    </QuestionCard>
  );
}

function YesNoQ({
  question, value, onChange, yes, no,
}: {
  question: string;
  value: boolean | undefined;
  onChange: (v: string) => void;
  yes: string;
  no: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-text mb-3">{question}</label>
      <div className="grid grid-cols-2 gap-2">
        <OptionButton value="yes" label={yes} selected={value === true} onClick={onChange} />
        <OptionButton value="no" label={no} selected={value === false} onClick={onChange} />
      </div>
    </div>
  );
}
