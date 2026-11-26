"use client";

// Tarjeta de un proyecto en la sección Projects (enlaza a su página de detalle).

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/types";
import { cn } from "@/lib/utils";
import { CornerMarks, MetaTag } from "@/components/effects/Blueprint";
import Image from "next/image";
import { ImageReveal } from "@/components/effects/Motion";
import { useLocalized, useT } from "@/i18n/t";

import { statusLabel, statusTone } from "./status";
export { statusLabel };

export function ProjectCard({ project: source, className, large = false }: { project: Project; className?: string; large?: boolean }) {
  const t = useT();
  const project = useLocalized(source);
  return (
    <article className={cn("group relative", className)}>
      <Link href={`/projects/${project.slug}`} className="block focus-visible:outline-offset-8" aria-label={`${project.title} — ${t("open project page")}`}>
        <ImageReveal>
        <div className="relative overflow-hidden border border-line bg-bg-2 transition-colors duration-500 group-hover:border-muted/60">
          <div className="relative aspect-[16/10]">
            {project.cover ? (
              <Image
                src={project.cover}
                alt={`${project.title} — ${t("project preview")}`}
                fill
                sizes={large ? "(min-width: 1024px) 58vw, 100vw" : "(min-width: 1024px) 34vw, 100vw"}
                className="object-cover transition-transform duration-700 ease-blueprint group-hover:scale-[1.03]"
              />
            ) : (
              <div className="hatch absolute inset-0 grid place-items-center">
                <div className="blueprint-grid absolute inset-0 opacity-60" aria-hidden="true" />
                <span
                  aria-hidden="true"
                  className="text-outline absolute -bottom-[0.12em] right-4 font-display text-[clamp(5rem,12vw,10rem)] font-bold leading-none tracking-[-0.06em] opacity-50"
                >
                  {project.index}
                </span>
                <p className="relative font-mono text-[11px] text-muted">{t("[ IMAGE COMING SOON ]")}</p>
              </div>
            )}
            {/* subtle shade so the frame marks stay visible on bright images */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10" />
          </div>
          {/* Blueprint frame: corner marks over the image */}
          <CornerMarks
            className="text-fog transition-all duration-500 group-hover:text-fluor [&>span]:m-3 group-hover:[&>span]:m-2"
            size={16}
          />
          <span className="absolute bottom-3 right-3 grid size-10 place-items-center rounded-full bg-fg text-bg opacity-0 transition-all duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 sm:translate-y-2 sm:group-hover:translate-y-0">
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </span>
        </div>
        </ImageReveal>

        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
          <MetaTag k="PROJECT INDEX —" v={project.index} />
          <MetaTag k="MODULE:" v={project.module} />
          <MetaTag k="STATUS:" v={statusLabel[project.status]} tone={statusTone(project.status)} />
        </div>

        <h3
          className={cn(
            "mt-4 font-display font-semibold leading-[0.98] tracking-[-0.035em] transition-colors group-hover:text-accent",
            large ? "text-[clamp(2rem,4.4vw,3.75rem)]" : "text-[clamp(1.75rem,3.2vw,2.75rem)]",
          )}
        >
          {project.title}
        </h3>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted">{project.summary}</p>
        <p className="mt-4 font-mono text-[11px] text-muted">
          {project.category}
          {project.period && <> / {project.period}</>}
        </p>
      </Link>
    </article>
  );
}
