"use client";

// Etiqueta de una tecnología.

import { cn } from "@/lib/utils";
import { useT } from "@/i18n/t";

export function TechnologyBadge({ name, className }: { name: string; className?: string }) {
  name = useT()(name);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-line px-3 py-1 font-mono text-[12px] text-fg",
        className,
      )}
    >
      <span aria-hidden="true" className="size-1 rounded-full bg-accent" />
      {name}
    </span>
  );
}
