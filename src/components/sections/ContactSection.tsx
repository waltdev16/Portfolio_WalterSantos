// Sección de contacto: correo, perfiles, ubicación y formulario.

import { Mail } from "lucide-react";
import { profile } from "@/data/profile";
import { T } from "@/i18n/Translate";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { Pending } from "@/components/ui/Pending";
import { Reveal } from "@/components/effects/Reveal";
import { BlueprintGrid } from "@/components/effects/Blueprint";
import { ContactForm } from "./ContactForm";

export function ContactSection() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative overflow-hidden border-t border-line">
      <BlueprintGrid fade="radial" />
      <div className="relative mx-auto max-w-[96rem] px-5 py-24 sm:px-10 sm:py-32 short:py-20">
        <SectionHeading id="contact-title" code="008" label="CONTACT" title="Let’s talk." />

        <div className="grid gap-16 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <p className="max-w-md text-lg leading-relaxed text-muted">
              <T>Questions about a project, a collaboration or an opportunity to learn — write to me and I’ll reply by email.</T>
            </p>

            <dl className="mt-12 space-y-6">
              <div>
                <dt className="type-label mb-2"><T>EMAIL</T></dt>
                <dd>
                  {profile.email ? (
                    <a
                      href={`mailto:${profile.email}`}
                      className="inline-flex max-w-full items-center gap-2 font-display text-xl sm:text-2xl [overflow-wrap:anywhere] tracking-tight underline decoration-line underline-offset-8 transition-colors hover:text-accent hover:decoration-accent"
                    >
                      <Mail className="size-5 shrink-0" aria-hidden="true" />
                      <span className="min-w-0">{profile.email}</span>
                    </a>
                  ) : (
                    <Pending>Email address coming soon</Pending>
                  )}
                </dd>
              </div>
              <div>
                <dt className="type-label mb-2"><T>PROFILES</T></dt>
                <dd>
                  <SocialLinks />
                </dd>
              </div>
              <div>
                <dt className="type-label mb-2"><T>LOCATION</T></dt>
                <dd className="text-[15px]">{profile.location}</dd>
              </div>
            </dl>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-6 lg:col-start-7">
            <div className="relative border border-line bg-bg/70 p-6 backdrop-blur-sm sm:p-10">
              <p className="mb-8 font-mono text-xl font-bold tracking-wide text-white"><T>Send a message</T></p>
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
