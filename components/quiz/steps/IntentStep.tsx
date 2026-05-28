"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { QuestionCard } from "../QuestionCard";
import { OptionButton } from "../OptionButton";
import { useQuiz } from "@/app/[locale]/quiz/QuizContext";
import { getNextStep, getTotalSteps, STEP } from "@/lib/quiz/quizState";
import type { ImmigrationIntent } from "@/lib/types";

const OPTIONS: { value: ImmigrationIntent; emoji: string; labelKey: string; descKey: string }[] = [
  { value: "tourism", emoji: "✈️", labelKey: "tourism", descKey: "tourismDesc" },
  { value: "study", emoji: "🎓", labelKey: "study", descKey: "studyDesc" },
  { value: "work_specialty", emoji: "💼", labelKey: "work", descKey: "workDesc" },
  { value: "business_investment", emoji: "🚀", labelKey: "business", descKey: "businessDesc" },
  { value: "green_card", emoji: "🌟", labelKey: "greenCard", descKey: "greenCardDesc" },
  { value: "not_sure", emoji: "🤔", labelKey: "notSure", descKey: "notSureDesc" },
];

export function IntentStep() {
  const t = useTranslations("quiz.intent");
  const { state, setAnswer, dispatch } = useQuiz();
  const router = useRouter();
  const locale = useLocale();

  function handleSelect(value: string) {
    const intent = value as ImmigrationIntent;
    setAnswer("intent", intent);

    const nextStep = getNextStep(STEP.INTENT, { ...state.answers, intent });
    if (nextStep !== null) {
      dispatch({ type: "NEXT_STEP", nextStep });
      router.push(`/${locale}/quiz/${nextStep}`);
    }
  }

  return (
    <QuestionCard
      step={STEP.INTENT}
      totalSteps={getTotalSteps(state.answers)}
      question={t("question")}
      subtitle={t("subtitle")}
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
            selected={state.answers.intent === opt.value}
            onClick={handleSelect}
          />
        ))}
      </div>
    </QuestionCard>
  );
}
