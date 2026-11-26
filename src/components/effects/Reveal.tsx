"use client";

// Envoltorio que hace aparecer su contenido cuando entra en pantalla.

import { motion } from "motion/react";
import { DUR, EASE, VIEWPORT } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Progressive reveal on scroll. Opacity + a short translate, once.
 * Reduced motion is handled globally by MotionConfig.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li" | "article" | "section";
}) {
  const Comp = motion[as];
  return (
    <Comp
      className={cn(className)}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: DUR.base + 0.1, delay, ease: EASE }}
    >
      {children}
    </Comp>
  );
}
