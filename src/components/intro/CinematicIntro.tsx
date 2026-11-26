"use client";

// Envuelve el portafolio y reproduce la intro cinematográfica la primera vez de cada sesión (y con "Repetir introducción").

import { useCallback, useEffect, useRef, useState } from "react";
import type { IntroHandle } from "./scene/runIntro";
import { HERO_EVENT, INTRO_KEY, REPLAY_EVENT } from "./introState";
import { SkipIntro } from "./IntroControls";
import { PortalReturn } from "@/components/world/PortalReturn";

/**
 * Wraps the portfolio and, when the boot script asked for it, plays the
 * cinematic intro over it: Hyperspeed → laptop → the live site on its screen →
 * into the site. The site itself is never replaced or copied; while the intro
 * runs, its wrapper is hidden and then projected onto the laptop's screen.
 */
export function CinematicIntro({ children }: { children: React.ReactNode }) {
  const site = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const handle = useRef<IntroHandle | null>(null);
  const [run, setRun] = useState(0); // increments for every play
  const [pageKey, setPageKey] = useState(0); // remounts the page on replay, so the hero animates again
  const [fading, setFading] = useState(false);

  // first visit: the boot script already set data-intro="play"
  useEffect(() => {
    // (after hydration, so the server and client trees match)
    if (document.documentElement.dataset.intro === "play") queueMicrotask(() => setRun(1));
    const replay = () => {
      window.scrollTo(0, 0);
      document.documentElement.dataset.intro = "play";
      setPageKey((k) => k + 1);
      // after a finished run `run` is negative: count up from its absolute value,
      // so every replay starts a new run (a negative or zero value would leave
      // the page hidden behind data-intro="play" with no intro to release it)
      setRun((r) => Math.abs(r) + 1);
    };
    window.addEventListener(REPLAY_EVENT, replay);
    return () => window.removeEventListener(REPLAY_EVENT, replay);
  }, []);

  const release = useCallback(() => {
    const root = document.documentElement;
    if (root.dataset.intro === "play") root.dataset.intro = "hero";
    window.dispatchEvent(new Event(HERO_EVENT));
  }, []);

  const done = useCallback(() => {
    // the page now sits exactly where it belongs; drop the stage
    delete document.documentElement.dataset.intro;
    // the page is scrollable again: let scroll-linked UI (reading progress) re-measure
    requestAnimationFrame(() => window.dispatchEvent(new Event("resize")));
    handle.current?.stop();
    handle.current = null;
    setFading(false);
    setRun((r) => -Math.abs(r));
  }, []);

  useEffect(() => {
    if (run <= 0 || !stage.current || !site.current) return;
    let cancelled = false;
    try {
      sessionStorage.setItem(INTRO_KEY, "1");
    } catch {
      /* private mode: the intro may simply play again */
    }
    // if anything goes wrong, the portfolio must still appear
    const safety = window.setTimeout(() => {
      release();
      done();
    }, 15000);
    import("./scene/runIntro")
      .then(({ runIntro }) => {
        if (cancelled || !stage.current || !site.current) return;
        handle.current = runIntro({
          container: stage.current,
          site: site.current,
          onHero: release,
          onDone: () => {
            window.clearTimeout(safety);
            done();
          },
        });
      })
      .catch((error) => {
        console.error("[intro] skipped:", error);
        window.clearTimeout(safety);
        release();
        done();
      });
    return () => {
      cancelled = true;
      window.clearTimeout(safety);
      handle.current?.stop();
      handle.current = null;
    };
  }, [run, release, done]);

  const skip = useCallback(() => {
    // reveal the real page underneath and fade the stage away
    handle.current?.skip();
    const s = site.current;
    if (s) {
      s.style.transform = "";
      s.style.opacity = "";
      s.style.visibility = "visible";
      s.style.zIndex = "";
    }
    setFading(true);
    release();
    window.setTimeout(() => {
      if (s) s.style.visibility = "";
      done();
    }, 450);
  }, [release, done]);

  const playing = run > 0;

  return (
    <>
      <div id="site" ref={site} key={pageKey} inert={playing}>
        {children}
      </div>
      <PortalReturn />
      {playing && (
        <>
          <div ref={stage} aria-hidden="true" className="intro-stage" data-fading={fading || undefined} />
          <SkipIntro onSkip={skip} visible={!fading} />
        </>
      )}
    </>
  );
}
