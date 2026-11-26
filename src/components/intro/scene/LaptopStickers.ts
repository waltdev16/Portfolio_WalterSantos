// Dibuja en un canvas el collage de stickers de la tapa (ilustraciones propias, sin logos oficiales).
/**
 * LaptopStickers — the lid's sticker collage, painted into a canvas texture.
 *
 * Every sticker is original artwork that names or evokes an interest (Python,
 * GitHub, React, JavaScript, Linux, Qiskit, quantum computing, space, Porsche,
 * Formula 1, engineering, motorsport, code, diagrams and circuits). No official
 * logos are reproduced. Placement is seeded, overlapping and rotated, and a
 * few stickers are worn at the edges.
 */
import * as THREE from "three";
import { mulberry } from "./LightTrails";

type Ctx = CanvasRenderingContext2D;
type Painter = (c: Ctx, s: number) => void;

const MONO = "600 1px ui-monospace, 'JetBrains Mono', SFMono-Regular, Menlo, monospace";
const SANS = "700 1px 'Space Grotesk', 'Inter', system-ui, sans-serif";

function font(c: Ctx, base: string, px: number) {
  c.font = base.replace("1px", `${Math.round(px)}px`);
}

function roundRect(c: Ctx, x: number, y: number, w: number, h: number, r: number) {
  c.beginPath();
  c.roundRect(x, y, w, h, r);
}

/** vinyl die-cut: a white border around whatever the painter draws */
function dieCut(c: Ctx, shape: () => void, border: number) {
  c.save();
  shape();
  c.lineWidth = border * 2;
  c.strokeStyle = "#eef1f5";
  c.lineJoin = "round";
  c.stroke();
  c.fillStyle = "#eef1f5";
  c.fill();
  c.restore();
}

