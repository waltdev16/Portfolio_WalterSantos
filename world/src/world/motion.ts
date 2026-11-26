/**
 * Motion system. Every animation in the room uses these values so hover,
 * selection, opening and closing feel like one piece.
 */
export const MOTION = {
  hover: 0.3, // glow + tooltip
  select: 0.42, // feedback on click, before the experience opens
  open: 1.1, // camera + experience entrance (0.7–1.4 depending on the object)
  close: 0.85, // reverse transition back to the room
  ease: {
    out: "power3.out",
    inOut: "power3.inOut",
    in: "power2.in",
  },
} as const;
