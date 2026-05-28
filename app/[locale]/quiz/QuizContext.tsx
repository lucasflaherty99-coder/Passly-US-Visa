"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
} from "react";
import { useLocale } from "next-intl";
import {
  quizReducer,
  createInitialState,
} from "@/lib/quiz/quizState";
import type { QuizState, QuizAction, QuizAnswers, Locale } from "@/lib/types";

interface QuizContextValue {
  state: QuizState;
  dispatch: React.Dispatch<QuizAction>;
  setAnswer: <K extends keyof QuizAnswers>(key: K, value: QuizAnswers[K]) => void;
  setAnswers: (answers: Partial<QuizAnswers>) => void;
}

const QuizContext = createContext<QuizContextValue | null>(null);

const STORAGE_KEY = "passly_quiz_state";

export function QuizProvider({ children }: { children: ReactNode }) {
  const locale = useLocale() as Locale;

  const [state, dispatch] = useReducer(
    quizReducer,
    locale,
    createInitialState
  );

  // Persist to sessionStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state]);

  function setAnswer<K extends keyof QuizAnswers>(key: K, value: QuizAnswers[K]) {
    dispatch({ type: "SET_ANSWER", key, value });
  }

  function setAnswers(answers: Partial<QuizAnswers>) {
    dispatch({ type: "SET_ANSWERS", answers });
  }

  return (
    <QuizContext.Provider value={{ state, dispatch, setAnswer, setAnswers }}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz(): QuizContextValue {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error("useQuiz must be used within QuizProvider");
  return ctx;
}

export function getStoredQuizState(): QuizState | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}
