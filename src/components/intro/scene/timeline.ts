// Línea de tiempo central de la intro: qué valor tiene cada elemento en cada segundo.
/**
 * The central timeline. Everything in the intro reads its value for the
 * current second from here, so speed, lights, lid, screen, camera and the
 * hand-off to the page stay in sync.
 *
 *  0.0–1.8  Hyperspeed      flying through the light trails
 *  1.8–3.0  The Arrival     slowing down, the laptop appears, trails peel off
 *  3.0–4.2  The Orbit       camera circles the closed laptop
 *  4.2–5.5  The Awakening   the lid opens, keys light up, screen wakes
 *  5.5–7.0  Enter My World  the camera flies into the screen
 */
/** when the wrap-around trails leave the road, reach the device and run out */
export const TRAILS = { start: 1.35, arrive: 2.5, end: 4.9 } as const;

export const PHASE = { arrival: 1.8, orbit: 3.0, awakening: 4.2, enter: 5.5, end: 7.0, hero: 6.35, pageIn: 5.3 } as const;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
/** 0→1 progress of t between a and b */
const span = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
const ease = {
  inOutCubic: (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - (-2 * k + 2) ** 3 / 2),
  outCubic: (k: number) => 1 - (1 - k) ** 3,
  inCubic: (k: number) => k * k * k,
  inOutSine: (k: number) => -(Math.cos(Math.PI * k) - 1) / 2,
  /** a weighty open: soft start, longer settle, no bounce (smootherstep, skewed early) */
  hinge: (k: number) => {
    const x = k ** 0.8;
    return x * x * x * (x * (6 * x - 15) + 10);
  },
};

export type Frame = {
  pace: number;
  stretch: number;
  curvature: number;
  road: number;
  trails: number;
  env: number;
  lid: number;
  backlight: number;
  screen: number;
  page: number;
  fov: number;
  bloom: number;
};

export function sample(t: number): Frame {
  const { arrival, orbit, awakening, enter } = PHASE;
  const fadeIn = ease.outCubic(span(t, 0, 0.45));
  const slow = ease.outCubic(span(t, arrival, orbit + 0.4));
  return {
    pace: lerp(1.7, 0.08, slow),
    stretch: lerp(1.3, 0.5, span(t, 0, arrival)) * (1 - ease.inOutCubic(span(t, arrival, 2.7))),
    curvature: 1 - ease.inOutCubic(span(t, 1.5, 2.9)),
    // the road traffic hands over to the wrap-around trails: one set of lines at a time
    road: fadeIn * (1 - ease.inOutCubic(span(t, 1.45, 2.15))),
    // the wrap-around trails fade in as they leave the road; they vanish on their own
    trails: ease.outCubic(span(t, 1.4, 1.9)) * (1 - span(t, 5.9, 6.6)),
    env: ease.inOutCubic(span(t, arrival - 0.1, 2.9)),
    lid: ease.hinge(span(t, awakening, enter)),
    backlight: ease.inOutSine(span(t, 4.55, 5.35)),
    screen: ease.inOutSine(span(t, 4.95, 5.35)),
    page: ease.inOutSine(span(t, PHASE.pageIn, 5.75)),
    fov: lerp(lerp(96, 90, span(t, 0, arrival)), 38, ease.inOutCubic(span(t, arrival, orbit + 0.2))),
    bloom: lerp(0.65, 0.5, span(t, arrival, orbit)) * (1 - 0.6 * span(t, enter, 6.6)),
  };
}
