"use client";

// El nombre monumental del Hero: entrada palabra por palabra y desvanecimiento al bajar.

import { motion, type MotionValue, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

const REVEAL = [0.76, 0, 0.24, 1] as const;
// only compositor-friendly properties (no letter-spacing: it would re-layout the huge title every frame)
const HIDDEN = { y: "108%", rotate: 3, scaleX: 1.04, opacity: 0, filter: "blur(12px)" };
const SHOWN = { y: "0%", rotate: 0, scaleX: 1, opacity: 1, filter: "blur(0px)" };

function Word({ children, play, delay, reduced }: { children: string; play: boolean; delay: number; reduced: boolean }) {
  return (
    // the mask: each word rises from below its own baseline
    <span className="inline-block overflow-hidden pb-[0.12em] pr-[0.08em] -mb-[0.12em] align-bottom">
      <motion.span
        className="inline-block"
        // rises from its baseline and comes into focus
        initial={reduced ? false : HIDDEN}
        animate={play || reduced ? SHOWN : HIDDEN}
        transition={{ duration: reduced ? 0 : 1.35, delay: reduced ? 0 : delay, ease: REVEAL }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/**
 * The monumental name. One line at ~90% of the width on larger screens,
 * two lines on phones. Loses presence as the hero scrolls away.
 */
export function HeroTypography({ name, role, play, delay, scroll, reduced, className }: { name: string; role: string; play: boolean; delay: number; scroll: MotionValue<number>; reduced: boolean; className?: string }) {
  const [first, ...rest] = name.split(" ");
  const opacity = useTransform(scroll, [0, 0.55], [1, 0.12]);
  const y = useTransform(scroll, [0, 1], ["0%", "-18%"]);
  const blur = useTransform(scroll, [0, 0.6], ["blur(0px)", "blur(6px)"]);

  return (
    <motion.h1 id="hero-title" className={cn("hero-name", className)} style={reduced ? undefined : { opacity, y, filter: blur }}>
      <Word play={play} delay={delay} reduced={reduced}>
        {first}
      </Word>
      <span className="hero-name__gap" aria-hidden="true">
        {" "}
      </span>
      <Word play={play} delay={delay + 0.16} reduced={reduced}>
        {rest.join(" ")}
      </Word>
      <span className="sr-only">, {role}</span>
    </motion.h1>
  );
}
