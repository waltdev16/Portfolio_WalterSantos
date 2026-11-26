// Recorrido de la cámara de la intro: un solo camino suave por la carretera, alrededor del dispositivo y hacia su pantalla.
/**
 * CameraController — one continuous camera move for the whole intro.
 *
 * A single spline carries the camera: down the road with the light trails,
 * half a turn around the device in the same direction the trails wrap it,
 * settling in front of the screen, and finally straight into it to the exact
 * pose where the page fills the viewport. Time is mapped to distance along the
 * spline with a monotone cubic, so speed changes smoothly — no stops, no jumps,
 * no back-and-forth.
 */
import * as THREE from "three";
import { hyperLook } from "./HyperspeedScene";

const ROAD_POS = new THREE.Vector3(0, 8, -5);

/** time keys of the move, in seconds */
const CAMERA = { arrive: 2.4, front: 4.9, hold: 5.6, end: 7.0 } as const;

const smooth = (a: number, b: number, t: number) => {
  const k = Math.min(1, Math.max(0, (t - a) / (b - a)));
  return k * k * (3 - 2 * k);
};

/** Monotone cubic Hermite through (xs, ys) with given end slopes (Fritsch–Carlson). */
function monotone(xs: number[], ys: number[], m0: number, mN: number) {
  const n = xs.length;
  const d = xs.slice(0, -1).map((x, i) => (ys[i + 1] - ys[i]) / (xs[i + 1] - x));
  const m = xs.map((_, i) => (i === 0 ? m0 : i === n - 1 ? mN : d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2));
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) {
      m[i] = m[i + 1] = 0;
      continue;
    }
    const a = m[i] / d[i];
    const b = m[i + 1] / d[i];
    const h = a * a + b * b;
    if (h > 9) {
      const tau = 3 / Math.sqrt(h);
      m[i] = tau * a * d[i];
      m[i + 1] = tau * b * d[i];
    }
  }
  return (x: number) => {
    if (x <= xs[0]) return ys[0] + m0 * (x - xs[0]);
    if (x >= xs[n - 1]) return ys[n - 1];
    let i = 0;
    while (x > xs[i + 1]) i++;
    const h = xs[i + 1] - xs[i];
    const t = (x - xs[i]) / h;
    const t2 = t * t, t3 = t2 * t;
    return (2 * t3 - 3 * t2 + 1) * ys[i] + (t3 - 2 * t2 + t) * h * m[i] + (-2 * t3 + 3 * t2) * ys[i + 1] + (t3 - t2) * h * m[i + 1];
  };
}

