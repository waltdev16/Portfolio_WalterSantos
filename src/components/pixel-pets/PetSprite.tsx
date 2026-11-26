"use client";

// Canvas de 16×16 donde se dibuja cada mascota.

import { forwardRef } from "react";

/** A 16×16 canvas, scaled up with crisp pixels. Drawn by the simulation. */
export const PetSprite = forwardRef<HTMLCanvasElement>(function PetSprite(_, ref) {
  return <canvas ref={ref} width={16} height={16} className="pixel-pet__sprite" aria-hidden="true" />;
});
