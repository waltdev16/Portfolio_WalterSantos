// Elige y construye el dispositivo de la intro según la pantalla del visitante: laptop, tablet o celular.
/**
 * Tablet and phone for the smaller viewports, so a visitor on a phone enters
 * the site through a phone and a visitor on a tablet through a tablet.
 *
 * Both are aluminium slabs that start face down (showing their back, with a
 * few stickers and the camera module), and "wake up" by turning toward the
 * camera around their own centre — the equivalent of the laptop's hinge. They
 * expose the same interface as the laptop, so the rest of the intro is shared.
 */
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { createLaptopScreen } from "./LaptopScreen";
import { createStickerTexture } from "./LaptopStickers";
import { createLaptopModel, LAPTOP } from "./LaptopModel";
import type { Disposable } from "./HyperspeedScene";

export type DeviceKind = "laptop" | "tablet" | "phone";

export type Device = {
  kind: DeviceKind;
  group: THREE.Group;
  /** the part that carries the screen (laptop lid, or the whole slab) */
  lidPivot: THREE.Group;
  screen: ReturnType<typeof createLaptopScreen>;
  occluders: THREE.Material[];
  /** the largest dimension, used to frame the camera */
  extent: number;
  setOpen: (k: number) => void;
  setBacklight: (k: number) => void;
  dispose: () => void;
};

export function pickDevice(width: number, height: number): DeviceKind {
  if (width < 640) return "phone";
  // tablets, including large ones held upright
  if (width < 1024 || (width < 1400 && height > width)) return "tablet";
  return "laptop";
}

/** a rounded rectangle extruded to thickness T, with a small bevel, centred on y = 0 */
function roundedSlab(W: number, D: number, T: number, r: number) {
  const bevel = Math.min(T * 0.35, 0.02);
  const w = W / 2 - bevel, h = D / 2 - bevel, rr = Math.max(0.01, r - bevel);
  const shape = new THREE.Shape();
  shape.moveTo(-w + rr, -h);
  shape.lineTo(w - rr, -h);
  shape.quadraticCurveTo(w, -h, w, -h + rr);
  shape.lineTo(w, h - rr);
  shape.quadraticCurveTo(w, h, w - rr, h);
  shape.lineTo(-w + rr, h);
  shape.quadraticCurveTo(-w, h, -w, h - rr);
  shape.lineTo(-w, -h + rr);
  shape.quadraticCurveTo(-w, -h, -w + rr, -h);
  const geo = new THREE.ExtrudeGeometry(shape, { depth: T - bevel * 2, bevelEnabled: true, bevelSize: bevel, bevelThickness: bevel, bevelSegments: 4, curveSegments: 10 });
  geo.rotateX(-Math.PI / 2);
  geo.translate(0, -(T - bevel * 2) / 2, 0);
  geo.computeVertexNormals();
  return geo;
}

