/**
 * Garage scene, in illustration pixels (the artwork is 1672 × 941).
 * Every overlay, hitbox and camera framing uses these coordinates, so the
 * garage scales to any screen without anything drifting out of place.
 *
 * The illustration is a single flattened image (base.webp). Objects are lit by
 * drawing their exact cut-out on top (see silhouettes.ts). The image itself
 * never moves; only the objects have their own animations.
 */

import { GYRO_OUTLINE, SILHOUETTES } from "./silhouettes";

export const SCENE = { width: 1672, height: 941 } as const;

export type Point = readonly [number, number];
export type Rect = { x: number; y: number; w: number; h: number };
export type SilKey = keyof typeof SILHOUETTES;


export type ZoneId =
  | "music"
  | "about"
  | "developer"
  | "archive"
  | "moments"
  | "break"
  | "engineering"
  | "projects"
  | "certificates"
  | "fortune"
  | "contact"
  | "silvia";

/** How a zone opens. Each object keeps its own V3 experience. */
export type Experience =
  | "panel"
  | "about"
  | "terminal"
  | "archive"
  | "crate"
  | "gallery"
  | "bubble"
  | "engineering"
  | "showcase"
  | "action";

export interface ZoneDef {
  id: ZoneId;
  title: string;
  /** Short name for menus. */
  label: string;
  /** Tooltip shown on hover/focus. */
  tip: string;
  experience: Experience;
  /** Cut-outs lit on hover (exact silhouettes). */
  lights: SilKey[];
  /** Invisible hitboxes. Defaults to the outline of each light. */
  hits?: Point[][];
  /** Where the tooltip points (illustration px). */
  anchor: { x: number; y: number };
  /** Area the camera frames when the zone opens (null = camera stays). */
  focus: Rect | null;
  /** Side of the screen kept free for the experience on large screens. */
  panel: "left" | "right" | "top" | "bottom";
  /** Fraction of the screen width the experience covers on that side (desktop). */
  reserve?: number;
}

const S = SILHOUETTES;
const top = (k: SilKey, dy = 6) => ({ x: S[k].x + S[k].w / 2, y: S[k].y - dy });

/*
 * Only these objects light up and react in the garage: Walter, the laptop,
 * the project sleeves, the camera, the Silvia, the gyroscope, both book stacks,
 * the turntable, the certificates and the tool chest on the back shelf.
 * Engineering Corner and Let's talk stay available
 * from the Explore menu (and the terminal), without a hotspot in the scene.
 */
