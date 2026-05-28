"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { QuestionCard } from "../QuestionCard";
import { OptionButton } from "../OptionButton";
import { CTAButton } from "@/components/ui/CTAButton";
import { useQuiz } from "@/app/[locale]/quiz/QuizContext";
import { getNextStep, getPrevStep, getTotalSteps, STEP } from "@/lib/quiz/quizState";
import type { DesiredTimeline, LongTermGoal } from "@/lib/types";

export function GoalsStep() {
  const t = useTranslations("quiz.goals");
  const tQuiz = useTranslations("quiz");
  const { state, setAnswer, dispatch } = useQuiz();
  const router = useRouter();
  const locale = useLocale();

  function handleNext() {
    const nextStep = getNextStep(STEP.GOALS, state.answers);
    if (nextStep !== null) {
      dispatch({ type: "NEXT_STEP", nextStep });
      router.push(`/${locale}/quiz/${nextStep}`);
    }
  }

  function handleBack() {
    const prevStep = getPrevStep(STEP.GOALS, state.answers);
    if (prevStep !== null) {
      dispatch({ type: "PREV_STEP", prevStep });
      router.push(`/${locale}/quiz/${prevStep}`);
    }
  }

  const canAdvance = !!state.answers.desiredTimeline && !!state.answers.longTermGoal;

  return (
    <QuestionCard
      step={STEP.GOALS}
      totalSteps={getTotalSteps(state.answers)}
      question={t("question")}
      subtitle={t("subtitle")}
      onBack={handleBack}
      navDirection={state.navDirection}
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-text mb-3">{t("timeline")}</label>
          <div className="space-y-2">
            {([
              { value: "asap", label: t("asap"), emoji: "⚡" },
              { value: "6months", label: t("months6"), emoji: "📅" },
              { value: "1year", label: t("year1"), emoji: "🗓️" },
              { value: "2plus", label: t("years2"), emoji: "🔭" },
              { value: "exploring", label: t("exploring"), emoji: "🤔" },
            ] as { value: DesiredTimeline; label: string; emoji: string }[]).map((opt) => (
              <OptionButton
                key={opt.value}
                value={opt.value}
                label={opt.label}
                emoji={opt.emoji}
                selected={state.answers.desiredTimeline === opt.value}
                onClick={(v) => setAnswer("desiredTimeline", v as DesiredTimeline)}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-3">{t("longTermGoal")}</label>
          <div className="space-y-2">
            {([
              { value: "temporary_visit", label: t("temporary"), emoji: "🏖️" },
              { value: "multi_year_stay", label: t("multiYear"), emoji: "🏠" },
              { value: "permanent_residency", label: t("permanent"), emoji: "🌿" },
              { value: "citizenship_path", label: t("citizenship"), emoji: "🗽" },
            ] as { value: LongTermGoal; label: string; emoji: string }[]).map((opt) => (
              <OptionButton
                key={opt.value}
                value={opt.value}
                label={opt.label}
                emoji={opt.emoji}
                selected={state.answers.longTermGoal === opt.value}
                onClick={(v) => setAnswer("longTermGoal", v as LongTermGoal)}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-2">
            {t("preferredState")}
          </label>
          <input
            type="text"
            className="w-full rounded-xl border-2 border-border bg-white px-4 py-3 text-text focus:border-primary focus:outline-none transition-colors"
            placeholder={t("statePlaceholder")}
            value={state.answers.preferredState || ""}
            onChange={(e) => setAnswer("preferredState", e.target.value)}
          />
        </div>

        {canAdvance && (
          <CTAButton onClick={handleNext} size="lg" fullWidth>
            {tQuiz("next")}
          </CTAButton>
        )}
      </div>
    </QuestionCard>
  );
}
