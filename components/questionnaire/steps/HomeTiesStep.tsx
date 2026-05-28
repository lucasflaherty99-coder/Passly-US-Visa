"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { QuestionCard } from "../QuestionCard";
import { OptionButton } from "../OptionButton";
import { CTAButton } from "@/components/ui/CTAButton";
import { useCheck } from "@/app/[locale]/check/CheckContext";
import { getCheckPrevStep, getCheckNextStep, CHECK_STEP } from "@/lib/check/checkState";
import type { TravelHistory } from "@/lib/types";

export function HomeTiesStep() {
  const t = useTranslations("quiz.homeTies");
  const tQuiz = useTranslations("quiz");
  const { state, setAnswer, dispatch } = useCheck();
  const router = useRouter();
  const locale = useLocale();

  function handleBack() {
    const prevStep = getCheckPrevStep(CHECK_STEP.HOME_TIES, state.answers);
    if (prevStep !== null) {
      dispatch({ type: "PREV_STEP", prevStep });
      router.push(`/${locale}/check/${prevStep}`);
    }
  }

  function handleNext() {
    const nextStep = getCheckNextStep(CHECK_STEP.HOME_TIES, state.answers);
    if (nextStep !== null) {
      dispatch({ type: "NEXT_STEP", nextStep });
      router.push(`/${locale}/check/${nextStep}`);
    } else {
      router.push(`/${locale}/check/results`);
    }
  }

  const canAdvance = state.answers.hasEmploymentHomeTies !== undefined &&
    state.answers.priorTravelHistory !== undefined;

  return (
    <QuestionCard
      step={CHECK_STEP.HOME_TIES}
      question={t("question")}
      subtitle={t("subtitle")}
      note={t("note")}
      onBack={handleBack}
    >
      <div className="space-y-6">
        <YesNoQ question={t("employment")} value={state.answers.hasEmploymentHomeTies}
          onChange={(v) => setAnswer("hasEmploymentHomeTies", v === "yes")} yes={t("yes")} no={t("no")} />
        <YesNoQ question={t("studying")} value={state.answers.isCurrentlyStudying}
          onChange={(v) => setAnswer("isCurrentlyStudying", v === "yes")} yes={t("yes")} no={t("no")} />
        <YesNoQ question={t("property")} value={state.answers.hasPropertyHomeTies}
          onChange={(v) => setAnswer("hasPropertyHomeTies", v === "yes")} yes={t("yes")} no={t("no")} />
        <YesNoQ question={t("vehicleOrBusiness")} value={state.answers.hasVehicleOrBusiness}
          onChange={(v) => setAnswer("hasVehicleOrBusiness", v === "yes")} yes={t("yes")} no={t("no")} />
        <YesNoQ question={t("married")} value={state.answers.isMarried}
          onChange={(v) => setAnswer("isMarried", v === "yes")} yes={t("yes")} no={t("no")} />

        <div>
          <label className="block text-sm font-medium text-text mb-3">{t("priorTravel")}</label>
          <div className="space-y-2">
            {([
              { value: "extensive", label: t("travelExtensive") },
              { value: "moderate", label: t("travelModerate") },
              { value: "limited", label: t("travelLimited") },
              { value: "none", label: t("travelNone") },
            ] as { value: TravelHistory; label: string }[]).map((opt) => (
              <OptionButton
                key={opt.value}
                value={opt.value}
                label={opt.label}
                selected={state.answers.priorTravelHistory === opt.value}
                onClick={(v) => setAnswer("priorTravelHistory", v as TravelHistory)}
              />
            ))}
          </div>
        </div>

        <YesNoQ question={t("plansToReturn")} value={state.answers.plansToReturn}
          onChange={(v) => setAnswer("plansToReturn", v === "yes")} yes={t("yes")} no={t("no")} />

        {canAdvance && (
          <CTAButton onClick={handleNext} size="lg" fullWidth>
            {tQuiz("next")}
          </CTAButton>
        )}
      </div>
    </QuestionCard>
  );
}

function YesNoQ({ question, value, onChange, yes, no }: {
  question: string; value: boolean | undefined;
  onChange: (v: string) => void; yes: string; no: string;
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
