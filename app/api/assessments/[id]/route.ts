import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type Props = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Props) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Assessment ID required" }, { status: 400 });
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = createClient() as any;
    const { data, error } = await db
      .from("assessments")
      .select("id, session_id, locale, answers, top_results, all_results, created_at")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
    }

    const row = data as {
      id: string;
      session_id: string;
      locale: string;
      answers: unknown;
      top_results: unknown;
      all_results: unknown;
      created_at: string;
    };

    return NextResponse.json({
      assessmentId: row.id,
      sessionId: row.session_id,
      locale: row.locale,
      topResults: row.top_results,
      allResults: row.all_results,
      generatedAt: row.created_at,
    });
  } catch (error) {
    console.error("[/api/assessments/[id]] Error:", error);
    return NextResponse.json({ error: "Failed to fetch assessment" }, { status: 500 });
  }
}

export const runtime = "nodejs";
