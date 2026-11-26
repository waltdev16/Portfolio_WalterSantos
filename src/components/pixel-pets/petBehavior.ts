// Comportamiento de las mascotas: máquina de estados por mascota y eventos especiales ocasionales.
/**
 * Autonomous behaviour: one small state machine per pet, plus a director that
 * now and then stages an interaction or an easter egg. Pure data and numbers,
 * no React; the simulation hook renders the result.
 */
import type { Expression, PetDefinition } from "./petDefinitions";
import { translate } from "@/i18n/t";
import { readLang } from "@/i18n/lang";

export type State =
  | "idle"
  | "walk"
  | "run"
  | "jump"
  | "sleep"
  | "wake"
  | "curious"
  | "surprised"
  | "interact"
  | "think"
  | "special";

export type Pet = {
  def: PetDefinition;
  x: number;
  /** height above the shelf, px */
  y: number;
  vy: number;
  dir: 1 | -1;
  state: State;
  timer: number;
  target: number;
  clock: number;
  blinkIn: number;
  blinking: number;
  expr: Expression;
  typing: boolean;
  /** 0..1, used by Null's glitch */
  opacity: number;
  bubble: string;
  bubbleFor: number;
  showName: number;
  partner: Pet | null;
  /** queued steps of an easter egg */
  script: { at: number; run: (p: Pet) => void }[];
  scriptClock: number;
};

export type World = {
  width: number;
  size: number;
  /** cursor position relative to the shelf, or null when far away */
  cursor: { x: number; y: number } | null;
  hovered: Pet | null;
  pets: Pet[];
  eventIn: number;
};

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T,>(items: [T, number][]) => {
  const total = items.reduce((s, [, w]) => s + w, 0);
  let r = Math.random() * total;
  for (const [v, w] of items) if ((r -= w) <= 0) return v;
  return items[0][0];
};

export function createPet(def: PetDefinition, x: number): Pet {
  return {
    def,
    x,
    y: def.floats ? 6 : 0,
    vy: 0,
    dir: Math.random() > 0.5 ? 1 : -1,
    state: "idle",
    timer: rand(0.6, 2.4),
    target: x,
    clock: Math.random() * 10,
    blinkIn: rand(1.5, 4),
    blinking: 0,
    expr: "neutral",
    typing: false,
    opacity: 1,
    bubble: "",
    bubbleFor: 0,
    showName: 0,
    partner: null,
    script: [],
    scriptClock: 0,
  };
}

export function say(p: Pet, text: string, seconds = 2.4) {
  // bubbles follow the visitor's language (exact phrases; partial typing is pre-translated)
  p.bubble = translate(text, readLang());
  p.bubbleFor = seconds;
}

function enter(p: Pet, state: State, w: World, seconds?: number) {
  p.state = state;
  p.partner = state === "interact" ? p.partner : null;
  p.typing = false;
  const max = w.width - w.size;
  switch (state) {
    case "walk":
    case "run": {
      let to = rand(0, max);
      if (Math.abs(to - p.x) < 30) to = p.x < max / 2 ? Math.min(max, p.x + rand(40, 120)) : Math.max(0, p.x - rand(40, 120));
      p.target = to;
      p.dir = to > p.x ? 1 : -1;
      p.timer = 12;
      break;
    }
    case "jump":
      p.vy = rand(150, 190);
      p.target = p.x;
      p.timer = 2;
      break;
    case "sleep":
      p.timer = seconds ?? rand(5, 10);
      break;
    case "wake":
      p.timer = 0.9;
      break;
    case "think":
      p.timer = seconds ?? rand(2, 3.5);
      if (p.def.id === "walt" && Math.random() < 0.5) p.typing = true;
      break;
    default:
      p.timer = seconds ?? rand(1.4, 3.5);
  }
}

function chooseNext(p: Pet, w: World) {
  const m = p.def.mood;
  const next = pick<State>([
    ["walk", m.walk],
    ["run", m.run],
    ["jump", m.jump * 0.6],
    ["sleep", m.sleep * 0.5],
    ["think", m.think * 0.6],
    ["idle", m.idle],
  ]);
  enter(p, next, w);
}

/** the pet closest to `p` in the direction it is heading, within `range` px */
function ahead(p: Pet, w: World, range: number) {
  let best: Pet | null = null;
  let bestD = range;
  for (const o of w.pets) {
    if (o === p || o.opacity < 0.5) continue;
    const d = (o.x - p.x) * p.dir;
    if (d > 0 && d < bestD) {
      best = o;
      bestD = d;
    }
  }
  return best;
}

