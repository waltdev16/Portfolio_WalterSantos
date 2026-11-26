// Página de detalle de cada proyecto independiente (src/data/independent-projects.ts).

import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getIndependentProject, independentProjects } from "@/data/independent-projects";
import { FloatingNavbar } from "@/components/layout/FloatingNavbar";
import { IndependentDetail } from "@/components/projects/IndependentDetail";

export function generateStaticParams() {
  return independentProjects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/projects/independent/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const project = getIndependentProject(slug);
  if (!project) return {};
  const url = `/projects/independent/${project.slug}`;
  return {
    title: project.name,
    description: project.summary,
    alternates: { canonical: url },
    openGraph: { title: project.name, description: project.summary, url },
  };
}

export default function IndependentProjectPage(props: PageProps<"/projects/independent/[slug]">) {
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

async function ProjectContent({ params }: Pick<PageProps<"/projects/independent/[slug]">, "params">) {
  const { slug } = await params;
  const project = getIndependentProject(slug);
  if (!project) notFound();

  return <IndependentDetail project={project} />;
}
