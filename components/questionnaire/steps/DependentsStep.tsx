"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { QuestionCard } from "../QuestionCard";
import { OptionButton } from "../OptionButton";
import { CTAButton } from "@/components/ui/CTAButton";
import { useCheck } from "@/app/[locale]/check/CheckContext";
import { getCheckPrevStep, CHECK_STEP } from "@/lib/check/checkState";

export function DependentsStep({ onComplete }: { onComplete: () => void }) {
  const t = useTranslations("quiz.dependents");
  const tQuiz = useTranslations("quiz");
  const { state, setAnswer, dispatch } = useCheck();
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
    if (!has) setAnswer("dependentAges", []);
  }

  function updateAge(index: number, value: string) {
    const newAges = [...ageInputs];
    newAges[index] = value;
    setAgeInputs(newAges);
    const parsed = newAges.map(Number).filter((n) => !isNaN(n) && n > 0);
    setAnswer("dependentAges", parsed);
  }

  function handleBack() {
    const prevStep = getCheckPrevStep(CHECK_STEP.DEPENDENTS, state.answers);
    if (prevStep !== null) {
      dispatch({ type: "PREV_STEP", prevStep });
      router.push(`/${locale}/check/${prevStep}`);
    }
  }

  return (
    <QuestionCard
      step={CHECK_STEP.DEPENDENTS}
      question={t("question")}
      subtitle={t("subtitle")}
      note={t("ageNote")}
      onBack={handleBack}
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
                onClick={() => setAgeInputs([...ageInputs, ""])}
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
