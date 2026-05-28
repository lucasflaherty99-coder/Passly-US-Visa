import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { LeadSubmission } from "@/lib/types";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Simple in-memory rate limiter: max 10 requests per IP per hour
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 3_600_000 });
    return true;
  }
  if (entry.count >= 10) return false;
  entry.count += 1;
  return true;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const body = await request.json() as LeadSubmission;

    if (!body.email || !EMAIL_REGEX.test(body.email)) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = createClient() as any;
    const { data, error } = await db
      .from("leads")
      .insert({
        email: body.email,
        name: body.name ?? null,
        whatsapp: body.whatsapp ?? null,
        locale: body.locale ?? "en",
        session_id: body.sessionId ?? null,
        attorney_interest: body.attorneyInterest ?? false,
        utm_source: body.utmSource ?? null,
      })
      .select("id")
      .single();

    if (error) {
      // Duplicate email — treat as success (idempotent)
      if ((error as { code?: string }).code === "23505") {
        return NextResponse.json({ success: true }, { status: 200 });
      }
      throw error;
    }

    console.log("[Lead captured]", {
      id: (data as { id: string } | null)?.id,
      email: body.email,
      name: body.name,
      whatsapp: body.whatsapp,
      locale: body.locale,
    });

    return NextResponse.json({ success: true, leadId: (data as { id: string } | null)?.id }, { status: 200 });
  } catch (error) {
    console.error("[/api/leads] Error:", error);
    return NextResponse.json({ error: "Failed to save lead" }, { status: 500 });
  }
}

export const runtime = "nodejs";
