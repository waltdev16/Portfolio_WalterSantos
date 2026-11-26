"use client";

// Al volver de Walter's World: restaura el scroll y cierra el portal sobre el botón World.

import { useEffect } from "react";
import { isReturning, playReturn, resetAfterBfcache } from "./portal";

/** Plays the way back from Walter's World, and cleans up after the back/forward cache. */
export function PortalReturn() {
  useEffect(() => {
    if (isReturning()) playReturn();
    else delete document.documentElement.dataset.portal;
    const onShow = (e: PageTransitionEvent) => {
      if (e.persisted) resetAfterBfcache();
    };
    window.addEventListener("pageshow", onShow);
    return () => window.removeEventListener("pageshow", onShow);
  }, []);
  return null;
}
