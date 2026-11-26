// Constantes del idioma que también usa el script inline del <head>.
// Este archivo no es "use client" para que layout.tsx (servidor) pueda importarlo.

import { LANGUAGES } from "./config";

/** Clave compartida con Walter's World (mismo dominio, misma preferencia). */
export const LANG_KEY = "world-language";

const CODES = JSON.stringify(LANGUAGES.map((l) => l.id));

/** Se ejecuta antes del primer pintado: aplica a <html> el idioma guardado. */
export const LANG_BOOT = `(function(){try{var c=${CODES};var s=localStorage.getItem("${LANG_KEY}");var l=c.indexOf(s)>=0?s:"en";var d=document.documentElement;d.lang=l;d.dataset.lang=l;}catch(e){}})();`;
