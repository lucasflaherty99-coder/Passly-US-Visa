"use client";

import type { QuizAnswers, Locale } from "@/lib/types";

export const CHECK_STEP = {
  INTENT:       0,
  PROFILE:      1,
  EDUCATION:    2,
  PROFESSIONAL: 3,
  US_TIES:      4,
  ACHIEVEMENTS: 5,
  GOALS:        6,
  HOME_TIES:    7,
  DEPENDENTS:   8,
} as const;

export interface CheckState {
  currentStep: number;
  answers: Partial<QuizAnswers>;
  sessionToken: string;
  locale: Locale;
  completedSteps: number[];
  isSubmitting: boolean;
  navDirection: "forward" | "backward";
}

export type CheckAction =
  | { type: "SET_ANSWER"; key: keyof QuizAnswers; value: unknown }
  | { type: "SET_ANSWERS"; answers: Partial<QuizAnswers> }
  | { type: "NEXT_STEP"; nextStep: number }
  | { type: "PREV_STEP"; prevStep: number }
  | { type: "SET_SUBMITTING"; value: boolean }
  | { type: "RESET" };

export function getCheckTotalSteps(answers: Partial<QuizAnswers>): number {
  const { intent } = answers;
  if (intent === "tourism") return 5;
  if (intent === "study") return 6;
  return 8; // work / green_card / business_investment / not_sure
}

export function getCheckStepPosition(step: number, answers: Partial<QuizAnswers>): number {
  const { intent } = answers;

  if (intent === "tourism") {
    const order: number[] = [CHECK_STEP.INTENT, CHECK_STEP.PROFILE, CHECK_STEP.US_TIES, CHECK_STEP.HOME_TIES, CHECK_STEP.GOALS];
    const idx = order.indexOf(step);
    return idx >= 0 ? idx + 1 : 1;
  }

  if (intent === "study") {
    const order: number[] = [CHECK_STEP.INTENT, CHECK_STEP.PROFILE, CHECK_STEP.EDUCATION, CHECK_STEP.PROFESSIONAL, CHECK_STEP.US_TIES, CHECK_STEP.GOALS];
    const idx = order.indexOf(step);
    return idx >= 0 ? idx + 1 : 1;
  }

  // work / green_card / business_investment / not_sure — includes ACHIEVEMENTS + DEPENDENTS
  const order: number[] = [
    CHECK_STEP.INTENT, CHECK_STEP.PROFILE, CHECK_STEP.EDUCATION,
    CHECK_STEP.PROFESSIONAL, CHECK_STEP.US_TIES, CHECK_STEP.ACHIEVEMENTS,
    CHECK_STEP.GOALS, CHECK_STEP.DEPENDENTS,
  ];
  const idx = order.indexOf(step);
  return idx >= 0 ? idx + 1 : 1;
}

export function getCheckNextStep(currentStep: number, answers: Partial<QuizAnswers>): number | null {
  const { intent } = answers;
  const isTourism = intent === "tourism";
  const isStudy = intent === "study";
  const needsAchievements = intent === "work_specialty" || intent === "green_card" ||
    intent === "business_investment" || intent === "not_sure" || !intent;
  const needsDependents = intent === "green_card" || intent === "work_specialty" ||
    intent === "business_investment";

  switch (currentStep) {
    case CHECK_STEP.INTENT:
      return CHECK_STEP.PROFILE;

    case CHECK_STEP.PROFILE:
      if (isTourism) return CHECK_STEP.US_TIES;
      return CHECK_STEP.EDUCATION;

    case CHECK_STEP.EDUCATION:
      return CHECK_STEP.PROFESSIONAL;

    case CHECK_STEP.PROFESSIONAL:
      return CHECK_STEP.US_TIES;

    case CHECK_STEP.US_TIES:
      if (isTourism) return CHECK_STEP.HOME_TIES;
      if (isStudy) return CHECK_STEP.GOALS;
      if (needsAchievements) return CHECK_STEP.ACHIEVEMENTS;
      return CHECK_STEP.GOALS;

    case CHECK_STEP.ACHIEVEMENTS:
      return CHECK_STEP.GOALS;

    case CHECK_STEP.GOALS:
      if (needsDependents) return CHECK_STEP.DEPENDENTS;
      return null;

    case CHECK_STEP.HOME_TIES:
      return CHECK_STEP.GOALS;

    case CHECK_STEP.DEPENDENTS:
      return null;

    default:
      return null;
  }
}

export function getCheckPrevStep(currentStep: number, answers: Partial<QuizAnswers>): number | null {
  const { intent } = answers;
  const isTourism = intent === "tourism";
  const isStudy = intent === "study";
  const hadAchievements = intent === "work_specialty" || intent === "green_card" ||
    intent === "business_investment" || intent === "not_sure" || !intent;
  const hadDependents = intent === "green_card" || intent === "work_specialty" ||
    intent === "business_investment";

  switch (currentStep) {
    case CHECK_STEP.INTENT:
      return null;

    case CHECK_STEP.PROFILE:
      return CHECK_STEP.INTENT;

    case CHECK_STEP.EDUCATION:
      return CHECK_STEP.PROFILE;

    case CHECK_STEP.PROFESSIONAL:
      return CHECK_STEP.EDUCATION;

    case CHECK_STEP.US_TIES:
      if (isTourism) return CHECK_STEP.PROFILE;
      return CHECK_STEP.PROFESSIONAL;

    case CHECK_STEP.ACHIEVEMENTS:
      return CHECK_STEP.US_TIES;

    case CHECK_STEP.GOALS:
      if (isTourism) return CHECK_STEP.HOME_TIES;
      if (isStudy) return CHECK_STEP.US_TIES;
      if (hadAchievements) return CHECK_STEP.ACHIEVEMENTS;
      return CHECK_STEP.US_TIES;

    case CHECK_STEP.HOME_TIES:
      return CHECK_STEP.US_TIES;

    case CHECK_STEP.DEPENDENTS:
      return CHECK_STEP.GOALS;

    default:
      return CHECK_STEP.INTENT;
  }
}

export function isCheckLastStep(currentStep: number, answers: Partial<QuizAnswers>): boolean {
  return getCheckNextStep(currentStep, answers) === null;
}

export function createCheckInitialState(locale: Locale): CheckState {
  const sessionToken = typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  return {
    currentStep: CHECK_STEP.INTENT,
    answers: {},
    sessionToken,
    locale,
    completedSteps: [],
    isSubmitting: false,
    navDirection: "forward",
  };
}

export function checkReducer(state: CheckState, action: CheckAction): CheckState {
  switch (action.type) {
    case "SET_ANSWER":
      return {
        ...state,
        answers: { ...state.answers, [action.key]: action.value },
      };

    case "SET_ANSWERS":
      return {
        ...state,
        answers: { ...state.answers, ...action.answers },
      };

    case "NEXT_STEP":
      return {
        ...state,
        currentStep: action.nextStep,
        completedSteps: state.completedSteps.includes(state.currentStep)
          ? state.completedSteps
          : [...state.completedSteps, state.currentStep],
        navDirection: "forward",
      };

    case "PREV_STEP":
      return {
        ...state,
        currentStep: action.prevStep,
        navDirection: "backward",
      };

    case "SET_SUBMITTING":
      return { ...state, isSubmitting: action.value };

    case "RESET":
      return createCheckInitialState(state.locale);

    default:
      return state;
  }
}
