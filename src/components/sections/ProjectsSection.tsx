// Sección "Selected projects" con dos colecciones:
//  01 — Proyectos académicos (carrusel con profundidad, src/data/projects.ts)
//  02 — Proyectos independientes (archivo editorial, src/data/independent-projects.ts)
import { BlueprintGrid } from "@/components/effects/Blueprint";
import { AcademicProjects } from "@/components/projects/AcademicProjects";
import { IndependentProjects } from "@/components/projects/IndependentProjects";

export function ProjectsSection() {
  return (
    <section id="projects" className="relative border-t border-line bg-bg">
      <BlueprintGrid fade="top" className="opacity-60" />
      <div className="relative mx-auto max-w-[96rem] px-5 py-24 sm:px-10 sm:py-32 short:py-20">
        <div className="space-y-28 sm:space-y-36 short:space-y-28">
          <AcademicProjects />
          <IndependentProjects />
        </div>
      </div>
    </section>
  );
}
