import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import gsap from "gsap";
import { CITY_LIGHTS, TOKYO } from "../../config/silhouettes";
import { TURNTABLE } from "../../config/scene";

/*
 * Garage objects that move. The illustration itself stays still; only these
 * objects animate, with transform/opacity or SVG. Paused by prefers-reduced-motion.
 */

const rand = (i: number, salt: number) => {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

/* ---------- Tokyo: lights in the windows ---------- */

export function TokyoView() {
  return (
    <div
      className="tokyo"
      style={{ left: TOKYO.x, top: TOKYO.y, width: TOKYO.w, height: TOKYO.h, maskImage: `url(${TOKYO.mask})`, WebkitMaskImage: `url(${TOKYO.mask})` }}
      aria-hidden="true"
    >
      <div className="tokyo__neon" />
      <div className="tokyo__tower" />
      {CITY_LIGHTS.map(([x, y], i) => (
        <i
          key={i}
          style={{ left: x - TOKYO.x - 2, top: y - TOKYO.y - 2, animationDuration: `${4 + rand(i, 1) * 6}s`, animationDelay: `${-rand(i, 2) * 10}s` }}
        />
      ))}
    </div>
  );
}

/*
 * Light layers are rendered from the illustration's own light sources
 * (docs/build-garage-lights.py): light on black, added with mix-blend-mode: screen.
 */
const LIGHT = {
  headlight: { src: "/world/garage/headlight-light.webp", x: 0, y: 380, w: 520, h: 280 },
  neon: { src: "/world/garage/neon-light.webp", x: 0, y: 0, w: 1672, h: 360 },
  lamp: { src: "/world/garage/lamp-light.webp", x: 150, y: 0, w: 1350, h: 620 },
};
const LightImg = ({ k, className }: { k: keyof typeof LIGHT; className?: string }) => {
  const l = LIGHT[k];
  return <img className={`lightmap ${className ?? ""}`} src={l.src} alt="" width={l.w} height={l.h} style={{ left: l.x, top: l.y }} draggable={false} />;
};

/* ---------- Lamps and neon: the bulbs breathe a little ---------- */

export function GarageLights() {
  return (
    <div className="glights" aria-hidden="true">
      <LightImg k="lamp" className="glights__lamp" />
      <LightImg k="neon" className="glights__neon" />
    </div>
  );
}

/* ---------- Intro: lights above the darkness (headlights → neon → rest) ---------- */

export function IntroLights() {
  return (
    <div className="intro-lights" aria-hidden="true">
      <img
        className="intro-lights__tokyo"
        src={TOKYO.src}
        alt=""
        style={{ left: TOKYO.x, top: TOKYO.y, width: TOKYO.w, height: TOKYO.h, maskImage: `url(${TOKYO.mask})`, WebkitMaskImage: `url(${TOKYO.mask})` }}
      />
      <div className="intro-lights__neon">
        <img src="/world/garage/neon.webp" alt="" width={1672} height={941} />
        <LightImg k="neon" />
      </div>
    </div>
  );
}

/** Headlights: the lenses light up, bloom, spill on the bumper and reflect on the floor. */
export function Headlights() {
  return (
    <div className="headlights" aria-hidden="true">
      <div className="headlights__on">
        <LightImg k="headlight" />
      </div>
    </div>
  );
}

/* ---------- Nissan Silvia: exhaust flame + headlights when touched ---------- */

export interface SilviaHandle {
  fire: () => void;
}

/** Exhaust tip under the rear bumper; the flame fires backward from here. */
const EXHAUST = { x: 623, y: 483, angle: -4 };
/** Gaming chair outline (segmented from the art): the flame passes behind it. */
const CHAIR = "783,418 749,419 722,423 700,434 694,443 676,496 673,509 673,527 645,537 636,552 644,629 649,647 682,645 680,637 682,624 681,605 685,593 695,577 701,550 735,490 753,473 757,462 774,449 783,434";

/** One flame layer: a tapered tongue along +x with a wobbling edge. */
function tongue(L: number, R: number, seed: number, t: number) {
  const n = 9;
  const top: string[] = [];
  const bot: string[] = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    const x = u * L;
    // wide near the nozzle, pinched tip, licking edge
    const r = R * Math.pow(Math.sin(Math.PI * Math.min(1, 0.18 + u * 0.92)), 0.8) * (1 - u * 0.55);
    const wob = Math.sin(u * 9 + t * 38 + seed) * R * 0.22 * u + Math.sin(u * 17 - t * 51 + seed * 2) * R * 0.12 * u;
    top.push(`${x.toFixed(1)} ${(-r + wob).toFixed(1)}`);
    bot.unshift(`${x.toFixed(1)} ${(r * 0.85 + wob * 0.7).toFixed(1)}`);
  }
  const tipY = Math.sin(t * 44 + seed) * R * 0.35;
  return `M0 ${(-R * 0.45).toFixed(1)} L${top.join(" L")} Q${(L * 1.08).toFixed(1)} ${tipY.toFixed(1)} ${bot[0]} L${bot.join(" L")} L0 ${(R * 0.4).toFixed(1)} Z`;
}

