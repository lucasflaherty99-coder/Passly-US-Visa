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
  checkReducer,
  createCheckInitialState,
  type CheckState,
  type CheckAction,
} from "@/lib/check/checkState";
import type { QuizAnswers, Locale } from "@/lib/types";

interface CheckContextValue {
  state: CheckState;
  dispatch: React.Dispatch<CheckAction>;
  setAnswer: <K extends keyof QuizAnswers>(key: K, value: QuizAnswers[K]) => void;
  setAnswers: (answers: Partial<QuizAnswers>) => void;
}

const CheckContext = createContext<CheckContextValue | null>(null);

const STORAGE_KEY = "passly_check_state";

export function CheckProvider({ children }: { children: ReactNode }) {
  const locale = useLocale() as Locale;

  const [state, dispatch] = useReducer(
    checkReducer,
    locale,
    createCheckInitialState
  );

  // Hydrate from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: CheckState = JSON.parse(stored);
        dispatch({ type: "SET_ANSWERS", answers: parsed.answers });
      }
    } catch {
      // ignore corrupt storage
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist to localStorage on every state change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state]);

  function setAnswer<K extends keyof QuizAnswers>(key: K, value: QuizAnswers[K]) {
    dispatch({ type: "SET_ANSWER", key, value });
  }

  function setAnswers(answers: Partial<QuizAnswers>) {
    dispatch({ type: "SET_ANSWERS", answers });
  }

  return (
    <CheckContext.Provider value={{ state, dispatch, setAnswer, setAnswers }}>
      {children}
    </CheckContext.Provider>
  );
}

export function useCheck(): CheckContextValue {
  const ctx = useContext(CheckContext);
  if (!ctx) throw new Error("useCheck must be used within CheckProvider");
  return ctx;
}
