// Página de detalle de cada proyecto. Se genera una por proyecto de src/data/projects.ts al compilar.

import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/data/projects";
import { FloatingNavbar } from "@/components/layout/FloatingNavbar";
import { ProjectDetail } from "@/components/projects/ProjectDetail";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: { title: project.title, description: project.summary, url: `/projects/${project.slug}` },
  };
}

export default function ProjectPage(props: PageProps<"/projects/[slug]">) {
  return (
    <>
      <FloatingNavbar forceActive="projects" />
      <main id="main">
        <Suspense fallback={<div className="min-h-screen" aria-busy="true" />}>
          <ProjectContent params={props.params} />
        </Suspense>
      </main>
    </>
  );
}

async function ProjectContent({ params }: Pick<PageProps<"/projects/[slug]">, "params">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return <ProjectDetail project={project} />;
}
