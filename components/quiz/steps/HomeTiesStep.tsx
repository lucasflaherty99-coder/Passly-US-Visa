"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { QuestionCard } from "../QuestionCard";
import { OptionButton } from "../OptionButton";
import { CTAButton } from "@/components/ui/CTAButton";
import { useQuiz } from "@/app/[locale]/quiz/QuizContext";
import { getTotalSteps, getPrevStep, STEP } from "@/lib/quiz/quizState";
import type { TravelHistory } from "@/lib/types";

export function HomeTiesStep({ onComplete }: { onComplete: () => void }) {
  const t = useTranslations("quiz.homeTies");
  const tQuiz = useTranslations("quiz");
  const { state, setAnswer, dispatch } = useQuiz();
  const router = useRouter();
  const locale = useLocale();

  function handleBack() {
    const prevStep = getPrevStep(STEP.HOME_TIES, state.answers);
    if (prevStep !== null) {
      dispatch({ type: "PREV_STEP", prevStep });
      router.push(`/${locale}/quiz/${prevStep}`);
    }
  }

  const canAdvance = state.answers.hasEmploymentHomeTies !== undefined &&
    state.answers.priorTravelHistory !== undefined;

  return (
    <QuestionCard
      step={STEP.HOME_TIES}
      totalSteps={getTotalSteps(state.answers)}
      question={t("question")}
      subtitle={t("subtitle")}
      onBack={handleBack}
      navDirection={state.navDirection}
      note={t("note")}
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
          <CTAButton onClick={onComplete} size="lg" fullWidth>
            {tQuiz("submit")}
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
