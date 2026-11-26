/**
 * Optional interface sounds. Off until the visitor turns them on.
 *
 * If an audio file is listed in FILES and exists in /public/world/audio,
 * it is used; otherwise a short tone is synthesised with Web Audio, so the
 * system works with no files at all. No music is ever played from here.
 */

export type Cue = "hover" | "select" | "back" | "open";

const FILES: Partial<Record<Cue, string>> = {
  // select: "/world/audio/select.mp3",
};

const TONES: Record<Cue, { f: number; to: number; d: number; v: number; type: OscillatorType }> = {
  hover: { f: 880, to: 990, d: 0.05, v: 0.025, type: "sine" },
  select: { f: 520, to: 780, d: 0.12, v: 0.05, type: "triangle" },
  open: { f: 330, to: 660, d: 0.22, v: 0.045, type: "triangle" },
  back: { f: 620, to: 410, d: 0.14, v: 0.04, type: "triangle" },
};

let enabled = false;
/** The visitor pressed the mute button themselves (direct actions like revving then stay silent too). */
let mutedByUser = false;
let ctx: AudioContext | null = null;
const buffers = new Map<Cue, AudioBuffer | null>();
const listeners = new Set<(on: boolean) => void>();

export const sound = {
  get enabled() {
    return enabled;
  },
  setEnabled(on: boolean) {
    enabled = on;
    mutedByUser = !on;
    if (on) {
      ctx ??= new AudioContext();
      void ctx.resume();
      void preload();
    }
    listeners.forEach((l) => l(on));
  },
  subscribe(l: (on: boolean) => void) {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
  play(cue: Cue) {
    if (!enabled || !ctx) return;
    const buf = buffers.get(cue);
    if (buf) {
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.connect(ctx.destination);
      src.start();
      return;
    }
    const t = TONES[cue];
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = t.type;
    osc.frequency.setValueAtTime(t.f, now);
    osc.frequency.exponentialRampToValueAtTime(t.to, now + t.d);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(t.v, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + t.d + 0.08);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + t.d + 0.1);
  },
};

/*
 * Engine sound of the Silvia.
 *
 * 1. A real recording, if one is placed in /public/world/audio/ as
 *    silvia-rev.mp3, .ogg or .wav (e.g. a Soundsnap file you licensed).
 * 2. Otherwise a synthesised rev, built sample by sample: the firing pulses of
 *    a turbo four-cylinder (two per revolution) through exhaust resonances,
 *    turbo spool, the blow-off valve when the throttle closes, and backfire
 *    bangs with crackle at the same moments the flames appear.
 * It plays on the visitor's own click unless they muted the garage.
 */

// Grabación opcional del Silvia: si existe src/world/audio/silvia-rev.(mp3|ogg|wav),
// Vite la incluye al compilar; si no existe, no se hace ninguna petición y suena el rev sintetizado.
const REV_FILES = Object.values(
  import.meta.glob<string>("./silvia-rev.{mp3,ogg,wav}", { eager: true, query: "?url", import: "default" }),
);
let revFile: AudioBuffer | null | undefined;
let revSynth: AudioBuffer | null = null;

async function loadRevFile(c: AudioContext) {
  if (revFile !== undefined) return revFile;
  revFile = null;
  for (const url of REV_FILES) {
    try {
      const res = await fetch(url);
      const type = res.headers.get("content-type") ?? "";
      // the dev server answers missing files with its HTML page: skip those
      if (!res.ok || type.includes("html")) continue;
      revFile = await c.decodeAudioData(await res.arrayBuffer());
      break;
    } catch {
      /* next format */
    }
  }
  return revFile;
}

/** Start the lookup early so the first click plays without delay. */
export function prepareRoar() {
  try {
    ctx ??= new AudioContext();
    void loadRevFile(ctx);
  } catch {
    /* no audio */
  }
}

