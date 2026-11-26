// Arma la escena 3D de la intro, la reproduce y libera todos sus recursos al terminar.
/**
 * Builds the intro scene, plays it once and tears everything down.
 * Loaded with a dynamic import, so return visitors never download three.js.
 */
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { createBloom, createHyperspeed } from "./HyperspeedScene";
import { createLightTrails } from "./LightTrails";
import { createDevice, pickDevice } from "./DeviceModels";
import { createCameraController } from "./CameraController";
import { createPortfolioTransition } from "./PortfolioTransition";
import { PHASE, TRAILS, sample } from "./timeline";

export type IntroHandle = {
  /** freezes the intro and gives the page back, without callbacks (the caller fades out) */
  skip: () => void;
  /** releases every GPU resource */
  stop: () => void;
};

const COLORS = {
  background: "#08090D",
  tail: ["#718096", "#a8b5c7", "#e2e8f0"],
  head: ["#38bdf8", "#2563eb", "#7dd3fc"],
  trails: ["#e2e8f0", "#38bdf8", "#a8b5c7", "#2563eb", "#7dd3fc"],
};

export function runIntro(opts: {
  container: HTMLElement;
  site: HTMLElement;
  onHero: () => void;
  onDone: () => void;
}): IntroHandle {
  const { container, site } = opts;
  const small = window.innerWidth < 768;
  const lowPower = small || (navigator.hardwareConcurrency || 8) <= 4;

  const renderer = new THREE.WebGLRenderer({ antialias: !lowPower, alpha: false, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lowPower ? 1.25 : 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.autoClear = false;
  renderer.setClearColor(COLORS.background, 1);
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(96, 1, 0.05, 2000);

  // reflections for the metal; faded in with the arrival
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envMap = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envMap;
  scene.environmentIntensity = 0;

  const hyper = createHyperspeed(scene, {
    density: lowPower ? 22 : 40,
    tailColors: COLORS.tail,
    headColors: COLORS.head,
  });
  const bloom = createBloom(renderer);

  // the device matches the visitor's screen: laptop, tablet or phone.
  // It floats above the road, facing away from us: we arrive from behind.
  const kind = pickDevice(window.innerWidth, window.innerHeight);
  const laptop = createDevice(kind, { textureSize: lowPower ? 1024 : 2048, aspect: window.innerWidth / window.innerHeight });
  laptop.group.position.set(0, 3, -55);
  laptop.group.rotation.y = Math.PI;
  scene.add(laptop.group);
  laptop.group.updateMatrixWorld(true);

  // soft studio light: a cool key from above and a blue rim from behind
  const key = new THREE.DirectionalLight("#dfe8f5", 0);
  key.position.set(-4, 9, 6);
  scene.add(key);
  const rim = new THREE.DirectionalLight("#5b8cff", 0);
  rim.position.set(3, 2, -8);
  scene.add(rim);

  const cameraRig = createCameraController(camera, laptop.group, new THREE.Vector3(0, kind === "laptop" ? 0.45 : 0.35, 0));
  const WRAP = 1; // the trails and the camera go round the device the same way
  const transition = createPortfolioTransition(site);
  const cornersWorld = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];

  let width = 1;
  let height = 1;
  const layout = () => {
    width = Math.max(1, window.innerWidth);
    height = Math.max(1, window.innerHeight);
    renderer.setSize(width, height, false);
    bloom.setSize(renderer.domElement.width, renderer.domElement.height);
    camera.aspect = width / height;
    // the page rectangle follows the viewport's shape
    laptop.screen.fit(camera.aspect);
    // final pose: open lid, screen centre and normal in world space
    laptop.setOpen(1);
    laptop.group.updateMatrixWorld(true);
    const center = laptop.lidPivot.localToWorld(laptop.screen.pageCenter.clone());
    const normal = new THREE.Vector3(0, -1, 0).transformDirection(laptop.lidPivot.matrixWorld);
    cameraRig.build({ screenCenter: center, normal, pageHeight: laptop.screen.pageHeight, fov: sample(PHASE.end).fov, aspect: camera.aspect, extent: laptop.extent, dir: WRAP });
    laptop.setOpen(0);
  };
  layout();

  // trails set off just ahead of where the camera will be, low like the road lights
  const trails = createLightTrails(laptop.group, {
    count: lowPower ? 10 : 16,
    colors: COLORS.trails,
    lights: lowPower ? 2 : 4,
    scale: Math.max(0.7, laptop.extent / 3.3),
    from: laptop.group.worldToLocal(cameraRig.positionAt(TRAILS.start)),
    roadY: laptop.group.worldToLocal(new THREE.Vector3(0, 0.5, 0)).y,
    dir: WRAP,
    timing: TRAILS,
  });
  window.addEventListener("resize", layout);

  let raf = 0;
  let last = 0;
  // the intro's own clock: it advances by real time, but never by more than a
  // frame and a half at once, so a slow frame slows it for an instant instead
  // of making it jump
  let t = 0;
  let heroSent = false;
  let finished = false;
  let pageShown = false;

  const finish = () => {
    if (finished) return;
    finished = true;
    cancelAnimationFrame(raf);
    transition.release();
    if (!heroSent) {
      heroSent = true;
      opts.onHero();
    }
    opts.onDone();
  };

  const frame = () => {
    const now = performance.now();
    raf = 0;
    if (finished) return;
    const dt = last ? Math.min(1 / 24, (now - last) / 1000) : 0;
    last = now;
    t += dt;
    const f = sample(t);

    hyper.update(dt, { pace: f.pace, stretch: f.stretch, curvature: f.curvature, intensity: f.road }, camera.fov, renderer.domElement.height);
    trails.update(t, f.trails);
    scene.environmentIntensity = f.env * 0.75;
    key.intensity = f.env * 1.4;
    rim.intensity = f.env * 1.6;
    laptop.setOpen(f.lid);
    laptop.setBacklight(f.backlight);
    laptop.screen.setPower(f.screen);
    cameraRig.update(t, hyper.shared.uTime.value, f.curvature, f.fov);

    renderer.setRenderTarget(null);
    renderer.clear();
    renderer.render(scene, camera);
    if (f.bloom > 0) {
      // thin lines must stay at least a pixel wide in the half-size glow pass
      const pixel = hyper.shared.uPixel.value;
      hyper.shared.uPixel.value = pixel * (renderer.domElement.height / bloom.levels[0].height);
      bloom.render(scene, camera, f.bloom, laptop.occluders);
      hyper.shared.uPixel.value = pixel;
    }

    // the live page on the screen
    if (t >= PHASE.pageIn) {
      laptop.group.updateMatrixWorld(true);
      laptop.screen.pageCorners.forEach((c, i) => laptop.lidPivot.localToWorld(cornersWorld[i].copy(c)));
      if (transition.sync(cornersWorld, camera, width, height)) {
        if (!pageShown) {
          pageShown = true;
          site.style.zIndex = "201";
        }
        transition.setVisible(f.page);
      }
    }
    if (!heroSent && t >= PHASE.hero) {
      heroSent = true;
      opts.onHero();
    }
    if (t >= PHASE.end) {
      finish();
      return;
    }
    raf = requestAnimationFrame(frame);
  };

  // warm up before the clock starts: compile every shader and upload every
  // texture now, so the first seconds don't stutter
  try {
    laptop.setOpen(1);
    renderer.compile(scene, camera);
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      const mats = mesh.material ? (Array.isArray(mesh.material) ? mesh.material : [mesh.material]) : [];
      mats.forEach((m) => {
        Object.values(m).forEach((v) => {
          if (v instanceof THREE.Texture) renderer.initTexture(v);
        });
      });
    });
    laptop.setOpen(0);
  } catch {
    laptop.setOpen(0);
  }
  // one frame later, so the warm-up work isn't counted as animation time
  raf = requestAnimationFrame(() => {
    last = 0;
    raf = requestAnimationFrame(frame);
  });

  const dispose = () => {
    window.removeEventListener("resize", layout);
    cancelAnimationFrame(raf);
    hyper.dispose();
    bloom.dispose();
    trails.dispose();
    laptop.dispose();
    envMap.dispose();
    pmrem.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
    renderer.domElement.remove();
  };

  return {
    skip() {
      finished = true;
      cancelAnimationFrame(raf);
      transition.release();
    },
    stop() {
      finished = true;
      dispose();
    },
  };
}
