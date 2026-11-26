// Pie de página: índice de secciones, enlaces sociales, acceso a Walter's World y "Repetir introducción".

import Link from "next/link";
import { sections } from "@/data/navigation";
import { profile } from "@/data/profile";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { ReplayIntro } from "@/components/intro/IntroControls";
import { WorldButton } from "@/components/world/WorldButton";
import { T } from "@/i18n/Translate";

export function Footer() {
  return (
    <footer className="relative border-t border-line bg-bg">
      <div className="mx-auto max-w-[96rem] px-5 pb-10 pt-16 sm:px-10">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-display text-3xl font-semibold tracking-[-0.03em]">Walter Santos</p>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-muted"><T>{profile.tagline}</T></p>
          </div>

          <nav aria-labelledby="footer-nav-label" className="md:col-span-3 md:col-start-7">
            <span id="footer-nav-label" className="sr-only"><T>Footer</T></span>
            <p className="type-label mb-4"><T>INDEX</T></p>
            <ul className="space-y-2 text-sm">
              {sections.map((s) => (
                <li key={s.id}>
                  <Link href={`/#${s.id}`} className="text-muted transition-colors hover:text-fg">
                    <span className="mr-3 font-mono text-[11px] text-muted/80">{s.code}</span>
                    <T>{s.label}</T>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <p className="type-label mb-4"><T>ELSEWHERE</T></p>
            <SocialLinks className="flex-col !items-start" />
            <p className="type-label mb-4 mt-10"><T>CREATIVE AREA</T></p>
            <WorldButton size="sm" />
          </div>
        </div>

        <div aria-hidden="true" className="mt-16 h-px bg-line" />

        <div className="mt-4 flex flex-col gap-2 font-mono text-[11px] text-muted sm:flex-row sm:justify-between">
          <span>© 2026 Walter Santos, {profile.location}</span>
          <span className="flex gap-4">
            <span><T>Built with Next.js, TypeScript and Tailwind CSS</T></span>
            <ReplayIntro className="underline-offset-4 transition-colors hover:text-fg hover:underline" />
          </span>
        </div>
      </div>
    </footer>
  );
}