function createSlab(kind: "tablet" | "phone", opts: { textureSize: number; aspect: number }): Device {
  const disposables: Disposable[] = [];
  const track = <T extends Disposable>(x: T) => (disposables.push(x), x);
  const phone = kind === "phone";
  const landscape = opts.aspect > 1;
  // the display takes the visitor's aspect ratio, so the page fills it;
  // the body is the display plus a thin border (sizes in scene units, laptop = 3.3)
  const longest = phone ? 2.4 : 3.0;
  const bezel = phone ? 0.035 : 0.05;
  const displayW = landscape ? longest : longest * opts.aspect;
  const displayH = landscape ? longest / opts.aspect : longest;
  const W = displayW + bezel * 2 + 0.03;
  const D = displayH + bezel * 2 + 0.03;
  const T = phone ? 0.075 : 0.065;
  const radius = phone ? 0.17 : 0.14;

  const group = new THREE.Group();
  const pivot = new THREE.Group();
  pivot.position.y = 0.35;
  group.add(pivot);

  const metal = track(new THREE.MeshPhysicalMaterial({ color: new THREE.Color("#4a4f57"), metalness: 1, roughness: 0.36, clearcoat: 0.2, clearcoatRoughness: 0.4 }));
  const edge = track(new THREE.MeshPhysicalMaterial({ color: new THREE.Color("#7c8592"), metalness: 1, roughness: 0.18 }));
  const dark = track(new THREE.MeshPhysicalMaterial({ color: new THREE.Color("#0b0d10"), metalness: 0.3, roughness: 0.25, clearcoat: 1 }));

  // body: rounded slab with softened edges, screen on -y, back on +y
  const body = new THREE.Mesh(track(roundedSlab(W, D, T, radius)), metal);
  pivot.add(body);

  // camera module on the back, near the top-left (seen from behind)
  const lensGeo = track(new THREE.CylinderGeometry(phone ? 0.085 : 0.06, phone ? 0.085 : 0.06, 0.02, 32));
  const ringGeo = track(new THREE.TorusGeometry(phone ? 0.09 : 0.065, 0.008, 8, 32));
  const moduleMesh = new THREE.Mesh(track(new RoundedBoxGeometry(phone ? 0.46 : 0.2, 0.02, phone ? 0.46 : 0.2, 3, 0.008)), metal);
  const mx = (W / 2 - (phone ? 0.3 : 0.18)) * (landscape ? -1 : 1);
  const mz = D / 2 - (phone ? 0.3 : 0.18);
  moduleMesh.position.set(mx, T / 2 + 0.01, mz);
  pivot.add(moduleMesh);
  const lenses = phone ? [[-0.1, -0.1], [0.1, -0.1], [-0.1, 0.1]] : [[0, 0]];
  lenses.forEach(([dx, dz]) => {
    const lens = new THREE.Mesh(lensGeo, dark);
    lens.position.set(mx + dx, T / 2 + 0.025, mz + dz);
    pivot.add(lens);
    const ring = new THREE.Mesh(ringGeo, edge);
    ring.rotation.x = Math.PI / 2;
    ring.position.copy(lens.position).setY(T / 2 + 0.034);
    pivot.add(ring);
  });

  // a few stickers on the back
  const stickerTex = track(
    createStickerTexture(opts.textureSize, {
      aspect: D / W,
      seed: phone ? 7 : 13,
      scale: phone ? 2.1 : 1.6,
      only: phone ? ["python", "braces", "quantum", "rocket", "star", "checkered"] : ["mission", "python", "github", "quantum", "js", "checkered", "gear", "braces", "circuit", "rocket", "star", "hello"],
    }),
  );
  const stickerMat = track(
    new THREE.MeshPhysicalMaterial({ map: stickerTex, transparent: true, alphaTest: 0.35, roughness: 0.5, clearcoat: 0.35, polygonOffset: true, polygonOffsetFactor: -2 }),
  );
  const stickers = new THREE.Mesh(track(new THREE.PlaneGeometry(W * 0.86, D * 0.66)), stickerMat);
  stickers.rotation.set(-Math.PI / 2, 0, Math.PI);
  stickers.position.set(0, T / 2 + 0.0015, -D * 0.1);
  pivot.add(stickers);

  // the screen, edge to edge with a thin border
  const glassW = W - 0.03;
  const glassH = D - 0.03;
  const screen = createLaptopScreen({
    glassW,
    glassH,
    glassZ: 0,
    displayW,
    displayH,
    displayZ: 0,
    surfaceY: -T / 2,
    radius: radius * 0.85,
    aspect: opts.aspect,
  });
  pivot.add(screen.group);

  group.traverse((o) => o.layers.enable(1));

  // turns from face-down to facing the camera, leaning back a little
  const OPEN = 96;
  return {
    kind,
    group,
    lidPivot: pivot,
    screen,
    occluders: [metal, edge, dark, stickerMat, ...screen.materials],
    extent: Math.max(W, D),
    setOpen(k) {
      pivot.rotation.x = -THREE.MathUtils.degToRad(OPEN) * k;
    },
    setBacklight() {
      /* no keyboard */
    },
    dispose() {
      disposables.forEach((d) => d.dispose());
      screen.dispose();
    },
  };
}

export function createDevice(kind: DeviceKind, opts: { textureSize: number; aspect: number }): Device {
  if (kind === "laptop") {
    const laptop = createLaptopModel(opts);
    return { kind, ...laptop, extent: LAPTOP.width };
  }
  return createSlab(kind, opts);
}
