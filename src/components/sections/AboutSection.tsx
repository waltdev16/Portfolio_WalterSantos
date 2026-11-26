"use client";

// Sección "Sobre mí": presentación, intereses, metas y la terminal de arranque.

import Image from "next/image";
import { MapPin } from "lucide-react";
import { profile as profileEn } from "@/data/profile";
import { projects } from "@/data/projects";
import { independentProjects } from "@/data/independent-projects";
import { skills } from "@/data/skills";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Pending } from "@/components/ui/Pending";
import { BlueprintGrid, CornerMarks } from "@/components/effects/Blueprint";
import { Reveal } from "@/components/effects/Reveal";
import { Terminal, type TerminalLine } from "@/components/effects/Terminal";
import { BlurHighlight } from "@/components/effects/BlurHighlight";
import { ImageReveal } from "@/components/effects/Motion";
import { useLocalized, useT } from "@/i18n/t";



function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-line pt-4">
      <h3 className="type-label mb-3">{label}</h3>
      <div className="text-[15px] leading-relaxed">{children}</div>
    </div>
  );
}

export function AboutSection() {
  const t = useT();
  const profile = useLocalized(profileEn);
  const bootLines: TerminalLine[] = [
    { text: t("> initializing portfolio..."), tone: "cmd" },
    { text: "", tone: "plain" },
    { text: t("[OK] Identity loaded"), tone: "ok" },
    { text: `[OK] ${t("Projects indexed")} (${projects.length + independentProjects.length})`, tone: "ok" },
    { text: `[OK] ${t("Skills initialized")} (${skills.reduce((n, g) => n + g.items.length, 0)})`, tone: "ok" },
    { text: "", tone: "plain" },
    { text: `${t("USER:")}  ${profile.name}`, tone: "key" },
    { text: `${t("ROLE:")}  ${profile.role}`, tone: "key" },
    { text: t("FOCUS: Software Development / AI / Data"), tone: "key" },
    { text: `${t("LOC:")}   ${profile.location}`, tone: "dim" },
    { text: "", tone: "plain" },
    { text: t("> ready"), tone: "cmd" },
  ];

  return (
    <section id="about" aria-labelledby="about-title" className="theme-paper relative bg-bg text-fg">
      <BlueprintGrid fade="top" className="opacity-70" />
      <div className="relative mx-auto max-w-[96rem] px-5 py-24 sm:px-10 sm:py-32 short:py-20">
        <SectionHeading
          id="about-title"
          code="002"
          label="ABOUT"
          title={["Software, AI", "and data."]}
          lede="Who I am, what I'm learning and where I want to go."
        />

        <div className="grid gap-14 lg:grid-cols-12 lg:gap-8">
          {/* Portrait */}
          <Reveal className="lg:col-span-4">
            <figure>
              <ImageReveal className="relative aspect-[4/5] w-full max-w-sm overflow-hidden bg-[#d3d8df]">
                {profile.photo ? (
                  <Image
                    src={profile.photo}
                    alt={`${t("Portrait of")} ${profile.name}`}
                    fill
                    sizes="(min-width: 1024px) 30vw, 90vw"
                    className="object-cover grayscale"
                  />
                ) : (
                  <div className="hatch absolute inset-0 grid place-items-center">
                    <div className="text-center font-mono text-[11px] text-muted">
                      <p>{t("[ PORTRAIT ]")}</p>
                      <p className="mt-1 text-[10px]">{t("Photo coming soon")}</p>
                    </div>
                    {/* crosshair */}
                    <span aria-hidden="true" className="absolute left-1/2 top-0 h-full w-px bg-[#b9c0ca]/70" />
                    <span aria-hidden="true" className="absolute left-0 top-1/2 h-px w-full bg-[#b9c0ca]/70" />
                  </div>
                )}
                <CornerMarks className="text-fg" size={14} />
              </ImageReveal>
              <figcaption className="mt-4 flex max-w-sm items-center justify-between font-mono text-[11px] text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-3.5" aria-hidden="true" />
                  {profile.location}
                </span>
                <span>{profile.coordinates}</span>
              </figcaption>
            </figure>
          </Reveal>

          {/* Text */}
          <div className="lg:col-span-7 lg:col-start-6">
            <BlurHighlight
              text={profile.intro}
              highlights={profile.introHighlights}
              className="font-display text-[clamp(1.4rem,2.6vw,2.1rem)] font-medium leading-[1.2] tracking-[-0.02em] text-balance"
            />

            <div className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2">
              <Field label={t("INTERESTS")}>
                <ul className="flex flex-wrap gap-2">
                  {profile.interests.map((i) => (
                    <li key={i} className="rounded-full border border-line px-3 py-1 text-[13px]">
                      {i}
                    </li>
                  ))}
                </ul>
              </Field>
              <Field label={t("ACADEMIC GOAL")}>
                {profile.academicGoals ?? <Pending inline>To be added</Pending>}
              </Field>
              <Field label={t("PROFESSIONAL GOAL")}>
                {profile.professionalGoals ?? (
                  <Pending>Professional goal coming soon</Pending>
                )}
              </Field>
              <Field label={t("STRENGTHS")}>
                {profile.strengths ? (
                  <ul className="space-y-1">
                    {profile.strengths.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                ) : (
                  <Pending>Strengths coming soon</Pending>
                )}
              </Field>
            </div>

            </div>

          {/* Consola de ancho completo */}
          <Reveal className="mt-4 w-full lg:col-span-12">
            <Terminal lines={bootLines} />
          </Reveal>

        </div>
      </div>
    </section>
  );
}
