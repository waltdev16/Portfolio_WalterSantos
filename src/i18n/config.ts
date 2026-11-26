import { es } from "./locales/es";

// Configuración central de idiomas.
// El inglés es el idioma fuente: los textos se escriben en inglés en los
// componentes y en src/data, y cada diccionario traduce desde ese texto.
//
// Para agregar un idioma en el futuro:
//   1. crea src/i18n/locales/<código>.ts copiando la forma de es.ts;
//   2. agrégalo a LANGUAGES y a DICTIONARIES aquí abajo.
// El selector de idioma y el script de arranque lo toman de esta lista.

export const LANGUAGES = [
  { id: "en", label: "English" },
  { id: "es", label: "Español" },
] as const;

export type Lang = (typeof LANGUAGES)[number]["id"];

export const DEFAULT_LANG: Lang = "en";

/** Diccionarios por idioma (el inglés no necesita uno). */
export const DICTIONARIES: Partial<Record<Lang, Record<string, string>>> = { es };
