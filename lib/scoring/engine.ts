import type {
  QuizAnswers,
  VisaResult,
  VisaScoringFactor,
  ConfidenceLevel,
  AnalysisResponse,
} from "@/lib/types";
import { scoreO1 } from "./o1";
import { scoreH1B } from "./h1b";
import { scoreEB2NIW } from "./eb2niw";
import { scoreF1 } from "./f1";
import { scoreL1 } from "./l1";
import { scoreE2 } from "./e2";
import { scoreB1B2 } from "./b1b2";
import { scoreEB1A } from "./eb1a";
import { scoreEB2PERM } from "./eb2perm";
import { scoreEB1C } from "./eb1c";
import { scoreTN } from "./tn";
import { scoreEB3 } from "./eb3";
import { scoreJ1 } from "./j1";

// Weighted score helper — all scorers use this
export function weightedScore(factors: VisaScoringFactor[]): number {
  return factors.reduce((acc, f) => acc + f.weight * f.score, 0);
}

// Confidence mapping — all scorers use this
export function mapConfidence(score: number): ConfidenceLevel {
  if (score >= 75) return "high";
  if (score >= 50) return "medium";
  if (score >= 30) return "low";
  return "not_applicable";
}

// Main analysis function — locale is used for bilingual contextual notices
export function analyzeEligibility(answers: Partial<QuizAnswers>, locale = "en"): AnalysisResponse {
  const sessionId = generateSessionId();

  const allResults: VisaResult[] = [
    scoreO1(answers, locale),
    scoreH1B(answers),
    scoreEB2NIW(answers, locale),
    scoreF1(answers, locale),
    scoreL1(answers, locale),
    scoreE2(answers),
    scoreB1B2(answers),
    scoreEB1A(answers, locale),
    scoreEB2PERM(answers, locale),
    scoreEB1C(answers, locale),
    scoreTN(answers, locale),
    scoreEB3(answers, locale),
    scoreJ1(answers, locale),
  ];

  // Sort by total score descending, applicable visas first
  const sorted = allResults.sort((a, b) => {
    if (a.confidence === "not_applicable" && b.confidence !== "not_applicable") return 1;
    if (b.confidence === "not_applicable" && a.confidence !== "not_applicable") return -1;
    return b.totalScore - a.totalScore;
  });

  const topResults = sorted.slice(0, 3);

  return {
    sessionId,
    topResults,
    allResults: sorted,
    generatedAt: new Date().toISOString(),
  };
}

function generateSessionId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
