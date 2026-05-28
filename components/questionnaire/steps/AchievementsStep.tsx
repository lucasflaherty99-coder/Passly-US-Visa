"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { QuestionCard } from "../QuestionCard";
import { OptionButton } from "../OptionButton";
import { CTAButton } from "@/components/ui/CTAButton";
import { useCheck } from "@/app/[locale]/check/CheckContext";
import { getCheckNextStep, getCheckPrevStep, CHECK_STEP } from "@/lib/check/checkState";
import type { PublicationsCount } from "@/lib/types";

export function AchievementsStep() {
  const t = useTranslations("quiz.recognition");
  const tQuiz = useTranslations("quiz");
  const { state, setAnswer, dispatch } = useCheck();
  const router = useRouter();
  const locale = useLocale();

  function handleNext() {
    const nextStep = getCheckNextStep(CHECK_STEP.ACHIEVEMENTS, state.answers);
    if (nextStep !== null) {
      dispatch({ type: "NEXT_STEP", nextStep });
      router.push(`/${locale}/check/${nextStep}`);
    }
  }

  function handleBack() {
    const prevStep = getCheckPrevStep(CHECK_STEP.ACHIEVEMENTS, state.answers);
    if (prevStep !== null) {
      dispatch({ type: "PREV_STEP", prevStep });
      router.push(`/${locale}/check/${prevStep}`);
    }
  }

  const canAdvance = state.answers.hasPublications !== undefined &&
    state.answers.hasSpeakingEngagements !== undefined &&
    state.answers.hasAwards !== undefined &&
    state.answers.patents !== undefined &&
    state.answers.recognitionBeyondEmployer !== undefined;

  return (
    <QuestionCard
      step={CHECK_STEP.ACHIEVEMENTS}
      question={t("question")}
      subtitle={t("subtitle")}
      onBack={handleBack}
    >
      <div className="space-y-6">
        <YesNoQuestion
          question={t("publications")}
          value={state.answers.hasPublications}
          onChange={(v) => setAnswer("hasPublications", v === "yes")}
          t={t}
        />

        {state.answers.hasPublications && (
          <div>
            <label className="block text-sm font-medium text-text mb-3">{t("publicationsCount")}</label>
            <div className="space-y-2">
              {(["1-3", "4-10", "10+"] as PublicationsCount[]).map((v) => (
                <OptionButton
                  key={v}
                  value={v}
                  label={t(v === "1-3" ? "pub1" : v === "4-10" ? "pub2" : "pub3")}
                  selected={state.answers.publicationsCount === v}
                  onClick={(val) => setAnswer("publicationsCount", val as PublicationsCount)}
                />
              ))}
            </div>
          </div>
        )}

        <YesNoQuestion
          question={t("speaking")}
          value={state.answers.hasSpeakingEngagements}
          onChange={(v) => setAnswer("hasSpeakingEngagements", v === "yes")}
          t={t}
        />
        <YesNoQuestion
          question={t("awards")}
          value={state.answers.hasAwards}
          onChange={(v) => setAnswer("hasAwards", v === "yes")}
          t={t}
        />
        <YesNoQuestion
          question={t("media")}
          value={state.answers.hasMediaCoverage}
          onChange={(v) => setAnswer("hasMediaCoverage", v === "yes")}
          t={t}
        />
        <YesNoQuestion
          question={t("certifications")}
          value={state.answers.hasCertifications}
          onChange={(v) => setAnswer("hasCertifications", v === "yes")}
          t={t}
        />
        <YesNoQuestion
          question={t("judging")}
          value={state.answers.hasJudgingExperience}
          onChange={(v) => setAnswer("hasJudgingExperience", v === "yes")}
          t={t}
        />
        <YesNoQuestion
          question={t("portfolio")}
          value={state.answers.hasPortfolio}
          onChange={(v) => setAnswer("hasPortfolio", v === "yes")}
          t={t}
        />
        <YesNoQuestion
          question={t("patents")}
          value={state.answers.patents}
          onChange={(v) => setAnswer("patents", v === "yes")}
          t={t}
        />
        <YesNoQuestion
          question={t("recognitionBeyondEmployer")}
          value={state.answers.recognitionBeyondEmployer}
          onChange={(v) => setAnswer("recognitionBeyondEmployer", v === "yes")}
          t={t}
        />

        {canAdvance && (
          <CTAButton onClick={handleNext} size="lg" fullWidth>
            {tQuiz("next")}
          </CTAButton>
        )}
      </div>
    </QuestionCard>
  );
}

function YesNoQuestion({
  question, value, onChange, t,
}: {
  question: string;
  value: boolean | undefined;
  onChange: (v: string) => void;
  t: (k: string) => string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-text mb-3">{question}</label>
      <div className="grid grid-cols-2 gap-2">
        <OptionButton value="yes" label={t("yes")} selected={value === true} onClick={onChange} />
        <OptionButton value="no" label={t("no")} selected={value === false} onClick={onChange} />
      </div>
    </div>
  );
}
