"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { ProgressBar } from "./ProgressBar";
import { TransitionWrapper } from "./TransitionWrapper";
import { useCheck } from "@/app/[locale]/check/CheckContext";
import { getCheckStepPosition, getCheckTotalSteps } from "@/lib/check/checkState";

interface QuestionCardProps {
  step: number;
  question: string;
  subtitle?: string;
  note?: string;
  children: React.ReactNode;
  onBack?: () => void;
}

export function QuestionCard({
  step,
  question,
  subtitle,
  note,
  children,
  onBack,
}: QuestionCardProps) {
  const t = useTranslations("quiz");
  const tNav = useTranslations("nav");
  const locale = useLocale();
  const { state } = useCheck();
  const stepPosition = getCheckStepPosition(step, state.answers);
  const totalSteps = getCheckTotalSteps(state.answers);

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-bg/90 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className="max-w-xl mx-auto flex items-center gap-4">
          {onBack ? (
            <button
              onClick={onBack}
              className="shrink-0 p-2 -ml-2 rounded-lg text-muted hover:text-text hover:bg-card transition-colors"
              aria-label={t("back")}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          ) : (
            <div className="shrink-0 w-9" />
          )}
          <div className="flex-1">
            <ProgressBar current={stepPosition} total={totalSteps} />
          </div>
          <Link
            href={`/${locale}`}
            className="shrink-0 p-2 -mr-2 rounded-lg text-muted hover:text-text hover:bg-card transition-colors"
            aria-label={tNav("home")}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col px-4 py-8">
        <div className="max-w-xl mx-auto w-full flex-1 flex flex-col">
          <TransitionWrapper step={step} direction={state.navDirection}>
            {/* Question */}
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-navy leading-tight">
                {question}
              </h1>
              {subtitle && (
                <p className="mt-3 text-base text-muted">{subtitle}</p>
              )}
              {note && (
                <div className="mt-4 rounded-lg bg-card border border-border px-4 py-3">
                  <p className="text-sm text-muted leading-relaxed">{note}</p>
                </div>
              )}
            </div>

            {/* Options / content */}
            <div className="flex-1">
              {children}
            </div>
          </TransitionWrapper>
        </div>
      </div>
    </div>
  );
}
