"use client";

// Selector de idioma (EN / ES) de la barra y del menú móvil.

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Globe } from "lucide-react";
import { setLang, useLang } from "@/i18n/lang";
import { LANGUAGES } from "@/i18n/config";
import { cn } from "@/lib/utils";

/**
 * EN / ES selector. Same preference as Walter's World (shared key), so the
 * choice follows the visitor across both. Two looks:
 *  - "menu": a compact globe pill with a small dropdown (the navbar)
 *  - "segmented": two inline buttons (the mobile menu)
 */
export function LanguageSwitch({ variant = "menu", className }: { variant?: "menu" | "segmented"; className?: string }) {
  const lang = useLang();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const es = lang === "es";

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

  if (variant === "segmented") {
    return (
      <div role="group" aria-label={es ? "Idioma" : "Language"} className={cn("inline-flex rounded-full border border-[#293241] p-1", className)}>
        {LANGUAGES.map((l) => (
          <button
            key={l.id}
            type="button"
            lang={l.id}
            aria-pressed={l.id === lang}
            onClick={() => setLang(l.id)}
            className={cn(
              "h-8 rounded-full px-4 font-mono text-[12px] transition-colors",
              l.id === lang ? "bg-fog text-[#080b10]" : "text-[#9099a8] hover:text-fog",
            )}
          >
            {l.id.toUpperCase()}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div ref={root} className={cn("lang-switch relative", className)} data-open={open || undefined}>
      <button
        ref={trigger}
        type="button"
        aria-expanded={open}
        aria-controls="lang-options"
        aria-label={es ? "Cambiar idioma" : "Change language"}
        onClick={() => setOpen((v) => !v)}
        className="lang-switch__btn"
      >
        <Globe className="size-[15px]" aria-hidden="true" />
        <span className="font-mono text-[11px] tracking-[0.06em]">{lang.toUpperCase()}</span>
        <ChevronDown className="lang-switch__chevron size-3" aria-hidden="true" />
      </button>
      <div id="lang-options" role="group" aria-label={es ? "Idiomas" : "Languages"} className="lang-switch__menu" inert={!open}>
        {LANGUAGES.map((l) => (
          <button
            key={l.id}
            type="button"
            lang={l.id}
            aria-pressed={l.id === lang}
            onClick={() => {
              setLang(l.id);
              setOpen(false);
              trigger.current?.focus();
            }}
          >
            <span>{l.label}</span>
            <span className="lang-switch__tick">{l.id === lang && <Check className="size-4" aria-hidden="true" />}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
