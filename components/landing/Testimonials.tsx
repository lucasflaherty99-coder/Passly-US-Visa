"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export function Testimonials() {
  const t = useTranslations("landing.testimonials");

  const testimonials = [
    {
      name: t("t1Name"),
      role: t("t1Role"),
      quote: t("t1Quote"),
      emoji: "🇦🇷",
      visaTag: "O-1",
    },
    {
      name: t("t2Name"),
      role: t("t2Role"),
      quote: t("t2Quote"),
      emoji: "🇮🇳",
      visaTag: "H-1B",
    },
    {
      name: t("t3Name"),
      role: t("t3Role"),
      quote: t("t3Quote"),
      emoji: "🇲🇽",
      visaTag: "L-1",
    },
  ];

  return (
    <section className="py-20 px-4 bg-navy">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-2xl md:text-3xl font-bold text-white">{t("title")}</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl bg-white/10 backdrop-blur border border-white/20 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{item.emoji}</span>
                <div>
                  <p className="font-semibold text-white text-sm">{item.name}</p>
                  <p className="text-white/60 text-xs">{item.role}</p>
                </div>
                <span className="ml-auto text-xs font-bold text-primary bg-primary/20 px-2 py-0.5 rounded-full">
                  {item.visaTag}
                </span>
              </div>
              <p className="text-white/80 text-sm leading-relaxed italic">"{item.quote}"</p>
              <div className="flex gap-0.5 mt-4">
                {[...Array(5)].map((_, j) => (
                  <span key={j} className="text-amber-400 text-sm">★</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
