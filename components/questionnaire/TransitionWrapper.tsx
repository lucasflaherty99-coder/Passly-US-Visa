"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";

const SLIDE_VARIANTS = {
  enter: (direction: "forward" | "backward") => ({
    x: direction === "forward" ? 60 : -60,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: "forward" | "backward") => ({
    x: direction === "forward" ? -60 : 60,
    opacity: 0,
  }),
};

interface TransitionWrapperProps {
  step: number;
  direction: "forward" | "backward";
  children: ReactNode;
}

export function TransitionWrapper({ step, direction, children }: TransitionWrapperProps) {
  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={step}
        custom={direction}
        variants={SLIDE_VARIANTS}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="flex-1 flex flex-col"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
