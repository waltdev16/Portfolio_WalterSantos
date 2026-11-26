"use client";

// Hace que todas las animaciones de Motion respeten la preferencia de movimiento reducido.

import { MotionConfig } from "motion/react";

/** Every Motion animation respects the OS "reduce motion" setting. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
