"use client";

// Repisa plateada del Hero con las cuatro mascotas pixel.

import { useRef } from "react";
import { PETS } from "./petDefinitions";
import { PixelPet } from "./PixelPet";
import { usePetSimulation } from "./usePetSimulation";
import "./pixel-pets.css";
import { useT } from "@/i18n/t";

/**
 * A thin silver shelf with four pixel pets living on it: WALT.exe, Ember,
 * Byte and Null. Each one wanders, rests, reacts to the others and to the
 * cursor on its own.
 */
export function PetShelf({ className }: { className?: string }) {
  const shelf = useRef<HTMLDivElement>(null);
  const { refs, api } = usePetSimulation(shelf);
  const t = useT();
  return (
    <div ref={shelf} className={`pet-shelf ${className ?? ""}`} role="group" aria-label={t("Pixel pets")}>
      <div className="pet-shelf__stage">
        {PETS.map((def, i) => (
          <PixelPet
            key={def.id}
            def={def}
            register={(part, el) => {
              refs.current[i][part] = el;
            }}
            onPoke={() => api.current.poke(i)}
            onHover={(on) => api.current.hover(i, on)}
          />
        ))}
      </div>
      <span className="pet-shelf__line" aria-hidden="true" />
    </div>
  );
}
