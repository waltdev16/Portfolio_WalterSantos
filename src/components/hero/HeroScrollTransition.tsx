"use client";

// Progreso de scroll del Hero (0 → 1) que usan sus animaciones al bajar.

import { type RefObject } from "react";
import { useScroll, useSpring } from "motion/react";

/**
 * Progress of the hero leaving the screen (0 at the top, 1 when it is gone).
 * Read-only: it never takes over the scroll.
 */
export function useHeroScroll(ref: RefObject<HTMLElement | null>) {
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  return useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });
}
