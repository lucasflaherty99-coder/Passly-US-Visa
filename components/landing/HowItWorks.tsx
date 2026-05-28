"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const STEPS = [
  { emoji: "💬", titleKey: "step1Title", descKey: "step1Desc" },
  { emoji: "🔬", titleKey: "step2Title", descKey: "step2Desc" },
  { emoji: "🚀", titleKey: "step3Title", descKey: "step3Desc" },
];

export function HowItWorks() {
  const t = useTranslations("landing.howItWorks");

  return (
    <section id="how-it-works" className="py-20 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-navy">{t("title")}</h2>
          <p className="mt-3 text-muted">{t("subtitle")}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {STEPS.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-card flex items-center justify-center text-2xl mx-auto mb-4">
                {step.emoji}
              </div>
              <div className="text-xs font-bold text-primary uppercase tracking-wide mb-2">
                Step {i + 1}
              </div>
              <h3 className="text-lg font-bold text-navy mb-2">{t(step.titleKey)}</h3>
              <p className="text-sm text-muted leading-relaxed">{t(step.descKey)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
