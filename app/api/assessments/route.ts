import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { analyzeEligibility } from "@/lib/scoring/engine";
import type { QuizAnswers } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      sessionId: string;
      answers: Partial<QuizAnswers>;
      leadId?: string;
      locale?: string;
    };

    if (!body.sessionId || !body.answers?.intent) {
      return NextResponse.json({ error: "sessionId and answers.intent are required" }, { status: 400 });
    }

    const results = analyzeEligibility(body.answers, body.locale ?? "en");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = createClient() as any;

    const { data, error } = await db
      .from("assessments")
      .insert({
        session_id: body.sessionId,
        lead_id: body.leadId ?? null,
        locale: body.locale ?? "en",
        answers: body.answers,
        top_results: results.topResults,
        all_results: results.allResults,
      })
      .select("id")
      .single();

    if (error) throw error;

    const assessmentId = (data as { id: string } | null)?.id;

    return NextResponse.json({
      assessmentId,
      ...results,
    }, { status: 201 });
  } catch (error) {
    console.error("[/api/assessments] Error:", error);
    return NextResponse.json({ error: "Failed to save assessment" }, { status: 500 });
  }
}

export const runtime = "nodejs";
