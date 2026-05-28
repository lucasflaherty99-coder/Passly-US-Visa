"use client";

import { motion } from "framer-motion";

interface OptionButtonProps {
  value: string;
  label: string;
  description?: string;
  selected?: boolean;
  onClick: (value: string) => void;
  multiSelect?: boolean;
  emoji?: string;
  disabled?: boolean;
}

export function OptionButton({
  value,
  label,
  description,
  selected = false,
  onClick,
  multiSelect = false,
  emoji,
  disabled = false,
}: OptionButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={() => !disabled && onClick(value)}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.01, y: -1 } : {}}
      whileTap={!disabled ? { scale: 0.99 } : {}}
      className={[
        "w-full text-left rounded-xl border-2 p-4 transition-all duration-150",
        "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        "min-h-[56px]",
        selected
          ? "border-primary bg-primary/5 shadow-sm"
          : "border-border bg-white hover:border-primary/40 hover:shadow-sm",
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
      ].join(" ")}
      aria-pressed={selected}
    >
      <div className="flex items-start gap-3">
        <div
          className={[
            "shrink-0 mt-0.5",
            multiSelect
              ? "w-5 h-5 rounded border-2 flex items-center justify-center"
              : "w-5 h-5 rounded-full border-2 flex items-center justify-center",
            selected ? "border-primary bg-primary" : "border-border bg-white",
          ].join(" ")}
        >
          {selected && (
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {emoji && <span className="text-lg">{emoji}</span>}
            <span className={[
              "font-medium leading-snug",
              selected ? "text-navy" : "text-text",
            ].join(" ")}>
              {label}
            </span>
          </div>
          {description && (
            <p className="mt-0.5 text-sm text-muted leading-snug">{description}</p>
          )}
        </div>
      </div>
    </motion.button>
  );
}
