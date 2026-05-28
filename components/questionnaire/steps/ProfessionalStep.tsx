"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { QuestionCard } from "../QuestionCard";
import { OptionButton } from "../OptionButton";
import { CTAButton } from "@/components/ui/CTAButton";
import { useCheck } from "@/app/[locale]/check/CheckContext";
import { getCheckNextStep, getCheckPrevStep, CHECK_STEP } from "@/lib/check/checkState";
import type { EmploymentType, IncomeRange } from "@/lib/types";

const EXP_OPTIONS = [
  { value: 0, label: "lessThan1" },
  { value: 2, label: "years13" },
  { value: 4, label: "years36" },
  { value: 8, label: "years610" },
  { value: 12, label: "years10plus" },
];

const EMP_OPTIONS: { value: EmploymentType; emoji: string; labelKey: string }[] = [
  { value: "employee", emoji: "🏢", labelKey: "employee" },
  { value: "freelance", emoji: "💻", labelKey: "freelance" },
  { value: "founder", emoji: "🚀", labelKey: "founder" },
  { value: "unemployed", emoji: "🔍", labelKey: "unemployed" },
];

const INCOME_OPTIONS: { value: IncomeRange; labelKey: string }[] = [
  { value: "<30k", labelKey: "income1" },
  { value: "30k-60k", labelKey: "income2" },
  { value: "60k-100k", labelKey: "income3" },
  { value: "100k-200k", labelKey: "income4" },
  { value: "200k+", labelKey: "income5" },
];

export function ProfessionalStep() {
  const t = useTranslations("quiz.professional");
  const tQuiz = useTranslations("quiz");
  const { state, setAnswer, dispatch } = useCheck();
  const router = useRouter();
  const locale = useLocale();

  function handleNext() {
    const nextStep = getCheckNextStep(CHECK_STEP.PROFESSIONAL, state.answers);
    if (nextStep !== null) {
      dispatch({ type: "NEXT_STEP", nextStep });
      router.push(`/${locale}/check/${nextStep}`);
    }
  }

  function handleBack() {
    const prevStep = getCheckPrevStep(CHECK_STEP.PROFESSIONAL, state.answers);
    if (prevStep !== null) {
      dispatch({ type: "PREV_STEP", prevStep });
      router.push(`/${locale}/check/${prevStep}`);
    }
  }

  const canAdvance = !!state.answers.profession && state.answers.yearsExperience !== undefined &&
    !!state.answers.employmentType && !!state.answers.incomeRange;

  return (
    <QuestionCard
      step={CHECK_STEP.PROFESSIONAL}
      question={t("question")}
      subtitle={t("subtitle")}
      onBack={handleBack}
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-text mb-2">{t("profession")}</label>
          <input
            type="text"
            className="w-full rounded-xl border-2 border-border bg-white px-4 py-3 text-text focus:border-primary focus:outline-none transition-colors"
            placeholder={t("professionPlaceholder")}
            value={state.answers.profession || ""}
            onChange={(e) => setAnswer("profession", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-3">{t("yearsExp")}</label>
          <div className="space-y-2">
            {EXP_OPTIONS.map((opt) => (
              <OptionButton
                key={opt.value}
                value={String(opt.value)}
                label={t(opt.label)}
                selected={state.answers.yearsExperience === opt.value}
                onClick={() => setAnswer("yearsExperience", opt.value)}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-3">{t("employmentType")}</label>
          <div className="space-y-2">
            {EMP_OPTIONS.map((opt) => (
              <OptionButton
                key={opt.value}
                value={opt.value}
                label={t(opt.labelKey)}
                emoji={opt.emoji}
                selected={state.answers.employmentType === opt.value}
                onClick={(v) => {
                  setAnswer("employmentType", v as EmploymentType);
                  setAnswer("isFounder", v === "founder");
                }}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-3">{t("management")}</label>
          <div className="space-y-2">
            <OptionButton
              value="yes"
              label={t("managementYes")}
              emoji="👥"
              selected={state.answers.hasManagementExperience === true}
              onClick={() => setAnswer("hasManagementExperience", true)}
            />
            <OptionButton
              value="no"
              label={t("managementNo")}
              selected={state.answers.hasManagementExperience === false}
              onClick={() => setAnswer("hasManagementExperience", false)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-1">{t("income")}</label>
          <p className="text-xs text-muted mb-3">{t("incomeSub")}</p>
          <div className="space-y-2">
            {INCOME_OPTIONS.map((opt) => (
              <OptionButton
                key={opt.value}
                value={opt.value}
                label={t(opt.labelKey)}
                selected={state.answers.incomeRange === opt.value}
                onClick={(v) => setAnswer("incomeRange", v as IncomeRange)}
              />
            ))}
          </div>
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