const painters: Record<string, Painter> = {
  python(c, s) {
    const w = s * 1.5, h = s * 0.62;
    dieCut(c, () => roundRect(c, -w / 2, -h / 2, w, h, h / 2), s * 0.04);
    c.fillStyle = "#2f5f8f";
    roundRect(c, -w / 2, -h / 2, w, h, h / 2);
    c.fill();
    c.fillStyle = "#f2cc4a";
    roundRect(c, -w / 2 + h * 0.12, -h * 0.38, h * 0.76, h * 0.76, h * 0.38);
    c.fill();
    font(c, MONO, s * 0.2);
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillStyle = "#2f5f8f";
    c.fillText(">>>", -w / 2 + h * 0.5, 0);
    c.fillStyle = "#f6f1df";
    c.fillText("python", h * 0.38, 0);
  },
  js(c, s) {
    dieCut(c, () => roundRect(c, -s / 2, -s / 2, s, s, s * 0.06), s * 0.04);
    c.fillStyle = "#f0d63a";
    c.fillRect(-s / 2, -s / 2, s, s);
    font(c, SANS, s * 0.42);
    c.fillStyle = "#16181d";
    c.textAlign = "right";
    c.textBaseline = "alphabetic";
    c.fillText("JS", s * 0.42, s * 0.42);
  },
  react(c, s) {
    const r = s * 0.55;
    dieCut(c, () => { c.beginPath(); c.arc(0, 0, r, 0, Math.PI * 2); }, s * 0.04);
    c.fillStyle = "#14181f";
    c.beginPath();
    c.arc(0, 0, r, 0, Math.PI * 2);
    c.fill();
    c.strokeStyle = "#62d4f2";
    c.lineWidth = s * 0.03;
    c.beginPath();
    c.arc(0, -s * 0.06, r * 0.62, Math.PI * 1.1, Math.PI * 1.9);
    c.stroke();
    font(c, SANS, s * 0.25);
    c.fillStyle = "#62d4f2";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText("react", 0, s * 0.08);
    font(c, MONO, s * 0.1);
    c.fillStyle = "#8fa0b4";
    c.fillText("useState()", 0, s * 0.3);
  },
  github(c, s) {
    const w = s * 1.3, h = s * 0.7;
    dieCut(c, () => roundRect(c, -w / 2, -h / 2, w, h, s * 0.1), s * 0.04);
    c.fillStyle = "#1b1f24";
    roundRect(c, -w / 2, -h / 2, w, h, s * 0.1);
    c.fill();
    // a branch diagram
    c.strokeStyle = "#e6e9ee";
    c.lineWidth = s * 0.03;
    const x0 = -w * 0.36;
    c.beginPath();
    c.moveTo(x0, -h * 0.28);
    c.lineTo(x0, h * 0.28);
    c.moveTo(x0, h * 0.12);
    c.quadraticCurveTo(x0, -h * 0.05, x0 + s * 0.2, -h * 0.1);
    c.stroke();
    [[x0, -h * 0.28], [x0, h * 0.28], [x0 + s * 0.22, -h * 0.1]].forEach(([x, y]) => {
      c.beginPath();
      c.arc(x, y, s * 0.05, 0, Math.PI * 2);
      c.fillStyle = "#1b1f24";
      c.fill();
      c.stroke();
    });
    font(c, MONO, s * 0.16);
    c.fillStyle = "#e6e9ee";
    c.textAlign = "left";
    c.textBaseline = "middle";
    c.fillText("git push", -w * 0.1, -h * 0.08);
    font(c, MONO, s * 0.1);
    c.fillStyle = "#7ee787";
    c.fillText("github", -w * 0.1, h * 0.17);
  },
  linux(c, s) {
    const w = s * 1.25, h = s * 0.55;
    dieCut(c, () => roundRect(c, -w / 2, -h / 2, w, h, s * 0.06), s * 0.035);
    c.fillStyle = "#0c0f13";
    roundRect(c, -w / 2, -h / 2, w, h, s * 0.06);
    c.fill();
    ["#ff5f57", "#febc2e", "#28c840"].forEach((col, i) => {
      c.fillStyle = col;
      c.beginPath();
      c.arc(-w / 2 + s * (0.08 + i * 0.07), -h / 2 + s * 0.08, s * 0.025, 0, Math.PI * 2);
      c.fill();
    });
    font(c, MONO, s * 0.15);
    c.textAlign = "left";
    c.textBaseline = "middle";
    c.fillStyle = "#9be564";
    c.fillText("~$", -w / 2 + s * 0.08, h * 0.12);
    c.fillStyle = "#e6e9ee";
    c.fillText("linux", -w / 2 + s * 0.34, h * 0.12);
  },
  qiskit(c, s) {
    const w = s * 1.4, h = s * 0.62;
    dieCut(c, () => roundRect(c, -w / 2, -h / 2, w, h, s * 0.08), s * 0.04);
    c.fillStyle = "#f4f6fa";
    roundRect(c, -w / 2, -h / 2, w, h, s * 0.08);
    c.fill();
    c.strokeStyle = "#1e2a3a";
    c.lineWidth = s * 0.018;
    for (let i = 0; i < 2; i++) {
      const y = -h * 0.12 + i * h * 0.3;
      c.beginPath();
      c.moveTo(-w * 0.42, y);
      c.lineTo(w * 0.42, y);
      c.stroke();
    }
    c.fillStyle = "#2563eb";
    c.fillRect(-w * 0.3, -h * 0.12 - s * 0.07, s * 0.14, s * 0.14);
    c.fillStyle = "#ffffff";
    font(c, MONO, s * 0.1);
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText("H", -w * 0.3 + s * 0.07, -h * 0.12);
    c.fillStyle = "#1e2a3a";
    c.beginPath();
    c.arc(-w * 0.02, -h * 0.12, s * 0.035, 0, Math.PI * 2);
    c.fill();
    c.beginPath();
    c.moveTo(-w * 0.02, -h * 0.12);
    c.lineTo(-w * 0.02, h * 0.18);
    c.stroke();
    c.beginPath();
    c.arc(-w * 0.02, h * 0.18, s * 0.06, 0, Math.PI * 2);
    c.stroke();
    font(c, SANS, s * 0.15);
    c.textAlign = "left";
    c.fillText("qiskit", w * 0.08, h * 0.04);
  },
  quantum(c, s) {
    const r = s * 0.5;
    dieCut(c, () => { c.beginPath(); c.arc(0, 0, r, 0, Math.PI * 2); }, s * 0.04);
    c.fillStyle = "#0f1a2e";
    c.beginPath();
    c.arc(0, 0, r, 0, Math.PI * 2);
    c.fill();
    c.strokeStyle = "#7dd3fc";
    c.lineWidth = s * 0.014;
    c.beginPath();
    c.arc(0, 0, r * 0.68, 0, Math.PI * 2);
    c.stroke();
    c.beginPath();
    c.ellipse(0, 0, r * 0.68, r * 0.22, 0, 0, Math.PI * 2);
    c.stroke();
    c.beginPath();
    c.moveTo(0, 0);
    c.lineTo(r * 0.36, -r * 0.48);
    c.stroke();
    c.fillStyle = "#7dd3fc";
    c.beginPath();
    c.arc(r * 0.36, -r * 0.48, s * 0.025, 0, Math.PI * 2);
    c.fill();
    font(c, MONO, s * 0.13);
    c.fillStyle = "#e2e8f0";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText("|ψ⟩", 0, r * 0.82 - s * 0.12);
  },
  mission(c, s) {
    const r = s * 0.55;
    dieCut(c, () => { c.beginPath(); c.arc(0, 0, r, 0, Math.PI * 2); }, s * 0.04);
    c.fillStyle = "#16264a";
    c.beginPath();
    c.arc(0, 0, r, 0, Math.PI * 2);
    c.fill();
    const rand = mulberry(31);
    c.fillStyle = "#ffffff";
    for (let i = 0; i < 26; i++) {
      const a = rand() * Math.PI * 2, d = rand() * r * 0.9;
      c.fillRect(Math.cos(a) * d, Math.sin(a) * d, s * 0.012, s * 0.012);
    }
    c.fillStyle = "#c9b8a2";
    c.beginPath();
    c.arc(-r * 0.15, r * 0.1, r * 0.3, 0, Math.PI * 2);
    c.fill();
    c.strokeStyle = "#e2e8f0";
    c.lineWidth = s * 0.02;
    c.beginPath();
    c.ellipse(-r * 0.15, r * 0.1, r * 0.62, r * 0.16, -0.35, 0, Math.PI * 2);
    c.stroke();
    font(c, MONO, s * 0.09);
    c.fillStyle = "#e2e8f0";
    c.textAlign = "center";
    c.fillText("EXPLORE · ORBIT", 0, -r * 0.62);
  },
  rocket(c, s) {
    dieCut(c, () => {
      c.beginPath();
      c.moveTo(0, -s * 0.5);
      c.quadraticCurveTo(s * 0.22, -s * 0.2, s * 0.16, s * 0.25);
      c.lineTo(s * 0.28, s * 0.42);
      c.lineTo(-s * 0.28, s * 0.42);
      c.lineTo(-s * 0.16, s * 0.25);
      c.quadraticCurveTo(-s * 0.22, -s * 0.2, 0, -s * 0.5);
    }, s * 0.06);
    c.fillStyle = "#e9edf2";
    c.beginPath();
    c.moveTo(0, -s * 0.46);
    c.quadraticCurveTo(s * 0.18, -s * 0.2, s * 0.13, s * 0.24);
    c.lineTo(-s * 0.13, s * 0.24);
    c.quadraticCurveTo(-s * 0.18, -s * 0.2, 0, -s * 0.46);
    c.fill();
    c.fillStyle = "#2563eb";
    c.beginPath();
    c.arc(0, -s * 0.1, s * 0.06, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = "#e26b3a";
    c.beginPath();
    c.moveTo(-s * 0.1, s * 0.26);
    c.lineTo(0, s * 0.42);
    c.lineTo(s * 0.1, s * 0.26);
    c.fill();
  },
  saturn(c, s) {
    dieCut(c, () => { c.beginPath(); c.ellipse(0, 0, s * 0.5, s * 0.3, -0.3, 0, Math.PI * 2); }, s * 0.05);
    c.fillStyle = "#e7c98f";
    c.beginPath();
    c.arc(0, 0, s * 0.2, 0, Math.PI * 2);
    c.fill();
    c.strokeStyle = "#a8b5c7";
    c.lineWidth = s * 0.05;
    c.beginPath();
    c.ellipse(0, 0, s * 0.42, s * 0.1, -0.3, 0, Math.PI * 2);
    c.stroke();
  },
  star(c, s) {
    const path = () => {
      c.beginPath();
      for (let i = 0; i < 10; i++) {
        const r = i % 2 ? s * 0.2 : s * 0.48;
        const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
        c.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      }
      c.closePath();
    };
    dieCut(c, path, s * 0.05);
    path();
    c.fillStyle = "#f1d36b";
    c.fill();
  },
  flatsix(c, s) {
    const w = s * 1.7, h = s * 0.55;
    dieCut(c, () => roundRect(c, -w / 2, -h / 2, w, h, s * 0.05), s * 0.035);
    c.fillStyle = "#e8e3d6";
    roundRect(c, -w / 2, -h / 2, w, h, s * 0.05);
    c.fill();
    // a generic rear-engine coupe silhouette
    c.fillStyle = "#1c1f24";
    c.beginPath();
    c.moveTo(-w * 0.4, h * 0.12);
    c.bezierCurveTo(-w * 0.36, -h * 0.05, -w * 0.18, -h * 0.3, w * 0.02, -h * 0.3);
    c.bezierCurveTo(w * 0.22, -h * 0.3, w * 0.36, -h * 0.05, w * 0.42, h * 0.12);
    c.lineTo(-w * 0.4, h * 0.12);
    c.fill();
    c.fillStyle = "#e8e3d6";
    [-0.24, 0.26].forEach((k) => {
      c.beginPath();
      c.arc(w * k, h * 0.14, s * 0.07, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = "#1c1f24";
      c.beginPath();
      c.arc(w * k, h * 0.14, s * 0.05, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = "#e8e3d6";
    });
    font(c, MONO, s * 0.08);
    c.fillStyle = "#8a2b1f";
    c.textAlign = "left";
    c.fillText("FLAT-SIX · STUTTGART", -w * 0.45, -h * 0.32);
  },
  checkered(c, s) {
    const w = s * 1.2, h = s * 0.7;
    dieCut(c, () => roundRect(c, -w / 2, -h / 2, w, h, s * 0.04), s * 0.04);
    const n = 8, m = 5;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < m; j++) {
        c.fillStyle = (i + j) % 2 ? "#111318" : "#f2f4f7";
        c.fillRect(-w / 2 + (i * w) / n, -h / 2 + (j * h) / m, w / n + 0.5, h / m + 0.5);
      }
    }
    c.fillStyle = "#d7262e";
    c.fillRect(-w / 2, h * 0.12, w, h * 0.26);
    font(c, SANS, s * 0.13);
    c.fillStyle = "#ffffff";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText("LIGHTS OUT", 0, h * 0.25);
  },
  roundel(c, s) {
    const r = s * 0.42;
    dieCut(c, () => { c.beginPath(); c.arc(0, 0, r, 0, Math.PI * 2); }, s * 0.03);
    c.fillStyle = "#f6f6f2";
    c.beginPath();
    c.arc(0, 0, r, 0, Math.PI * 2);
    c.fill();
    c.strokeStyle = "#1c1f24";
    c.lineWidth = s * 0.02;
    c.stroke();
    font(c, SANS, s * 0.42);
    c.fillStyle = "#1c1f24";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText("07", 0, s * 0.02);
  },
  gear(c, s) {
    const path = () => {
      c.beginPath();
      const teeth = 10;
      for (let i = 0; i < teeth * 2; i++) {
        const r = i % 2 ? s * 0.38 : s * 0.47;
        const a0 = (i / (teeth * 2)) * Math.PI * 2;
        const a1 = ((i + 1) / (teeth * 2)) * Math.PI * 2;
        c.arc(0, 0, r, a0, a1);
      }
      c.closePath();
    };
    dieCut(c, path, s * 0.04);
    path();
    c.fillStyle = "#8a96a8";
    c.fill();
    c.fillStyle = "#eef1f5";
    c.beginPath();
    c.arc(0, 0, s * 0.2, 0, Math.PI * 2);
    c.fill();
    font(c, MONO, s * 0.07);
    c.fillStyle = "#1c1f24";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText("ENGINEER", 0, 0);
  },
  braces(c, s) {
    const r = s * 0.38;
    dieCut(c, () => { c.beginPath(); c.arc(0, 0, r, 0, Math.PI * 2); }, s * 0.04);
    c.fillStyle = "#c6f432";
    c.beginPath();
    c.arc(0, 0, r, 0, Math.PI * 2);
    c.fill();
    font(c, MONO, s * 0.34);
    c.fillStyle = "#0a0d12";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText("{ }", 0, s * 0.02);
  },
  tags(c, s) {
    const w = s * 0.95, h = s * 0.5;
    dieCut(c, () => roundRect(c, -w / 2, -h / 2, w, h, h / 2), s * 0.04);
    c.fillStyle = "#2563eb";
    roundRect(c, -w / 2, -h / 2, w, h, h / 2);
    c.fill();
    font(c, MONO, s * 0.24);
    c.fillStyle = "#ffffff";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText("</>", 0, s * 0.01);
  },
  hello(c, s) {
    const w = s * 1.5, h = s * 0.42;
    dieCut(c, () => roundRect(c, -w / 2, -h / 2, w, h, s * 0.04), s * 0.035);
    c.fillStyle = "#f2f4f7";
    roundRect(c, -w / 2, -h / 2, w, h, s * 0.04);
    c.fill();
    font(c, MONO, s * 0.14);
    c.fillStyle = "#16181d";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText('print("Hello, world!")', 0, 0);
  },
  blueprint(c, s) {
    const w = s * 1.1, h = s * 0.8;
    dieCut(c, () => roundRect(c, -w / 2, -h / 2, w, h, s * 0.02), s * 0.03);
    c.fillStyle = "#1d4f8f";
    c.fillRect(-w / 2, -h / 2, w, h);
    c.strokeStyle = "rgba(226,232,240,0.25)";
    c.lineWidth = 1;
    for (let x = -w / 2; x < w / 2; x += s * 0.08) {
      c.beginPath();
      c.moveTo(x, -h / 2);
      c.lineTo(x, h / 2);
      c.stroke();
    }
    for (let y = -h / 2; y < h / 2; y += s * 0.08) {
      c.beginPath();
      c.moveTo(-w / 2, y);
      c.lineTo(w / 2, y);
      c.stroke();
    }
    c.strokeStyle = "#e2e8f0";
    c.lineWidth = s * 0.012;
    c.strokeRect(-w * 0.28, -h * 0.2, w * 0.5, h * 0.36);
    c.beginPath();
    c.arc(w * 0.22, -h * 0.02, s * 0.1, 0, Math.PI * 2);
    c.stroke();
    // dimension line
    c.beginPath();
    c.moveTo(-w * 0.28, h * 0.3);
    c.lineTo(w * 0.22, h * 0.3);
    c.stroke();
    font(c, MONO, s * 0.07);
    c.fillStyle = "#e2e8f0";
    c.textAlign = "center";
    c.fillText("120.0 mm", -w * 0.03, h * 0.27);
  },
  circuit(c, s) {
    const w = s * 1.0, h = s * 0.75;
    dieCut(c, () => roundRect(c, -w / 2, -h / 2, w, h, s * 0.05), s * 0.035);
    c.fillStyle = "#174d36";
    roundRect(c, -w / 2, -h / 2, w, h, s * 0.05);
    c.fill();
    c.strokeStyle = "#d4b25a";
    c.lineWidth = s * 0.018;
    const rand = mulberry(11);
    for (let i = 0; i < 7; i++) {
      const y = -h * 0.36 + i * h * 0.12;
      const x1 = -w * 0.42 + rand() * w * 0.2;
      const x2 = w * 0.42 - rand() * w * 0.2;
      c.beginPath();
      c.moveTo(x1, y);
      c.lineTo(x1 + w * 0.15, y);
      c.lineTo(x1 + w * 0.22, y + h * 0.06);
      c.lineTo(x2, y + h * 0.06);
      c.stroke();
      c.fillStyle = "#d4b25a";
      c.beginPath();
      c.arc(x2, y + h * 0.06, s * 0.022, 0, Math.PI * 2);
      c.fill();
    }
    c.fillStyle = "#1c1f24";
    c.fillRect(-w * 0.12, -h * 0.14, w * 0.24, h * 0.28);
  },
  lambda(c, s) {
    const w = s * 0.55;
    dieCut(c, () => roundRect(c, -w / 2, -w / 2, w, w, s * 0.08), s * 0.04);
    c.fillStyle = "#a8b5c7";
    roundRect(c, -w / 2, -w / 2, w, w, s * 0.08);
    c.fill();
    font(c, MONO, s * 0.36);
    c.fillStyle = "#0d1017";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText("λ", 0, s * 0.02);
  },
  moon(c, s) {
    dieCut(c, () => { c.beginPath(); c.arc(0, 0, s * 0.3, 0, Math.PI * 2); }, s * 0.04);
    c.fillStyle = "#d8dde5";
    c.beginPath();
    c.arc(0, 0, s * 0.3, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = "#b5bdc9";
    [[-0.1, -0.08, 0.06], [0.1, 0.06, 0.08], [-0.04, 0.14, 0.04]].forEach(([x, y, r]) => {
      c.beginPath();
      c.arc(s * x, s * y, s * r, 0, Math.PI * 2);
      c.fill();
    });
  },
};

/** [painter, size as a fraction of the lid width] — some appear twice, at different sizes */
const SET: [string, number][] = [
  ["mission", 0.19], ["python", 0.15], ["flatsix", 0.14], ["github", 0.14], ["quantum", 0.14],
  ["checkered", 0.13], ["js", 0.1], ["react", 0.13], ["linux", 0.13], ["qiskit", 0.13],
  ["gear", 0.12], ["circuit", 0.13], ["blueprint", 0.13], ["roundel", 0.1], ["braces", 0.1],
  ["hello", 0.13], ["tags", 0.1], ["rocket", 0.09], ["saturn", 0.09], ["lambda", 0.08],
  ["star", 0.055], ["moon", 0.06], ["star", 0.04], ["rocket", 0.06],
];

export function createStickerTexture(size: number, opts: { aspect?: number; only?: string[]; seed?: number; scale?: number } = {}) {
  const aspect = opts.aspect ?? 0.68;
  const W = size, H = Math.round(size * aspect);
  const set = opts.only ? SET.filter(([n]) => opts.only!.includes(n)) : SET;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const c = canvas.getContext("2d")!;
  const rand = mulberry(opts.seed ?? 2026);

  // loose placement: an uneven grid with big jitter, so stickers overlap without
  // reading as a pattern; the centre is left a little emptier
  const cols = Math.max(2, Math.round(Math.sqrt(set.length / aspect))), rows = Math.max(2, Math.ceil(set.length / cols));
  const cells: [number, number][] = [];
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) cells.push([i, j]);
  cells.sort(() => rand() - 0.5);

  set.forEach(([name, frac], k) => {
    const [i, j] = cells[k % cells.length];
    const s = W * frac * (opts.scale ?? 1) * (0.9 + rand() * 0.25);
    let x = ((i + 0.5 + (rand() - 0.5) * 0.95) / cols) * W;
    let y = ((j + 0.5 + (rand() - 0.5) * 0.9) / rows) * H;
    // keep a margin from the edge of the lid
    x = Math.min(W - s * 0.5, Math.max(s * 0.5, x));
    y = Math.min(H - s * 0.4, Math.max(s * 0.4, y));
    c.save();
    c.translate(x, y);
    c.rotate((rand() - 0.5) * 0.9);
    c.shadowColor = "rgba(0,0,0,0.35)";
    c.shadowBlur = s * 0.02;
    painters[name](c, s);
    c.restore();

    // wear: scuff a few of them with tiny chips and a lighter faded patch
    if (rand() < 0.4) {
      c.save();
      c.globalCompositeOperation = "destination-out";
      for (let n = 0; n < 40; n++) {
        const a = rand() * Math.PI * 2;
        const d = s * (0.3 + rand() * 0.35);
        c.globalAlpha = 0.25 + rand() * 0.6;
        c.fillRect(x + Math.cos(a) * d, y + Math.sin(a) * d, 1 + rand() * s * 0.025, 1 + rand() * s * 0.02);
      }
      c.restore();
      c.save();
      c.globalCompositeOperation = "source-atop";
      c.fillStyle = "rgba(255,255,255,0.08)";
      c.beginPath();
      c.ellipse(x + (rand() - 0.5) * s * 0.4, y + (rand() - 0.5) * s * 0.3, s * 0.3, s * 0.12, rand() * 3, 0, Math.PI * 2);
      c.fill();
      c.restore();
    }
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}
