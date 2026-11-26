import type { Chapter } from "../../../data/archive";
import { gearPath } from "../../scene/art/quad";

/*
 * Blueprint-style line drawings for the reader: thin grey strokes, red guides.
 * Decorative only (aria-hidden).
 */

const G = { fill: "none", stroke: "currentColor", strokeWidth: 1.2, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

function Guides() {
  return (
    <g className="la__guide">
      <path d="M8 104H152M136 8V120" strokeDasharray="2 3" />
      <path d="M128 96h16v16" />
    </g>
  );
}

const ART: Record<Chapter["art"], React.ReactNode> = {
  laptop: (
    <>
      <path {...G} d="M42 22h86l-10 58H32z" />
      <path {...G} d="M47 28h74l-8 46H39z" opacity=".6" />
      <path {...G} d="M22 86h104l10 10H14z" />
      <path {...G} d="M70 46l-8 6 8 6M88 46l8 6-8 6M82 42l-6 20" />
      <path {...G} d="M60 91h30" opacity=".6" />
    </>
  ),
  gear: (
    <>
      <path {...G} d={gearPath(80, 62, 12, 42, 9)} />
      <circle {...G} cx={80} cy={62} r={17} />
      <circle {...G} cx={80} cy={62} r={29} strokeDasharray="2 3" opacity=".5" />
    </>
  ),
  board: (
    <>
      <rect {...G} x={20} y={26} width={118} height={74} rx={3} />
      <rect {...G} x={30} y={36} width={22} height={16} />
      <rect {...G} x={30} y={62} width={14} height={24} />
      <rect {...G} x={66} y={44} width={44} height={24} rx={2} />
      <path {...G} d="M78 56c4-6 8-6 12 0s8 6 12 0c-4-6-8-6-12 0s-8 6-12 0" />
      {Array.from({ length: 12 }, (_, i) => (
        <rect key={i} {...G} x={58 + i * 6} y={88} width={3} height={6} />
      ))}
      {Array.from({ length: 8 }, (_, i) => (
        <rect key={`t${i}`} {...G} x={70 + i * 7} y={28} width={4} height={5} />
      ))}
    </>
  ),
  chart: (
    <>
      <rect {...G} x={18} y={22} width={124} height={84} />
      <path {...G} d="M18 40h124M18 62h124M18 84h124" opacity=".35" />
      <path {...G} d="M30 94l22-24 18 12 22-26 18 8 20-30" />
      {[
        [30, 94],
        [52, 70],
        [70, 82],
        [92, 56],
        [110, 64],
        [130, 34],
      ].map(([x, y]) => (
        <circle key={x} {...G} cx={x} cy={y} r={3} />
      ))}
      <path {...G} d="M128 28h8M132 24v8" opacity=".6" />
    </>
  ),
  car: (
    <>
      <path {...G} d="M24 78l10-26c3-8 9-12 17-12h58c8 0 14 4 17 12l10 26v20H24z" />
      <path {...G} d="M40 52h80M44 46l8-14h56l8 14" />
      <path {...G} d="M30 70h22l6 8H30zM130 70h-22l-6 8h28z" />
      <path {...G} d="M62 84h36M66 90h28" opacity=".6" />
      <path {...G} d="M28 98v8h16v-8M116 98v8h16v-8" />
    </>
  ),
  globe: (
    <>
      <circle {...G} cx={80} cy={62} r={44} />
      <ellipse {...G} cx={80} cy={62} rx={20} ry={44} />
      <path {...G} d="M80 18v88M36 62h88M42 40h76M42 84h76" />
      <ellipse {...G} cx={80} cy={62} rx={36} ry={44} opacity=".5" />
    </>
  ),
};

export function LineArt({ kind }: { kind: Chapter["art"] }) {
  return (
    <svg className="la" viewBox="0 0 160 124" aria-hidden="true">
      <Guides />
      {ART[kind]}
    </svg>
  );
}

/** Large background drawings: a wheel (bottom-left) and a car silhouette (top-right). */
export function Backdrop() {
  return (
    <div className="pa-backdrop" aria-hidden="true">
      <svg className="pa-backdrop__wheel" viewBox="-200 -200 400 400">
        <g fill="none" stroke="currentColor">
          <circle r={196} strokeWidth={1} />
          <circle r={176} strokeWidth={0.8} />
          <circle r={128} strokeWidth={0.8} />
          <circle r={34} strokeWidth={1} />
          {Array.from({ length: 10 }, (_, i) => {
            const a = (i * Math.PI * 2) / 10;
            const b = a + 0.16;
            const p = (r: number, t: number) => `${(Math.cos(t) * r).toFixed(1)} ${(Math.sin(t) * r).toFixed(1)}`;
            return <path key={i} d={`M${p(36, a)}L${p(126, a + 0.05)}M${p(36, b)}L${p(126, b - 0.05)}`} strokeWidth={0.8} />;
          })}
          {Array.from({ length: 5 }, (_, i) => {
            const a = (i * Math.PI * 2) / 5 + 0.3;
            return <circle key={`n${i}`} cx={Math.cos(a) * 20} cy={Math.sin(a) * 20} r={4} strokeWidth={0.8} />;
          })}
        </g>
      </svg>
      <svg className="pa-backdrop__arcs" viewBox="0 0 400 800">
        <g fill="none" stroke="currentColor" strokeWidth={1}>
          <path d="M-40 60C180 200 240 480 120 800" />
          <path d="M-60 120C140 260 190 520 70 800" opacity=".6" />
        </g>
      </svg>
      <svg className="pa-backdrop__car" viewBox="0 0 420 220">
        <g fill="none" stroke="currentColor" strokeWidth={1}>
          <path d="M20 150c10-34 40-50 80-58l70-40c30-14 70-18 120-16 50 2 90 14 110 36l20 26v52H20z" />
          <path d="M150 92l40-34c22-10 56-12 92-10l40 46z" />
          <circle cx={110} cy={160} r={36} />
          <circle cx={110} cy={160} r={22} />
          <circle cx={330} cy={160} r={36} />
          <circle cx={330} cy={160} r={22} />
          <path d="M30 122h40M380 118h30" />
        </g>
      </svg>
    </div>
  );
}