export const ZONES: ZoneDef[] = [
  {
    id: "fortune",
    title: "Fortune.exe",
    label: "Fortune.exe",
    tip: "Fortune.exe",
    experience: "panel",
    lights: ["compressor"],
    anchor: top("compressor"),
    focus: { x: 640, y: 300, w: 200, h: 150 },
    panel: "right",
  },
  {
    id: "silvia",
    title: "Silvia",
    label: "Silvia",
    tip: "Silvia S15",
    experience: "action",
    lights: ["car"],
    anchor: { x: 380, y: 352 },
    focus: null,
    panel: "right",
  },
  {
    id: "break",
    title: "Little Break",
    label: "Little break",
    tip: "Little Break",
    experience: "bubble",
    lights: ["gyroBase"],
    hits: [GYRO_OUTLINE],
    anchor: { x: 490, y: 514 },
    focus: null,
    panel: "right",
  },
  {
    id: "archive",
    title: "Personal Archive",
    label: "My story",
    tip: "Personal Archive",
    experience: "archive",
    lights: ["booksL", "booksR"],
    anchor: top("booksL"),
    focus: null,
    panel: "right",
  },
  {
    id: "moments",
    title: "Captured Moments",
    label: "Moments",
    tip: "Captured Moments",
    experience: "gallery",
    lights: ["camera"],
    anchor: top("camera"),
    focus: null,
    panel: "right",
  },
  {
    id: "music",
    title: "The Soundtrack",
    label: "Music",
    tip: "The Soundtrack",
    experience: "crate",
    lights: ["turntable"],
    anchor: top("turntable"),
    focus: { x: 1360, y: 330, w: 300, h: 260 },
    panel: "left",
    reserve: 0.62,
  },
  {
    id: "projects",
    title: "My work",
    label: "Projects",
    tip: "My work",
    experience: "panel",
    lights: [],
    hits: [],
    anchor: { x: 836, y: 694 },
    focus: { x: 58, y: 690, w: 1614, h: 235 },
    panel: "top",
  },
  {
    id: "certificates",
    title: "Certificates",
    label: "Certificates",
    tip: "Diplomas & certificates",
    experience: "showcase",
    lights: [],
    hits: [],
    anchor: { x: 1395, y: 328 },
    focus: { x: 1340, y: 100, w: 320, h: 220 },
    panel: "left",
  },
  // the laptop is listed after Walter so its hitbox sits in front of his hands
  {
    id: "about",
    title: "About me",
    label: "About me",
    tip: "About me",
    experience: "about",
    lights: ["character"],
    anchor: { x: 812, y: 300 },
    focus: { x: 600, y: 260, w: 420, h: 430 },
    panel: "right",
  },
  {
    id: "developer",
    title: "The Developer",
    label: "Terminal",
    tip: "The Developer",
    experience: "terminal",
    lights: ["laptop"],
    anchor: { x: 1168, y: 470 },
    focus: { x: 800, y: 440, w: 470, h: 250 },
    panel: "right",
  },
  // menu only
  {
    id: "engineering",
    title: "Engineering Corner",
    label: "Engineering",
    tip: "Engineering Corner",
    experience: "engineering",
    lights: [],
    hits: [],
    anchor: { x: 1144, y: 72 },
    focus: { x: 930, y: 60, w: 430, h: 430 },
    panel: "left",
    reserve: 0.4,
  },
  {
    id: "contact",
    title: "Let's talk",
    label: "Let's talk",
    tip: "Let's talk",
    experience: "panel",
    lights: [],
    hits: [],
    anchor: { x: 1290, y: 540 },
    focus: { x: 1150, y: 470, w: 320, h: 220 },
    panel: "left",
  },
];

export const zoneById = (id: ZoneId) => ZONES.find((z) => z.id === id)!;
export const hitsOf = (z: ZoneDef): Point[][] => z.hits ?? z.lights.flatMap((k) => [S[k].outline, ...S[k].extra]);

/** Menu order: everything in the garage, by what it opens. */
export const MENU_ORDER: ZoneId[] = ["projects", "archive", "music", "moments", "certificates", "fortune", "break", "about", "developer", "engineering", "contact"];

/** Project sleeves in the crate at the front (cut-outs from the pack). */
export const COVERS = {
  regresion: "cover_hotspots",
  toeic: "cover_regresion",
  hotspots: "cover_toeic",
  academic: "cover_hydra",
  race: "cover_quantum",
} as const satisfies Record<string, SilKey>;

/** Picture frames on the certifications wall (paper area, TL TR BR BL). */
export const FRAMES: Point[][] = [
  [[1350, 129], [1430, 130], [1431, 198], [1357, 203]],
  [[1460, 126], [1536, 122], [1536, 193], [1460, 197]],
  [[1565, 120], [1646, 114], [1647, 186], [1566, 191]],
  [[1357, 241], [1432, 237], [1432, 304], [1357, 306]],
  [[1461, 235], [1538, 231], [1539, 301], [1461, 304]],
  [[1566, 231], [1648, 227], [1648, 298], [1567, 300]],
];

/** Turntable geometry (illustration px): record ellipse and tonearm pivot. */
export const TURNTABLE = {
  record: { cx: 1509, cy: 503, rx: 69, ry: 11.5 },
  label: { cx: 1510, cy: 502, rx: 24, ry: 5 },
  pivot: { x: 1594, y: 490 },
  /** Headshell positions: resting off the record / playing near the outer groove. */
  rest: { x: 1589, y: 512 },
  play: { x: 1552, y: 501 },
};

export const toPoints = (pts: readonly Point[]) => pts.map((p) => p.join(",")).join(" ");
