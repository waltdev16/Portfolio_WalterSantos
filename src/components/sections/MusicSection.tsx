// Sección de música.

import { albums } from "@/data/albums";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MusicRotation } from "@/components/music/MusicRotation";

export function MusicSection() {
  return (
    <section id="music" aria-labelledby="music-title" className="relative overflow-hidden border-t border-line bg-bg">
      <div className="relative mx-auto max-w-[96rem] px-5 py-20 sm:px-10 lg:py-24 short:py-16">
        <SectionHeading
          id="music-title"
          code="007"
          label="CURRENT ROTATION"
          title="Music"
          lede="A little bit of everything, always on repeat."
          className="!mb-4 lg:!mb-6"
        />
        <MusicRotation albums={albums} />
      </div>
    </section>
  );
}
