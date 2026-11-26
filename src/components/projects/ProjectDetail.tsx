"use client";

// Página completa de un proyecto: ficha, metodología, resultados, evidencias y archivos.

import { ProjectGlossary } from "./ProjectGlossary";
import { RegressionPredictor } from "./RegressionPredictor";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChartNoAxesColumn,
  Database,
  ExternalLink,
  FileCode2,
  Layers,
  SquareFunction,
} from "lucide-react";
import type { Project } from "@/types";
import { projects as projectsEn } from "@/data/projects";
import { BlueprintGrid, CornerMarks, MetaTag } from "@/components/effects/Blueprint";
import { Reveal } from "@/components/effects/Reveal";
import { Pending } from "@/components/ui/Pending";
import { TechnologyBadge } from "@/components/ui/TechnologyBadge";
import { GithubIcon } from "@/components/ui/BrandIcons";
import { ProjectGallery } from "./ProjectGallery";
import { statusLabel, statusTone } from "./status";
import { useLocalized, useT } from "@/i18n/t";

function Block({ code, title, children }: { code: string; title: string; children: React.ReactNode }) {
  title = useT()(title);
  return (
    <Reveal className="grid gap-6 border-t border-line py-12 md:grid-cols-12 md:gap-8">
      <div className="md:col-span-4">
        <p className="type-label">{code}</p>
        <h2 className="mt-2 font-display text-[clamp(1.6rem,3vw,2.4rem)] font-semibold leading-none tracking-[-0.03em]">
          {title}
        </h2>
      </div>
      <div className="md:col-span-7 md:col-start-6">{children}</div>
    </Reveal>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3 text-[16px] leading-relaxed">
      {items.map((t) => (
        <li key={t} className="flex gap-4">
          <span aria-hidden="true" className="font-mono text-muted">—</span>
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

function Spec({ k, children }: { k: string; children: React.ReactNode }) {
  k = useT()(k);
  return (
    <div className="grid grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] gap-4 border-b border-line py-4 sm:grid-cols-[11rem_minmax(0,1fr)]">
      <dt className="type-label pt-0.5">{k}</dt>
      <dd className="min-w-0 text-[15px] leading-relaxed [overflow-wrap:anywhere]">{children}</dd>
    </div>
  );
}

const metricIcon = { chart: ChartNoAxesColumn, layers: Layers, function: SquareFunction } as const;

/** Section title used in the two-column blocks: "01 /" + heading. */
function Heading({ n, title, id }: { n: string; title: string; id?: string }) {
  title = useT()(title);
  return (
    <>
      <p className="type-label">{n} /</p>
      <h2 id={id} className="mt-2 font-display text-[clamp(1.6rem,2.6vw,2.25rem)] font-semibold leading-none tracking-[-0.03em]">
        {title}
      </h2>
    </>
  );
}

/** Very small highlighter for the code excerpt: keywords and comments. */
function Code({ snippet }: { snippet: string }) {
  const parts = snippet.split(/(\b(?:from|import|def|return|for|in|as)\b|#.*$)/gm);
  return (
    <pre tabIndex={0} className="overflow-x-auto px-5 py-5 font-mono text-[13px] leading-[1.8] text-[#c6ccd6] focus-visible:outline focus-visible:outline-1 focus-visible:outline-accent">
      <code>
        {parts.map((p, i) =>
          /^(from|import|def|return|for|in|as)$/.test(p) ? (
            <span key={i} className="text-[#8fb4ff]">{p}</span>
          ) : p.startsWith("#") ? (
            <span key={i} className="text-[#6b7484]">{p}</span>
          ) : (
            p
          ),
        )}
      </code>
    </pre>
  );
}

export function ProjectDetail({ project: source }: { project: Project }) {
  const t = useT();
  const project = useLocalized(source);
  const projects = useLocalized(projectsEn);
  const i = projects.findIndex((p) => p.slug === project.slug);
  const prev = projects[(i - 1 + projects.length) % projects.length];
  const next = projects[(i + 1) % projects.length];

    // Regresa al inicio cuando cambia el proyecto.
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [project.slug]);

  const router = useRouter();

  // Navegación entre proyectos mediante el teclado.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target;

      // Evita interferir cuando el usuario está escribiendo.
      if (
        target instanceof HTMLElement &&
        (target.matches("input, textarea, select") ||
          target.isContentEditable)
      ) return;

      if (
        event.ctrlKey ||
        event.altKey ||
        event.metaKey ||
        event.repeat || event.defaultPrevented
      ) return;

      if (event.key === "[") {
        event.preventDefault();
        router.push(`/projects/${prev.slug}`, { scroll: true });
      }

      if (event.key === "]") {
        event.preventDefault();
        router.push(`/projects/${next.slug}`, { scroll: true });
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [router, prev.slug, next.slug]);

  const cover = project.cover ?? project.evidence.find((e) => e.src)?.src ?? null;

  return (
    <article>
      {/* Header: text left, project image right */}
      <header className="relative overflow-hidden">
        <BlueprintGrid fade="radial" />
        <div className="relative mx-auto max-w-[96rem] px-5 pb-14 pt-28 sm:px-10 sm:pt-32 short:pt-24">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 font-mono text-[12px] text-muted transition-colors hover:text-fg"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            {t("All projects")}
          </Link>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-3">
            <MetaTag k="PROJECT INDEX —" v={project.index} />
            <MetaTag k="MODULE:" v={project.module} />
            <MetaTag k="STATUS:" v={statusLabel[project.status]} tone={statusTone(project.status)} />
            {project.period && <MetaTag k="PERIOD:" v={project.period} />}
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
            <div className="lg:col-span-5">
              <p className="font-mono text-[12px] text-fg">
                <span className="underline decoration-accent decoration-2 underline-offset-[6px]">{t("PROJECT")}</span>
                <span className="text-muted"> / {project.category}</span>
              </p>
              <h1 className="mt-5 font-display text-[clamp(2.75rem,6.5vw,6rem)] font-bold leading-[0.9] tracking-[-0.05em] text-balance">
                {project.title}
              </h1>
              <p className="mt-6 max-w-xl text-[clamp(1rem,1.3vw,1.15rem)] leading-relaxed text-muted">{project.summary}</p>
            </div>

            <Reveal className="lg:col-span-7">
              <figure>
                <div className="relative aspect-[16/10] overflow-hidden border border-line bg-[#0c1017]">
                  {cover ? (
                    <Image
                      src={cover}
                      alt={`${project.title} — ${t("main project image")}`}
                      fill
                      priority
                      sizes="(min-width: 1024px) 55vw, 100vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="hatch absolute inset-0 grid place-items-center">
                      <p className="font-mono text-[11px] text-muted">{t("[ IMAGE COMING SOON ]")}</p>
                    </div>
                  )}
                  <CornerMarks className="text-fog [&>span]:m-3" size={16} />
                </div>
                <figcaption className="mt-3 flex gap-3 font-mono text-[11px] text-muted">
                  <span className="text-fg">FIG. 01</span>
                  <span>{project.title}</span>
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[96rem] px-5 sm:px-10">
        {/* Key figures */}
        {project.metrics && (
          <section aria-label={t("Key figures")} className="grid gap-4 border-t border-line py-10 sm:grid-cols-3">
            {project.metrics.map((m, n) => {
              const Icon = metricIcon[m.icon ?? "chart"];
              return (
                <Reveal key={m.label} delay={n * 0.06} className="relative flex gap-5 border border-line bg-bg-2 p-6 sm:p-7">
                  <CornerMarks className="text-muted/70 [&>span]:m-2" size={10} />
                  <Icon className="mt-1 size-6 shrink-0 text-muted" aria-hidden="true" />
                  <div>
                    <p className="text-[14px] text-fg">{m.label}</p>
                    <p className="mt-1 font-display text-[clamp(1.75rem,2.6vw,2.4rem)] font-semibold leading-tight tracking-[-0.02em] text-accent">
                      {m.value}
                    </p>
                    <p className="mt-1 text-[13px] text-muted">{m.caption}</p>
                  </div>
                </Reveal>
              );
            })}
          </section>
        )}

        <ProjectGlossary slug={project.slug} />

        {/* How it works | Implementation */}
        <section className="grid gap-12 border-t border-line py-12 lg:grid-cols-2 lg:gap-0">
          <div className="min-w-0 lg:border-r lg:border-line lg:pr-12">
            <Heading n="01" title="How it works" />
            <ol className="mt-8 divide-y divide-line">
              {project.methodology.map((step, n) => (
                <Reveal as="li" key={step} delay={n * 0.06} className="grid grid-cols-[3rem_1fr] items-center gap-4 py-4 first:pt-0">
                  <span className="grid h-9 w-11 place-items-center border border-line font-mono text-[13px] text-accent">
                    {String(n + 1).padStart(2, "0")}
                  </span>
                  <p className="text-[15px] leading-relaxed">{step}</p>
                </Reveal>
              ))}
            </ol>
          </div>
          <div className="min-w-0 lg:pl-12">
            <Heading n="02" title="Implementation" />
            <div className="mt-8">
              {project.code ? (
                <Reveal className="relative border border-line bg-[#0c1017]">
                  <div className="flex gap-1.5 border-b border-line px-4 py-3" aria-hidden="true">
                    <i className="block size-2 rounded-full bg-[#3a4352]" />
                    <i className="block size-2 rounded-full bg-[#3a4352]" />
                    <i className="block size-2 rounded-full bg-[#3a4352]" />
                  </div>
                  <Code snippet={project.code.snippet} />
                </Reveal>
              ) : project.implementation ? (
                <List items={project.implementation} />
              ) : (
                <Pending>How I built it — pending</Pending>
              )}
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="grid gap-10 border-t border-line py-12 lg:grid-cols-2 lg:items-center lg:gap-0">
          <div className="min-w-0 lg:border-r lg:border-line lg:pr-12">
            <Heading n="03" title="Results" />
            <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-muted">
              {project.results ? (
                project.results.map((r) => <p key={r}>{r}</p>)
              ) : (
                <Pending>Results will be added from the original project files</Pending>
              )}
            </div>
          </div>
          {/* Calculadora de regresión lineal */}
          {project.slug === "linear-regression" && (
            <Reveal className="min-w-0 lg:pl-12">
              <RegressionPredictor t={t} />
            </Reveal>
          )}
          {/* Visualización de algoritmos de Race Maze */}
          {project.slug === "maze-decision-trees" && (
            <Reveal className="min-w-0 lg:pl-12">
              <p className="type-label mb-5">
                {t("Algorithm workflow")}
              </p>

              <div className="grid gap-4">

                {/* DFS */}
                <div className="relative border border-line bg-bg-2 p-6">
                  <CornerMarks
                    className="text-muted/70 [&>span]:m-2"
                    size={10}
                  />

                  <p className="type-label">
                    01 — {t("Generation")}
                  </p>

                  <p className="mt-2 font-display text-3xl font-semibold text-accent">
                    DFS
                  </p>

                  <p className="mt-2 text-sm text-muted">
                    {t("Procedural maze generation")}
                  </p>
                </div>

                {/* Conector */}
                <div className="flex justify-center text-muted">
                  <span aria-hidden="true">↓</span>
                </div>

                {/* BFS */}
                <div className="relative border border-line bg-bg-2 p-6">
                  <CornerMarks
                    className="text-muted/70 [&>span]:m-2"
                    size={10}
                  />

                  <p className="type-label">
                    02 — {t("Pathfinding")}
                  </p>

                  <p className="mt-2 font-display text-3xl font-semibold text-accent">
                    BFS
                  </p>

                  <p className="mt-2 text-sm text-muted">
                    {t("Shortest-path calculation")}
                  </p>
                </div>

              </div>
            </Reveal>
          )}

          {/* Evaluación de modelos de Academic Habits */}
          {project.slug === "ai-challenge-kmeans-knn" && (
            <Reveal className="min-w-0 lg:pl-12">

              <p className="type-label mb-6">
                {t("Model evaluation")}
              </p>

              {/* Comparación KNN */}
              <div className="border border-line p-5">
                <h3 className="mb-5 font-display text-lg">
                  KNN — {t("Classification accuracy")}
                </h3>

                {[
                  { label: "Scaled features", value: 81.6 },
                  { label: "Unscaled features", value: 77.6 },
                ].map((item, i) => (
                  <div key={item.label} className="mb-4">
                    <div className="mb-2 flex justify-between text-sm">
                      <span>{t(item.label)}</span>
                      <span>{item.value}%</span>
                    </div>

                    <div className="h-2 bg-white/5">
                      <div
                        className={`h-full transition-all duration-1000 ${
                          i === 0 ? "bg-accent" : "bg-muted"
                        }`}
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}

                <p className="mt-4 text-sm text-accent">
                  +4.0 pp — {t("Improvement with feature scaling")}
                </p>
              </div>

              {/* Comparación K-Means */}
              <div className="mt-4 border border-line p-5">
                <h3 className="mb-5 font-display text-lg">
                  K-Means — {t("Silhouette score")}
                </h3>

                {[
                  { label: "3 clusters", value: 0.379 },
                  { label: "4 clusters", value: 0.334 },
                ].map((item, i) => (
                  <div key={item.label} className="mb-4">
                    <div className="mb-2 flex justify-between text-sm">
                      <span>{t(item.label)}</span>
                      <span>{item.value.toFixed(3)}</span>
                    </div>

                    <div className="h-2 bg-white/5">
                      <div
                        className={`h-full transition-all duration-1000 ${
                          i === 0 ? "bg-accent" : "bg-muted"
                        }`}
                        style={{ width: `${item.value * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-4 text-xs text-muted">
                {t("Evaluation on synthetic academic data.")}
              </p>

            </Reveal>
          )}

          {/* Comparación de ubicaciones comerciales */}
          {project.slug === "commercial-hotspots" && (
            <Reveal className="min-w-0 lg:pl-12">

              <p className="type-label mb-6">
                {t("Location comparison")}
              </p>

              <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-3">
                {[
                  { id: "A", zone: 1, one: 5, two: 16 },
                  { id: "B", zone: 2, one: 10, two: 13 },
                  { id: "C", zone: 1, one: 2, two: 9 },
                ].map((location) => (
                  <div
                    key={location.id}
                    className={`relative border p-4 ${
                      location.id === "C"
                        ? "border-accent"
                        : "border-line"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-display text-3xl font-semibold">
                        {location.id}
                      </span>

                      <span className="type-label">
                        {t("Zone")} {location.zone}
                      </span>
                    </div>

                    <div className="mt-5 border-t border-line pt-4">
                      <p className="text-xs text-muted">
                        {t("Within 1 km")}
                      </p>
                      <p className="mt-1 text-2xl">
                        {location.one}
                      </p>

                      <p className="mt-4 text-xs text-muted">
                        {t("Within 2 km")}
                      </p>
                      <p className="mt-1 text-2xl">
                        {location.two}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 border border-line p-5">
                <p className="mb-5 text-sm">
                  {t("Competitors within 2 km")}
                </p>

                {[
                  { id: "A", value: 16 },
                  { id: "B", value: 13 },
                  { id: "C", value: 9 },
                ].map((item) => (
                  <div
                    key={item.id}
                    className="mb-4 flex items-center gap-4"
                  >
                    <span className="w-4 font-mono">
                      {item.id}
                    </span>

                    <div className="h-2 flex-1 bg-white/5">
                      <div
                        className={`h-full ${
                          item.id === "C"
                            ? "bg-accent"
                            : "bg-muted"
                        }`}
                        style={{
                          width: `${(item.value / 16) * 100}%`,
                        }}
                      />
                    </div>

                    <span className="w-6 text-right font-mono text-sm">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 border border-line p-5">
                <p className="text-xs text-muted">
                  {t("Preliminary preferred alternative")}
                </p>

                <p className="mt-2 font-display text-2xl text-accent">
                  {t("Location C")}
                </p>
              </div>

              <p className="mt-4 text-xs text-muted">
                {t("Competitor counts based on straight-line distances.")}
              </p>

            </Reveal>
          )}

          {/* Arquitectura del portafolio */}
          {project.slug === "web-app-backend" && (
            <Reveal className="min-w-0 lg:pl-12">

              <p className="type-label mb-6">
                {t("System architecture")}
              </p>

              {/* Cliente */}
              <div className="border border-line p-4 text-center">
                <p className="type-label">{t("Client")}</p>
                <p className="mt-2 font-display text-lg">
                  {t("Web browser")}
                </p>
              </div>

              <div className="py-3 text-center text-muted">↓</div>

              {/* Aplicación principal */}
              <div className="border border-accent p-5 text-center">
                <p className="font-display text-2xl text-accent">
                  Next.js
                </p>
                <p className="mt-2 text-sm text-muted">
                  App Router
                </p>
              </div>

              <div className="py-3 text-center text-muted">↓</div>

              {/* Experiencias */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="border border-line p-4">
                  <p className="font-medium">
                    {t("Professional portfolio")}
                  </p>
                  <p className="mt-2 text-xs text-muted">
                    React · TypeScript · Tailwind CSS
                  </p>
                  <p className="mt-2 text-xs text-muted">
                    Three.js · Motion · OGL
                  </p>
                </div>

                <div className="border border-line p-4">
                  <p className="font-medium">
                    Walter&apos;s World
                  </p>
                  <p className="mt-2 text-xs text-muted">
                    React · Vite · TypeScript
                  </p>
                  <p className="mt-2 text-xs text-muted">
                    GSAP
                  </p>
                </div>
              </div>

              {/* Backend */}
              <p className="type-label mb-4 mt-8">
                {t("Contact request flow")}
              </p>

              {[
                {
                  name: "POST /api/contact",
                  detail: "Route Handler",
                },
                {
                  name: "Zod",
                  detail: "Validation and spam protection",
                },
                {
                  name: "Resend",
                  detail: "Email delivery when configured",
                },
              ].map((item, i) => (
                <div key={item.name}>

                  {i > 0 && (
                    <div className="py-2 text-center text-muted">
                      ↓
                    </div>
                  )}

                  <div className="border border-line p-4">
                    <p className="font-mono text-sm text-accent">
                      {item.name}
                    </p>

                    <p className="mt-2 text-xs text-muted">
                      {t(item.detail)}
                    </p>
                  </div>

                </div>
              ))}

            </Reveal>
          )}

        </section>

        {/* Data | What I learned */}
        <section className="grid gap-12 border-t border-line py-12 lg:grid-cols-2 lg:gap-0">
          <div className="min-w-0 lg:border-r lg:border-line lg:pr-12">
           <Heading
              n="04"
              title={
                project.slug === "maze-decision-trees"
                  ? "Data Structure"
                  : project.slug === "web-app-backend"
                    ? "Content Architecture"
                    : "Data"
              }
            />
            <div className="mt-6">
              {project.dataset ? (
                <dl className="divide-y divide-line border-b border-line">
                  {[
                    {
                      k: t(
                        project.slug === "maze-decision-trees"
                          ? "Source"
                          : project.slug === "web-app-backend"
                            ? "Storage"
                            : "Records"
                      ),
                      v: t(project.dataset.records),
                      Icon: Database,
                    },
                    {
                      k: t(
                        project.slug === "maze-decision-trees"
                          ? "Elements"
                          : project.slug === "web-app-backend"
                            ? "Content"
                            : "Variables"
                      ),
                      v: t(project.dataset.variables),
                      Icon: Layers,
                    },
                    ].map(({ k, v, Icon }) => (
                    <div key={k} className="flex items-center gap-4 py-4">
                      <Icon className="size-5 text-muted" aria-hidden="true" />
                      <dt className="text-[15px]">{k}</dt>
                      <dd className="ml-auto text-right text-[15px]">{v}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <Pending>Dataset details coming soon</Pending>
              )}
            </div>
          </div>
          <div className="min-w-0 lg:pl-12">
            <Heading n="05" title="What I learned" />
            <div className="mt-6">
              {project.learnings ? (
                <ul className="space-y-4">
                  {project.learnings.map((l) => (
                    <li key={l} className="flex gap-4 text-[15px] leading-relaxed">
                      <Check className="mt-1 size-4 shrink-0 text-accent" aria-hidden="true" />
                      {l}
                    </li>
                  ))}
                </ul>
              ) : (
                <Pending>Learnings pending</Pending>
              )}
            </div>
          </div>
        </section>

        {/* Spec sheet */}
        <section aria-label={t("Project specification")} className="border-t border-line py-12">
          <p className="type-label mb-4">06 / {t("DETAILS")}</p>
          <dl className="max-w-4xl">
            <Spec k="PROBLEM">{project.problem ?? <Pending>Problem statement pending</Pending>}</Spec>
            <Spec k="OBJECTIVE">{project.objective ?? <Pending>Objective pending</Pending>}</Spec>
            <Spec k="TECHNOLOGIES">
              {project.technologies ? (
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((t) => (
                    <TechnologyBadge key={t} name={t} />
                  ))}
                </div>
              ) : (
                <Pending>Technologies to confirm</Pending>
              )}
            </Spec>
            <Spec k="REPOSITORY">
              {project.repository ? (
                <a href={project.repository} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 underline underline-offset-4 hover:text-accent">
                  <GithubIcon className="size-4" /> {t("View repository")}
                </a>
              ) : (
                <Pending inline>Repository link pending</Pending>
              )}
            </Spec>
            {/* Mostrar únicamente si existe una demo */}
            {project.demo && (
              <Spec k="DEMO">
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 underline underline-offset-4 hover:text-accent"
                >
                  <ExternalLink className="size-4" aria-hidden="true" />
                  {t("Open demo")}
                </a>
              </Spec>
            )}
          </dl>
        </section>

        {/* Evidence */}
        <section aria-labelledby="evidence-title" className="border-t border-line py-14">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="type-label">07 /</p>
              <h2 id="evidence-title" className="mt-2 font-display text-[clamp(1.6rem,3vw,2.4rem)] font-semibold leading-none tracking-[-0.03em]">
                {t("Captures & visualisations")}
              </h2>
            </div>
            <p className="hidden font-mono text-[11px] text-muted sm:block">
              {project.evidence.filter((e) => e.src).length} / {project.evidence.length} {t("added")}
            </p>
          </div>
          <ProjectGallery items={project.evidence} />
        </section>

        <Block code="08 /" title="Files & source code">
          {project.files.length ? (
            <ul className="divide-y divide-line border-y border-line">
              {project.files.map((f) => (
                <li key={f.href}>
                  <a href={f.href} className="flex items-center justify-between gap-4 py-3 text-[15px] hover:text-accent">
                    <span className="inline-flex items-center gap-3">
                      <FileCode2 className="size-4 text-muted" aria-hidden="true" />
                      {f.label}
                    </span>
                    <ExternalLink className="size-3.5 text-muted" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <Pending>Source files coming soon</Pending>
          )}
        </Block>

        {/* Prev / next */}
        <nav aria-label={t("More projects")} className="grid border-t border-line sm:grid-cols-2">
          <Link href={`/projects/${prev.slug}`} scroll={true} className="group flex flex-col gap-2 py-10 sm:border-r sm:border-line sm:pr-8">
            <span className="inline-flex items-center gap-2 font-mono text-[11px] text-muted">
              <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
              {t("Previous")} / {prev.index}
              <kbd className="rounded border border-line px-1.5 py-0.5 text-[10px]">
                [
              </kbd>
            </span>
            <span className="font-display text-2xl font-semibold tracking-[-0.02em] group-hover:text-accent">{prev.title}</span>
          </Link>
          <Link href={`/projects/${next.slug}`} scroll={true} className="group flex flex-col items-end gap-2 border-t border-line py-10 text-right sm:border-t-0 sm:pl-8">
            <span className="inline-flex items-center gap-2 font-mono text-[11px] text-muted">
              {t("Next")} / {next.index}
              <kbd className="rounded border border-line px-1.5 py-0.5 text-[10px]">
                ]
              </kbd>
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </span>
            <span className="font-display text-2xl font-semibold tracking-[-0.02em] group-hover:text-accent">{next.title}</span>
          </Link>
        </nav>
      </div>
    </article>
  );
}
