"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { QuestionCard } from "../QuestionCard";
import { OptionButton } from "../OptionButton";
import { CTAButton } from "@/components/ui/CTAButton";
import { useQuiz } from "@/app/[locale]/quiz/QuizContext";
import { getTotalSteps, getPrevStep, STEP } from "@/lib/quiz/quizState";

export function DependentsStep({ onComplete }: { onComplete: () => void }) {
  const t = useTranslations("quiz.dependents");
  const tQuiz = useTranslations("quiz");
  const { state, setAnswer, dispatch } = useQuiz();
  const router = useRouter();
  const locale = useLocale();

  const [ageInputs, setAgeInputs] = useState<string[]>(
    state.answers.dependentAges?.map(String) || [""]
  );

  const hasAgeOutRisk = ageInputs.some((a) => {
    const n = parseInt(a);
    return n >= 19 && n <= 21;
  });

  function handleHasDependents(v: string) {
    const has = v === "yes";
    setAnswer("hasDependents", has);
    if (!has) {
      setAnswer("dependentAges", []);
    }
  }

  function updateAge(index: number, value: string) {
    const newAges = [...ageInputs];
    newAges[index] = value;
    setAgeInputs(newAges);
    const parsed = newAges.map(Number).filter((n) => !isNaN(n) && n > 0);
    setAnswer("dependentAges", parsed);
  }

  function addAge() {
    setAgeInputs([...ageInputs, ""]);
  }

  function handleBack() {
    const prevStep = getPrevStep(STEP.DEPENDENTS, state.answers);
    if (prevStep !== null) {
      dispatch({ type: "PREV_STEP", prevStep });
      router.push(`/${locale}/quiz/${prevStep}`);
    }
  }

  return (
    <QuestionCard
      step={STEP.DEPENDENTS}
      totalSteps={getTotalSteps(state.answers)}
      question={t("question")}
      subtitle={t("subtitle")}
      onBack={handleBack}
      navDirection={state.navDirection}
      note={t("ageNote")}
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-text mb-3">{t("hasDependents")}</label>
          <div className="grid grid-cols-2 gap-2">
            <OptionButton value="yes" label={t("yes")} emoji="👨‍👩‍👧"
              selected={state.answers.hasDependents === true} onClick={handleHasDependents} />
            <OptionButton value="no" label={t("no")}
              selected={state.answers.hasDependents === false} onClick={handleHasDependents} />
          </div>
        </div>

        {state.answers.hasDependents && (
          <div>
            <label className="block text-sm font-medium text-text mb-3">{t("ages")}</label>
            <div className="space-y-2">
              {ageInputs.map((age, i) => (
                <input
                  key={i}
                  type="number"
                  min={0}
                  max={100}
                  className="w-full rounded-xl border-2 border-border bg-white px-4 py-3 text-text focus:border-primary focus:outline-none transition-colors"
                  placeholder={`Child ${i + 1} age`}
                  value={age}
                  onChange={(e) => updateAge(i, e.target.value)}
                />
              ))}
              <button
                type="button"
                onClick={addAge}
                className="text-sm text-primary hover:underline mt-1"
              >
                + Add another dependent
              </button>
            </div>

            {hasAgeOutRisk && (
              <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 p-4">
                <p className="text-sm text-amber-800">{t("ageOutWarning")}</p>
              </div>
            )}
          </div>
        )}

        {state.answers.hasDependents !== undefined && (
          <CTAButton onClick={onComplete} size="lg" fullWidth>
            {tQuiz("submit")}
          </CTAButton>
        )}
      </div>
    </QuestionCard>
  );
}