export const SilviaFlame = forwardRef<SilviaHandle, { reduced: boolean }>(function SilviaFlame({ reduced }, ref) {
  const g = useRef<SVGGElement>(null);
  const activeFlame = useRef<{ timeline: gsap.core.Timeline; stop: () => void } | null>(null);

  useImperativeHandle(ref, () => ({
    fire() {
      if (!g.current) return;
      // Every press restarts the backfire immediately, even while a previous one is running.
      activeFlame.current?.stop();
      activeFlame.current?.timeline.kill();
      activeFlame.current = null;
      const root = g.current;
      const layers = Array.from(root.querySelectorAll<SVGPathElement>("[data-l]"));
      const glow = root.querySelector<SVGGElement>(".flame__glow")!;
      const sparks = Array.from(root.querySelectorAll<SVGCircleElement>(".flame__spark"));
      const lamps = document.querySelector(".headlights__on");
      const st = { p: 0, t: 0 };
      const spec = [
        { L: 1, R: 1, k: 0 },
        { L: 0.78, R: 0.66, k: 1.7 },
        { L: 0.5, R: 0.42, k: 3.1 },
        { L: 0.2, R: 0.5, k: 4.4 },
      ];
      const sp = sparks.map(() => ({ x: 0, y: 0, vx: 0, vy: 0, life: 0 }));
      const draw = () => {
        const p = st.p;
        const L = 92 * p;
        const R = 13 * (0.6 + p * 0.4);
        root.style.opacity = p > 0.01 ? "1" : "0";
        layers.forEach((el, i) => el.setAttribute("d", p > 0.01 ? tongue(L * spec[i].L, R * spec[i].R, spec[i].k, st.t) : ""));
        glow.style.opacity = String(Math.min(1, p * 1.2));
        sp.forEach((s, i) => {
          if (s.life <= 0 && p > 0.6 && Math.random() < 0.25) Object.assign(s, { x: L * 0.3, y: (Math.random() - 0.5) * 8, vx: 140 + Math.random() * 160, vy: (Math.random() - 0.6) * 90, life: 0.35 + Math.random() * 0.3 });
          const el = sparks[i];
          el.setAttribute("cx", s.x.toFixed(1));
          el.setAttribute("cy", s.y.toFixed(1));
          el.style.opacity = s.life > 0 ? String(Math.min(1, s.life * 3)) : "0";
        });
      };
      const tick = (_time: number, dt: number) => {
        const d = dt / 1000;
        st.t += d;
        sp.forEach((s) => {
          if (s.life <= 0) return;
          s.x += s.vx * d;
          s.y += s.vy * d;
          s.vy += 220 * d;
          s.life -= d;
        });
        draw();
      };
      const stop = () => {
        gsap.ticker.remove(tick);
        st.p = 0;
        draw();
      };
      const tl = gsap.timeline({ onComplete: () => { stop(); activeFlame.current = null; } });
      activeFlame.current = { timeline: tl, stop };
      gsap.ticker.add(tick);
      // headlights blink on with the engine
      tl.to(lamps, { keyframes: [{ opacity: 1, duration: 0.05 }, { opacity: 0.4, duration: 0.06 }, { opacity: 1, duration: 0.08 }] }, 0);
      // rev (0–0.55 s), then three backfires as the throttle closes
      const pops = reduced ? [0.08] : [0.08, 0.40, 0.72];
      pops.forEach((at, i) => {
        const big = i === 0 ? 1 : 0.78;
        tl.to(st, { p: big, duration: 0.05, ease: "power3.out" }, at)
          .to(st, { p: big * 0.7, duration: 0.06 }, at + 0.06)
          .to(st, { p: big * 0.95, duration: 0.05 }, at + 0.12)
          .to(st, { p: 0, duration: 0.16, ease: "power2.in" }, at + 0.18);
      });
      tl.to(lamps, { opacity: 0, duration: 0.6, ease: "power2.in" }, "+=0.5");
    },
  }));
  useEffect(() => () => {
    activeFlame.current?.stop();
    activeFlame.current?.timeline.kill();
  }, []);

  return (
    <svg className="flame" viewBox="0 0 1672 941" width={1672} height={941} aria-hidden="true">
      <defs>
        <mask id="flame-occlude" maskUnits="userSpaceOnUse" x="0" y="0" width="1672" height="941">
          <rect width="1672" height="941" fill="white" />
          <polygon points={CHAIR} fill="black" />
        </mask>
        <linearGradient id="fl-outer" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#ff9a3a" />
          <stop offset=".6" stopColor="#ff5216" />
          <stop offset="1" stopColor="#c21a08" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="fl-mid" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#fff0b0" />
          <stop offset=".7" stopColor="#ffb534" />
          <stop offset="1" stopColor="#ff7a1a" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="fl-core" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset=".8" stopColor="#fff2c0" stopOpacity=".7" />
          <stop offset="1" stopColor="#fff2c0" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="fl-blue">
          <stop offset="0" stopColor="#d9f0ff" />
          <stop offset="1" stopColor="#3c8dff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="fl-glow">
          <stop offset="0" stopColor="#ffb25a" stopOpacity=".9" />
          <stop offset=".4" stopColor="#ff7a2a" stopOpacity=".35" />
          <stop offset="1" stopColor="#ff5a1a" stopOpacity="0" />
        </radialGradient>
        <filter id="fl-soft" x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur stdDeviation="0.9" />
        </filter>
        <filter id="fl-blur" x="-30%" y="-80%" width="160%" height="260%">
          <feGaussianBlur stdDeviation="3 1.5" />
        </filter>
      </defs>
      {/* exhaust tip, always visible under the bumper */}
      <g transform={`translate(${EXHAUST.x} ${EXHAUST.y})`}>
        <path d="M-12 -3.2 L0 -3.6 L0 3.6 L-12 3.2 Z" fill="#2a2326" stroke="#120c0d" strokeWidth="1" />
        <path d="M-11 -2.4 L-0.5 -2.8" stroke="#bdb3b7" strokeWidth="1" strokeLinecap="round" opacity=".8" />
        <ellipse cx="0" cy="0" rx="2.4" ry="3.9" fill="#120c0d" stroke="#d7cfd2" strokeWidth="1.3" />
      </g>
      <g ref={g} className="flame__fx" mask="url(#flame-occlude)" style={{ opacity: 0 }}>
        <g className="flame__glow" style={{ opacity: 0 }}>
          <ellipse cx={EXHAUST.x + 40} cy={EXHAUST.y} rx="90" ry="44" fill="url(#fl-glow)" />
          {/* light on the wet floor */}
          <ellipse cx={EXHAUST.x + 30} cy={EXHAUST.y + 44} rx="56" ry="9" fill="url(#fl-glow)" />
        </g>
        <g id="flame-body" transform={`translate(${EXHAUST.x + 1} ${EXHAUST.y}) rotate(${EXHAUST.angle})`}>
          <path data-l="0" fill="url(#fl-outer)" filter="url(#fl-soft)" />
          <path data-l="1" fill="url(#fl-mid)" />
          <path data-l="2" fill="url(#fl-core)" />
          <path data-l="3" fill="url(#fl-blue)" />
          {Array.from({ length: 10 }, (_, i) => (
            <circle key={i} className="flame__spark" r={0.9 + (i % 3) * 0.35} fill="#ffd27a" style={{ opacity: 0 }} />
          ))}
        </g>
        {/* reflection on the floor */}
        <use href="#flame-body" transform={`translate(0 ${2 * (EXHAUST.y + 22)}) scale(1 -1)`} opacity="0.32" filter="url(#fl-blur)" />
      </g>
    </svg>
  );
});

