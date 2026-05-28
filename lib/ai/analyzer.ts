import type { QuizAnswers, AnalysisResponse } from "@/lib/types";

export interface AIAnalysisInput {
  answers: Partial<QuizAnswers>;
  sessionId: string;
  locale: string;
}

export interface AIAnalysisOutput extends AnalysisResponse {
  aiEnhanced: boolean;
  processingMs: number;
}

export async function mockAnalysis(input: AIAnalysisInput): Promise<AIAnalysisOutput> {
  const { analyzeEligibility } = await import("@/lib/scoring/engine");
  const start = Date.now();
  const base = analyzeEligibility(input.answers);
  return {
    ...base,
    sessionId: input.sessionId,
    aiEnhanced: false,
    processingMs: Date.now() - start,
  };
}
