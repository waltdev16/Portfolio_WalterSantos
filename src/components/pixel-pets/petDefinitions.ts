// Diseño de cada mascota en pixel art (WALT.exe, Ember, Byte y Null).
/**
 * The four pixel pets: 16×16 sprites drawn pixel by pixel, one function per
 * pet. Each sprite reacts to a `Pose` (walk frame, blink, expression), so the
 * same function covers idle, walking, sleeping, surprise and so on.
 */
export type Expression = "neutral" | "happy" | "surprised" | "sleep" | "think" | "error" | "look";
export type Pose = { frame: number; blink: boolean; expr: Expression; typing?: boolean };
type Px = (x: number, y: number, w: number, h: number, color: string) => void;

export type PetId = "ember" | "null" | "byte" | "walt";

export type PetDefinition = {
  id: PetId;
  name: string;
  /** shown on hover and on click */
  line: string;
  /** px per second when walking */
  speed: number;
  /** relative appetite for each autonomous choice */
  mood: { walk: number; run: number; jump: number; sleep: number; think: number; idle: number };
  /** floats above the shelf instead of standing on it */
  floats?: boolean;
  draw: (px: Px, p: Pose) => void;
};

const ember: PetDefinition = {
  id: "ember",
  name: "Ember",
  line: "Thinking...",
  speed: 34,
  mood: { walk: 5, run: 3, jump: 3, sleep: 1, think: 1, idle: 2 },
  draw(px, p) {
    const body = "#d9794a", shade = "#b35c33", light = "#ee9b68", flame = "#f3b65b", tip = "#fbe3a2", ink = "#2a1812";
    // a small flame tuft that flickers
    const f = p.frame % 2;
    px(8 - f, 2, 1, 1, tip);
    px(7, 3, 2, 1, flame);
    px(6 + f, 4, 3, 1, flame);
    px(5, 5, 6, 1, flame);
    // round body
    px(5, 6, 6, 1, body);
    px(4, 7, 8, 1, body);
    px(3, 8, 10, 5, body);
    px(4, 13, 8, 1, shade);
    px(12, 8, 1, 5, shade);
    px(4, 8, 2, 1, light);
    px(3, 9, 1, 2, light);
    // feet
    px(f ? 4 : 5, 14, 2, 1, shade);
    px(f ? 10 : 9, 14, 2, 1, shade);
    // face
    if (p.expr === "sleep" || p.blink) {
      px(5, 10, 2, 1, ink);
      px(9, 10, 2, 1, ink);
    } else if (p.expr === "happy") {
      px(5, 10, 1, 1, ink); px(6, 9, 1, 1, ink);
      px(9, 9, 1, 1, ink); px(10, 10, 1, 1, ink);
    } else if (p.expr === "surprised") {
      px(5, 9, 2, 2, ink);
      px(9, 9, 2, 2, ink);
      px(7, 12, 2, 1, ink);
    } else {
      const d = p.expr === "look" ? 1 : 0;
      px(6 + d, 9, 1, 2, ink);
      px(9 + d, 9, 1, 2, ink);
    }
  },
};

const ghost: PetDefinition = {
  id: "null",
  name: "Null",
  line: "404: Ghost found",
  speed: 18,
  floats: true,
  mood: { walk: 4, run: 0, jump: 0, sleep: 1, think: 2, idle: 4 },
  draw(px, p) {
    const c = "#dfe3e9", shade = "#b8bfc9", ink = "#0c0e12";
    px(6, 2, 4, 1, c);
    px(5, 3, 6, 1, c);
    px(4, 4, 8, 1, c);
    px(3, 5, 10, 8, c);
    px(12, 6, 1, 7, shade);
    // wavy hem, two frames
    const hem = p.frame % 2 ? [4, 7, 10] : [3, 6, 9, 12];
    hem.forEach((x) => px(x, 13, 2, 1, c));
    hem.forEach((x) => px(x + 1, 13, 1, 1, shade));
    if (p.expr === "sleep" || p.blink) {
      px(5, 8, 2, 1, ink);
      px(9, 8, 2, 1, ink);
    } else if (p.expr === "surprised") {
      px(5, 6, 2, 3, ink);
      px(9, 6, 2, 3, ink);
      px(7, 10, 2, 2, ink);
    } else if (p.expr === "happy") {
      px(5, 8, 1, 1, ink); px(6, 7, 1, 1, ink);
      px(9, 7, 1, 1, ink); px(10, 8, 1, 1, ink);
    } else {
      const d = p.expr === "look" ? 1 : 0;
      px(5 + d, 7, 2, 2, ink);
      px(9 + d, 7, 2, 2, ink);
    }
  },
};

