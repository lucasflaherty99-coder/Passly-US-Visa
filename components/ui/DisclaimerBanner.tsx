"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";

interface DisclaimerBannerProps {
  variant?: "inline" | "sticky" | "modal";
}

export function DisclaimerBanner({ variant = "inline" }: DisclaimerBannerProps) {
  const t = useTranslations("disclaimer");
  const [dismissed, setDismissed] = useState(false);

  if (variant === "sticky") {
    return (
      <AnimatePresence>
        {!dismissed && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-50"
          >
            <div className="glass-card rounded-xl p-4 border border-border">
              <div className="flex items-start gap-3">
                <div className="text-warning text-lg shrink-0 mt-0.5">⚠️</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted leading-relaxed">{t("short")}</p>
                </div>
                <button
                  onClick={() => setDismissed(true)}
                  className="text-muted hover:text-text shrink-0 transition-colors"
                  aria-label="Dismiss"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  if (variant === "modal") {
    return (
      <div className="rounded-xl bg-amber-50 border border-amber-200 p-6">
        <div className="flex items-start gap-3">
          <div className="text-warning text-xl shrink-0">⚠️</div>
          <div>
            <h3 className="font-semibold text-amber-900 mb-1">Important Disclaimer</h3>
            <p className="text-sm text-amber-800 leading-relaxed">{t("long")}</p>
          </div>
        </div>
      </div>
    );
  }

  // inline (default)
  return (
    <div className="flex items-center gap-2 py-2 px-3 rounded-lg bg-amber-50 border border-amber-100">
      <svg className="w-3.5 h-3.5 text-amber-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      <span className="text-xs text-amber-700">{t("short")}</span>
    </div>
  );
}
