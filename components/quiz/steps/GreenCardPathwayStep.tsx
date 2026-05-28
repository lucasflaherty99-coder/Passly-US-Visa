"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { QuestionCard } from "../QuestionCard";
import { OptionButton } from "../OptionButton";
import { CTAButton } from "@/components/ui/CTAButton";
import { useQuiz } from "@/app/[locale]/quiz/QuizContext";
import { getNextStep, getPrevStep, getTotalSteps, STEP } from "@/lib/quiz/quizState";
import type { GreenCardPathway } from "@/lib/types";

const OPTIONS: { value: GreenCardPathway; emoji: string; labelKey: string; descKey: string }[] = [
  { value: "extraordinary_ability", emoji: "⭐", labelKey: "extraordinary", descKey: "extraordinaryDesc" },
  { value: "employer_sponsorship", emoji: "🏢", labelKey: "employer", descKey: "employerDesc" },
  { value: "investment", emoji: "💰", labelKey: "investment", descKey: "investmentDesc" },
  { value: "family", emoji: "👨‍👩‍👧", labelKey: "family", descKey: "familyDesc" },
  { value: "not_sure", emoji: "🤔", labelKey: "notSure", descKey: "notSureDesc" },
];

export function GreenCardPathwayStep() {
  const t = useTranslations("quiz.greenCardPathway");
  const tQuiz = useTranslations("quiz");
  const { state, setAnswer, dispatch } = useQuiz();
  const router = useRouter();
  const locale = useLocale();

  function handleSelect(value: string) {
    setAnswer("greenCardPathway", value as GreenCardPathway);
  }

  function handleNext() {
    const nextStep = getNextStep(STEP.GREEN_CARD_PATHWAY, state.answers);
    if (nextStep !== null) {
      dispatch({ type: "NEXT_STEP", nextStep });
      router.push(`/${locale}/quiz/${nextStep}`);
    }
  }

  function handleBack() {
    const prevStep = getPrevStep(STEP.GREEN_CARD_PATHWAY, state.answers);
    if (prevStep !== null) {
      dispatch({ type: "PREV_STEP", prevStep });
      router.push(`/${locale}/quiz/${prevStep}`);
    }
  }

  return (
    <QuestionCard
      step={STEP.GREEN_CARD_PATHWAY}
      totalSteps={getTotalSteps(state.answers)}
      question={t("question")}
      subtitle={t("subtitle")}
      onBack={handleBack}
      navDirection={state.navDirection}
    >
      <div className="space-y-3">
        {OPTIONS.map((opt) => (
          <OptionButton
            key={opt.value}
            value={opt.value}
            label={t(opt.labelKey)}
            description={t(opt.descKey)}
            emoji={opt.emoji}
            selected={state.answers.greenCardPathway === opt.value}
            onClick={handleSelect}
          />
        ))}
      </div>
      {state.answers.greenCardPathway && (
        <div className="mt-6">
          <CTAButton onClick={handleNext} size="lg" fullWidth>
            {tQuiz("next")}
          </CTAButton>
        </div>
      )}
    </QuestionCard>
  );
}
