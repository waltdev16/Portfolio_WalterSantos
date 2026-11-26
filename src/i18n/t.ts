"use client";

// Funciones de traducción: translate, useT (textos) y useLocalized (objetos de datos completos).

import { useMemo } from "react";
import { DICTIONARIES } from "./config";
import { useLang, type Lang } from "./lang";

/** English text in, the visitor's language out (English is the source). */
export function translate(text: string, lang: Lang): string {
  if (!text) return text;
  return DICTIONARIES[lang]?.[text] ?? text;
}

export function useT() {
  const lang = useLang();
  return useMemo(() => (text: string) => translate(text, lang), [lang]);
}

/** Deep copy of a data object with every string translated (keys and URLs untouched). */
function localize<T>(value: T, lang: Lang): T {
  const dict = DICTIONARIES[lang];
  if (!dict) return value;
  const walk = (v: unknown): unknown => {
    if (typeof v === "string") return dict[v] ?? v;
    if (Array.isArray(v)) return v.map(walk);
    if (v && typeof v === "object") {
      const out: Record<string, unknown> = {};
      for (const [k, x] of Object.entries(v)) out[k] = walk(x);
      return out;
    }
    return v;
  };
  return walk(value) as T;
}

export function useLocalized<T>(value: T): T {
  const lang = useLang();
  return useMemo(() => localize(value, lang), [value, lang]);
}