/* ---------- Gyroscope: rings drawn in 3D and animated (pedestal stays from the art) ---------- */

type V3 = [number, number, number];
const PIVOT = { x: 489, y: 650 }; // top of the pedestal
const HUB = 60; // centre of the rings above the pivot
const VIEW = (12 * Math.PI) / 180; // looking slightly down

const rotY = ([x, y, z]: V3, a: number): V3 => [x * Math.cos(a) + z * Math.sin(a), y, -x * Math.sin(a) + z * Math.cos(a)];
const rotX = ([x, y, z]: V3, a: number): V3 => [x, y * Math.cos(a) - z * Math.sin(a), y * Math.sin(a) + z * Math.cos(a)];
const rotZ = ([x, y, z]: V3, a: number): V3 => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a), z];

interface Ring {
  r: number;
  /** ring plane: vertical (cage), horizontal (frame) or tilted (inner gimbal) */
  plane: "v" | "h" | "t";
  /** spin speed relative to the precession */
  k: number;
  w: number;
}
const RINGS: Ring[] = [
  { r: 57, plane: "v", k: 1, w: 8.5 },
  { r: 74, plane: "h", k: 1, w: 7.5 },
  { r: 44, plane: "t", k: -1.7, w: 6.5 },
];

function ringPoints(ring: Ring, phi: number, lean: number, n = 72) {
  const pts: { x: number; y: number; z: number }[] = [];
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * Math.PI * 2;
    const c = Math.cos(t) * ring.r;
    const s = Math.sin(t) * ring.r;
    let p: V3 = ring.plane === "h" ? [c, 0, s] : ring.plane === "v" ? [c, s, 0] : rotX([c, s, 0], 1.05);
    p = rotY(p, phi * ring.k);
    p = [p[0], p[1] + HUB, p[2]];
    p = rotZ(p, lean);
    p = rotX(p, -VIEW * 0.5);
    pts.push({ x: PIVOT.x + p[0], y: PIVOT.y - p[1], z: p[2] });
  }
  return pts;
}

