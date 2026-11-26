// Pantalla de los dispositivos de la intro y el rectángulo donde se proyecta la página real.
/**
 * LaptopScreen — the display of any device (laptop lid, tablet, phone).
 *
 * It starts black, warms up to a faint glow, and then the real portfolio
 * (live DOM, see PortfolioTransition) is mapped onto `pageRect`: the largest
 * rectangle with the viewport's aspect ratio that fits the display.
 *
 * Frame: the screen faces -y of its parent; "up" on the screen is +z.
 */
import * as THREE from "three";
import type { Disposable } from "./HyperspeedScene";

export type ScreenSpec = {
  /** glass panel (the bezel) size and centre */
  glassW: number;
  glassH: number;
  glassZ: number;
  /** active display area and centre */
  displayW: number;
  displayH: number;
  displayZ: number;
  /** y of the surface the glass sits on */
  surfaceY: number;
  /** corner radius of the glass */
  radius: number;
  aspect: number;
};

export function createLaptopScreen(spec: ScreenSpec) {
  const disposables: Disposable[] = [];
  const track = <T extends Disposable>(x: T) => (disposables.push(x), x);
  const group = new THREE.Group();
  const y = spec.surfaceY;

  // one sheet of glass with rounded corners; the black border is only a hair wide
  const bezelMat = track(new THREE.MeshPhysicalMaterial({ color: new THREE.Color("#040507"), roughness: 0.1, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.06 }));
  const shape = new THREE.Shape();
  const w = spec.glassW / 2, h = spec.glassH / 2, r = spec.radius;
  shape.moveTo(-w + r, -h);
  shape.lineTo(w - r, -h);
  shape.quadraticCurveTo(w, -h, w, -h + r);
  shape.lineTo(w, h - r);
  shape.quadraticCurveTo(w, h, w - r, h);
  shape.lineTo(-w + r, h);
  shape.quadraticCurveTo(-w, h, -w, h - r);
  shape.lineTo(-w, -h + r);
  shape.quadraticCurveTo(-w, -h, -w + r, -h);
  const glassGeo = track(new THREE.ShapeGeometry(shape, 8));
  glassGeo.rotateX(Math.PI / 2);
  const bezel = new THREE.Mesh(glassGeo, bezelMat);
  bezel.position.set(0, y - 0.002, spec.glassZ);
  group.add(bezel);

  const displayMat = track(new THREE.MeshPhysicalMaterial({ color: new THREE.Color("#000000"), emissive: new THREE.Color("#0b111c"), emissiveIntensity: 0, roughness: 0.08, metalness: 0, clearcoat: 1 }));
  const displayGeo = track(new THREE.PlaneGeometry(spec.displayW, spec.displayH));
  displayGeo.rotateX(Math.PI / 2);
  const display = new THREE.Mesh(displayGeo, displayMat);
  display.position.set(0, y - 0.003, spec.displayZ);
  group.add(display);

  let pageH = spec.displayH;
  const corners = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];
  const center = new THREE.Vector3(0, y - 0.005, spec.displayZ);
  const fit = (aspect: number) => {
    let pageW: number;
    if (aspect > spec.displayW / spec.displayH) {
      pageW = spec.displayW;
      pageH = spec.displayW / aspect;
    } else {
      pageH = spec.displayH;
      pageW = spec.displayH * aspect;
    }
    const z = spec.displayZ;
    const sy = y - 0.005;
    // order: top-left, top-right, bottom-right, bottom-left
    corners[0].set(-pageW / 2, sy, z + pageH / 2);
    corners[1].set(pageW / 2, sy, z + pageH / 2);
    corners[2].set(pageW / 2, sy, z - pageH / 2);
    corners[3].set(-pageW / 2, sy, z - pageH / 2);
  };
  fit(spec.aspect);

  return {
    group,
    materials: [bezelMat, displayMat],
    fit,
    get pageCorners() {
      return corners;
    },
    get pageCenter() {
      return center;
    },
    get pageHeight() {
      return pageH;
    },
    setPower(k: number) {
      displayMat.emissiveIntensity = k;
    },
    dispose() {
      disposables.forEach((d) => d.dispose());
    },
  };
}
