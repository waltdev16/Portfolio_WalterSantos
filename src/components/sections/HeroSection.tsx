"use client";

// Hero: nombre, rol, ubicación, mascotas, terreno de partículas y animaciones de entrada y de scroll.

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useTransform } from "motion/react";
import { profile } from "@/data/profile";
import { ParticleField } from "@/components/effects/ParticleField";
import { HeroTypography } from "@/components/hero/HeroTypography";
import { LocalTime } from "@/components/hero/LocalTime";
import { useHeroScroll } from "@/components/hero/HeroScrollTransition";
import { EASE } from "@/lib/motion";
import { whenHeroMayStart } from "@/components/intro/introState";
import { PetShelf } from "@/components/pixel-pets/PetShelf";
import { useT } from "@/i18n/t";

/** Timeline of the entrance, in seconds. */
const T = { name: 0.55, ui: 1.25 };

const statement =
  "Exploring the intersection of technology, engineering and creativity. Building digital experiences with curiosity, purpose and precision.";

export function HeroSection() {
  const t = useT();
  const section = useRef<HTMLElement>(null);
  const reduced = !!useReducedMotion();
  const scroll = useHeroScroll(section);
  const [go, setGo] = useState(false);
  const start = useCallback(() => setGo(true), []);

  // the dots start rising right away; the name follows them.
  // On the first visit the cinematic intro decides when that is.
  useEffect(() => {
    let t = 0;
    const off = whenHeroMayStart(() => {
      t = window.setTimeout(start, 80);
    });
    return () => {
      off();
      clearTimeout(t);
    };
  }, [start]);

  const glow = useTransform(scroll, [0, 0.8], [1, 0]);
  const uiOpacity = useTransform(scroll, [0, 0.35], [1, 0]);

  const fade = (d: number) => ({
    initial: reduced ? false : ({ opacity: 0, y: 10 } as const),
    animate: go || reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 },
    transition: { duration: 0.8, delay: reduced ? 0 : d, ease: EASE },
  });

  return (
    <section ref={section} id="top" aria-labelledby="hero-title" className="hero relative isolate h-[100svh] min-h-[600px] overflow-hidden bg-bg">
      {/* faint ambient light behind the field */}
      <motion.div aria-hidden="true" className="hero-ambient pointer-events-none absolute inset-0 -z-10" style={{ opacity: glow }} />

      <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0" style={{ opacity: glow }}>
        <ParticleField className="absolute inset-0 h-full w-full [mask-image:linear-gradient(to_right,transparent_0%,black_45%)] md:[mask-image:linear-gradient(to_right,transparent_10%,black_55%)]" />
      </motion.div>

      {/* context: "Currently" sits in the centre of the nav row on wide screens
          (the nav holds the logo and links); below that it stacks on the right */}
      <motion.div style={reduced ? undefined : { opacity: uiOpacity }} className="pointer-events-none absolute inset-x-0 top-0 z-[55] hidden sm:block">
        <motion.p {...fade(T.ui)} className="hero-meta absolute left-1/2 top-[1.85rem] hidden -translate-x-1/2 text-center min-[110rem]:grid">
          <span>{t("Currently")}</span>
          {t(profile.role)}
        </motion.p>
      </motion.div>
      <motion.div style={reduced ? undefined : { opacity: uiOpacity }} className="pointer-events-none absolute right-[3vw] top-[5.6rem] z-20 hidden gap-5 text-right sm:grid">
        <motion.p {...fade(T.ui)} className="hero-meta min-[110rem]:hidden">
          <span>{t("Currently")}</span>
          {t(profile.role)}
        </motion.p>
        <motion.p {...fade(T.ui + 0.1)} className="hero-meta">
          <span>{t("Based in")}</span>
          {profile.location}
          <em>
            <LocalTime />
          </em>
        </motion.p>
      </motion.div>

      <p className="hero-mobile-role absolute left-5 right-5 top-24 z-20 text-sm text-muted sm:hidden">{t(profile.role)}</p>

      {/* bottom: statement + call to action, then the name */}
      <div className="hero-content absolute inset-x-0 bottom-0 z-20 px-[3vw] pb-[2.2vw] max-sm:px-5 max-sm:pb-6">
        <motion.div style={reduced ? undefined : { opacity: uiOpacity }} className="mb-[1.2vw] flex items-end justify-between gap-8 max-sm:mb-4 max-sm:flex-col max-sm:items-center max-sm:gap-5">
          <div>
            {/* the pets' shelf, above the statement */}
            <motion.div {...fade(T.ui + 0.05)} className="mb-[1.4vw] max-sm:mb-0">
              <PetShelf />
            </motion.div>
            <motion.p {...fade(T.ui + 0.15)} className="hero-statement max-w-[30rem] max-sm:hidden">
              {t(statement)}
            </motion.p>
          </div>
          <motion.a {...fade(T.ui + 0.25)} href="#projects" className="hero-cta max-sm:mx-auto">
            {t("Explore my work")}
            <span className="hero-cta__icon" aria-hidden="true">
              <svg viewBox="0 0 16 16" width="14" height="14">
                <path d="M8 2.5v10M3.5 8.5 8 13l4.5-4.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </motion.a>
        </motion.div>
        <HeroTypography name={profile.name} role={t(profile.role)} play={go} delay={T.name} scroll={scroll} reduced={reduced} />
      </div>

      {/* hands the black over to the next section */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-[15] h-[16%] bg-gradient-to-t from-bg to-transparent" />
    </section>
  );
}
