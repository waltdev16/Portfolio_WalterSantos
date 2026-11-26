"use client";

// Página de detalle reutilizable para proyectos independientes.
// Todo el contenido sale de src/data/independent-projects.ts: portada, visor
// incrustado (embed), visor propio (viewer), enlaces y descripción (overview).

// 01. Importaciones
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { IndependentProject } from "@/types";
import { independentProjects } from "@/data/independent-projects";
import { useLocalized, useT } from "@/i18n/t";
import { BlueprintGrid, MetaTag } from "@/components/effects/Blueprint";
import { Reveal } from "@/components/effects/Reveal";
import { Pending } from "@/components/ui/Pending";
import { GithubIcon } from "@/components/ui/BrandIcons";
import { IndependentCover } from "./IndependentProjects";
import { InteractiveEmbed } from "./InteractiveEmbed";
import { ProjectPager, circularNeighbors, useScrollTopOnChange } from "./ProjectPager";
import { PythonLabViewer } from "./python/PythonLabViewer";
import { statusLabel, statusTone } from "./status";

const linkClass = "inline-flex items-center gap-2 underline underline-offset-4 hover:text-accent";

// 02. Portada de detalle: visor propio, aplicación incrustada o imagen
function DetailMedia({ project }: { project: IndependentProject }) {
  if (project.viewer === "python-lab") return <PythonLabViewer />;
  if (project.embed) {
    return (
      <InteractiveEmbed
        src={project.embed.src}
        title={project.name}
        poster={project.detailCover ?? project.cover}
        externalUrl={project.demo ?? project.embed.src}
        allowCamera={project.embed.allowCamera}
      />
    );
  }
  return (
    <IndependentCover
      project={{ ...project, cover: project.detailCover ?? project.cover }}
      sizes="(max-width: 1024px) 100vw, 55vw"
    />
  );
}

export function IndependentDetail({ project: source }: { project: IndependentProject }) {
  const t = useT();
  const project = useLocalized(source);

  // 03. Navegación circular entre proyectos independientes
  const list = useLocalized(independentProjects);
  const near = circularNeighbors(list, list.findIndex((p) => p.slug === project.slug));
  useScrollTopOnChange(project.slug);

  const overview = project.overview?.length ? project.overview : [project.summary];

  // 04. Renderizado
  return (
    <article>
      <div className="relative overflow-hidden">
        <BlueprintGrid fade="radial" />

        <div className="relative mx-auto max-w-[96rem] px-5 pt-28 sm:px-10 sm:pt-32 short:pt-24">
          <Link
            href="/#independent-projects"
            className="inline-flex items-center gap-2 font-mono text-[12px] text-muted transition-colors hover:text-fg"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            {t("All independent projects")}
          </Link>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-3">
            <MetaTag k="PROJECT INDEX —" v={project.index} />
            <MetaTag k="STATUS:" v={statusLabel[project.status]} tone={statusTone(project.status)} />
            {project.year && <MetaTag k={`${t("Year").toUpperCase()}:`} v={project.year} />}
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
            {/* Información del proyecto */}
            <div className="min-w-0 [container-type:inline-size] lg:col-span-5">
              <p className="font-mono text-[12px] text-fg">
                <span className="underline decoration-accent decoration-2 underline-offset-[6px]">
                  {t("Independent project").toUpperCase()}
                </span>
                <span className="text-muted">
                  {" / "}
                  {project.category}
                </span>
              </p>

              <h1
                className="mt-5 font-display font-bold leading-[0.95] tracking-[-0.05em] text-balance [overflow-wrap:anywhere]"
                style={{ fontSize: "clamp(2.5rem, 11cqw, 5.5rem)" }}
              >
                {project.name}
              </h1>

              <p className="mt-6 max-w-xl text-[clamp(1rem,1.3vw,1.15rem)] leading-relaxed text-muted">{project.summary}</p>

              <dl className="mt-10 grid gap-6 border-t border-line pt-6 text-[14px]">
                <div>
                  <dt className="type-label mb-2">{t("Technologies").toUpperCase()}</dt>
                  <dd>
                    {project.technologies.length ? (
                      <ul className="flex flex-wrap gap-1.5">
                        {project.technologies.map((tech) => (
                          <li key={tech} className="border border-line px-2 py-1 font-mono text-[11px] text-fg/80">
                            {tech}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <Pending inline>Technologies to be documented</Pending>
                    )}
                  </dd>
                </div>

                <div>
                  <dt className="type-label mb-2">{t("Repository").toUpperCase()}</dt>
                  <dd>
                    {project.repository ? (
                      <a href={project.repository} target="_blank" rel="noopener noreferrer" className={linkClass}>
                        <GithubIcon className="size-4" />
                        {t("View repository")}
                      </a>
                    ) : (
                      <Pending inline />
                    )}
                  </dd>
                </div>

                <div>
                  <dt className="type-label mb-2">{t("Live Demo").toUpperCase()}</dt>
                  <dd>
                    {project.demo ? (
                      <a href={project.demo} target="_blank" rel="noopener noreferrer" className={linkClass}>
                        {t("Open live demo")}
                        <ArrowUpRight className="size-4" aria-hidden="true" />
                      </a>
                    ) : project.viewer ? (
                      <span className="text-muted">{t("Runs in the viewer on this page")}</span>
                    ) : (
                      <Pending inline />
                    )}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Portada de detalle */}
            <Reveal className="min-w-0 lg:col-span-7">
              <DetailMedia project={project} />
            </Reveal>
          </div>

          {/* Descripción del proyecto */}
          <section className="mt-14 max-w-2xl border-t border-line pt-6">
            <h2 className="font-display text-2xl font-semibold">{t("Project overview")}</h2>
            {overview.map((paragraph) => (
              <p key={paragraph} className="mt-4 leading-relaxed text-muted">
                {paragraph}
              </p>
            ))}
          </section>

          {/* Navegación entre proyectos */}
          {near ? (
            <div className="mt-20 short:mt-14">
              <ProjectPager
                prev={{ href: `/projects/independent/${near.prev.slug}`, index: near.prev.index, title: near.prev.name }}
                next={{ href: `/projects/independent/${near.next.slug}`, index: near.next.index, title: near.next.name }}
              />
            </div>
          ) : (
            <div className="pb-24" />
          )}
        </div>
      </div>
    </article>
  );
}
