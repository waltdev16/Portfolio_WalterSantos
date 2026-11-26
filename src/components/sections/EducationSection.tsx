"use client";

// Sección de educación y certificaciones (datos en src/data/education.ts y credentials.ts).

import { education as educationEn } from "@/data/education";
import { credentials } from "@/data/credentials";
import type { EducationItem } from "@/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Pending } from "@/components/ui/Pending";
import { BlueprintGrid, CornerMarks } from "@/components/effects/Blueprint";
import { DrawLine, Stagger, StaggerItem } from "@/components/effects/Motion";
import { Reveal } from "@/components/effects/Reveal";
import { CredentialCarousel } from "@/components/education/CredentialCarousel";
import { useLocalized, useT } from "@/i18n/t";

const kindLabel: Record<EducationItem["kind"], string> = {
  school: "Secondary school",
  program: "Program",
  course: "Complementary course",
};

function SubHeading({ index, title, children }: { index: string; title: string; children?: React.ReactNode }) {
  return (
    <div>
      <p className="type-label text-fg">{index}</p>
      <h3 className="mt-3 font-display text-[clamp(1.6rem,3vw,2.5rem)] font-semibold leading-none tracking-[-0.035em]">
        {title}
      </h3>
      {children && <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-muted">{children}</p>}
    </div>
  );
}

/** A. Studies and programs — compact editorial cards. */
function AcademicJourney() {
  const t = useT();
  const education = useLocalized(educationEn);
  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
      <Reveal className="lg:col-span-4">
        <SubHeading index="A / 02" title={t("Academic journey")}>
          {t("Studies and programs. Certifications are listed separately below.")}
        </SubHeading>
      </Reveal>
      <Stagger as="ol" className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
        {education.map((item, i) => (
          <StaggerItem
            as="li"
            key={item.id}
            className="relative flex min-h-[15rem] flex-col border border-line bg-surface p-6 sm:p-7"
          >
            <CornerMarks className="text-fg/40 [&>span]:m-2" size={8} />
            <div className="flex items-start justify-between gap-4">
              <span className="font-mono text-[11px] text-muted">A-{String(i + 1).padStart(2, "0")}</span>
              <span className="font-mono text-[11px] text-muted">{t(kindLabel[item.kind])}</span>
            </div>
            <p className="mt-8 font-display text-[clamp(2.4rem,4vw,3.5rem)] font-bold leading-none tracking-[-0.05em]">
              {item.period ?? <span className="text-muted/70">— —</span>}
            </p>
            <h4 className="mt-auto pt-8 font-display text-2xl font-semibold leading-tight tracking-[-0.02em]">
              {item.title}
            </h4>
            <p className="mt-2 text-[14px] text-muted">
              {item.institution ?? (item.confirmed ? null : <Pending inline>Details to be confirmed</Pending>)}
            </p>
            {item.detail && <p className="mt-3 text-[14px] leading-relaxed">{item.detail}</p>}
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}

export function EducationSection() {
  const t = useT();
  return (
    <section id="education" aria-labelledby="education-title" className="theme-paper relative bg-bg text-fg">
      <BlueprintGrid fade="bottom" className="opacity-60" />
      <div className="relative mx-auto max-w-[96rem] px-5 py-24 sm:px-10 sm:py-32 short:py-20">
        <SectionHeading
          id="education-title"
          code="006"
          label="EDUCATION & CERTIFICATIONS"
          title={["Education &", "credentials"]}
          lede="Where I study, and the certifications and credentials that back up my skills."
        />

        <AcademicJourney />

        {/* B. Certifications gallery */}
        <div className="mt-24 sm:mt-32">
          <div className="relative mb-12 pt-10">
            <DrawLine className="absolute inset-x-0 top-0" />
            <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
              <Reveal className="lg:col-span-6">
                <SubHeading index="B / 02" title={t("Certifications & achievements")} />
              </Reveal>
              <Reveal delay={0.1} className="max-w-md text-[15px] leading-relaxed text-muted lg:col-span-4 lg:col-start-9">
                {t("Select a credential to see it larger. A verification link appears when the issuer provides one.")}
              </Reveal>
            </div>
          </div>
          <Reveal>
            <CredentialCarousel items={credentials} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
