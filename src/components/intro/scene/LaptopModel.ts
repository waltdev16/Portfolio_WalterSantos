// Modelo 3D de la laptop: aluminio, teclado con teclas en relieve, bisagra, stickers y pantalla.
/**
 * LaptopModel — a space-grey aluminium laptop built from real geometry.
 *
 * Rounded unibody base and lid (PBR metal with a roughness map of fine
 * brushing, scuffs and a couple of dents), a keyboard deck whose legends glow
 * as the backlight comes up, a trackpad, a hinge, the sticker collage on the
 * lid and the display (see LaptopScreen). The lid pivots on the hinge.
 *
 * Local frame: the front edge faces +z, the hinge sits at the back (-z).
 */
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { createStickerTexture } from "./LaptopStickers";
import { createLaptopScreen } from "./LaptopScreen";
import { mulberry } from "./LightTrails";
import type { Disposable } from "./HyperspeedScene";

export const LAPTOP = {
  width: 3.3,
  depth: 2.25,
  base: 0.1,
  lid: 0.055,
  /** fully open angle of the lid, in degrees */
  open: 106,
};

function aluminiumMaps(size: number) {
  const rand = mulberry(99);
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const c = canvas.getContext("2d")!;
  // base roughness, with fine horizontal brushing
  c.fillStyle = "rgb(92,92,92)";
  c.fillRect(0, 0, size, size);
  for (let i = 0; i < size * 1.4; i++) {
    const v = 80 + rand() * 30;
    c.fillStyle = `rgba(${v},${v},${v},0.35)`;
    c.fillRect(0, rand() * size, size, 1);
  }
  // scuffs: smoother, slightly shinier strokes
  c.strokeStyle = "rgba(40,40,40,0.55)";
  for (let i = 0; i < 26; i++) {
    c.lineWidth = 0.6 + rand() * 1.2;
    const x = rand() * size, y = rand() * size, a = rand() * Math.PI, l = 6 + rand() * size * 0.08;
    c.beginPath();
    c.moveTo(x, y);
    c.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l);
    c.stroke();
  }
  // a couple of soft dents / fingerprints
  for (let i = 0; i < 5; i++) {
    const x = rand() * size, y = rand() * size, r = size * (0.02 + rand() * 0.05);
    const g = c.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, "rgba(140,140,140,0.35)");
    g.addColorStop(1, "rgba(140,140,140,0)");
    c.fillStyle = g;
    c.fillRect(x - r, y - r, r * 2, r * 2);
  }
  const roughness = new THREE.CanvasTexture(canvas);
  roughness.wrapS = roughness.wrapT = THREE.RepeatWrapping;
  return roughness;
}

type Key = { x: number; y: number; w: number; h: number; legend: string };

/** key rectangles in a 0..1 × 0..1 keyboard area, shared by the 3D caps and the legends */
function keyboardLayout(ratio: number): Key[] {
  const keys: Key[] = [];
  const legends = "1234567890-=QWERTYUIOP[]ASDFGHJKL;'ZXCVBNM,./";
  const gap = 0.012;
  const gapY = gap / ratio;
  const rows: { count: number; h: number; widths?: number[] }[] = [
    { count: 14, h: 0.6 },
    { count: 14, h: 1 },
    { count: 14, h: 1 },
    { count: 13, h: 1 },
    { count: 12, h: 1 },
    { count: 9, h: 1, widths: [1, 1, 1, 1.3, 5, 1.3, 1, 1, 1] },
  ];
  const totalH = rows.reduce((s, r) => s + r.h, 0);
  const unitH = (1 - gapY * (rows.length + 1)) / totalH;
  let y = gapY;
  let li = 0;
  rows.forEach((row, r) => {
    const widths = row.widths ?? Array.from({ length: row.count }, () => 1);
    const total = widths.reduce((a, v) => a + v, 0);
    const u = (1 - gap * (row.count + 1)) / total;
    let x = gap;
    widths.forEach((wk) => {
      const legend = r > 0 && r < 5 && li < legends.length ? legends[li++] : "";
      keys.push({ x, y, w: wk * u, h: row.h * unitH, legend });
      x += wk * u + gap;
    });
    y += row.h * unitH + gapY;
  });
  return keys;
}

