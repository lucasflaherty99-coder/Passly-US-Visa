"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

interface ProgressBarProps {
  current: number;
  total: number;
  percent?: number;
}

export function ProgressBar({ current, total, percent }: ProgressBarProps) {
  const t = useTranslations("quiz");
  const progress = percent ?? Math.round((current / total) * 100);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-muted font-medium">
          {t("stepOf", { current, total })}
        </span>
        <span className="text-xs text-muted">{progress}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-border overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
