"use client";

// Lista de experiencias desplegables. Se genera a partir de src/data/experience.ts.

import Link from "next/link";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { ArrowRight, Plus } from "lucide-react";
import { useState } from "react";
import type { ExperienceItem } from "@/types";
import { cn } from "@/lib/utils";
import { DUR, EASE, STAGGER } from "@/lib/motion";
import { CornerMarks } from "@/components/effects/Blueprint";
import { TechnologyBadge } from "@/components/ui/TechnologyBadge";
import { Pending } from "@/components/ui/Pending";
import { ExperienceVisual } from "./ExperienceVisual";
import { useLocalized, useT } from "@/i18n/t";

const layoutTransition = { duration: DUR.base, ease: EASE };

function Detail({ item }: { item: ExperienceItem }) {
  const t = useT();
  const block = (i: number) => ({
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: DUR.base, ease: EASE, delay: 0.15 + i * STAGGER } },
    exit: { opacity: 0, transition: { duration: 0.15 } },
  });
  return (
    <div className="grid gap-8 pt-8 md:grid-cols-2 md:gap-10">
      <motion.p {...block(0)} className="text-[16px] leading-relaxed md:col-span-2 md:max-w-3xl">
        {item.description}
      </motion.p>

      <motion.div {...block(1)}>
        <h4 className="type-label mb-3">{t("RESPONSIBILITIES")}</h4>
        {item.responsibilities ? (
          <ul className="space-y-2.5 text-[14px] leading-relaxed">
            {item.responsibilities.map((r) => (
              <li key={r} className="grid grid-cols-[1.25rem_1fr]">
                <span aria-hidden="true" className="font-mono text-muted">—</span>
                {r}
              </li>
            ))}
          </ul>
        ) : (
          <Pending inline>Coming soon</Pending>
        )}
      </motion.div>

      <motion.div {...block(2)}>
        <h4 className="type-label mb-3">{t("VERIFIABLE RESULTS")}</h4>
        {item.outcomes ? (
          <ul className="space-y-2.5 text-[14px] leading-relaxed">
            {item.outcomes.map((r) => (
              <li key={r} className="grid grid-cols-[1.25rem_1fr]">
                <span aria-hidden="true" className="mt-[0.45em] size-1.5 rotate-45 border border-accent" />
                {r}
              </li>
            ))}
          </ul>
        ) : (
          <Pending>Results coming soon</Pending>
        )}
      </motion.div>

      {item.technologies && (
        <motion.div {...block(3)} className="md:col-span-2">
          <h4 className="type-label mb-3">{t("TECHNOLOGIES")}</h4>
          <ul className="flex flex-wrap gap-2">
            {item.technologies.map((t) => (
              <li key={t}>
                <TechnologyBadge name={t} />
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {item.link && (
        <motion.div {...block(4)} className="md:col-span-2">
          <Link
            href={item.link.href}
            className="group inline-flex items-center gap-2 text-sm text-fg underline decoration-line underline-offset-4 hover:text-accent hover:decoration-accent"
          >
            {item.link.label}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </motion.div>
      )}
    </div>
  );
}

/**
 * Selected Experiences: large modules in an asymmetric row.
 * Clicking a module opens it (it takes 8/12 columns, the others shrink).
 * On small screens the modules stack and behave as an accordion.
 * Everything is driven by real <button> elements — no hover-only content.
 */
export function ExperienceJourney({ items: source }: { items: ExperienceItem[] }) {
  const t = useT();
  const items = useLocalized(source);
  const [active, setActive] = useState<string | null>(items[0]?.id ?? null);

  return (
    <LayoutGroup>
      <div className="grid gap-4 lg:grid-cols-12 lg:items-start lg:gap-5">
        {items.map((item, i) => {
          const open = active === item.id;
          const span = active === null ? "lg:col-span-6" : open ? "lg:col-span-8" : "lg:col-span-4";
          const panelId = `exp-panel-${item.id}`;
          return (
            <motion.article
              layout
              transition={layoutTransition}
              key={item.id}
              className={cn(
                "group relative overflow-hidden border transition-colors duration-500",
                span,
                open ? "border-muted/50 bg-surface" : "border-line bg-bg-2 hover:border-muted/40",
              )}
            >
              <CornerMarks className={cn("transition-colors [&>span]:m-2", open ? "text-accent" : "text-muted/60")} size={10} />

              {/* Oversized index numeral */}
              <motion.span
                layout="position"
                aria-hidden="true"
                className="text-outline pointer-events-none absolute -right-2 -top-6 font-display text-[clamp(5rem,9vw,8.5rem)] font-bold leading-none tracking-[-0.06em] opacity-50"
              >
                {String(i + 1).padStart(2, "0")}
              </motion.span>

              <motion.div layout="position" className="relative p-6 sm:p-8 lg:p-10">
                <h3>
                  <button
                    type="button"
                    onClick={() => setActive(open ? null : item.id)}
                    aria-expanded={open}
                    aria-controls={panelId}
                    className="block w-full pr-16 text-left focus-visible:outline-offset-8 sm:pr-24"
                  >
                    <span className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px]">
                      <span className="text-fg">{item.ref}</span>
                      <span className="rounded-full border border-line px-2 py-0.5 text-muted">{item.category}</span>
                      <span className="text-muted">{item.period ?? t("Period to be confirmed")}</span>
                    </span>
                    <span className="mt-8 block max-w-[22ch] font-display text-[clamp(1.75rem,3.2vw,3rem)] font-semibold leading-[0.98] tracking-[-0.035em]">
                      {item.name}
                    </span>
                    <span className="mt-3 flex items-center justify-between gap-4">
                      <span className="text-sm text-accent">{item.context}</span>
                      <span
                        aria-hidden="true"
                        className={cn(
                          "grid size-9 shrink-0 place-items-center rounded-full border transition-all duration-500",
                          open ? "rotate-45 border-fg bg-fg text-bg" : "border-line text-fg group-hover:border-fg",
                        )}
                      >
                        <Plus className="size-4" />
                      </span>
                    </span>
                    <span className="sr-only">{t(open ? "Collapse details" : "Show details")}</span>
                  </button>
                </h3>

                {/* image of the experience (or its Blueprint drawing) */}
                <div className={cn("mt-8 border-t border-line pt-6 transition-opacity duration-500", open ? "opacity-100" : "opacity-60")}>
                  <div className="max-w-[34rem]">
                    <ExperienceVisual image={item.image?.src} alt={item.image?.alt} />
                  </div>
                </div>

                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      id={panelId}
                      key="panel"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={layoutTransition}
                      className="overflow-hidden"
                    >
                      <motion.span
                        aria-hidden="true"
                        className="mt-8 block h-px origin-left bg-line"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: DUR.slow, ease: EASE, delay: 0.1 }}
                      />
                      <Detail item={item} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.article>
          );
        })}
      </div>
    </LayoutGroup>
  );
}
