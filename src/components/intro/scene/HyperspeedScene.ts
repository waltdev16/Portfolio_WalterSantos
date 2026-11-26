// Líneas de luz de la carretera (adaptado de Hyperspeed de React Bits) y el resplandor (bloom) de la intro.
/**
 * Hyperspeed — adapted from the React Bits <Hyperspeed /> component (MIT).
 *
 * The original owns its renderer, camera and loop. Here its light trails and
 * bloom are built into a scene that is shared with the
 * laptop, so the intro is one continuous 3D world. The cinematic timeline drives
 * the speed, stretch, curvature and intensity instead of the pointer.
 */
import * as THREE from "three";

const TRAVEL = 400;
const MAX_COLORS = 8;

const BEND = /* glsl */ `
  uniform float uTime;
  uniform float uCurvature;
  uniform float uFogNear;
  uniform float uFogFar;
  uniform float uPixel;
  #define PI 3.14159265358979
  float nsin(float v) { return sin(v) * 0.5 + 0.5; }
  float windX(float p) { return cos(PI * p * 4.0 + uTime) * 25.0 + pow(cos(PI * p * 8.0 + uTime * 2.0), 2.0) * 5.0; }
  float windY(float p) { return -nsin(PI * p * 8.0 + uTime) * 10.0 - pow(nsin(PI * p + uTime / 8.0), 5.0) * 10.0; }
  vec3 bend(float p) { return vec3(windX(p) - windX(0.0125), windY(p) - windY(0.0125), 0.0) * uCurvature; }
`;

const STREAK_VERTEX = /* glsl */ `
  ${BEND}
  attribute vec4 aSeedA;
  attribute vec4 aSeedB;
  attribute float aPair;
  attribute float aTone;
  uniform float uTravel;
  uniform float uRoadX;
  uniform float uRoadWidth;
  uniform float uLanes;
  uniform float uDirection;
  uniform vec2 uSpeedRange;
  uniform float uTrail;
  uniform float uStretch;
  uniform float uSize;
  uniform float uRadiusScale;
  uniform float uMirror;
  uniform vec3 uColors[${MAX_COLORS}];
  uniform float uColorCount;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vColor;
  varying float vFog;
  varying float vAbove;
  varying float vThin;
  void main() {
    float laneWidth = uRoadWidth / uLanes;
    float lane = min(floor(aSeedA.x * uLanes), uLanes - 1.0);
    float laneX = (lane + 0.5) * laneWidth - uRoadWidth * 0.5 + (aSeedA.y - 0.5) * 0.5 * laneWidth;
    float carWidth = mix(0.3, 0.5, aSeedA.z) * laneWidth;
    float radius = mix(0.05, 0.14, aSeedA.w) * uSize;
    float len = mix(0.03, 0.2, aSeedB.x) * uTravel * uTrail * (1.0 + uStretch);
    float speed = mix(uSpeedRange.x, uSpeedRange.y, aSeedB.y) * uDirection;
    vec3 center = vec3(
      uRoadX + laneX + aPair * carWidth,
      aSeedB.w * 0.8 + radius * 1.3,
      position.z * len + len - mod(uTime * speed + aSeedB.z * uTravel, uTravel)
    );
    vAbove = center.y;
    center.y = mix(center.y, -center.y * 1.8, uMirror);
    center += bend(abs(center.z / uTravel));
    float depth = max(0.1, -(modelViewMatrix * vec4(center, 1.0)).z);
    float wanted = radius * uRadiusScale;
    float shown = max(wanted, depth * uPixel * 0.75);
    vThin = wanted / shown;
    vec3 p = center + vec3(position.x * shown, position.y * shown * mix(1.0, 2.2, uMirror), 0.0);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    vec3 n = normal;
    n.y *= 1.0 - 2.0 * uMirror;
    vNormal = normalize(normalMatrix * n);
    vView = -mv.xyz;
    vUv = uv;
    vColor = uColors[int(min(floor(aTone * uColorCount), uColorCount - 1.0))];
    vFog = smoothstep(uFogNear, uFogFar, -mv.z);
  }
`;