/** legends (on the caps) and the light that leaks up between the keys */
function keyboardMaps(keys: Key[], w: number, h: number) {
  const make = () => {
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    return canvas;
  };
  const legend = make();
  const well = make();
  const l = legend.getContext("2d")!;
  const g = well.getContext("2d")!;
  g.fillStyle = "#000";
  g.fillRect(0, 0, w, h);
  keys.forEach((k) => {
    const x = k.x * w, y = k.y * h, kw = k.w * w, kh = k.h * h;
    // soft halo around each key edge
    g.shadowColor = "rgba(190,220,255,0.9)";
    g.shadowBlur = kh * 0.18;
    g.strokeStyle = "rgba(190,220,255,0.55)";
    g.lineWidth = kh * 0.05;
    g.strokeRect(x, y, kw, kh);
    if (k.legend) {
      l.fillStyle = "rgba(232,240,255,1)";
      l.font = `600 ${Math.round(kh * 0.34)}px ui-sans-serif, system-ui, sans-serif`;
      l.fillText(k.legend, x + kw * 0.22, y + kh * 0.46);
    }
  });
  const legendTex = new THREE.CanvasTexture(legend);
  legendTex.colorSpace = THREE.SRGBColorSpace;
  const wellTex = new THREE.CanvasTexture(well);
  wellTex.colorSpace = THREE.SRGBColorSpace;
  return { legendTex, wellTex };
}

