"use client";

// Colección 02 — Proyectos independientes: archivo editorial.
// Lista vertical a la izquierda y vista previa dinámica a la derecha (en móvil,
// la vista previa aparece debajo del elemento seleccionado).
// Los datos salen de src/data/independent-projects.ts.

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { independentProjects } from "@/data/independent-projects";
import type { IndependentProject } from "@/types";
import { useLocalized, useT } from "@/i18n/t";
import { cn } from "@/lib/utils";
import { CornerMarks, MetaTag } from "@/components/effects/Blueprint";
import { Pending } from "@/components/ui/Pending";
import { CollectionHeader } from "./CollectionHeader";
import { statusLabel, statusTone } from "./status";

/** Portada o, si no hay imagen, un marco técnico discreto (nunca una imagen inventada). */
export function IndependentCover({ project, sizes }: { project: IndependentProject; sizes: string }) {
  const t = useT();
  return (
    <div className="relative w-full overflow-hidden border border-line bg-transparent">
      {project.cover ? (
        <Image src={project.cover} alt={project.name} width={1600} height={1000} sizes={sizes} quality={100} className="block h-auto w-full"/>
      ) : (
        <div className="blueprint-grid absolute inset-0 grid place-items-center" role="img" aria-label={`${project.name} — ${t("Image pending")}`}>
          {/* cruz de registro + datos mínimos del proyecto */}
          <span aria-hidden="true" className="absolute left-1/2 top-0 h-full w-px bg-line" />
          <span aria-hidden="true" className="absolute left-0 top-1/2 h-px w-full bg-line" />
          <span className="relative bg-bg-2 px-3 py-1.5 text-center font-mono text-[11px] leading-relaxed text-muted">
            <span className="block text-fg">{project.name}</span>
            {t("Image pending").toUpperCase()}
          </span>
          <span aria-hidden="true" className="absolute bottom-3 left-3 font-mono text-[10px] text-muted/80">
            IDX {project.index}
          </span>
          <span aria-hidden="true" className="absolute bottom-3 right-3 font-mono text-[10px] text-muted/80">
            16:10
          </span>
        </div>
      )}
      <CornerMarks size={9} />
    </div>
  );
}

function Preview({ project }: { project: IndependentProject }) {
  const t = useT();
  return (
    <motion.div
      key={project.slug}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <IndependentCover project={project} sizes="(max-width: 1024px) 100vw, 40vw" />
      <div className="mt-6 flex flex-wrap items-baseline justify-between gap-4">
        <h4 className="font-display min-w-0 text-[1.75rem] font-semibold leading-none tracking-[-0.02em] text-fg [overflow-wrap:anywhere]">{project.name}</h4>
        <MetaTag k="STATUS:" v={statusLabel[project.status]} tone={statusTone(project.status)} />
      </div>
      <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted">{project.summary}</p>
      <div className="mt-5">
        {project.technologies.length > 0 ? (
          <ul className="flex flex-wrap gap-1.5" aria-label={t("Technologies")}>
            {project.technologies.map((tech) => (
              <li key={tech} className="border border-line px-2 py-1 font-mono text-[11px] text-fg/80">
                {tech}
              </li>
            ))}
          </ul>
        ) : (
          <Pending inline>Technologies to be documented</Pending>
        )}
      </div>
      <Link
        href={`/projects/independent/${project.slug}`}
        className="group mt-6 inline-flex items-center gap-2 text-sm font-medium text-fg underline decoration-line underline-offset-[6px] transition-colors hover:text-accent hover:decoration-accent"
      >
        {t("View details")}
        <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true"/>
      </Link>
    </motion.div>
  );
}

export function IndependentProjects() {
  const list = useLocalized(independentProjects);
  // se guarda el slug (no el índice ni el texto): cambiar de idioma no pierde la selección
  const [selected, setSelected] = useState(list[0]?.slug ?? "");
  const current = list.find((p) => p.slug === selected) ?? list[0];
  if (!current) return null;

  return (
    <div id="independent-projects" className="scroll-mt-28">
      <CollectionHeader
        id="independent-projects-title"
        label="Independent Work"
        title="Independent Projects."
        lede="Independent work driven by curiosity, engineering and experimentation."
      />

      <div className="grid gap-10 lg:grid-cols-[11fr_9fr] lg:gap-14" role="region" aria-labelledby="independent-projects-title">
        {/* Lista */}
        <ul className="border-t border-line">
          {list.map((p) => {
            const active = p.slug === current.slug;
            return (
              <li key={p.slug} className="border-b border-line">
                <button
                  type="button"
                  aria-pressed={active}
                  aria-controls={`independent-preview independent-preview-${p.slug}`}
                  onClick={() => setSelected(p.slug)}
                  className="group grid w-full grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-x-4 py-6 text-left sm:grid-cols-[3rem_minmax(0,1fr)_auto] sm:py-7"
                >
                  <span className={cn("font-mono text-[12px] transition-colors", active ? "text-accent" : "text-muted")}>{p.index}</span>
                  <span className="min-w-0">
                    <span
                      className={cn(
                        "block font-display text-[clamp(1.6rem,3.4vw,2.6rem)] font-semibold leading-none tracking-[-0.03em] [overflow-wrap:anywhere] transition-colors duration-300",
                        active ? "text-accent" : "text-fg",
                      )}
                    >
                      {p.name}
                    </span>
                    <span className="mt-3 flex flex-wrap items-baseline gap-x-5 gap-y-1">
                      <span className="type-label">{p.category.toUpperCase()}</span>
                      {p.year && <span className="type-label">{p.year}</span>}
                      <MetaTag k="" v={statusLabel[p.status]} tone={statusTone(p.status)} />
                    </span>
                  </span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className={cn(
                      "size-5 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5",
                      active ? "text-accent" : "text-muted",
                    )}
                  />
                </button>

                {/* Móvil y tablet: vista previa debajo del elemento seleccionado */}
                <div id={`independent-preview-${p.slug}`} hidden={!active} className="pb-8 lg:hidden" aria-live="polite">
                  {active && <Preview project={p} />}
                </div>
              </li>
            );
          })}
        </ul>

        {/* Escritorio: vista previa fija con altura estable */}
        <div id="independent-preview" aria-live="polite" className="hidden lg:block">
          <div className="sticky top-28 min-h-[560px] short:static short:min-h-[480px]">
            <Preview project={current} />
          </div>
        </div>
      </div>
    </div>
  );
}
