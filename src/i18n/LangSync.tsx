"use client";

// Mantiene <html lang> al día y evita que la página se vea en inglés antes de cambiar a español.

import { useEffect } from "react";
import { readLang, useLang } from "./lang";

/**
 * Keeps <html lang> in sync and lifts the "waiting for the language" state:
 * when the stored language is Spanish, the page stays hidden for the
 * instant between hydration (English) and the switch, so it never flashes.
 */
export function LangSync() {
  const lang = useLang();
  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dataset.lang = lang;
    // ready once the rendered language is the stored one (not the hydration pass)
    if (lang === readLang()) root.dataset.langReady = "";
  }, [lang]);
  return null;
}
