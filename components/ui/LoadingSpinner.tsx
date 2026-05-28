"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  message?: string;
  subtitle?: string;
}

const DOT_VARIANTS = {
  initial: { y: 0, opacity: 0.4 },
  animate: { y: [-8, 0], opacity: [0.4, 1, 0.4] },
};

export function LoadingSpinner({ fullScreen = false, message, subtitle }: LoadingSpinnerProps) {
  const t = useTranslations("quiz");

  const content = (
    <div className="flex flex-col items-center gap-6 text-center">
      {/* Animated passport icon */}
      <motion.div
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center"
      >
        <span className="text-3xl">🛂</span>
      </motion.div>

      {/* Animated dots */}
      <div className="flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-primary"
            variants={DOT_VARIANTS}
            initial="initial"
            animate="animate"
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div>
        <p className="text-xl font-semibold text-text">
          {message || t("analyzing")}
        </p>
        {(subtitle || t("analyzingSubtitle")) && (
          <p className="mt-2 text-sm text-muted max-w-xs">
            {subtitle || t("analyzingSubtitle")}
          </p>
        )}
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg/90 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-20 px-4">
      {content}
    </div>
  );
}
