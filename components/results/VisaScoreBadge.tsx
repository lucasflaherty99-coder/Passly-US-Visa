"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { ConfidenceLevel } from "@/lib/types";

interface VisaScoreBadgeProps {
  score: number;
  confidence: ConfidenceLevel;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
}

const CONFIDENCE_COLORS: Record<ConfidenceLevel, { ring: string; text: string; bg: string; badge: string }> = {
  high: { ring: "#10b981", text: "#059669", bg: "#f0fdf4", badge: "bg-emerald-100 text-emerald-700" },
  medium: { ring: "#84B0DC", text: "#1B3569", bg: "#EEF1F8", badge: "bg-blue-100 text-blue-700" },
  low: { ring: "#f59e0b", text: "#b45309", bg: "#fffbeb", badge: "bg-amber-100 text-amber-700" },
  not_applicable: { ring: "#d1d5db", text: "#6b7280", bg: "#f9fafb", badge: "bg-gray-100 text-gray-500" },
};

const SIZES = {
  sm: { outer: 64, stroke: 5, text: "text-lg", label: "text-xs" },
  md: { outer: 96, stroke: 6, text: "text-2xl", label: "text-xs" },
  lg: { outer: 128, stroke: 8, text: "text-4xl", label: "text-sm" },
};

export function VisaScoreBadge({ score, confidence, size = "md", animated = true }: VisaScoreBadgeProps) {
  const t = useTranslations("results");
  const colors = CONFIDENCE_COLORS[confidence];
  const dimensions = SIZES[size];

  const radius = (dimensions.outer - dimensions.stroke * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const center = dimensions.outer / 2;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: dimensions.outer, height: dimensions.outer }}>
        <svg width={dimensions.outer} height={dimensions.outer} className="-rotate-90">
          {/* Background ring */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={dimensions.stroke}
          />
          {/* Score ring */}
          <motion.circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={colors.ring}
            strokeWidth={dimensions.stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={animated ? { strokeDashoffset: circumference } : { strokeDashoffset: offset }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          />
        </svg>
        {/* Score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className={`font-bold ${dimensions.text}`}
            style={{ color: colors.text }}
            initial={animated ? { opacity: 0 } : {}}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {score}
          </motion.span>
          <span className={`${dimensions.label} text-muted`}>/100</span>
        </div>
      </div>

      {/* Confidence badge */}
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors.badge}`}>
        {t(`confidence.${confidence}`)}
      </span>
    </div>
  );
}
