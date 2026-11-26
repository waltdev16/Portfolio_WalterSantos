"use client";

// Animaciones reutilizables con Motion: título que aparece palabra por palabra, líneas que se dibujan, entradas escalonadas.

import { motion, useReducedMotion } from "motion/react";
import { DUR, EASE, STAGGER, VIEWPORT } from "@/lib/motion";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────
   TextReveal — words rise out of a mask, line by line.
   Accepts a string or an array of lines.
   ───────────────────────────────────────────────────────── */
export function TextReveal({
  text,
  className,
  delay = 0,
  as = "span",
  immediate = false,
  id,
}: {
  id?: string;
  text: string | string[];
  className?: string;
  delay?: number;
  as?: "span" | "h1" | "h2" | "h3" | "p";
  /** animate on mount instead of on scroll */
  immediate?: boolean;
}) {
  const lines = Array.isArray(text) ? text : [text];
  const Tag = as;
  let index = 0;
  const trigger = immediate
    ? { animate: "show" as const }
    : { whileInView: "show" as const, viewport: VIEWPORT };

  return (
    <Tag id={id} className={className}>
      <span className="sr-only">{lines.join(" ")}</span>
      <motion.span aria-hidden="true" initial="hidden" {...trigger} className="block">
        {lines.map((line, li) => (
          <span key={li} className="block">
            {line.split(" ").map((word, wi) => {
              const i = index++;
              return (
                <span key={wi} className="inline-block overflow-hidden pb-[0.08em] align-bottom -mb-[0.08em]">
                  <motion.span
                    className="inline-block"
                    variants={{
                      hidden: { y: "110%" },
                      show: { y: "0%", transition: { duration: DUR.slow, ease: EASE, delay: delay + i * STAGGER } },
                    }}
                  >
                    {word}
                  </motion.span>
                  {wi < line.split(" ").length - 1 && " "}
                </span>
              );
            })}
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}

/* ─────────────────────────────────────────────────────────
   ImageReveal — a clip-path wipe for frames and pictures.
   ───────────────────────────────────────────────────────── */
export function ImageReveal({
  children,
  className,
  delay = 0,
  direction = "up",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left";
}) {
  const reduced = useReducedMotion();
  const from = direction === "up" ? "inset(100% 0% 0% 0%)" : "inset(0% 100% 0% 0%)";
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { clipPath: from }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={VIEWPORT}
      transition={{ duration: DUR.slow, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   DrawLine — a Blueprint rule that draws itself.
   ───────────────────────────────────────────────────────── */
export function DrawLine({
  className,
  delay = 0,
  vertical = false,
}: {
  className?: string;
  delay?: number;
  vertical?: boolean;
}) {
  return (
    <motion.span
      aria-hidden="true"
      className={cn("block bg-line", vertical ? "w-px origin-top" : "h-px origin-left", className)}
      initial={vertical ? { scaleY: 0 } : { scaleX: 0 }}
      whileInView={vertical ? { scaleY: 1 } : { scaleX: 1 }}
      viewport={VIEWPORT}
      transition={{ duration: DUR.slow, ease: EASE, delay }}
    />
  );
}

/* ─────────────────────────────────────────────────────────
   Stagger — children appear one after another.
   ───────────────────────────────────────────────────────── */
export function Stagger({
  children,
  className,
  delay = 0,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "ul" | "ol" | "dl";
}) {
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      variants={{ show: { transition: { staggerChildren: STAGGER * 1.5, delayChildren: delay } } }}
    >
      {children}
    </Comp>
  );
}

export function StaggerItem({
  children,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "li" | "span";
}) {
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      variants={{
        hidden: { opacity: 0, y: 12 },
        show: { opacity: 1, y: 0, transition: { duration: DUR.base, ease: EASE } },
      }}
    >
      {children}
    </Comp>
  );
}
