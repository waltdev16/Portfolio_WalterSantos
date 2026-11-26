// Constantes de animación compartidas: curvas, duraciones y escalonado.
/**
 * Shared motion tokens — every animation in the site uses these,
 * so timings feel consistent from section to section.
 */
export const EASE = [0.22, 1, 0.36, 1] as const;

export const DUR = {
  fast: 0.35,
  base: 0.7,
  slow: 1.1,
} as const;

export const STAGGER = 0.06;

/** Viewport trigger used by scroll-in animations. */
export const VIEWPORT = { once: true, margin: "0px 0px -12% 0px" } as const;
