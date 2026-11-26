"use client";

// Una mascota: botón accesible que la simulación mueve.

import type { PetDefinition } from "./petDefinitions";
import { PetSprite } from "./PetSprite";
import { PetBubble, PetName } from "./PetTooltip";
import { useT } from "@/i18n/t";

export type PetRefs = {
  root: HTMLButtonElement | null;
  sprite: HTMLCanvasElement | null;
  bubble: HTMLSpanElement | null;
  name: HTMLSpanElement | null;
};

/**
 * One pet: a button (so it can be clicked or focused with the keyboard) that
 * the simulation moves with transforms. React renders it once.
 */
export function PixelPet({ def, register, onPoke, onHover }: { def: PetDefinition; register: <K extends keyof PetRefs>(part: K, el: PetRefs[K]) => void; onPoke: () => void; onHover: (on: boolean) => void }) {
  return (
    <button
      type="button"
      ref={(el) => register("root", el)}
      className="pixel-pet"
      data-pet={def.id}
      aria-label={`${def.name}, ${useT()("a pixel pet. Say hello")}`}
      onClick={onPoke}
      onPointerEnter={() => onHover(true)}
      onPointerLeave={() => onHover(false)}
      onFocus={() => onHover(true)}
      onBlur={() => onHover(false)}
    >
      <PetBubble ref={(el) => register("bubble", el)} />
      <PetName name={def.name} ref={(el) => register("name", el)} />
      <span className="pixel-pet__body">
        <PetSprite ref={(el) => register("sprite", el)} />
      </span>
    </button>
  );
}