function synthRev(c: AudioContext, pops: number[]) {
  const sr = c.sampleRate;
  const dur = 2.4;
  const N = Math.floor(sr * dur);
  const out = new Float32Array(N);
  // rpm and throttle over time
  const rpmAt = (t: number) =>
    t < 0.06 ? 950 : t < 0.5 ? 950 + (7400 - 950) * Math.pow((t - 0.06) / 0.44, 0.7) : t < 1.6 ? 1100 + (7400 - 1100) * Math.exp(-(t - 0.5) * 3.2) : 1000;
  const throttle = (t: number) => (t > 0.04 && t < 0.52 ? 1 : 0.18);
  // firing events
  let phase = 0;
  let next = 0;
  const events: { i: number; amp: number; f1: number; f2: number }[] = [];
  for (let i = 0; i < N; i++) {
    const t = i / sr;
    phase += (rpmAt(t) / 60) * 2 / sr; // 4-cyl, 4-stroke: 2 firings per rev
    if (phase >= next) {
      next += 1 + (Math.random() - 0.5) * 0.08;
      const th = throttle(t);
      events.push({ i, amp: (0.35 + th * 0.65) * (0.85 + Math.random() * 0.3), f1: 95 + Math.random() * 25, f2: 210 + Math.random() * 40 });
    }
  }
  const pulseLen = Math.floor(sr * 0.03);
  for (const e of events) {
    for (let k = 0; k < pulseLen && e.i + k < N; k++) {
      const tt = k / sr;
      const env = Math.exp(-tt / 0.0065);
      const v = Math.sin(2 * Math.PI * e.f1 * tt) * 0.7 + Math.sin(2 * Math.PI * e.f2 * tt) * 0.35 + (Math.random() * 2 - 1) * 0.35 * Math.exp(-tt / 0.0015);
      out[e.i + k] += v * env * e.amp * 0.55;
    }
  }
  // turbo spool whine + blow-off valve
  let wp = 0;
  for (let i = 0; i < N; i++) {
    const t = i / sr;
    const boost = t < 0.08 ? 0 : t < 0.52 ? Math.pow((t - 0.08) / 0.44, 1.6) : Math.max(0, 1 - (t - 0.52) * 4);
    wp += (2 * Math.PI * (1800 + boost * 4200)) / sr;
    out[i] += Math.sin(wp) * boost * 0.035;
  }
  let lp = 0;
  for (let i = Math.floor(sr * 0.55); i < Math.floor(sr * 0.95); i++) {
    const tt = i / sr - 0.55;
    const env = Math.min(1, tt / 0.01) * Math.exp(-tt / 0.11);
    const a = 0.12 + 0.25 * Math.exp(-tt * 6); // filter closes: "pssshh"
    lp += a * ((Math.random() * 2 - 1) - lp);
    out[i] += ((Math.random() * 2 - 1) - lp) * env * 0.22;
  }
  // backfires: a bang, then crackle
  for (const at of pops) {
    const i0 = Math.floor(at * sr);
    let b = 0;
    for (let k = 0; k < sr * 0.09 && i0 + k < N; k++) {
      const tt = k / sr;
      b += 0.35 * ((Math.random() * 2 - 1) - b);
      out[i0 + k] += (b * 1.6 + Math.sin(2 * Math.PI * 70 * tt) * 0.9) * Math.exp(-tt / 0.018);
    }
    for (let c2 = 0; c2 < 7; c2++) {
      const j = i0 + Math.floor(sr * (0.03 + Math.random() * 0.22));
      const amp = 0.25 + Math.random() * 0.4;
      for (let k = 0; k < sr * 0.006 && j + k < N; k++) out[j + k] += (Math.random() * 2 - 1) * amp * Math.exp(-k / (sr * 0.0012));
    }
  }
  // soft clip + fade out
  for (let i = 0; i < N; i++) {
    const fade = i > N - sr * 0.3 ? (N - i) / (sr * 0.3) : 1;
    out[i] = Math.tanh(out[i] * 1.6) * 0.8 * fade;
  }
  const buf = c.createBuffer(1, N, sr);
  buf.copyToChannel(out, 0);
  return buf;
}

export async function roar(pops: number[] = [0.55, 0.97, 1.27]) {
  if (mutedByUser) return;
  ctx ??= new AudioContext();
  void ctx.resume();
  const c = ctx;
  const file = await loadRevFile(c);
  const src = c.createBufferSource();
  const out = c.createGain();
  out.gain.value = file ? 0.9 : 0.75;
  if (file) {
    src.buffer = file;
    src.connect(out).connect(c.destination);
  } else {
    revSynth ??= synthRev(c, pops);
    src.buffer = revSynth;
    // exhaust pipe tone: warm low end, no harsh top
    const body = c.createBiquadFilter();
    body.type = "peaking";
    body.frequency.value = 120;
    body.gain.value = 5;
    const top = c.createBiquadFilter();
    top.type = "lowpass";
    top.frequency.value = 5200;
    src.connect(body).connect(top).connect(out).connect(c.destination);
  }
  src.start();
}

async function preload() {
  if (!ctx) return;
  for (const [cue, url] of Object.entries(FILES) as [Cue, string][]) {
    if (buffers.has(cue)) continue;
    try {
      const res = await fetch(url);
      buffers.set(cue, res.ok ? await ctx.decodeAudioData(await res.arrayBuffer()) : null);
    } catch {
      buffers.set(cue, null); // missing file → synthesised tone
    }
  }
}
