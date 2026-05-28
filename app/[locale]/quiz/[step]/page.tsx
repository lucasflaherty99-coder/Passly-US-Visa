"use client";

import { use, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useQuiz } from "../QuizContext";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { IntentStep } from "@/components/quiz/steps/IntentStep";
import { GreenCardPathwayStep } from "@/components/quiz/steps/GreenCardPathwayStep";
import { BasicProfileStep } from "@/components/quiz/steps/BasicProfileStep";
import { EducationStep } from "@/components/quiz/steps/EducationStep";
import { ProfessionalStep } from "@/components/quiz/steps/ProfessionalStep";
import { RecognitionStep } from "@/components/quiz/steps/RecognitionStep";
import { UsConnectionStep } from "@/components/quiz/steps/UsConnectionStep";
import { GoalsStep } from "@/components/quiz/steps/GoalsStep";
import { DependentsStep } from "@/components/quiz/steps/DependentsStep";
import { HomeTiesStep } from "@/components/quiz/steps/HomeTiesStep";
import { STEP } from "@/lib/quiz/quizState";
import type { QuizAnswers } from "@/lib/types";

export default function QuizStepPage({
  params,
}: {
  params: Promise<{ locale: string; step: string }>;
}) {
  const { step } = use(params);
  const stepNum = parseInt(step, 10);
  const { state, dispatch } = useQuiz();
  const router = useRouter();
  const locale = useLocale();

  const handleComplete = useCallback(async () => {
    dispatch({ type: "SET_SUBMITTING", value: true });

    try {
      // Store answers in sessionStorage for results page
      if (typeof window !== "undefined") {
        sessionStorage.setItem("passly_answers", JSON.stringify(state.answers));
        sessionStorage.setItem("passly_session", state.sessionToken);
      }

      // Call analyze API
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state.answers as QuizAnswers),
      });

      if (response.ok) {
        const results = await response.json();
        sessionStorage.setItem("passly_results", JSON.stringify(results));
      }

      router.push(`/${locale}/results`);
    } catch (error) {
      console.error("Analysis failed:", error);
      router.push(`/${locale}/results`);
    } finally {
      dispatch({ type: "SET_SUBMITTING", value: false });
    }
  }, [state.answers, state.sessionToken, dispatch, router, locale]);

  if (state.isSubmitting) {
    return <LoadingSpinner fullScreen />;
  }

  // Route to correct step component
  switch (stepNum) {
    case STEP.INTENT:
      return <IntentStep />;
    case STEP.GREEN_CARD_PATHWAY:
      return <GreenCardPathwayStep />;
    case STEP.BASIC_PROFILE:
      return <BasicProfileStep />;
    case STEP.EDUCATION:
      return <EducationStep />;
    case STEP.PROFESSIONAL:
      return <ProfessionalStep />;
    case STEP.RECOGNITION:
      return <RecognitionStep />;
    case STEP.US_CONNECTION:
      return <UsConnectionStep />;
    case STEP.GOALS:
      return <GoalsStep />;
    case STEP.DEPENDENTS:
      return <DependentsStep onComplete={handleComplete} />;
    case STEP.HOME_TIES:
      return <HomeTiesStep onComplete={handleComplete} />;
    default:
      router.push(`/${locale}/quiz/0`);
      return <LoadingSpinner />;
  }
}
