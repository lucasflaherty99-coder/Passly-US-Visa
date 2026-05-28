import { NextRequest, NextResponse } from "next/server";
import { analyzeWithAI } from "@/lib/ai/analyze";
import type { QuizAnswers } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const answers = body as Partial<QuizAnswers>;
    const locale = typeof body.locale === "string" ? body.locale : "en";

    if (!answers.intent) {
      return NextResponse.json({ error: "Missing required field: intent" }, { status: 400 });
    }

    const results = await analyzeWithAI(answers, locale);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error("[/api/analyze] Error:", error);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}

export const runtime = "edge";