function split(pts: { x: number; y: number; z: number }[]) {
  const back: string[] = [];
  const front: string[] = [];
  let cur: string[] = [];
  let side = pts[0].z >= 0;
  const flush = () => {
    if (cur.length > 1) (side ? front : back).push("M" + cur.join("L"));
  };
  for (const p of pts) {
    const s = p.z >= 0;
    if (s !== side) {
      cur.push(`${p.x.toFixed(1)} ${p.y.toFixed(1)}`);
      flush();
      cur = [];
      side = s;
    }
    cur.push(`${p.x.toFixed(1)} ${p.y.toFixed(1)}`);
  }
  flush();
  return { back: back.join(""), front: front.join("") };
}

export function Gyroscope({ fast, reduced }: { fast: boolean; reduced: boolean }) {
  const root = useRef<SVGGElement>(null);
  const speed = useRef({ v: 1 });

  useEffect(() => {
    gsap.to(speed.current, { v: fast ? 4 : 1, duration: 0.6, ease: "power2.out" });
  }, [fast]);

  useEffect(() => {
    const g = root.current;
    if (!g) return;
    const q = (sel: string) => Array.from(g.querySelectorAll<SVGPathElement>(sel));
    const backs = RINGS.map((_, i) => q(`[data-ring="${i}"][data-side="back"]`));
    const fronts = RINGS.map((_, i) => q(`[data-ring="${i}"][data-side="front"]`));
    const spokes = q("[data-spoke]");
    const rotor = g.querySelector<SVGEllipseElement>(".gy__rotor")!;
    const axle = q(".gy__axle");
    const knob = g.querySelector<SVGCircleElement>(".gy__knob")!;
    let phi = 0.6;
    let psi = 0;
    let t = 0;
    const draw = () => {
      const lean = Math.sin(t * 0.9) * 0.035;
      RINGS.forEach((ring, i) => {
        const { back, front } = split(ringPoints(ring, phi, lean));
        backs[i].forEach((p) => p.setAttribute("d", back));
        fronts[i].forEach((p) => p.setAttribute("d", front));
      });
      // axle from the pivot through the hub to the knob
      const top = rotX(rotZ([0, HUB + 64, 0], lean), -VIEW * 0.5);
      const hub = rotX(rotZ([0, HUB, 0], lean), -VIEW * 0.5);
      const d = `M${PIVOT.x} ${PIVOT.y}L${(PIVOT.x + top[0]).toFixed(1)} ${(PIVOT.y - top[1]).toFixed(1)}`;
      axle.forEach((a) => a.setAttribute("d", d));
      knob.setAttribute("cx", (PIVOT.x + top[0]).toFixed(1));
      knob.setAttribute("cy", (PIVOT.y - top[1]).toFixed(1));
      const cx = PIVOT.x + hub[0];
      const cy = PIVOT.y - hub[1];
      rotor.setAttribute("cx", cx.toFixed(1));
      rotor.setAttribute("cy", cy.toFixed(1));
      spokes.forEach((s, k) => {
        const a = psi + (k * Math.PI) / 3;
        const p = rotX(rotZ([Math.cos(a) * 32, HUB, Math.sin(a) * 32], lean), -VIEW * 0.5);
        s.setAttribute("d", `M${cx.toFixed(1)} ${cy.toFixed(1)}L${(PIVOT.x + p[0]).toFixed(1)} ${(PIVOT.y - p[1]).toFixed(1)}`);
      });
    };
    draw();
    if (reduced) return;
    const tick = (_time: number, dt: number) => {
      const s = speed.current.v;
      if (document.hidden) return;
      t += dt / 1000;
      phi += (dt / 1000) * 0.55 * s;
      psi += (dt / 1000) * 9 * s;
      draw();
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [reduced]);

  const layers = (side: "back" | "front") =>
    RINGS.map((r, i) => (
      <g key={`${side}${i}`}>
        <path data-ring={i} data-side={side} className="gy__ink" strokeWidth={r.w + 3.4} />
        <path data-ring={i} data-side={side} className={`gy__brass gy__brass--${side}`} strokeWidth={r.w} />
        {side === "front" && (
          <>
            <path data-ring={i} data-side={side} className="gy__core" strokeWidth={r.w * 0.32} transform="translate(0 1.4)" />
            <path data-ring={i} data-side={side} className="gy__shine" strokeWidth={1.8} transform="translate(0 -1.3)" />
          </>
        )}
      </g>
    ));

  return (
    <svg className={`gyro${fast ? " is-lit" : ""}`} viewBox="0 0 1672 941" width={1672} height={941} aria-hidden="true">
      <defs>
        <linearGradient id="gy-brass" x1="0" y1="520" x2="0" y2="660" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffd98f" />
          <stop offset=".45" stopColor="#e0953f" />
          <stop offset="1" stopColor="#8a4418" />
        </linearGradient>
        <radialGradient id="gy-disc" cx=".4" cy=".35" r=".8">
          <stop offset="0" stopColor="#ffe6a8" />
          <stop offset=".5" stopColor="#d68b3a" />
          <stop offset="1" stopColor="#6e3412" />
        </radialGradient>
      </defs>
      <g ref={root}>
        {layers("back")}
        <path className="gy__ink gy__axle" strokeWidth={9} />
        <path className="gy__axle gy__axle--metal" strokeWidth={5.5} />
        <ellipse className="gy__rotor" rx={34} ry={10} />
        {Array.from({ length: 6 }, (_, k) => (
          <path key={k} data-spoke className="gy__spoke" />
        ))}
        {layers("front")}
        <circle className="gy__knob" r={7} />
      </g>
    </svg>
  );
}

/* ---------- Turntable: spinning record + moving tonearm ---------- */

const { record, label, pivot, rest, play } = TURNTABLE;
const polar = (p: { x: number; y: number }) => ({ a: Math.atan2(p.y - pivot.y, p.x - pivot.x), r: Math.hypot(p.x - pivot.x, p.y - pivot.y) });
const R0 = polar(rest);
const R1 = polar(play);

export function Turntable({ armOn, spinning, reduced }: { armOn: boolean; spinning: boolean; reduced: boolean }) {
  const arm = useRef<SVGPathElement>(null);
  const metal = useRef<SVGPathElement>(null);
  const head = useRef<SVGGElement>(null);
  const t = useRef({ v: armOn ? 1 : 0 });

  useEffect(() => {
    const draw = () => {
      const v = t.current.v;
      const a = R0.a + (R1.a - R0.a) * v;
      const r = R0.r + (R1.r - R0.r) * v;
      const hx = pivot.x + Math.cos(a) * r;
      const hy = pivot.y + Math.sin(a) * r;
      const mx = pivot.x + Math.cos(a) * r * 0.55 + Math.sin(a) * 2.2;
      const my = pivot.y + Math.sin(a) * r * 0.55 - Math.cos(a) * 2.2;
      const d = `M${pivot.x} ${pivot.y} Q${mx} ${my} ${hx} ${hy}`;
      arm.current?.setAttribute("d", d);
      metal.current?.setAttribute("d", d);
      head.current?.setAttribute("transform", `translate(${hx} ${hy}) rotate(${(a * 180) / Math.PI + 90})`);
    };
    draw();
    const tween = gsap.to(t.current, { v: armOn ? 1 : 0, duration: reduced ? 0 : 1.6, ease: "power2.inOut", onUpdate: draw, delay: armOn && !reduced ? 0.2 : 0 });
    return () => {
      tween.kill();
    };
  }, [armOn, reduced]);

  return (
    <>
      <div
        className={`record${spinning ? " is-spinning" : ""}${armOn ? " is-loaded" : ""}`}
        style={{ left: record.cx - record.rx, top: record.cy - record.rx, width: record.rx * 2, height: record.rx * 2, transform: `scaleY(${record.ry / record.rx})` }}
        aria-hidden="true"
      >
        <div className="record__spin">
          <i className="record__sheen" />
          <i className="record__mark" style={{ left: record.rx + label.rx * 0.55, top: record.rx - 2 }} />
        </div>
      </div>
      <svg className="tonearm" viewBox="0 0 1672 941" width={1672} height={941} aria-hidden="true">
        <path ref={arm} className="tonearm__outline" />
        <path ref={metal} className="tonearm__metal" />
        <g ref={head}>
          <rect x={-3.2} y={-1} width={6.4} height={5} rx={1} fill="#1a1110" />
          <rect x={-2.2} y={-0.2} width={4.4} height={3.2} rx={0.6} fill="#bdb7ae" />
        </g>
        <circle cx={pivot.x} cy={pivot.y} r={2.6} fill="#2a1f1c" stroke="#0d0807" strokeWidth={1} />
      </svg>
    </>
  );
}

/* ---------- Walter: breathing and blinking ---------- */

const EYES = [
  { cx: 899, cy: 419.5, rx: 19.5, ry: 12.5, rot: -4 },
  { cx: 935.5, cy: 421.5, rx: 11.5, ry: 11.5, rot: -10 },
];
const WALTER = { src: "/world/garage/walter.webp", x: 623, y: 274, w: 373, h: 404 };

export function Character({ reduced }: { reduced: boolean }) {
  const s = WALTER;
  const body = useRef<HTMLDivElement>(null);
  const lids = useRef<SVGGElement>(null);

  useEffect(() => {
    gsap.set(lids.current, { scaleY: 0, transformOrigin: "50% 0%" });
    if (reduced) return;
    const breath = gsap.to(body.current, { scaleY: 1.006, scaleX: 1.002, transformOrigin: "50% 92%", duration: 2.8, ease: "sine.inOut", yoyo: true, repeat: -1 });
    let timer: gsap.core.Tween;
    const blink = () => {
      const tl = gsap.timeline();
      tl.to(lids.current, { scaleY: 1, duration: 0.07, ease: "power2.in" }).to(lids.current, { scaleY: 0, duration: 0.12, ease: "power2.out" });
      if (Math.random() < 0.2) tl.to(lids.current, { scaleY: 1, duration: 0.07, delay: 0.08 }).to(lids.current, { scaleY: 0, duration: 0.12 });
      timer = gsap.delayedCall(2.8 + Math.random() * 4.2, blink);
    };
    timer = gsap.delayedCall(2, blink);
    return () => {
      breath.kill();
      timer?.kill();
    };
  }, [reduced]);

  return (
    <div ref={body} className="walter" style={{ left: s.x, top: s.y, width: s.w, height: s.h }} aria-hidden="true">
      <img src={s.src} alt="" width={s.w} height={s.h} draggable={false} />
      <svg className="walter__lids" viewBox={`${s.x} ${s.y} ${s.w} ${s.h}`} width={s.w} height={s.h}>
        <defs>
          <linearGradient id="lid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#d9824f" />
            <stop offset="1" stopColor="#f99253" />
          </linearGradient>
        </defs>
        <g ref={lids} style={{ transform: "scaleY(0)" }}>
          {EYES.map((e) => (
            <g key={e.cx} transform={`rotate(${e.rot} ${e.cx} ${e.cy})`}>
              <ellipse cx={e.cx} cy={e.cy} rx={e.rx + 1} ry={e.ry + 1} fill="url(#lid)" />
              <path d={`M${e.cx - e.rx} ${e.cy + 1} Q${e.cx} ${e.cy + e.ry * 0.75} ${e.cx + e.rx} ${e.cy}`} fill="none" stroke="#1d0c07" strokeWidth={2.4} strokeLinecap="round" />
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}

