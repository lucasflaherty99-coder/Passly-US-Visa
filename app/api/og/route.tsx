import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") ?? "Find Your U.S. Visa Path";
  const visa = searchParams.get("visa") ?? "";
  const score = searchParams.get("score") ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          background: "linear-gradient(135deg, #0a1628 0%, #1a2f5e 60%, #0a1628 100%)",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Accent bar */}
        <div
          style={{
            width: "60px",
            height: "5px",
            background: "#3b82f6",
            borderRadius: "9999px",
            marginBottom: "28px",
          }}
        />

        {/* Visa badge */}
        {visa && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "rgba(59,130,246,0.15)",
              border: "1px solid rgba(59,130,246,0.3)",
              borderRadius: "999px",
              padding: "8px 20px",
              marginBottom: "24px",
            }}
          >
            <span style={{ color: "#60a5fa", fontSize: "14px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase" }}>
              {visa}
            </span>
          </div>
        )}

        {/* Title */}
        <div
          style={{
            color: "white",
            fontSize: title.length > 50 ? "48px" : "56px",
            fontWeight: 800,
            lineHeight: 1.15,
            maxWidth: "900px",
            marginBottom: "32px",
          }}
        >
          {title}
        </div>

        {/* Score chip */}
        {score && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "40px",
            }}
          >
            <span style={{ color: "#94a3b8", fontSize: "18px" }}>Fit Score</span>
            <span
              style={{
                color: "#22c55e",
                fontSize: "24px",
                fontWeight: 700,
              }}
            >
              {score}%
            </span>
          </div>
        )}

        {/* Footer row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginTop: "auto",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              background: "#3b82f6",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ color: "white", fontSize: "20px", fontWeight: 900 }}>P</span>
          </div>
          <span style={{ color: "#94a3b8", fontSize: "20px", fontWeight: 600 }}>Passly AI</span>
          <span style={{ color: "#475569", fontSize: "20px", marginLeft: "8px" }}>·</span>
          <span style={{ color: "#64748b", fontSize: "18px" }}>Free U.S. Visa Eligibility Analysis</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
