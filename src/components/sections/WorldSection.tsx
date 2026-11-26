"use client";

import Image from "next/image";
import { WorldButton } from "@/components/world/WorldButton";
import { T } from "@/i18n/Translate";
import { useLang } from "@/i18n/lang";

export function WorldSection() {
  const lang = useLang();

  // Selecciona la portada según el idioma actual.
  const worldCover = `/world/garage/${lang === "es" ? "es" : "en"}/base.webp`;

  return (
    <section
      id="world"
      aria-labelledby="world-title"
      className="world-teaser relative overflow-hidden border-t border-line bg-bg"
    >
      <div className="relative mx-auto max-w-[96rem] px-5 py-20 sm:px-10 lg:py-24">
        <div className="world-teaser__frame" aria-hidden="true">
          <Image
            src={worldCover}
            alt=""
            fill
            sizes="(min-width: 96rem) 92rem, 100vw"
            className="world-teaser__art"
          />
          <span className="world-teaser__shade" />
        </div>

        <div className="world-teaser__copy">
          <p className="world-teaser__label">
            <T>Creative area</T>
          </p>

          <h2 id="world-title" className="world-teaser__title">
            Walter&rsquo;s World
          </h2>

          <p className="world-teaser__text">
            <T>An illustrated, interactive Japanese garage with my projects, music and certificates.</T>
          </p>

          <WorldButton
            size="lg"
            label="Enter Walter's World"
            className="mt-7"
          />
        </div>
      </div>
    </section>
  );
}