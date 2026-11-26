// Página de inicio: ordena las secciones del portafolio. Para agregar o mover una sección, se edita esta lista.

import { FloatingNavbar } from "@/components/layout/FloatingNavbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { EducationSection } from "@/components/sections/EducationSection";
import { MusicSection } from "@/components/sections/MusicSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { WorldSection } from "@/components/sections/WorldSection";
import { CinematicIntro } from "@/components/intro/CinematicIntro";

export default function Home() {
  return (
    // CinematicIntro envuelve todo: la primera visita de la sesión reproduce la intro 3D encima.
    <CinematicIntro>
      <FloatingNavbar />
      {/* Secciones en el orden en que aparecen en la página */}
      <main id="main">
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        <ProjectsSection />
        <SkillsSection />
        <EducationSection />
        <MusicSection />
        <WorldSection />
        <ContactSection />
      </main>
      <Footer />
    </CinematicIntro>
  );
}
