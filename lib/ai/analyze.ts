import type { QuizAnswers, AnalysisResponse } from "@/lib/types";
import { analyzeEligibility } from "@/lib/scoring/engine";

// AI abstraction layer — currently returns scoring engine output
// When ENABLE_OPENAI=true and API key is set, this will enhance results with GPT-4o
export async function analyzeWithAI(answers: Partial<QuizAnswers>, locale = "en"): Promise<AnalysisResponse> {
  const openaiEnabled = process.env.ENABLE_OPENAI === "true";
  const apiKey = process.env.OPENAI_API_KEY;

  if (openaiEnabled && apiKey) {
    // Future: enhance scoring results with AI-generated explanations
    // const enhanced = await callOpenAI(answers, baseResults);
    // return enhanced;
  }

  return analyzeEligibility(answers, locale);
}
