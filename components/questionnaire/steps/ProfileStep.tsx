"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { QuestionCard } from "../QuestionCard";
import { OptionButton } from "../OptionButton";
import { CTAButton } from "@/components/ui/CTAButton";
import { useCheck } from "@/app/[locale]/check/CheckContext";
import { getCheckNextStep, getCheckPrevStep, CHECK_STEP } from "@/lib/check/checkState";
import { COUNTRIES } from "@/lib/quiz/countries";
import type { AgeRange } from "@/lib/types";

const AGE_OPTIONS: { value: AgeRange; labelKey: string }[] = [
  { value: "18-24", labelKey: "age1824" },
  { value: "25-34", labelKey: "age2534" },
  { value: "35-44", labelKey: "age3544" },
  { value: "45-54", labelKey: "age4554" },
  { value: "55+", labelKey: "age55" },
];

export function ProfileStep() {
  const t = useTranslations("quiz.basicProfile");
  const tQuiz = useTranslations("quiz");
  const { state, setAnswer, dispatch } = useCheck();
  const router = useRouter();
  const locale = useLocale();

  const canAdvance = !!state.answers.nationality && !!state.answers.countryOfResidence && !!state.answers.ageRange;

  function handleNext() {
    const nextStep = getCheckNextStep(CHECK_STEP.PROFILE, state.answers);
    if (nextStep !== null) {
      dispatch({ type: "NEXT_STEP", nextStep });
      router.push(`/${locale}/check/${nextStep}`);
    }
  }

  function handleBack() {
    const prevStep = getCheckPrevStep(CHECK_STEP.PROFILE, state.answers);
    if (prevStep !== null) {
      dispatch({ type: "PREV_STEP", prevStep });
      router.push(`/${locale}/check/${prevStep}`);
    }
  }

  return (
    <QuestionCard
      step={CHECK_STEP.PROFILE}
      question={t("question")}
      onBack={handleBack}
    >
      <div className="space-y-6">
        {/* Nationality */}
        <div>
          <label className="block text-sm font-medium text-text mb-2">{t("nationality")}</label>
          <select
            className="w-full rounded-xl border-2 border-border bg-white px-4 py-3 text-text focus:border-primary focus:outline-none transition-colors"
            value={state.answers.nationality || ""}
            onChange={(e) => setAnswer("nationality", e.target.value)}
          >
            <option value="">{t("nationalityPlaceholder")}</option>
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Residence */}
        {state.answers.nationality && (
          <div>
            <label className="block text-sm font-medium text-text mb-2">{t("residence")}</label>
            <select
              className="w-full rounded-xl border-2 border-border bg-white px-4 py-3 text-text focus:border-primary focus:outline-none transition-colors"
              value={state.answers.countryOfResidence || ""}
              onChange={(e) => setAnswer("countryOfResidence", e.target.value)}
            >
              <option value="">{t("residencePlaceholder")}</option>
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Age range */}
        {state.answers.countryOfResidence && (
          <div>
            <label className="block text-sm font-medium text-text mb-3">{t("ageRange")}</label>
            <div className="space-y-2">
              {AGE_OPTIONS.map((opt) => (
                <OptionButton
                  key={opt.value}
                  value={opt.value}
                  label={t(opt.labelKey)}
                  selected={state.answers.ageRange === opt.value}
                  onClick={(v) => setAnswer("ageRange", v as AgeRange)}
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