const STREAK_FRAGMENT = /* glsl */ `
  uniform vec2 uFade;
  uniform float uIntensity;
  uniform float uSharp;
  uniform float uCore;
  uniform float uMirror;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vColor;
  varying float vFog;
  varying float vAbove;
  varying float vThin;
  void main() {
    float facing = abs(dot(normalize(vNormal), normalize(vView)));
    float alpha = pow(facing, uSharp) * smoothstep(uFade.x, uFade.y, vUv.x) * uIntensity * vThin * (1.0 - vFog);
    alpha *= mix(1.0, exp(-vAbove * 0.9), uMirror);
    if (alpha < 0.003) discard;
    gl_FragColor = vec4(mix(vColor, vec3(1.0), pow(facing, 12.0) * uCore), min(alpha, 1.0));
  }
`;

const QUAD_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

const DOWN_FRAGMENT = /* glsl */ `
  uniform sampler2D uTexture;
  uniform vec2 uTexel;
  varying vec2 vUv;
  vec4 tap(vec2 o) { return min(texture2D(uTexture, vUv + uTexel * o), vec4(1.0)); }
  void main() {
    vec4 sum = tap(vec2(0.0)) * 4.0 + tap(vec2(-1.0, -1.0)) + tap(vec2(1.0, -1.0)) + tap(vec2(-1.0, 1.0)) + tap(vec2(1.0, 1.0));
    gl_FragColor = sum * 0.125;
  }
`;

const TENT = /* glsl */ `
  uniform sampler2D uTexture;
  uniform vec2 uTexel;
  varying vec2 vUv;
  vec4 tent() {
    vec4 sum = texture2D(uTexture, vUv + uTexel * vec2(-1.0, 0.0));
    sum += texture2D(uTexture, vUv + uTexel * vec2(1.0, 0.0));
    sum += texture2D(uTexture, vUv + uTexel * vec2(0.0, -1.0));
    sum += texture2D(uTexture, vUv + uTexel * vec2(0.0, 1.0));
    sum += texture2D(uTexture, vUv + uTexel * vec2(-0.5, -0.5)) * 2.0;
    sum += texture2D(uTexture, vUv + uTexel * vec2(0.5, -0.5)) * 2.0;
    sum += texture2D(uTexture, vUv + uTexel * vec2(-0.5, 0.5)) * 2.0;
    sum += texture2D(uTexture, vUv + uTexel * vec2(0.5, 0.5)) * 2.0;
    return sum / 12.0;
  }
`;

const UP_FRAGMENT = /* glsl */ `${TENT}
  void main() { gl_FragColor = tent(); }`;

const BLOOM_FRAGMENT = /* glsl */ `${TENT}
  uniform float uStrength;
  uniform float uCeiling;
  void main() {
    vec4 color = tent() * uStrength;
    float peak = max(max(color.r, max(color.g, color.b)), 0.0001);
    color *= uCeiling * (1.0 - exp(-peak / uCeiling)) / peak;
    gl_FragColor = vec4(color.rgb, 0.0);
  }`;

export type Disposable = { dispose: () => void };

/** Paints a palette into a uniform array of vec3. */
function palette(colors: string[]) {
  const value = Array.from({ length: MAX_COLORS }, (_, i) => {
    const c = new THREE.Color(colors[i % colors.length]);
    return new THREE.Vector3(c.r, c.g, c.b);
  });
  return { uColors: { value }, uColorCount: { value: Math.min(colors.length, MAX_COLORS) } };
}

function instanced(source: THREE.BufferGeometry) {
  const geometry = new THREE.InstancedBufferGeometry();
  geometry.setIndex(source.index);
  Object.entries(source.attributes).forEach(([name, attribute]) => geometry.setAttribute(name, attribute));
  return geometry;
}

/** The camera look-ahead of the winding curve, as in the original. */
export function hyperLook(time: number, curvature: number, out: THREE.Vector3) {
  const nsin = (v: number) => Math.sin(v) * 0.5 + 0.5;
  const windX = (q: number) => Math.cos(Math.PI * q * 4 + time) * 25 + Math.cos(Math.PI * q * 8 + time * 2) ** 2 * 5;
  const windY = (q: number) => -nsin(Math.PI * q * 8 + time) * 10 - nsin(Math.PI * q + time / 8) ** 5 * 10;
  const p = 0.025;
  return out.set((windX(p) - windX(p + 0.007)) * curvature * -2, (windY(p) - windY(p + 0.007)) * curvature * -5, -10);
}

