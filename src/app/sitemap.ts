// Genera /sitemap.xml con la página de inicio, Walter's World y las páginas de proyectos.

import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { independentProjects } from "@/data/independent-projects";
import { site } from "@/data/profile";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, changeFrequency: "monthly", priority: 1 },
    // Walter's World: el área creativa (app aparte servida en /world)
    { url: `${site.url}/world`, changeFrequency: "monthly", priority: 0.6 },
    ...projects.map((p) => ({
      url: `${site.url}/projects/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...independentProjects.map((p) => ({
      url: `${site.url}/projects/independent/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
