"use client";

import { use, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useCheck } from "../CheckContext";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { IntentStep } from "@/components/questionnaire/steps/IntentStep";
import { ProfileStep } from "@/components/questionnaire/steps/ProfileStep";
import { EducationStep } from "@/components/questionnaire/steps/EducationStep";
import { ProfessionalStep } from "@/components/questionnaire/steps/ProfessionalStep";
import { UsTiesStep } from "@/components/questionnaire/steps/UsTiesStep";
import { AchievementsStep } from "@/components/questionnaire/steps/AchievementsStep";
import { GoalsStep } from "@/components/questionnaire/steps/GoalsStep";
import { HomeTiesStep } from "@/components/questionnaire/steps/HomeTiesStep";
import { DependentsStep } from "@/components/questionnaire/steps/DependentsStep";
import { CHECK_STEP } from "@/lib/check/checkState";
import type { QuizAnswers } from "@/lib/types";

export default function CheckStepPage({
  params,
}: {
  params: Promise<{ locale: string; step: string }>;
}) {
  const { step } = use(params);
  const stepNum = parseInt(step, 10);
  const { state, dispatch } = useCheck();
  const router = useRouter();
  const locale = useLocale();

  const handleComplete = useCallback(async () => {
    dispatch({ type: "SET_SUBMITTING", value: true });

    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("passly_check_answers", JSON.stringify(state.answers));
        localStorage.setItem("passly_check_session", state.sessionToken);
      }

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state.answers as QuizAnswers),
      });

      if (response.ok) {
        const results = await response.json();
        localStorage.setItem("passly_check_results", JSON.stringify(results));
      }

      router.push(`/${locale}/check/results`);
    } catch (error) {
      console.error("Analysis failed:", error);
      router.push(`/${locale}/check/results`);
    } finally {
      dispatch({ type: "SET_SUBMITTING", value: false });
    }
  }, [state.answers, state.sessionToken, dispatch, router, locale]);

  if (state.isSubmitting) {
    return <LoadingSpinner fullScreen />;
  }

  switch (stepNum) {
    case CHECK_STEP.INTENT:
      return <IntentStep />;
    case CHECK_STEP.PROFILE:
      return <ProfileStep />;
    case CHECK_STEP.EDUCATION:
      return <EducationStep />;
    case CHECK_STEP.PROFESSIONAL:
      return <ProfessionalStep />;
    case CHECK_STEP.US_TIES:
      return <UsTiesStep />;
    case CHECK_STEP.ACHIEVEMENTS:
      return <AchievementsStep />;
    case CHECK_STEP.GOALS:
      return <GoalsStep onComplete={handleComplete} />;
    case CHECK_STEP.HOME_TIES:
      return <HomeTiesStep />;
    case CHECK_STEP.DEPENDENTS:
      return <DependentsStep onComplete={handleComplete} />;
    default:
      router.push(`/${locale}/check/0`);
      return <LoadingSpinner />;
  }
}