export type HyperspeedOptions = {
  density: number;
  tailColors: string[];
  headColors: string[];
};

export type HyperspeedControls = {
  /** cruising pace (1 = original speed) */
  pace: number;
  /** trail stretch, as while boosting */
  stretch: number;
  curvature: number;
  /** 0..1 global brightness of the road layer */
  intensity: number;
};

export function createHyperspeed(scene: THREE.Scene, opts: HyperspeedOptions) {
  const disposables: Disposable[] = [];
  const shared = {
    uTime: { value: 0 },
    uCurvature: { value: 1 },
    uFogNear: { value: TRAVEL * 0.22 },
    uFogFar: { value: TRAVEL * 0.95 },
    uTravel: { value: TRAVEL },
    uStretch: { value: 0 },
    uPixel: { value: 0.001 },
  };
  const effects: THREE.ShaderMaterial[] = [];
  const material = (vertexShader: string, fragmentShader: string, uniforms: Record<string, THREE.IUniform>, extra: THREE.ShaderMaterialParameters = {}) => {
    const m = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms: { ...shared, ...uniforms }, transparent: true, depthWrite: false, ...extra });
    disposables.push(m);
    return m;
  };

  const roadWidth = 10;
  const median = 2;
  const lanes = 3;

  // only the light trails: no road surface, markings, poles or dust
  const tube = new THREE.TubeGeometry(new THREE.LineCurve3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -1)), 24, 1, 7, false);
  disposables.push(tube);

  const streakGroup = (direction: number, fade: [number, number], speedRange: [number, number], colors: string[], roadX: number) => {
    const count = opts.density;
    const geometry = instanced(tube);
    // one light per car (the original draws a pair side by side): a single line per lane
    const seedA = new Float32Array(count * 4);
    const seedB = new Float32Array(count * 4);
    const pair = new Float32Array(count);
    const tone = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      seedA.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4);
      seedB.set([Math.random(), Math.random(), Math.random(), Math.random() * Math.random()], i * 4);
      pair[i] = 0;
      tone[i] = Math.random();
    }
    geometry.setAttribute("aSeedA", new THREE.InstancedBufferAttribute(seedA, 4));
    geometry.setAttribute("aSeedB", new THREE.InstancedBufferAttribute(seedB, 4));
    geometry.setAttribute("aPair", new THREE.InstancedBufferAttribute(pair, 1));
    geometry.setAttribute("aTone", new THREE.InstancedBufferAttribute(tone, 1));
    geometry.instanceCount = count;
    disposables.push(geometry);
    const uniforms = {
      uRoadX: { value: roadX },
      uRoadWidth: { value: roadWidth },
      uLanes: { value: lanes },
      uDirection: { value: direction },
      uSpeedRange: { value: new THREE.Vector2(...speedRange) },
      uTrail: { value: 1 },
      uSize: { value: 1.7 }, // thicker than the original component
      uFade: { value: new THREE.Vector2(...fade) },
      ...palette(colors),
    };
    const layer = (radiusScale: number, sharp: number, mirror: number, order: number) => {
      const m = material(
        STREAK_VERTEX,
        STREAK_FRAGMENT,
        { ...uniforms, uRadiusScale: { value: radiusScale }, uSharp: { value: sharp }, uMirror: { value: mirror }, uIntensity: { value: 1 }, uCore: { value: mirror ? 0 : 0.75 } },
        { depthTest: !mirror, blending: THREE.AdditiveBlending },
      );
      effects.push(m);
      const mesh = new THREE.Mesh(geometry, m);
      mesh.frustumCulled = false;
      mesh.renderOrder = order;
      if (!mirror) mesh.layers.enable(1);
      scene.add(mesh);
      return m;
    };
    // no mirrored copy on the road: one line, not one above and one below
    return { core: layer(1, 0.85, 0, 3) };
  };

  const half = roadWidth / 2 + median / 2;
  const tail = streakGroup(1, [0, 0.6], [60, 80], opts.tailColors, -half);
  const head = streakGroup(-1, [1, 0.4], [120, 160], opts.headColors, half);

  return {
    shared,
    update(dt: number, c: HyperspeedControls, fov: number, heightPx: number) {
      shared.uTime.value += dt * c.pace;
      shared.uStretch.value = c.stretch;
      shared.uCurvature.value = c.curvature;
      shared.uPixel.value = (2 * Math.tan((fov * Math.PI) / 360)) / Math.max(1, heightPx);
      const i = c.intensity;
      [tail, head].forEach((g) => {
        g.core.uniforms.uIntensity.value = (1 + 0.35 * c.stretch) * i;
      });
    },
    dispose() {
      disposables.forEach((x) => x.dispose());
    },
  };
}

