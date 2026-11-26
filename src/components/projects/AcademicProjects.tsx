"use client";

// Colección 01 — Proyectos académicos: carrusel con profundidad a la derecha y
// panel con la información del proyecto activo a la izquierda (en móvil, debajo).
// Los datos salen de src/data/projects.ts; la configuración del carrusel está en CONFIG.

import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Pause, Play } from "lucide-react";
import { projects } from "@/data/projects";
import type { Project } from "@/types";
import { useLocalized, useT } from "@/i18n/t";
import { CornerMarks, MetaTag } from "@/components/effects/Blueprint";
import { DepthCarousel } from "./DepthCarousel";
import { CollectionHeader } from "./CollectionHeader";
import { statusLabel, statusTone } from "./status";

// Configuración del carrusel: escritorio y móvil (en móvil todo se reduce)
const CONFIG = {
  desktop: { cardWidth: 480, cardHeight: 300, depth: 220, spread: 110, tilt: 22, perspective: 1400, visibleCards: 4, blur: 6 },
  mobile: { cardWidth: 300, cardHeight: 188, depth: 130, spread: 36, tilt: 16, perspective: 1000, visibleCards: 3, blur: 4 },
} as const;

// Pantalla pequeña (sin error de hidratación: en el servidor se asume escritorio)
const MQ = "(max-width: 639px)";
function useSmallScreen() {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(MQ);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia(MQ).matches,
    () => false,
  );
}

const pad = (n: number) => String(n).padStart(2, "0");

export function AcademicProjects() {
  const t = useT();
  const router = useRouter();
  const list = useLocalized(projects);
  const small = useSmallScreen();
  const cfg = small ? CONFIG.mobile : CONFIG.desktop;

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  // con autoplay activo el panel no se anuncia en cada cambio (evita ruido en lectores de pantalla)
  const live = paused || reduced ? "polite" : "off";
  const project = list[active] ?? list[0];

  const open = useCallback((_: number, p: Project) => router.push(`/projects/${p.slug}`), [router]);
  const onChange = useCallback((i: number) => setActive(i), []);
  const onInteract = useCallback(() => setPaused(true), []);

  const labels = useMemo(
    () => ({
      carousel: t("Machine Learning & Portfolio"),
      previous: t("Previous project"),
      next: t("Next project"),
      slides: t("Choose a project"),
      slide: t("Project {n} of {total}"),
      goTo: t("Go to project {n}"),
    }),
    [t],
  );

  return (
    <div>
      <CollectionHeader
        id="academic-projects-title"
        label="Collection 01"
        title="Machine Learning & Portfolio"
        lede="Applied machine learning, data analysis and web development projects."
      />

      <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-10" aria-labelledby="academic-projects-title" role="region">
        {/* Carrusel (primero en móvil) */}
        <div className="order-1 min-w-0 lg:order-2 lg:col-span-7">
          <p className="mb-2 text-center text-xs text-muted">{t("Use the arrows or drag to choose a project. Open it with View project.")}</p>
          <div className="relative h-[290px] sm:h-[400px] lg:h-[440px] short:lg:h-[380px] shorter:lg:h-[340px]">
            <DepthCarousel
              items={list}
              getKey={(p) => p.slug}
              {...cfg}
              radius={4}
              tiltDirection="right"
              falloff={0.2}
              duration={700}
              ease="power3.out"
              autoplay
              autoplayDelay={4500}
              paused={paused}
              loop
              showControls
              showIndicators
              labels={labels}
              onChange={onChange}
              onActivate={open}
              onInteract={onInteract}
              renderCard={(p) => (
                <div className="relative size-full">
                  {p.cover ? (
                    <Image
                      src={p.cover}
                      alt={p.title}
                      fill
                      draggable={false}
                      sizes="(max-width: 640px) 300px, 480px"
                      className="pointer-events-none object-cover"
                    />
                  ) : (
                    <div className="hatch size-full" />
                  )}
                  <CornerMarks className="text-muted/60" size={9} />
                </div>
              )}
            />
          </div>
        </div>

        {/* Información del proyecto activo */}
        <div className="order-2 lg:order-1 lg:col-span-5">
          <div className="relative min-h-[340px] short:min-h-[300px] border-l border-line pl-5 sm:pl-7">
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              aria-live={live}
            >
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-[13px] text-accent">{project.index}</span>
                <span className="type-label">{project.category.toUpperCase()}</span>
              </div>
              <h4 className="mt-4 font-display text-[clamp(1.6rem,3vw,2.4rem)] font-semibold leading-[1.02] tracking-[-0.025em] text-fg">
                {project.title}
              </h4>
              <p className="mt-4 line-clamp-4 max-w-lg text-[15px] leading-relaxed text-muted">{project.summary}</p>

              {project.technologies && project.technologies.length > 0 && (
                <ul className="mt-5 flex flex-wrap gap-1.5" aria-label={t("Technologies")}>
                  {project.technologies.slice(0, 5).map((tech) => (
                    <li key={tech} className="border border-line px-2 py-1 font-mono text-[11px] text-fg/80">
                      {tech}
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-5">
                <MetaTag k="STATUS:" v={statusLabel[project.status]} tone={statusTone(project.status)} />
              </div>
            </motion.div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Link
                href={`/projects/${project.slug}`}
                className="group inline-flex h-11 items-center gap-2 rounded-full border border-line px-5 text-sm font-medium text-fg transition-colors hover:border-accent hover:text-accent"
              >
                {t("View project")}
                <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
              <span className="font-mono text-[12px] text-muted" aria-hidden="true">
                <span className="text-fg">{pad(active + 1)}</span> / {pad(list.length)}
              </span>
              {!reduced && (
              <button
                type="button"
                onClick={() => setPaused((p) => !p)}
                aria-pressed={paused}
                className="inline-flex items-center gap-2 font-mono text-[11px] text-muted transition-colors hover:text-fg"
              >
                {paused ? <Play className="size-3.5" aria-hidden="true" /> : <Pause className="size-3.5" aria-hidden="true" />}
                {paused ? t("Resume autoplay") : t("Pause autoplay")}
              </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
