// Proyecta el portafolio real (DOM en vivo) sobre la pantalla 3D con una transformación CSS matrix3d.
/**
 * PortfolioTransition — puts the real, live portfolio on the laptop's screen.
 *
 * Every frame the four corners of the screen's page rectangle are projected
 * with the scene camera, and the site wrapper gets the CSS matrix3d() that
 * maps the viewport onto those four points (a projective transform, the same
 * idea as CSS3DRenderer). The DOM is never copied or captured. When the camera
 * finishes framing the screen, the corners land on the viewport corners, the
 * matrix becomes the identity and the transform is simply removed.
 */
import * as THREE from "three";

/** Solves the 8 unknowns of the homography that maps the unit rect to the quad. */
function homography(w: number, h: number, q: [number, number][]) {
  const src: [number, number][] = [
    [0, 0],
    [w, 0],
    [w, h],
    [0, h],
  ];
  const A: number[][] = [];
  const b: number[] = [];
  for (let i = 0; i < 4; i++) {
    const [x, y] = src[i];
    const [u, v] = q[i];
    A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]);
    b.push(u);
    A.push([0, 0, 0, x, y, 1, -v * x, -v * y]);
    b.push(v);
  }
  // Gaussian elimination with partial pivoting
  const n = 8;
  for (let col = 0; col < n; col++) {
    let pivot = col;
    for (let r = col + 1; r < n; r++) if (Math.abs(A[r][col]) > Math.abs(A[pivot][col])) pivot = r;
    [A[col], A[pivot]] = [A[pivot], A[col]];
    [b[col], b[pivot]] = [b[pivot], b[col]];
    const d = A[col][col] || 1e-12;
    for (let r = col + 1; r < n; r++) {
      const f = A[r][col] / d;
      if (!f) continue;
      for (let k = col; k < n; k++) A[r][k] -= f * A[col][k];
      b[r] -= f * b[col];
    }
  }
  const x = new Array(n).fill(0);
  for (let r = n - 1; r >= 0; r--) {
    let s = b[r];
    for (let k = r + 1; k < n; k++) s -= A[r][k] * x[k];
    x[r] = s / (A[r][r] || 1e-12);
  }
  return x; // a b c d e f g h  ->  u = (a x + b y + c) / (g x + h y + 1)
}

export function createPortfolioTransition(site: HTMLElement) {
  const v = new THREE.Vector3();
  const quad: [number, number][] = [
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
  ];
  return {
    /** maps the site onto the four world-space corners; returns false if a corner is behind the camera */
    sync(cornersWorld: THREE.Vector3[], camera: THREE.Camera, width: number, height: number) {
      for (let i = 0; i < 4; i++) {
        v.copy(cornersWorld[i]).applyMatrix4(camera.matrixWorldInverse);
        if (v.z > -0.01) return false;
        v.applyMatrix4(camera.projectionMatrix);
        quad[i][0] = ((v.x + 1) / 2) * width;
        quad[i][1] = ((1 - v.y) / 2) * height;
      }
      const [a, b, c, d, e, f, g, h] = homography(width, height, quad);
      // CSS matrix3d is column-major
      site.style.transform = `matrix3d(${a},${d},0,${g},${b},${e},0,${h},0,0,1,0,${c},${f},0,1)`;
      return true;
    },
    setVisible(opacity: number) {
      site.style.visibility = opacity > 0 ? "visible" : "hidden";
      site.style.opacity = String(opacity);
    },
    release() {
      site.style.transform = "";
      site.style.visibility = "";
      site.style.opacity = "";
      site.style.zIndex = "";
    },
  };
}
