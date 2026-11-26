// Líneas de luz que salen de la carretera, envuelven el dispositivo y se apagan.
/**
 * LightTrails — light streaks that come off the road, wrap around the device
 * and then disappear.
 *
 * Each trail is one continuous path: it starts just ahead of the camera, low
 * like the road lights, runs forward to the device, spirals around it one and
 * a half to two times (passing in front and behind) and ends. A bright head
 * with a fading tail travels the path once; when the tail has run off the end,
 * the trail is gone. Nothing splits apart or fades out in place. A few point
 * lights ride the heads, which is what puts moving reflections on the metal.
 */
import * as THREE from "three";
import type { Disposable } from "./HyperspeedScene";

const VERTEX = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    vNormal = normalize(normalMatrix * normal);
    vView = -mv.xyz;
    vUv = uv;
  }
`;

const FRAGMENT = /* glsl */ `
  uniform float uHead;
  uniform float uLength;
  uniform float uIntensity;
  uniform vec3 uColor;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    float d = uHead - vUv.x;
    if (d < 0.0 || d > uLength) discard;
    float tail = pow(1.0 - d / uLength, 1.7);
    // soft start and end of the path itself
    tail *= smoothstep(0.0, 0.07, vUv.x) * (1.0 - smoothstep(0.94, 1.0, vUv.x));
    float facing = abs(dot(normalize(vNormal), normalize(vView)));
    float alpha = tail * pow(facing, 0.9) * uIntensity;
    if (alpha < 0.004) discard;
    vec3 color = mix(uColor, vec3(1.0), pow(facing, 10.0) * 0.7 * tail);
    gl_FragColor = vec4(color, min(alpha, 1.0));
  }