const byte: PetDefinition = {
  id: "byte",
  name: "Byte",
  line: "System online",
  speed: 22,
  mood: { walk: 3, run: 1, jump: 1, sleep: 3, think: 3, idle: 3 },
  draw(px, p) {
    const shell = "#c9bfa6", shade = "#a59a80", glass = "#1b2126", face = "#a6d6a0", err = "#e5584e", ink = "#5d5546";
    px(1, 2, 14, 10, shell);
    px(1, 11, 14, 1, shade);
    px(14, 2, 1, 10, shade);
    px(3, 3, 10, 7, glass);
    px(12, 10, 1, 1, ink); // power led
    px(6, 12, 4, 1, shade); // neck
    const f = p.frame % 2;
    px(f ? 4 : 5, 13, 2, 2, ink);
    px(f ? 10 : 9, 13, 2, 2, ink);
    const e = p.expr;
    if (e === "error") {
      [[4, 4], [5, 5], [6, 4], [4, 6], [6, 6]].forEach(([x, y]) => px(x, y, 1, 1, err));
      [[9, 4], [10, 5], [11, 4], [9, 6], [11, 6]].forEach(([x, y]) => px(x, y, 1, 1, err));
      px(6, 8, 4, 1, err);
    } else if (e === "sleep" || p.blink) {
      px(5, 6, 2, 1, face);
      px(9, 6, 2, 1, face);
      if (e === "sleep") px(7, 8, 2, 1, face);
    } else if (e === "think") {
      px(5 + (p.frame % 3) * 2, 6, 1, 1, face);
      px(5, 6, 1, 1, face);
      px(7, 6, 1, 1, face);
      px(9, 6, 1, 1, face);
    } else if (e === "happy") {
      px(5, 6, 1, 1, face); px(6, 5, 1, 1, face); px(7, 6, 1, 1, face);
      px(9, 6, 1, 1, face); px(10, 5, 1, 1, face); px(11, 6, 1, 1, face);
      px(6, 8, 4, 1, face);
    } else if (e === "surprised") {
      px(5, 5, 2, 2, face);
      px(9, 5, 2, 2, face);
      px(7, 8, 2, 1, face);
    } else {
      const d = e === "look" ? 1 : 0;
      px(5 + d, 5, 1, 2, face);
      px(10 + d, 5, 1, 2, face);
      px(6, 8, 4, 1, face);
    }
  },
};

const walt: PetDefinition = {
  id: "walt",
  name: "WALT.exe",
  line: "Hello, world!",
  speed: 28,
  mood: { walk: 4, run: 2, jump: 2, sleep: 1, think: 3, idle: 3 },
  draw(px, p) {
    const metal = "#d6dce4", shade = "#a7b0bc", visor = "#10141a", eye = "#c6f432", dark = "#3a414b", bolt = "#7d8794";
    // antenna
    px(8, 0, 1, 1, p.blink ? bolt : eye);
    px(8, 1, 1, 1, bolt);
    // head with a wide dark visor
    px(3, 2, 10, 6, metal);
    px(12, 2, 1, 6, shade);
    px(3, 7, 10, 1, shade);
    px(2, 4, 1, 2, bolt);
    px(13, 4, 1, 2, bolt);
    px(4, 3, 8, 3, visor);
    const e = p.expr;
    if (e === "sleep" || p.blink) {
      px(5, 5, 2, 1, "#5c6b1e");
      px(9, 5, 2, 1, "#5c6b1e");
    } else if (e === "happy") {
      px(5, 4, 1, 1, eye); px(6, 3, 1, 1, eye);
      px(9, 3, 1, 1, eye); px(10, 4, 1, 1, eye);
    } else if (e === "surprised") {
      px(5, 3, 2, 3, eye);
      px(9, 3, 2, 3, eye);
    } else if (e === "think") {
      px(6, 3, 1, 1, eye);
      px(10, 3, 1, 1, eye);
    } else {
      const d = e === "look" ? 1 : 0;
      px(5 + d, 4, 2, 1, eye);
      px(9 + d, 4, 2, 1, eye);
    }
    // body with a small status light
    px(5, 8, 6, 5, metal);
    px(10, 8, 1, 5, shade);
    px(7, 10, 2, 1, p.frame % 2 ? eye : "#7dd3fc");
    // arms: they tap a keyboard while typing
    const up = p.typing ? p.frame % 2 : 0;
    px(4, 9 - up, 1, 3, shade);
    px(11, 9 - (p.typing ? 1 - up : 0), 1, 3, shade);
    // tracks
    const f = p.frame % 2;
    px(4, 13, 3, 2, dark);
    px(9, 13, 3, 2, dark);
    px(f ? 4 : 5, 14, 1, 1, bolt);
    px(f ? 10 : 11, 14, 1, 1, bolt);
  },
};

export const PETS: PetDefinition[] = [walt, ember, byte, ghost];
