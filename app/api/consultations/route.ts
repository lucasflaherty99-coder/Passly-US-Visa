import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      email: string;
      name?: string;
      message?: string;
      preferredTime?: string;
      leadId?: string;
      assessmentId?: string;
    };

    if (!body.email || !EMAIL_REGEX.test(body.email)) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = createClient() as any;
    const { data, error } = await db
      .from("attorney_consultations")
      .insert({
        email: body.email,
        name: body.name ?? null,
        message: body.message ?? null,
        preferred_time: body.preferredTime ?? null,
        lead_id: body.leadId ?? null,
        assessment_id: body.assessmentId ?? null,
        status: "pending",
      })
      .select("id")
      .single();

    if (error) throw error;

    console.log("[Consultation request]", {
      id: (data as { id: string } | null)?.id,
      email: body.email,
    });

    return NextResponse.json({
      success: true,
      consultationId: (data as { id: string } | null)?.id,
    }, { status: 201 });
  } catch (error) {
    console.error("[/api/consultations] Error:", error);
    return NextResponse.json({ error: "Failed to create consultation request" }, { status: 500 });
  }
}

export const runtime = "nodejs";