export function tickPet(p: Pet, w: World, dt: number) {
  p.clock += dt;
  p.timer -= dt;
  p.bubbleFor = Math.max(0, p.bubbleFor - dt);
  if (!p.bubbleFor) p.bubble = "";
  p.showName = Math.max(0, p.showName - dt);

  // blinking, on its own rhythm
  p.blinkIn -= dt;
  if (p.blinkIn <= 0) {
    p.blinking = 0.14;
    p.blinkIn = rand(2, 5.5);
  }
  p.blinking = Math.max(0, p.blinking - dt);

  // a scripted moment (easter egg) takes over until it ends
  if (p.script.length) {
    p.scriptClock += dt;
    while (p.script.length && p.scriptClock >= p.script[0].at) p.script.shift()!.run(p);
  }

  const max = w.width - w.size;
  const floor = p.def.floats ? 6 + Math.sin(p.clock * 2.2) * 2.5 : 0;

  // gravity for jumps; floaters bob instead
  if (p.state === "jump" || p.y > floor + 0.5) {
    p.vy -= 520 * dt;
    p.y += p.vy * dt;
    if (p.y <= floor) {
      p.y = floor;
      p.vy = 0;
      if (p.state === "jump") enter(p, "idle", w, rand(0.6, 1.4));
    }
  } else {
    p.y = floor;
  }

  // the hovered pet freezes and looks up
  if (w.hovered === p && p.state !== "jump") {
    p.expr = "surprised";
    p.showName = 0.4;
    return;
  }

  switch (p.state) {
    case "walk":
    case "run": {
      const speed = p.def.speed * (p.state === "run" ? 2.3 : 1);
      p.x += p.dir * speed * dt;
      const o = ahead(p, w, w.size * 0.9);
      if (o && !p.def.floats && !o.def.floats) {
        const r = Math.random();
        if (r < 0.45 && o.state !== "sleep" && o.state !== "special") {
          // meet: both stop and look at each other
          p.partner = o;
          o.partner = p;
          enter(p, "interact", w, 1.8);
          o.state = "interact";
          o.timer = 1.8;
          o.dir = p.dir === 1 ? -1 : 1;
          if (o.def.id === "ember") {
            o.state = "jump";
            o.vy = 160;
          }
        } else if (r < 0.65) {
          // try to leap over it
          p.vy = 210;
          p.state = "jump";
          p.target = Math.min(max, Math.max(0, p.x + p.dir * w.size * 2));
        } else {
          p.dir = p.dir === 1 ? -1 : 1;
          p.target = Math.min(max, Math.max(0, p.x + p.dir * rand(30, 90)));
        }
      }
      if ((p.dir > 0 && p.x >= p.target) || (p.dir < 0 && p.x <= p.target) || p.timer <= 0) {
        p.x = Math.min(max, Math.max(0, p.x));
        enter(p, "idle", w);
      }
      p.expr = "neutral";
      break;
    }
    case "jump":
      // keep drifting in the direction of travel while airborne
      if (p.target !== p.x) p.x += p.dir * p.def.speed * 2.2 * dt;
      p.expr = "happy";
      break;
    case "sleep":
      p.expr = "sleep";
      if (!p.bubble && Math.random() < dt * 0.6) say(p, "z z", 1.4);
      if (p.timer <= 0) enter(p, "wake", w);
      break;
    case "wake":
      p.expr = "surprised";
      if (p.timer <= 0) enter(p, "idle", w);
      break;
    case "think":
      p.expr = "think";
      if (!p.bubble) say(p, "...", p.timer);
      if (p.timer <= 0) enter(p, "idle", w);
      break;
    case "interact":
      p.expr = "happy";
      if (p.partner) p.dir = p.partner.x > p.x ? 1 : -1;
      if (p.timer <= 0) enter(p, "idle", w);
      break;
    case "curious":
      p.expr = "look";
      if (w.cursor) {
        const goal = Math.min(max, Math.max(0, w.cursor.x - w.size / 2));
        const d = goal - p.x;
        p.dir = d > 0 ? 1 : -1;
        if (Math.abs(d) > w.size * 0.7) p.x += p.dir * p.def.speed * 1.2 * dt;
      }
      if (p.timer <= 0 || !w.cursor) enter(p, "idle", w);
      break;
    case "surprised":
      p.expr = "surprised";
      if (p.timer <= 0) enter(p, "idle", w);
      break;
    case "special":
      if (p.timer <= 0 && !p.script.length) enter(p, "idle", w);
      break;
    default: {
      // idle: the pet nearest the cursor turns to look at it
      p.expr = "neutral";
      if (w.cursor && nearestToCursor(w) === p) {
        p.dir = w.cursor.x > p.x + w.size / 2 ? 1 : -1;
        p.expr = "look";
        if (Math.random() < dt * 0.35) enter(p, "curious", w, rand(2, 3.5));
      }
      // two pets standing on the same spot: one steps aside
      if (!p.def.floats && p.partner === null) {
        const crowd = w.pets.find((o) => o !== p && !o.def.floats && o.state !== "jump" && Math.abs(o.x - p.x) < w.size * 0.6);
        if (crowd && w.pets.indexOf(crowd) < w.pets.indexOf(p) && p.state === "idle") {
          const max = w.width - w.size;
          p.dir = p.x >= crowd.x ? 1 : -1;
          if ((p.dir > 0 && p.x > max - w.size) || (p.dir < 0 && p.x < w.size)) p.dir = p.dir === 1 ? -1 : 1;
          p.state = "walk";
          p.target = Math.min(max, Math.max(0, crowd.x + p.dir * w.size * 1.1));
          p.timer = 4;
          break;
        }
      }
      if (p.timer <= 0) chooseNext(p, w);
    }
  }
  p.x = Math.min(max, Math.max(0, p.x));
}

