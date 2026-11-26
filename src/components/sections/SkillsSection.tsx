"use client";

// Sección de habilidades: un grupo por cada entrada de src/data/skills.ts.

import { BrainCircuit, Code2, Database, Globe, Users, Wrench } from "lucide-react";
import { skills as skillsEn } from "@/data/skills";
import type { SkillGroup } from "@/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/effects/Reveal";
import { CornerMarks } from "@/components/effects/Blueprint";
import { useLocalized, useT } from "@/i18n/t";

const icons: Record<SkillGroup["icon"], React.ComponentType<{ className?: string }>> = {
  code: Code2,
  globe: Globe,
  brain: BrainCircuit,
  database: Database,
  wrench: Wrench,
  users: Users,
};

export function SkillsSection() {
  const t = useT();
  const skills = useLocalized(skillsEn);
  return (
    <section id="skills" aria-labelledby="skills-title" className="relative border-t border-line bg-bg-2">
      <div className="mx-auto max-w-[96rem] px-5 py-24 sm:px-10 sm:py-32 short:py-20">
        <SectionHeading
          id="skills-title"
          code="005"
          label="SKILLS"
          title="Toolkit"
          lede="No percentages. Each skill shows where I used it, so it can be checked against the projects."
        />

        <ul className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((group, i) => {
            const Icon = icons[group.icon];
            return (
              <Reveal as="li" key={group.id} delay={(i % 3) * 0.06} className="group relative bg-bg-2 p-6 sm:p-8">
                <CornerMarks className="opacity-0 transition-opacity group-hover:opacity-100 [&>span]:m-2" size={8} />
                <div className="flex items-center justify-between">
                  <span className="grid size-10 place-items-center rounded-full border border-line text-accent">
                    <Icon className="size-[18px]" aria-hidden="true" />
                  </span>
                  <span className="font-mono text-[11px] text-muted">
                    {String(group.items.length).padStart(2, "0")} {t("items")}
                  </span>
                </div>
                <h3 className="mt-6 font-display text-2xl font-semibold tracking-[-0.02em]">{group.title}</h3>
                <ul className="mt-5 divide-y divide-line border-t border-line">
                  {group.items.map((item) => (
                    <li key={item.name} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-2.5">
                      <span className="text-[14px]">{item.name}</span>
                      {item.evidence && (
                        <span className="max-w-full font-mono text-[11px] text-muted [overflow-wrap:anywhere]">{item.evidence}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