`;

type Trail = {
  curve: THREE.CatmullRomCurve3;
  material: THREE.ShaderMaterial;
  /** when the head leaves, reaches the device, and finishes the path */
  start: number;
  arrive: number;
  end: number;
  /** fraction of the path where the spiral begins */
  entry: number;
  length: number;
};

export function createLightTrails(
  parent: THREE.Object3D,
  opts: {
    count: number;
    colors: string[];
    lights: number;
    scale: number;
    /** where the camera is when the trails set off (device frame) */
    from: THREE.Vector3;
    /** height of the road lights (device frame) */
    roadY: number;
    /** direction every trail wraps the device; the camera follows the same way */
    dir: number;
    timing: { start: number; arrive: number; end: number };
  },
) {
  const disposables: Disposable[] = [];
  const group = new THREE.Group();
  parent.add(group);
  const trails: Trail[] = [];
  const rand = mulberry(7);
  const s = opts.scale;
  const center = new THREE.Vector3(0, 0.4 * s, 0);

  for (let i = 0; i < opts.count; i++) {
    const points: THREE.Vector3[] = [];
    // the road leg: starts a little ahead of the camera, low, in its own lane
    const lane = (i / Math.max(1, opts.count - 1) - 0.5) * 14 + (rand() - 0.5) * 1.2;
    const roadY = opts.roadY + rand() * 0.7;
    const startZ = opts.from.z + 16 + rand() * 6;
    for (let k = 0; k < 4; k++) {
      const f = k / 3;
      points.push(new THREE.Vector3(lane * (1 - f * 0.75), roadY + (center.y - 0.3 - roadY) * f * f, THREE.MathUtils.lerp(startZ, -9 * s, f)));
    }
    // the spiral: one and a half to two turns, tilted, tightening a little,
    // passing in front of and behind the device
    const r = (2.4 + rand() * 1.6) * s;
    const turns = 1.5 + rand() * 0.55;
    const dir = opts.dir;
    const tilt = (rand() - 0.5) * 0.8;
    const lift = (0.3 + rand() * 1.1) * s;
    const a0 = Math.PI; // entering from the road side (local -z)
    const steps = Math.round(turns * 20);
    const entryIndex = points.length;
    for (let k = 0; k <= steps; k++) {
      const f = k / steps;
      const a = a0 + dir * f * turns * Math.PI * 2;
      const rk = r * (1 - 0.18 * f);
      const p = new THREE.Vector3(Math.sin(a) * rk, center.y + lift * Math.sin(a * 1.0 + i) * 0.5 + (f - 0.5) * 0.6 * s, Math.cos(a) * rk * 0.88);
      p.applyAxisAngle(new THREE.Vector3(1, 0, 0), tilt * Math.min(1, f * 3));
      points.push(p);
    }
    // the exit: a short tangent flick upward, where the tail runs out
    const last = points[points.length - 1];
    const prev = points[points.length - 2];
    const out = last.clone().sub(prev).normalize();
    points.push(last.clone().addScaledVector(out, 1.2 * s).add(new THREE.Vector3(0, 0.5 * s, 0)));

    const curve = new THREE.CatmullRomCurve3(points, false, "centripetal");
    // fraction of arc length where the spiral starts
    const lengths = curve.getLengths(400);
    const total = lengths[lengths.length - 1];
    const entryT = entryIndex / (points.length - 1);
    const entry = lengths[Math.round(entryT * 400)] / total;

    const geometry = new THREE.TubeGeometry(curve, 700, (0.021 + rand() * 0.016) * Math.max(0.7, s), 6, false);
    disposables.push(geometry);
    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      uniforms: {
        uHead: { value: -1 },
        uLength: { value: 0.16 + rand() * 0.12 },
        uIntensity: { value: 0 },
        uColor: { value: new THREE.Color(opts.colors[i % opts.colors.length]) },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    disposables.push(material);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.frustumCulled = false;
    mesh.layers.enable(1);
    mesh.renderOrder = 5;
    group.add(mesh);
    const stagger = rand() * 0.35;
    trails.push({
      curve,
      material,
      start: opts.timing.start + stagger,
      arrive: opts.timing.arrive + stagger + rand() * 0.15,
      end: opts.timing.end + stagger + rand() * 0.4,
      entry,
      length: material.uniforms.uLength.value,
    });
  }

  const lights = Array.from({ length: opts.lights }, (_, i) => {
    const light = new THREE.PointLight(new THREE.Color(opts.colors[i % opts.colors.length]), 0, 6 * s, 1.6);
    group.add(light);
    return light;
  });

  /** head position along the path: fast down the road, then easing round the device */
  const headAt = (tr: Trail, t: number) => {
    if (t <= tr.start) return -1;
    if (t < tr.arrive) {
      const k = (t - tr.start) / (tr.arrive - tr.start);
      return tr.entry * k * (2 - k); // decelerates into the spiral
    }
    const k = Math.min(1, (t - tr.arrive) / (tr.end - tr.arrive));
    const eased = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2;
    // from the entry to past the end, so the tail fully runs off
    return tr.entry + (1 + tr.length - tr.entry) * (0.35 * k + 0.65 * eased);
  };

  return {
    group,
    /** true while any trail is still visible */
    update(t: number, intensity: number) {
      let alive = false;
      trails.forEach((tr, i) => {
        const head = headAt(tr, t);
        tr.material.uniforms.uHead.value = head;
        tr.material.uniforms.uIntensity.value = intensity;
        const visible = head > 0 && head < 1 + tr.length;
        alive ||= visible;
        const light = lights[i];
        if (light) {
          const onPath = head > 0 && head < 1;
          if (onPath) tr.curve.getPointAt(Math.min(1, head), light.position);
          // the light only matters near the device
          light.intensity = onPath && head > tr.entry * 0.9 ? intensity * 2.6 : 0;
        }
      });
      return alive;
    },
    dispose() {
      disposables.forEach((d) => d.dispose());
      lights.forEach((l) => l.dispose());
      group.removeFromParent();
    },
  };
}

/** Small deterministic PRNG, so the composition is the same on every visit. */
export function mulberry(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
