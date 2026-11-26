"use client";

// Idioma actual del visitante: lectura, cambio y suscripción (compartido con Walter's World).

import { useSyncExternalStore } from "react";

/**
 * The visitor's language, shared with Walter's World: both sites live on the
 * same origin and read/write the same key, so switching in one is kept in
 * the other. Only English and Spanish.
 */
import { LANG_KEY } from "./boot";
import { DEFAULT_LANG, LANGUAGES, type Lang } from "./config";

export type { Lang };
const EVENT = "ws:lang";
// Respaldo en memoria cuando el navegador no permite guardar preferencias.
let memoryLang: Lang = DEFAULT_LANG;

// Lee el idioma guardado; si no hay uno válido, usa el predeterminado.
export function readLang(): Lang {
  try {
    const stored = localStorage.getItem(LANG_KEY);
    return LANGUAGES.find((l) => l.id === stored)?.id ?? DEFAULT_LANG;
  } catch {
    return memoryLang;
  }
}

// Actualiza el idioma de toda la aplicación (y lo guarda para Walter's World).
export function setLang(lang: Lang) {
  memoryLang = lang;
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch {
    /* still switches for this page */
  }
  document.documentElement.lang = lang;
  document.documentElement.dataset.lang = lang;
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(cb: () => void) {
  const onStorage = (e: StorageEvent) => e.key === LANG_KEY && cb();
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", onStorage);
  };
}

/** The current language. Renders English on the server, then the stored choice. */
export function useLang(): Lang {
  return useSyncExternalStore(subscribe, readLang, () => DEFAULT_LANG);
}