function nearestToCursor(w: World) {
  if (!w.cursor) return null;
  let best: Pet | null = null;
  let bestD = 160;
  for (const p of w.pets) {
    const d = Math.abs(p.x + w.size / 2 - w.cursor.x);
    if (d < bestD) {
      best = p;
      bestD = d;
    }
  }
  return best;
}

/** a click: hop, a greeting and the pet's line */
export function poke(p: Pet, w: World) {
  p.script = [];
  enter(p, "jump", w);
  p.vy = 200;
  p.target = p.x;
  say(p, p.def.line, 2.4);
  p.showName = 2.4;
}

/** the director: rare, unexpected moments */
export function stageEvent(w: World) {
  const free = w.pets.filter((p) => !p.script.length && p.state !== "jump" && w.hovered !== p);
  const byId = (id: string) => free.find((p) => p.def.id === id);
  const events: [() => boolean, number][] = [
    [() => {
      const p = byId("walt");
      if (!p) return false;
      p.state = "special";
      p.timer = 4;
      p.typing = true;
      p.expr = "think";
      p.scriptClock = 0;
      const text = translate("Hello, world!", readLang());
      p.script = Array.from({ length: text.length }, (_, i) => ({ at: 0.15 * (i + 1), run: (q: Pet) => say(q, text.slice(0, i + 1) + (i < text.length - 1 ? "_" : ""), 2) }));
      p.script.push({ at: 0.15 * text.length + 0.2, run: (q) => { q.typing = false; q.expr = "happy"; } });
      return true;
    }, 3],
    [() => {
      const p = byId("null");
      if (!p) return false;
      p.state = "special";
      p.timer = 3;
      p.scriptClock = 0;
      const flick = (o: number) => (q: Pet) => (q.opacity = o);
      p.script = [
        { at: 0, run: flick(0.3) }, { at: 0.08, run: flick(1) }, { at: 0.16, run: flick(0.2) }, { at: 0.24, run: flick(0) },
        { at: 1.4, run: (q) => { q.x = rand(0, w.width - w.size); q.opacity = 0.4; } },
        { at: 1.5, run: flick(1) }, { at: 1.58, run: flick(0.5) }, { at: 1.66, run: (q) => { q.opacity = 1; say(q, "404: Ghost found", 2); } },
      ];
      return true;
    }, 2],
    [() => {
      const p = byId("byte");
      if (!p) return false;
      p.state = "special";
      p.timer = 5;
      p.scriptClock = 0;
      p.script = [
        { at: 0, run: (q) => { q.expr = "error"; say(q, "ERR 0x0B", 1.4); } },
        { at: 1.4, run: (q) => { q.expr = "sleep"; say(q, "rebooting...", 1.6); } },
        { at: 3.1, run: (q) => { q.expr = "happy"; say(q, "System online", 1.8); } },
      ];
      return true;
    }, 2],
    [() => {
      const p = byId("ember");
      if (!p) return false;
      p.state = "special";
      p.timer = 2.6;
      p.scriptClock = 0;
      const hop = (q: Pet) => { q.vy = 170; q.y = Math.max(q.y, 0.6); q.expr = "happy"; };
      p.script = [{ at: 0, run: (q) => { hop(q); say(q, "!!", 2.2); } }, { at: 0.75, run: hop }, { at: 1.5, run: hop }];
      return true;
    }, 2],
    [() => {
      // two pets fall asleep side by side
      const sleepy = free.filter((p) => !p.def.floats).sort(() => Math.random() - 0.5).slice(0, 2);
      if (sleepy.length < 2) return false;
      const [a, b] = sleepy;
      const spot = Math.min(w.width - w.size * 2.2, Math.max(0, a.x));
      a.x = Math.min(a.x, spot);
      enter(a, "sleep", w, 7);
      b.target = spot + w.size * 1.05;
      b.dir = b.target > b.x ? 1 : -1;
      b.state = "walk";
      b.timer = 8;
      b.scriptClock = 0;
      b.script = [{ at: Math.abs(b.target - b.x) / b.def.speed + 0.1, run: (q) => enter(q, "sleep", w, 6.5) }];
      return true;
    }, 1.5],
  ];
  const order = [...events].sort(() => Math.random() - 0.5);
  const choice = pick(order.map(([fn, wgt]) => [fn, wgt] as [() => boolean, number]));
  if (!choice()) order.some(([fn]) => fn());
  w.eventIn = rand(16, 32);
}