export function createLaptopModel(opts: { textureSize: number; aspect: number }) {
  const disposables: Disposable[] = [];
  const track = <T extends Disposable>(x: T) => (disposables.push(x), x);
  const { width: W, depth: D, base: T, lid: LT } = LAPTOP;
  // the display takes the visitor's aspect ratio, so the page fills it edge to edge;
  // the lid is cut to fit the display (hair-thin bezel, slim chin)
  const glassW = W - 0.05;
  const maxDisplayW = glassW - 0.04;
  const displayH = Math.min(maxDisplayW / opts.aspect, 2.12);
  const displayW = displayH * opts.aspect;
  const glassH = displayH + 0.02 + 0.075;
  const lidD = glassH + 0.05;

  const group = new THREE.Group();
  const rough = track(aluminiumMaps(opts.textureSize / 2));

  const aluminium = track(
    new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#4a4f57"),
      metalness: 1,
      roughness: 0.42,
      roughnessMap: rough,
      clearcoat: 0.15,
      clearcoatRoughness: 0.4,
    }),
  );
  const edge = track(new THREE.MeshPhysicalMaterial({ color: new THREE.Color("#7c8592"), metalness: 1, roughness: 0.2 }));
  const dark = track(new THREE.MeshStandardMaterial({ color: new THREE.Color("#0b0d10"), metalness: 0.2, roughness: 0.35 }));

  // base unibody, with a thin chamfer highlight around the top edge
  const baseMesh = new THREE.Mesh(track(new RoundedBoxGeometry(W, T, D, 4, 0.04)), aluminium);
  baseMesh.position.y = T / 2;
  group.add(baseMesh);
  const lip = new THREE.Mesh(track(new RoundedBoxGeometry(W - 0.01, 0.006, D - 0.01, 2, 0.04)), edge);
  lip.position.y = T - 0.002;
  group.add(lip);
  // rubber feet
  const footGeo = track(new THREE.CylinderGeometry(0.06, 0.06, 0.012, 16));
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sz]) => {
    const foot = new THREE.Mesh(footGeo, dark);
    foot.position.set(sx * (W / 2 - 0.25), -0.004, sz * (D / 2 - 0.25));
    group.add(foot);
  });

  // keyboard: a recessed well, real keycaps standing in it, legends on the caps
  // and backlight that leaks out between the keys
  const kbW = W * 0.84, kbH = kbW * 0.37, kbZ = -D * 0.14;
  const keys = keyboardLayout(kbW / kbH);
  const kb = keyboardMaps(keys, opts.textureSize, Math.round(opts.textureSize * 0.37));
  track(kb.legendTex);
  track(kb.wellTex);
  const wellMat = track(
    new THREE.MeshStandardMaterial({ color: new THREE.Color("#0c0e11"), emissiveMap: kb.wellTex, emissive: new THREE.Color("#cfe6ff"), emissiveIntensity: 0, roughness: 0.8 }),
  );
  const wellGeo = track(new THREE.PlaneGeometry(kbW + 0.03, kbH + 0.03));
  wellGeo.rotateX(-Math.PI / 2);
  const well = new THREE.Mesh(wellGeo, wellMat);
  well.position.set(0, T - 0.006, kbZ);
  group.add(well);
  // the well's walls, so the keyboard reads as cut into the deck
  const wallMat = track(new THREE.MeshStandardMaterial({ color: new THREE.Color("#2a2d33"), metalness: 0.8, roughness: 0.5 }));
  const wallGeoX = track(new THREE.BoxGeometry(kbW + 0.04, 0.008, 0.006));
  const wallGeoZ = track(new THREE.BoxGeometry(0.006, 0.008, kbH + 0.04));
  [-1, 1].forEach((sgn) => {
    const wx = new THREE.Mesh(wallGeoX, wallMat);
    wx.position.set(0, T - 0.003, kbZ + sgn * (kbH / 2 + 0.017));
    group.add(wx);
    const wz = new THREE.Mesh(wallGeoZ, wallMat);
    wz.position.set(sgn * (kbW / 2 + 0.017), T - 0.003, kbZ);
    group.add(wz);
  });
  // keycaps: one instanced mesh, slightly rounded, standing above the deck
  const capH = 0.016;
  const capMat = track(new THREE.MeshStandardMaterial({ color: new THREE.Color("#16181c"), roughness: 0.55, metalness: 0.15 }));
  const caps = new THREE.InstancedMesh(track(new RoundedBoxGeometry(1, 1, 1, 2, 0.18)), capMat, keys.length);
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  keys.forEach((k, i) => {
    const cx = -kbW / 2 + (k.x + k.w / 2) * kbW;
    const cz = kbZ - kbH / 2 + (k.y + k.h / 2) * kbH;
    m.compose(new THREE.Vector3(cx, T - 0.004 + capH / 2, cz), q, new THREE.Vector3(k.w * kbW * 0.96, capH, k.h * kbH * 0.94));
    caps.setMatrixAt(i, m);
  });
  caps.instanceMatrix.needsUpdate = true;
  group.add(caps);
  // legends printed on the cap tops
  const legendMat = track(
    new THREE.MeshStandardMaterial({
      color: new THREE.Color("#9aa1ab"),
      map: kb.legendTex,
      emissiveMap: kb.legendTex,
      emissive: new THREE.Color("#dcebff"),
      emissiveIntensity: 0,
      transparent: true,
      alphaTest: 0.2,
      depthWrite: false,
      roughness: 0.6,
    }),
  );
  const legendGeo = track(new THREE.PlaneGeometry(kbW, kbH));
  legendGeo.rotateX(-Math.PI / 2);
  const legends = new THREE.Mesh(legendGeo, legendMat);
  legends.position.set(0, T - 0.004 + capH + 0.0006, kbZ);
  group.add(legends);

  const padMat = track(new THREE.MeshPhysicalMaterial({ color: new THREE.Color("#454a52"), metalness: 0.9, roughness: 0.22, clearcoat: 0.6 }));
  const pad = new THREE.Mesh(track(new RoundedBoxGeometry(W * 0.36, 0.004, D * 0.3, 2, 0.02)), padMat);
  pad.position.set(0, T + 0.0005, D * 0.27);
  group.add(pad);

  // hinge barrel
  const hinge = new THREE.Mesh(track(new THREE.CylinderGeometry(0.05, 0.05, W * 0.72, 24)), dark);
  hinge.rotation.z = Math.PI / 2;
  hinge.position.set(0, T + 0.02, -D / 2 + 0.03);
  group.add(hinge);

  // lid, pivoting at the back edge of the base
  const lidPivot = new THREE.Group();
  lidPivot.position.set(0, T + 0.004, -D / 2 + 0.02);
  group.add(lidPivot);
  const lid = new THREE.Mesh(track(new RoundedBoxGeometry(W, LT, lidD, 4, 0.03)), aluminium);
  lid.position.set(0, LT / 2, lidD / 2);
  lidPivot.add(lid);

  // stickers on the outer face (readable from behind when open)
  const stickerTex = track(createStickerTexture(opts.textureSize));
  const stickerMat = track(
    new THREE.MeshPhysicalMaterial({
      map: stickerTex,
      transparent: true,
      alphaTest: 0.35,
      roughness: 0.5,
      metalness: 0,
      clearcoat: 0.35,
      clearcoatRoughness: 0.5,
      polygonOffset: true,
      polygonOffsetFactor: -2,
    }),
  );
  const stickers = new THREE.Mesh(track(new THREE.PlaneGeometry(W * 0.92, lidD * 0.9)), stickerMat);
  stickers.rotation.set(-Math.PI / 2, 0, Math.PI);
  stickers.position.set(0, LT + 0.0015, lidD / 2);
  lidPivot.add(stickers);

  // the display, on the inner face
  const top = lidD / 2 + glassH / 2 - 0.02; // top edge of the display
  const screen = createLaptopScreen({
    glassW,
    glassH,
    glassZ: lidD / 2,
    displayW,
    displayH,
    displayZ: top - displayH / 2,
    surfaceY: 0,
    radius: 0.05,
    aspect: opts.aspect,
  });
  lidPivot.add(screen.group);

  // everything opaque takes part in the bloom pass as an occluder
  const occluders = [aluminium, edge, dark, wellMat, wallMat, capMat, legendMat, padMat, stickerMat, ...screen.materials];
  group.traverse((o) => o.layers.enable(1));

  return {
    group,
    lidPivot,
    screen,
    occluders,
    /** 0 = closed, 1 = fully open */
    setOpen(k: number) {
      lidPivot.rotation.x = -THREE.MathUtils.degToRad(LAPTOP.open) * k;
    },
    setBacklight(k: number) {
      wellMat.emissiveIntensity = k * 1.6;
      legendMat.emissiveIntensity = k * 1.2;
    },
    dispose() {
      disposables.forEach((d) => d.dispose());
      screen.dispose();
    },
  };
}
