"use client";

// Marcador visible para información que aún no existe (nunca se reemplaza con datos inventados).

import { cn } from "@/lib/utils";
import { useT } from "@/i18n/t";

/**
 * Clearly marked placeholder for information that hasn't been provided.
 * Never replace this with invented content — fill the data file instead.
 */
export function Pending({
  children = "Pending — to be added",
  className,
  inline = false,
}: {
  children?: React.ReactNode;
  className?: string;
  inline?: boolean;
}) {
  const t = useT();
  if (typeof children === "string") children = t(children);
  if (inline) {
    return (
      <span className={cn("inline-flex items-center gap-1.5 font-mono text-[11px] text-muted", className)}>
        <span aria-hidden="true" className="inline-block size-1.5 rotate-45 border border-current" />
        {children}
      </span>
    );
  }
  return (
    <div className={cn("hatch rounded-sm border border-dashed border-line px-4 py-3", className)}>
      <p className="font-mono text-[12px] text-muted">
        <span aria-hidden="true">[ ] </span>
        {children}
      </p>
    </div>
  );
}