export function createCameraController(camera: THREE.PerspectiveCamera, device: THREE.Object3D, center = new THREE.Vector3(0, 0.45, 0)) {
  let path: THREE.CatmullRomCurve3 | null = null;
  let progress: (t: number) => number = () => 0;
  const centerWorld = new THREE.Vector3();
  const screenCenter = new THREE.Vector3();
  const look = new THREE.Vector3();
  const ahead = new THREE.Vector3();
  const road = new THREE.Vector3();
  const tmp = new THREE.Vector3();

  return {
    /**
     * Builds the path once the device's final (open) pose is known.
     * `dir` is the direction the light trails wrap the device (+1 / -1).
     */
    build(o: { screenCenter: THREE.Vector3; normal: THREE.Vector3; pageHeight: number; fov: number; aspect: number; extent: number; dir: number }) {
      screenCenter.copy(o.screenCenter);
      const normal = o.normal.clone().normalize();
      const reach = (o.aspect < 1 ? Math.min(2.1, 1.25 / o.aspect) : o.aspect < 1.35 ? 1.3 : 1) * Math.max(0.6, o.extent / 3.3);
      const fill = o.pageHeight / 2 / Math.tan(THREE.MathUtils.degToRad(o.fov) / 2);
      const final = screenCenter.clone().addScaledVector(normal, fill);
      const front = screenCenter.clone().addScaledVector(normal, Math.max(fill * 1.9, 4.4 * reach));
      device.updateMatrixWorld(true);

      // the half turn around the device, in its own frame: from the road side
      // (angle π) round to the front (angle 0 / 2π), ending exactly at `front`
      const frontLocal = device.worldToLocal(front.clone());
      const r1 = Math.hypot(frontLocal.x, frontLocal.z);
      const h1 = frontLocal.y;
      const r0 = 7.6 * reach;
      const h0 = 3.9 * Math.sqrt(reach);
      const a1 = Math.atan2(frontLocal.x, frontLocal.z); // ≈ 0
      const spiral: THREE.Vector3[] = [];
      const steps = 12;
      const aEnd = o.dir > 0 ? a1 + Math.PI * 2 : a1;
      for (let k = 0; k <= steps; k++) {
        const f = k / steps;
        const e = f * f * (3 - 2 * f);
        const a = Math.PI + f * (aEnd - Math.PI);
        const r = THREE.MathUtils.lerp(r0, r1, e);
        const h = THREE.MathUtils.lerp(h0, h1, e);
        spiral.push(device.localToWorld(new THREE.Vector3(Math.sin(a) * r, h, Math.cos(a) * r)));
      }
      spiral[spiral.length - 1] = front.clone();

      // the road leg, gently descending toward the start of the turn
      const start = spiral[0];
      const roadLeg = [ROAD_POS.clone(), ROAD_POS.clone().lerp(start, 0.38).setY(THREE.MathUtils.lerp(ROAD_POS.y, start.y, 0.25)), ROAD_POS.clone().lerp(start, 0.72)];
      const into = front.clone().lerp(final, 0.5);
      const points = [...roadLeg, ...spiral, into, final];
      path = new THREE.CatmullRomCurve3(points, false, "centripetal");

      // distance along the path at each key pose
      const N = 1000;
      const lengths = path.getLengths(N);
      const total = lengths[N];
      const at = (index: number) => lengths[Math.round((index / (points.length - 1)) * N)] / total;
      const uArrive = at(roadLeg.length);
      const uFront = at(roadLeg.length + spiral.length - 1);
      const uHold = uFront + (1 - uFront) * 0.08;
      // riding the road first (the Hyperspeed world flows past, as in the original),
      // then pulling forward with the trails, easing into the turn, settling in
      // front of the device, then in
      progress = monotone(
        [0, 1.1, CAMERA.arrive, CAMERA.front, CAMERA.hold, CAMERA.end],
        [0, uArrive * 0.04, uArrive, uFront, uHold, 1],
        0,
        0,
      );
    },

    /** where the camera will be at time t (device-independent, world space) */
    positionAt(t: number, out = new THREE.Vector3()) {
      if (!path) return out.copy(ROAD_POS);
      return path.getPointAt(Math.min(1, Math.max(0, progress(t))), out);
    },

    update(t: number, roadTime: number, curvature: number, fov: number) {
      camera.fov = fov;
      device.localToWorld(centerWorld.copy(center));
      if (!path) return;
      const u = Math.min(1, Math.max(0, progress(t)));
      path.getPointAt(u, camera.position);

      // looking: along the road (with the Hyperspeed look-ahead into the curves),
      // then at the device, then at its screen
      hyperLook(roadTime, curvature, road);
      path.getPointAt(Math.min(1, u + 0.02), ahead);
      // the original Hyperspeed view first, then along the path ahead
      tmp.copy(ahead).sub(camera.position).normalize().multiplyScalar(10).add(camera.position);
      road.add(camera.position);
      tmp.lerpVectors(road, tmp, smooth(0.6, 1.9, t));
      look.lerpVectors(tmp, centerWorld, smooth(1.3, 3.1, t));
      look.lerp(screenCenter, smooth(4.1, 5.1, t));

      camera.up.set(0, 1, 0);
      camera.lookAt(look);
      camera.updateProjectionMatrix();
      camera.updateMatrixWorld();
    },
  };
}
