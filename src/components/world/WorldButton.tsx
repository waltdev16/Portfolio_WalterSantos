"use client";

// Botón naranja de acceso a Walter's World (abre la transición de portal).

import { cn } from "@/lib/utils";
import { enterWorld, preloadWorld } from "./portal";
import { useT } from "@/i18n/t";

/**
 * The way into Walter's World, the creative area: warm garage-lamp orange,
 * the only orange on the site. Same height and type as the Projects button.
 * Clicking opens the portal transition (see portal.ts); modified clicks
 * (new tab, etc.) behave like a normal link.
 */
export function WorldButton({ size = "md", label = "Walter's World", className }: { size?: "sm" | "md" | "lg"; label?: string; className?: string }) {
  return (
    <a
      href="/world"
      className={cn("world-btn", `world-btn--${size}`, className)}
      onPointerEnter={preloadWorld}
      onFocus={preloadWorld}
      onTouchStart={preloadWorld}
      onClick={(e) => {
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        enterWorld(e.currentTarget);
      }}
    >
      <span className="world-btn__light" aria-hidden="true" />
      <span className="world-btn__spark" aria-hidden="true" />
      <span className="world-btn__label">{useT()(label)}</span>
      <svg className="world-btn__arrow" viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
        <path d="M5 12h14M12 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  );
}
