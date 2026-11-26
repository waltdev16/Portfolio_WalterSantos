"use client";

// Globo de texto y nombre de cada mascota.

import { forwardRef } from "react";

/** Terminal-style speech bubble; the simulation writes its text. */
export const PetBubble = forwardRef<HTMLSpanElement>(function PetBubble(_, ref) {
  return <span ref={ref} className="pixel-pet__bubble" aria-hidden="true" />;
});

/** The pet's name, shown only on hover, focus or after a click. */
export const PetName = forwardRef<HTMLSpanElement, { name: string }>(function PetName({ name }, ref) {
  return (
    <span ref={ref} className="pixel-pet__name" aria-hidden="true">
      {name}
    </span>
  );
});
