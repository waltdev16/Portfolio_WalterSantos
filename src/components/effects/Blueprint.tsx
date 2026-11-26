"use client";

// Piezas del lenguaje visual Blueprint: cuadrícula de fondo, marcas de esquina y etiquetas clave/valor.

import { cn } from "@/lib/utils";
import { useT } from "@/i18n/t";

/** Technical grid surface, faded at the edges so it never competes with content. */
export function BlueprintGrid({
  className,
  fade = "radial",
}: {
  className?: string;
  fade?: "radial" | "top" | "bottom" | "none";
}) {
  const mask = {
    radial: "radial-gradient(ellipse 80% 70% at 50% 40%, black 30%, transparent 100%)",
    top: "linear-gradient(to bottom, black, transparent 85%)",
    bottom: "linear-gradient(to top, black, transparent 85%)",
    none: "none",
  }[fade];
  return (
    <div
      aria-hidden="true"
      className={cn("blueprint-grid pointer-events-none absolute inset-0", className)}
      style={{ maskImage: mask, WebkitMaskImage: mask }}
    />
  );
}

/** Four L-shaped registration marks at the corners of the parent (must be relative). */
export function CornerMarks({ className, size = 10 }: { className?: string; size?: number }) {
  const base = "pointer-events-none absolute border-current transition-all duration-500 ease-blueprint";
  const s = { width: size, height: size };
  return (
    <span aria-hidden="true" className={cn("text-muted/70", className)}>
      <span className={cn(base, "left-0 top-0 border-l border-t")} style={s} />
      <span className={cn(base, "right-0 top-0 border-r border-t")} style={s} />
      <span className={cn(base, "bottom-0 left-0 border-b border-l")} style={s} />
      <span className={cn(base, "bottom-0 right-0 border-b border-r")} style={s} />
    </span>
  );
}

/** Small monospace tag: "STATUS: DEPLOYED" style metadata. */
export function MetaTag({
  k,
  v,
  className,
  tone = "default",
}: {
  k: string;
  v: string;
  className?: string;
  tone?: "default" | "accent" | "pending";
}) {
  const t = useT();
  k = t(k);
  v = t(v);
  return (
    <span className={cn("inline-flex items-baseline gap-1.5 font-mono text-[11px] leading-none", className)}>
      {k && <span className="text-muted">{k}</span>}
      <span
        className={cn(
          tone === "accent" && "text-accent",
          tone === "pending" && "text-muted",
          tone === "default" && "text-fg",
        )}
      >
        {v}
      </span>
    </span>
  );
}
