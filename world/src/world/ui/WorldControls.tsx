import { useEffect, useRef, useState } from "react";
import type { ProjectLanguage } from "../../data/projects";

/* Icons: Lucide (ISC licence) — arrow-left, globe, chevron-down, check */
const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </svg>
);
const Globe = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
    <path d="M2 12h20" />
  </svg>
);
const Chevron = () => (
  <svg className="wctl-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m6 9 6 6 6-6" />
  </svg>
);
const Check = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const LANGS = [
  { id: "en", label: "English" },
  { id: "es", label: "Español" },
] as const;

/**
 * Global controls of the garage: back to the portfolio (top left) and the
 * language selector (top right). Same capsule language as the portfolio's
 * navigation: dark glass, a fine metallic border, a warm orange light on hover.
 * Shown only on the main garage view; experiences bring their own controls.
 */
export function WorldControls({ lang, onLanguage, onBack }: { lang: ProjectLanguage; onLanguage: (lang: ProjectLanguage) => void; onBack: () => void }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const es = lang === "es";
  const backLabel = es ? "Volver al portafolio" : "Back to Portfolio";

  useEffect(() => {
    if (!open) return;
    const outside = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setOpen(false);
        trigger.current?.focus();
      }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape, true);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape, true);
    };
  }, [open]);

  return (
    <>
      <button className="wctl-btn world-back" type="button" onClick={onBack} aria-label={backLabel} data-tip={backLabel}>
        <Arrow />
      </button>
      <div ref={root} className="world-language" data-open={open || undefined}>
        <button
          ref={trigger}
          className="wctl-btn wctl-lang"
          type="button"
          aria-expanded={open}
          aria-controls="world-language-options"
          aria-label={es ? "Cambiar idioma" : "Change language"}
          onClick={() => setOpen((v) => !v)}
        >
          <Globe />
          <span className="wctl-code">{lang.toUpperCase()}</span>
          <Chevron />
        </button>
        <div id="world-language-options" className="wctl-menu" role="group" aria-label={es ? "Idiomas" : "Languages"} inert={!open}>
          {LANGS.map((l) => (
            <button
              type="button"
              key={l.id}
              lang={l.id}
              aria-pressed={l.id === lang}
              onClick={() => {
                onLanguage(l.id);
                setOpen(false);
                trigger.current?.focus();
              }}
            >
              <span>{l.label}</span>
              <span className="wctl-tick">{l.id === lang && <Check />}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
