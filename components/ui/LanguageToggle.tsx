"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";

export function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function switchLocale(newLocale: string) {
    // Replace the locale segment in the pathname
    const segments = pathname.split("/");
    segments[1] = newLocale;
    const newPath = segments.join("/");
    router.push(newPath);
  }

  return (
    <div className="flex items-center gap-1 rounded-full bg-card border border-border p-1">
      {(["en", "es"] as const).map((loc) => (
        <motion.button
          key={loc}
          onClick={() => switchLocale(loc)}
          className={[
            "px-3 py-1 rounded-full text-sm font-medium transition-all",
            locale === loc
              ? "bg-primary text-white shadow-sm"
              : "text-muted hover:text-text",
          ].join(" ")}
          whileTap={{ scale: 0.95 }}
          aria-label={`Switch to ${loc === "en" ? "English" : "Español"}`}
          aria-pressed={locale === loc}
        >
          {loc === "en" ? "EN" : "ES"}
        </motion.button>
      ))}
    </div>
  );
}
