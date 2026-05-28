"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import Link from "next/link";

const VISAS = [
  { key: "o1", emoji: "⭐", slug: "o1-visa-guide" },
  { key: "h1b", emoji: "💼", slug: "h1b-visa-specialty-occupations" },
  { key: "eb2niw", emoji: "🌟", slug: "eb2-niw-engineers" },
  { key: "eb1a", emoji: "🏆", slug: "visas/eb1a-extraordinary-ability" },
  { key: "eb2perm", emoji: "🤝", slug: "visas/eb2-perm-employer-sponsored" },
  { key: "f1", emoji: "🎓", slug: "f1-student-visa-guide" },
  { key: "l1", emoji: "🏢", slug: "l1-visa-founders" },
  { key: "e2", emoji: "💰", slug: "e2-investor-visa-guide" },
  { key: "b1b2", emoji: "✈️", slug: "b1b2-tourist-visa-strong-ties" },
  { key: "eb1c", emoji: "🏛️", slug: "visas/eb1c-multinational-executive" },
  { key: "tn", emoji: "🍁", slug: "tn-visa-usmca-professionals" },
  { key: "eb3", emoji: "⚙️", slug: "eb3-skilled-workers-professionals" },
  { key: "j1", emoji: "🌍", slug: "j1-visa-exchange-visitor" },
];

export function VisaTypes() {
  const t = useTranslations("landing.visaTypes");
  const locale = useLocale();

  return (
    <section id="visas" className="py-20 px-4 bg-bg">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-navy">{t("title")}</h2>
          <p className="mt-3 text-muted">{t("subtitle")}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {VISAS.map((visa, i) => (
            <motion.div
              key={visa.key}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <Link
                href={`/${locale}/${visa.slug}`}
                className="block rounded-2xl bg-white border border-border p-5 hover:border-primary/40 hover:shadow-card transition-all group"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{visa.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-navy text-sm">{t(`${visa.key}.name`)}</div>
                    <div className="text-xs text-primary font-medium mt-0.5">{t(`${visa.key}.label`)}</div>
                    <p className="text-xs text-muted mt-2 leading-relaxed">{t(`${visa.key}.desc`)}</p>
                  </div>
                </div>
                <div className="mt-3 text-xs font-medium text-primary group-hover:underline">
                  {t("learnMore")} →
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