/** Dual-filter bloom from the original component, run over layer 1 only. */
export function createBloom(renderer: THREE.WebGLRenderer) {
  const disposables: Disposable[] = [];
  const floatTargets = renderer.extensions.has("EXT_color_buffer_float") || renderer.extensions.has("EXT_color_buffer_half_float");
  const levels = Array.from({ length: 5 }, (_, index) => {
    const target = new THREE.WebGLRenderTarget(1, 1, { type: floatTargets ? THREE.HalfFloatType : THREE.UnsignedByteType, depthBuffer: index === 0 });
    disposables.push(target);
    return target;
  });
  const quadScene = new THREE.Scene();
  const quadCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const quadGeometry = new THREE.PlaneGeometry(2, 2);
  disposables.push(quadGeometry);
  const quad = new THREE.Mesh(quadGeometry);
  quad.frustumCulled = false;
  quadScene.add(quad);
  const pass = (fragmentShader: string, extra: THREE.ShaderMaterialParameters) => {
    const m = new THREE.ShaderMaterial({
      vertexShader: QUAD_VERTEX,
      fragmentShader,
      uniforms: { uTexture: { value: null }, uTexel: { value: new THREE.Vector2() }, uStrength: { value: 1 }, uCeiling: { value: 1 } },
      depthTest: false,
      depthWrite: false,
      ...extra,
    });
    disposables.push(m);
    return m;
  };
  const down = pass(DOWN_FRAGMENT, { blending: THREE.NoBlending });
  const additive = { blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor, blendSrcAlpha: THREE.OneFactor, blendDstAlpha: THREE.OneFactor } as const;
  const up = pass(UP_FRAGMENT, additive);
  const bloom = pass(BLOOM_FRAGMENT, { ...additive, blendSrcAlpha: THREE.ZeroFactor });
  const run = (m: THREE.ShaderMaterial, source: THREE.WebGLRenderTarget, target: THREE.WebGLRenderTarget | null) => {
    quad.material = m;
    m.uniforms.uTexture.value = source.texture;
    m.uniforms.uTexel.value.set(1 / source.width, 1 / source.height);
    renderer.setRenderTarget(target);
    renderer.render(quadScene, quadCamera);
  };
  return {
    levels,
    setSize(w: number, h: number) {
      levels.forEach((t, i) => t.setSize(Math.max(1, Math.round(w / 2 ** (i + 1))), Math.max(1, Math.round(h / 2 ** (i + 1)))));
    },
    /**
     * Renders layer 1 into the first level (occluders write depth only),
     * blurs it down and up and adds it over the frame.
     */
    render(scene: THREE.Scene, camera: THREE.Camera, strength: number, occluders: THREE.Material[]) {
      camera.layers.set(1);
      occluders.forEach((m) => (m.colorWrite = false));
      renderer.setRenderTarget(levels[0]);
      renderer.setClearColor(0x000000, 0);
      renderer.clear();
      renderer.render(scene, camera);
      occluders.forEach((m) => (m.colorWrite = true));
      camera.layers.set(0);
      for (let i = 1; i < levels.length; i++) run(down, levels[i - 1], levels[i]);
      for (let i = levels.length - 1; i > 1; i--) run(up, levels[i], levels[i - 1]);
      bloom.uniforms.uStrength.value = strength * 1.4;
      bloom.uniforms.uCeiling.value = strength * 0.5;
      run(bloom, levels[1], null);
    },
    dispose() {
      disposables.forEach((x) => x.dispose());
    },
  };
}
