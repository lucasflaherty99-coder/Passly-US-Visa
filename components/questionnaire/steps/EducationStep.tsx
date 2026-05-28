"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { QuestionCard } from "../QuestionCard";
import { OptionButton } from "../OptionButton";
import { CTAButton } from "@/components/ui/CTAButton";
import { useCheck } from "@/app/[locale]/check/CheckContext";
import { getCheckNextStep, getCheckPrevStep, CHECK_STEP } from "@/lib/check/checkState";
import type { EducationLevel, DocumentsReady } from "@/lib/types";

const EDU_OPTIONS: { value: EducationLevel; emoji: string; labelKey: string }[] = [
  { value: "none", emoji: "📝", labelKey: "none" },
  { value: "high_school", emoji: "🏫", labelKey: "highSchool" },
  { value: "bachelors", emoji: "🎓", labelKey: "bachelors" },
  { value: "masters", emoji: "📚", labelKey: "masters" },
  { value: "phd", emoji: "🔬", labelKey: "phd" },
  { value: "other", emoji: "📜", labelKey: "other" },
];

const DOC_OPTIONS: { value: DocumentsReady; labelKey: string }[] = [
  { value: "diploma", labelKey: "diploma" },
  { value: "transcripts", labelKey: "transcripts" },
  { value: "none", labelKey: "noDocs" },
];

export function EducationStep() {
  const t = useTranslations("quiz.education");
  const tQuiz = useTranslations("quiz");
  const { state, setAnswer, dispatch } = useCheck();
  const router = useRouter();
  const locale = useLocale();

  function handleDocToggle(value: string) {
    const doc = value as DocumentsReady;
    const current = state.answers.documentsReady || [];
    if (doc === "none") {
      setAnswer("documentsReady", ["none"]);
      return;
    }
    const withoutNone = current.filter((d) => d !== "none");
    if (withoutNone.includes(doc)) {
      setAnswer("documentsReady", withoutNone.filter((d) => d !== doc));
    } else {
      setAnswer("documentsReady", [...withoutNone, doc]);
    }
  }

  function handleNext() {
    const nextStep = getCheckNextStep(CHECK_STEP.EDUCATION, state.answers);
    if (nextStep !== null) {
      dispatch({ type: "NEXT_STEP", nextStep });
      router.push(`/${locale}/check/${nextStep}`);
    }
  }

  function handleBack() {
    const prevStep = getCheckPrevStep(CHECK_STEP.EDUCATION, state.answers);
    if (prevStep !== null) {
      dispatch({ type: "PREV_STEP", prevStep });
      router.push(`/${locale}/check/${prevStep}`);
    }
  }

  const canAdvance = !!state.answers.educationLevel && (state.answers.documentsReady?.length ?? 0) > 0;

  return (
    <QuestionCard
      step={CHECK_STEP.EDUCATION}
      question={t("question")}
      subtitle={t("subtitle")}
      onBack={handleBack}
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-text mb-3">{t("level")}</label>
          <div className="space-y-2">
            {EDU_OPTIONS.map((opt) => (
              <OptionButton
                key={opt.value}
                value={opt.value}
                label={t(opt.labelKey)}
                emoji={opt.emoji}
                selected={state.answers.educationLevel === opt.value}
                onClick={(v) => setAnswer("educationLevel", v as EducationLevel)}
              />
            ))}
          </div>
        </div>

        {state.answers.educationLevel && !["none", "high_school"].includes(state.answers.educationLevel) && (
          <div>
            <label className="block text-sm font-medium text-text mb-2">{t("field")}</label>
            <input
              type="text"
              className="w-full rounded-xl border-2 border-border bg-white px-4 py-3 text-text focus:border-primary focus:outline-none transition-colors"
              placeholder={t("fieldPlaceholder")}
              value={state.answers.degreeField || ""}
              onChange={(e) => setAnswer("degreeField", e.target.value)}
            />
          </div>
        )}

        {state.answers.educationLevel && (
          <div>
            <label className="block text-sm font-medium text-text mb-1">{t("documents")}</label>
            <p className="text-xs text-muted mb-3">{t("documentsSubtitle")}</p>
            <div className="space-y-2">
              {DOC_OPTIONS.map((opt) => (
                <OptionButton
                  key={opt.value}
                  value={opt.value}
                  label={t(opt.labelKey)}
                  selected={(state.answers.documentsReady || []).includes(opt.value)}
                  onClick={handleDocToggle}
                  multiSelect
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
