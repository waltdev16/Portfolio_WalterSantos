"use client";

// Encabezado común de las secciones: código, etiqueta, título y bajada (ya traducidos).

import { cn } from "@/lib/utils";
import { Reveal } from "@/components/effects/Reveal";
import { DrawLine, TextReveal } from "@/components/effects/Motion";
import { sections } from "@/data/navigation";
import { useT } from "@/i18n/t";

/**
 * Section header: a self-drawing Blueprint rule with the section index,
 * a large display title revealed word by word, and an optional lede.
 *
 * layout:
 *  - "split"   title left, lede in the right column (default)
 *  - "stacked" title, then lede underneath — for narrower compositions
 */
export function SectionHeading({
  code,
  label,
  title,
  lede,
  id,
  className,
  layout = "split",
}: {
  code: string;
  label: string;
  title: string | string[];
  lede?: React.ReactNode;
  id?: string;
  className?: string;
  layout?: "split" | "stacked";
}) {
  const t = useT();
  // "PROJECT INDEX — 05": translate the words, keep the number
  label = label.replace(/^(.*?)( — \d+)?$/, (_, words: string, n = "") => t(words) + n);
  // multi-line titles translate as a whole (word order changes between languages)
  title = Array.isArray(title) ? t(title.join("\n")).split("\n") : t(title);
  if (typeof lede === "string") lede = t(lede);
  const total = String(sections.length + 1).padStart(3, "0");
  return (
    <header className={cn("mb-14 sm:mb-20 short:mb-12", className)}>
      <div className="relative mb-8 pt-3">
        <DrawLine className="absolute inset-x-0 top-0" />
        {/* registration cross at the start of the rule */}
        <span aria-hidden="true" className="absolute -left-[5px] -top-[5px] block size-[11px]">
          <span className="absolute left-1/2 top-0 h-full w-px bg-fg" />
          <span className="absolute left-0 top-1/2 h-px w-full bg-fg" />
        </span>
        <Reveal className="flex items-center gap-4" delay={0.15}>
          <span className="type-label text-fg">SYS / {code}</span>
          <span className="type-label">{label}</span>
          <span aria-hidden="true" className="type-label ml-auto hidden sm:inline">
            {code} / {total}
          </span>
        </Reveal>
      </div>
      <div className={cn("grid gap-8", layout === "split" && "lg:grid-cols-12 lg:items-end")}>
        <TextReveal
          key={JSON.stringify(title)}
          id={id}
          as="h2"
          text={title}
          className={cn("type-section text-balance", layout === "split" && "lg:col-span-7")}
        />
        {lede && (
          <Reveal
            delay={0.2}
            className={cn(
              "max-w-md text-[15px] leading-relaxed text-muted",
              layout === "split" && "lg:col-span-4 lg:col-start-9",
            )}
          >
            {lede}
          </Reveal>
        )}
      </div>
    </header>
  );
}
