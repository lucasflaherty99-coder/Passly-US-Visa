"use client";

import type { QuizAnswers, QuizState, QuizAction, Locale } from "@/lib/types";

// Step IDs — numeric for URL routing
export const STEP = {
  INTENT: 0,
  GREEN_CARD_PATHWAY: 1,
  BASIC_PROFILE: 2,
  EDUCATION: 3,
  PROFESSIONAL: 4,
  RECOGNITION: 5,
  US_CONNECTION: 6,
  GOALS: 7,
  DEPENDENTS: 8,
  HOME_TIES: 9,
} as const;

// Total steps varies by intent — used for progress bar
export function getTotalSteps(answers: Partial<QuizAnswers>): number {
  if (answers.intent === "tourism") return 3;
  if (answers.intent === "study") return 5;
  if (answers.intent === "green_card") return 9;
  return 8;
}

// Given current step and current answers, return the next step index
export function getNextStep(currentStep: number, answers: Partial<QuizAnswers>): number | null {
  const { intent, greenCardPathway, hasDependents } = answers;

  switch (currentStep) {
    case STEP.INTENT:
      if (intent === "green_card") return STEP.GREEN_CARD_PATHWAY;
      if (intent === "tourism") return STEP.BASIC_PROFILE;
      return STEP.BASIC_PROFILE;

    case STEP.GREEN_CARD_PATHWAY:
      return STEP.BASIC_PROFILE;

    case STEP.BASIC_PROFILE:
      if (intent === "tourism") return STEP.HOME_TIES;
      return STEP.EDUCATION;

    case STEP.EDUCATION:
      if (intent === "study") return STEP.US_CONNECTION;
      return STEP.PROFESSIONAL;

    case STEP.PROFESSIONAL:
      return STEP.RECOGNITION;

    case STEP.RECOGNITION:
      return STEP.US_CONNECTION;

    case STEP.US_CONNECTION:
      if (intent === "study") return STEP.GOALS;
      return STEP.GOALS;

    case STEP.GOALS:
      return STEP.DEPENDENTS;

    case STEP.DEPENDENTS:
      if (hasDependents) return null; // done — dependents step is last
      return null; // done

    case STEP.HOME_TIES:
      return null; // done (tourism path)

    default:
      return null;
  }
}

// Given current step and answers, return previous step
export function getPrevStep(currentStep: number, answers: Partial<QuizAnswers>): number | null {
  const { intent } = answers;

  switch (currentStep) {
    case STEP.INTENT:
      return null;

    case STEP.GREEN_CARD_PATHWAY:
      return STEP.INTENT;

    case STEP.BASIC_PROFILE:
      if (intent === "green_card") return STEP.GREEN_CARD_PATHWAY;
      return STEP.INTENT;

    case STEP.HOME_TIES:
      return STEP.BASIC_PROFILE;

    case STEP.EDUCATION:
      return STEP.BASIC_PROFILE;

    case STEP.PROFESSIONAL:
      return STEP.EDUCATION;

    case STEP.RECOGNITION:
      return STEP.PROFESSIONAL;

    case STEP.US_CONNECTION:
      if (intent === "study") return STEP.EDUCATION;
      return STEP.RECOGNITION;

    case STEP.GOALS:
      return STEP.US_CONNECTION;

    case STEP.DEPENDENTS:
      return STEP.GOALS;

    default:
      return STEP.INTENT;
  }
}

// Check if quiz is complete at current step
export function isLastStep(currentStep: number, answers: Partial<QuizAnswers>): boolean {
  return getNextStep(currentStep, answers) === null;
}

export function getProgressPercent(currentStep: number, answers: Partial<QuizAnswers>): number {
  const total = getTotalSteps(answers);
  const position = getStepPosition(currentStep, answers);
  return Math.round((position / total) * 100);
}

export function getStepPosition(step: number, answers: Partial<QuizAnswers>): number {
  const { intent } = answers;

  if (intent === "tourism") {
    const order: number[] = [STEP.INTENT, STEP.BASIC_PROFILE, STEP.HOME_TIES];
    const idx = order.indexOf(step);
    return idx >= 0 ? idx + 1 : 1;
  }

  if (intent === "study") {
    const order: number[] = [STEP.INTENT, STEP.BASIC_PROFILE, STEP.EDUCATION, STEP.US_CONNECTION, STEP.GOALS];
    const idx = order.indexOf(step);
    return idx >= 0 ? idx + 1 : 1;
  }

  if (intent === "green_card") {
    const order: number[] = [
      STEP.INTENT, STEP.GREEN_CARD_PATHWAY, STEP.BASIC_PROFILE,
      STEP.EDUCATION, STEP.PROFESSIONAL, STEP.RECOGNITION,
      STEP.US_CONNECTION, STEP.GOALS, STEP.DEPENDENTS,
    ];
    const idx = order.indexOf(step);
    return idx >= 0 ? idx + 1 : 1;
  }

  // work / business_investment / not_sure / undefined (no GREEN_CARD_PATHWAY)
  const order: number[] = [
    STEP.INTENT, STEP.BASIC_PROFILE, STEP.EDUCATION,
    STEP.PROFESSIONAL, STEP.RECOGNITION, STEP.US_CONNECTION,
    STEP.GOALS, STEP.DEPENDENTS,
  ];
  const idx = order.indexOf(step);
  return idx >= 0 ? idx + 1 : 1;
}

// Initial state factory
export function createInitialState(locale: Locale): QuizState {
  const sessionToken = typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  return {
    currentStep: STEP.INTENT,
    answers: {},
    sessionToken,
    locale,
    completedSteps: [],
    isSubmitting: false,
    navDirection: "forward",
  };
}

// Reducer
export function quizReducer(state: QuizState, action: QuizAction): QuizState {
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
      return createInitialState(state.locale);

    default:
      return state;
  }
}
