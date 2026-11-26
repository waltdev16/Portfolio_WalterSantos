// Sección de experiencia (datos en src/data/experience.ts).

import { experience } from "@/data/experience";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ExperienceJourney } from "@/components/experience/ExperienceJourney";
import { Reveal } from "@/components/effects/Reveal";
import { T } from "@/i18n/Translate";

export function ExperienceSection() {
  return (
    <section id="experience" aria-labelledby="experience-title" className="relative">
      <div className="mx-auto max-w-[96rem] px-5 py-24 sm:px-10 sm:py-32 short:py-20">
        <SectionHeading
          id="experience-title"
          code="003"
          label="DEVELOPMENT JOURNEY"
          title={["Selected", "experiences"]}
          lede="Academic work and independent builds. Open a module to see responsibilities, results you can check and the tools involved."
        />
        <Reveal>
          <ExperienceJourney items={experience} />
        </Reveal>
        <p className="mt-8 flex items-center gap-3 font-mono text-[11px] text-muted">
          <span aria-hidden="true" className="inline-block size-2 rotate-45 border border-dashed border-current" />
          <T>Next module: internships and work experience will be added here.</T>
        </p>
      </div>
    </section>
  );
}
