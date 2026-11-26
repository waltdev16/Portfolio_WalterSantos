import { t } from "../i18n";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { SCENE, ZONES, hitsOf, zoneById, type Rect, type ZoneDef, type ZoneId } from "../config/scene";
import type { StageMetrics } from "../hooks/useStage";
import type { WorldProject, ProjectLanguage } from "../../data/projects";
import { MOTION } from "../motion";
import { ObjectHit, ObjectLight } from "./InteractiveObject";
import { HotspotLabel } from "./HotspotPill";
import { ProjectHits, ProjectLights } from "./ProjectGallery";
import { WallFrames } from "./art/WallFrames";
import { Character, GarageLights, Gyroscope, Headlights, IntroLights, SilviaFlame, TokyoView, Turntable, type SilviaHandle } from "./art/Garage";
import { prepareRoar, roar } from "../audio/sound";
import { MugNote } from "./MugNote";

interface Props {
  lang: ProjectLanguage;
  stage: StageMetrics;
  reduced: boolean;
  active: ZoneId | null;
  /** Zone that was just clicked: plays the selection feedback before its experience opens. */
  selecting: ZoneId | null;
  selectedProject: WorldProject["id"] | null;
  onSelect: (zone: ZoneDef) => void;
  onSelectProject: (id: WorldProject["id"]) => void;
  onProgress: (loaded: number, total: number) => void;
  onReady: () => void;
  onHoverAny: () => void;
  music: { armOn: boolean; spinning: boolean };
  liftedCert: string | null;
  onOpenCert: (index: number, from: HTMLElement) => void;
  breakNote: string | null;
  onBreakNote: () => void;
  /** Increments each time the Silvia should rev (click). */
  rev: number;
}

/** The garage art is served at 2x (3344 px): sharp up to this zoom. */
const MAX_ZOOM = 2.4;

/** Screen area left free for the garage when an experience is open. */
function focusArea(stage: StageMetrics, z: ZoneDef) {
  const m = 24;
  const compact = stage.vw < 900 || stage.mode === "pan";
  if (compact || z.panel === "bottom") {
    const sheet = Math.round(stage.vh * (compact ? 0.56 : 0.46));
    return { x: m, y: 64, w: stage.vw - 2 * m, h: stage.vh - sheet - 64 - m };
  }
  const panel = z.reserve ? stage.vw * z.reserve : Math.min(560, stage.vw * 0.42) + 2 * m;
  if (z.panel === "top") {
    const t = stage.vh * 0.44;
    return { x: m, y: t, w: stage.vw - 2 * m, h: stage.vh - t - m };
  }
  return z.panel === "right"
    ? { x: m, y: 80, w: stage.vw - panel - 2 * m, h: stage.vh - 80 - m }
    : { x: panel + m, y: 80, w: stage.vw - panel - 2 * m, h: stage.vh - 80 - m };
}

export function WorldScene(props: Props) {
  const { stage, reduced, active, selecting, selectedProject, onSelect, onSelectProject, onProgress, onReady, onHoverAny } = props;
  const scrollerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const silvia = useRef<SilviaHandle>(null);
  const [hovered, setHovered] = useState<ZoneId | null>(null);
  const [labels, setLabels] = useState(reduced);
  const [hoveredProject, setHoveredProject] = useState<WorldProject["id"] | null>(null);
  const focused = active !== null;

  // Loading + entrance. The garage starts dark with the lights off; then the
  // Silvia's headlights come on, then the neon, then the rest of the lights,
  // and finally the headlights switch off.
  useEffect(() => {
    const st = stageRef.current;
    if (!st) return;
    const night = st.querySelector(".night");
    const lamps = st.querySelector(".glights");
    const head = st.querySelector(".headlights__on");
    const neon = st.querySelector(".intro-lights__neon");
    const city = st.querySelector(".intro-lights__tokyo");
    if (!reduced) {
      gsap.set(night, { opacity: 0.94 });
      gsap.set(lamps, { opacity: 0 });
      gsap.set([head, neon], { opacity: 0 });
      gsap.set(city, { opacity: 0.32 });
    }
    const imgs = Array.from(st.querySelectorAll<HTMLImageElement>(".base, .walter > img, .headlights img, .intro-lights img"));
    let loaded = 0;
    let cancelled = false;
    onProgress(0, imgs.length);
    Promise.all(
      imgs.map((i) =>
        (i.complete ? Promise.resolve() : i.decode().catch(() => undefined)).then(() => {
          if (!cancelled) onProgress(++loaded, imgs.length);
        }),
      ),
    ).then(() => {
      if (cancelled) return;
      onReady();
      if (reduced) {
        setLabels(true);
        return;
      }
      const flick = (on: number) => [
        { opacity: on * 0.9, duration: 0.05 },
        { opacity: 0, duration: 0.08 },
        { opacity: on, duration: 0.05 },
        { opacity: on * 0.35, duration: 0.07 },
        { opacity: on, duration: 0.25 },
      ];
      gsap
        .timeline({ delay: 1.1 })
        // 1. headlights
        .to(head, { keyframes: flick(1) })
        // 2. neon
        .to(neon, { keyframes: flick(1) }, "+=0.7")
        .to(city, { opacity: 0.75, duration: 0.6 }, "<")
        // 3. everything else
        .to(lamps, { keyframes: flick(1) }, "+=0.7")
        .to(night, { opacity: 0, duration: 1.4, ease: "power2.out" }, "<0.1")
        .to([neon, city], { opacity: 0, duration: 1.2 }, "<0.4")
        // 4. headlights off
        .to(head, { keyframes: [{ opacity: 0.3, duration: 0.08 }, { opacity: 0.8, duration: 0.06 }, { opacity: 0, duration: 0.5, ease: "power2.in" }] }, "+=0.9")
        .add(() => setLabels(true), "-=0.4");
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Phones: start with Walter in the middle of the screen.
  useLayoutEffect(() => {
    const el = scrollerRef.current;
    if (el && stage.mode === "pan") el.scrollLeft = 880 * stage.scale - stage.vw / 2;
  }, [stage.mode, stage.scale, stage.vw]);

  // Camera: frame the selected object, or return to the whole garage.
  useLayoutEffect(() => {
    const cam = cameraRef.current;
    const st = stageRef.current;
    if (!cam || !st) return;
    const z = active ? zoneById(active) : null;
    if (!z?.focus) {
      gsap.to(cam, { x: 0, y: 0, scale: 1, duration: reduced ? 0 : MOTION.close, ease: MOTION.ease.inOut });
      return;
    }
    const r = z.focus;
    const area = focusArea(stage, z);
    const s = stage.scale;
    const k = Math.min(MAX_ZOOM, Math.max(1, Math.min(area.w / (r.w * s), area.h / (r.h * s))));
    const box = st.getBoundingClientRect();
    const left = box.left;
    const topY = box.top;
    let tx = area.x + area.w / 2 - left - k * s * (r.x + r.w / 2);
    let ty = area.y + area.h / 2 - topY - k * s * (r.y + r.h / 2);
    tx = Math.min(-left, Math.max(stage.vw - left - k * stage.width, tx));
    ty = Math.min(-topY, Math.max(stage.vh - topY - k * stage.height, ty));
    gsap.to(cam, { x: tx, y: ty, scale: k, duration: reduced ? 0 : MOTION.open, ease: MOTION.ease.inOut });
  }, [active, stage, reduced]);

  // Silvia: flame, headlights and engine roar on click
  useEffect(() => {
    if (props.rev > 0) {
      silvia.current?.fire();
      void roar();
    }
  }, [props.rev]);
  useEffect(() => {
    // look for a recorded rev once the visitor first interacts (browsers need a gesture for audio)
    const once = () => prepareRoar();
    window.addEventListener("pointerdown", once, { once: true });
    return () => window.removeEventListener("pointerdown", once);
  }, []);

  const hover = useCallback(
    (id: ZoneId | null) => {
      setHovered(id);
      if (id) onHoverAny();
    },
    [onHoverAny],
  );
  const hoverProject = useCallback(
    (id: WorldProject["id"] | null) => {
      setHoveredProject(id);
      if (id) onHoverAny();
    },
    [onHoverAny],
  );

  const stateOf = (id: ZoneId) => (selecting === id ? "selected" : hovered === id && !focused && !selecting ? "hover" : "idle");

  const lights = ZONES.flatMap((z) => z.lights.map((k) => <ObjectLight key={`${z.id}-${k}`} id={z.id} sil={k} state={stateOf(z.id)} />));
  const hits = ZONES.flatMap((z) =>
    hitsOf(z).map((pts, i) => <ObjectHit key={`${z.id}-${i}`} zone={z} pts={pts} tabbable={i === 0} disabled={focused} onSelect={onSelect} onHover={hover} />),
  );

  const spot: Rect | null = active ? zoneById(active).focus : null;
  const projectSelected = active === "projects" ? selectedProject : null;

  return (
    <div ref={scrollerRef} className={`viewport viewport--${stage.mode}${focused ? " is-focused" : ""}`} aria-label={t("Walter's garage")}>
      <div
        ref={stageRef}
        className="stage"
        style={{
          width: stage.width,
          height: stage.height,
          left: stage.mode === "cover" ? (stage.vw - stage.width) / 2 : 0,
          top: stage.mode === "cover" ? (stage.vh - stage.height) / 2 : 0,
        }}
      >
        <div ref={cameraRef} className="camera">
          <div ref={introRef} className="intro">
            <div
              className="scene"
              data-hover={(focused ? null : hovered) ?? undefined}
              data-active={active ?? selecting ?? undefined}
              style={{ width: SCENE.width, height: SCENE.height, transform: `scale(${stage.scale})` }}
            >
              <div className="room">
                <img className="base" src={`/world/garage/${props.lang}/base.webp`} alt="" width={SCENE.width} height={SCENE.height} draggable={false} fetchPriority="high" />
                <TokyoView />
                <GarageLights />
                <Headlights />
                <Turntable armOn={props.music.armOn} spinning={props.music.spinning} reduced={reduced} />
                <Character reduced={reduced} />
                {lights}
                <SilviaFlame ref={silvia} reduced={reduced} />
                <Gyroscope fast={stateOf("break") !== "idle"} reduced={reduced} />
                <ProjectLights lang={props.lang} selected={projectSelected} hovered={focused ? null : hoveredProject} />
                <WallFrames disabled={focused} hidden={props.liftedCert} onOpen={props.onOpenCert} />
                <div className="night" aria-hidden="true" />
                <IntroLights />

                {/* Focus: the rest of the garage dims around the selected object */}
                <svg className={`spotlight${spot ? " is-on" : ""}`} viewBox={`0 0 ${SCENE.width} ${SCENE.height}`} aria-hidden="true">
                  <defs>
                    <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="24" />
                    </filter>
                    <mask id="hole">
                      <rect width={SCENE.width} height={SCENE.height} fill="white" />
                      {spot && <ellipse cx={spot.x + spot.w / 2} cy={spot.y + spot.h / 2} rx={spot.w * 0.62} ry={spot.h * 0.66} fill="black" filter="url(#soft)" />}
                    </mask>
                  </defs>
                  <rect width={SCENE.width} height={SCENE.height} fill="#0b0b0e" mask="url(#hole)" />
                </svg>

                <svg className="hits" viewBox={`0 0 ${SCENE.width} ${SCENE.height}`} width={SCENE.width} height={SCENE.height}>
                  {hits}
                  <ProjectHits lang={props.lang} disabled={focused && active !== "projects"} onSelect={onSelectProject} onHover={hoverProject} />
                </svg>
                <div className={`hlabels${labels && !focused ? " is-on" : ""}`}>
                  {ZONES.filter((z) => z.lights.length || hitsOf(z).length || z.id === "projects" || z.id === "certificates").map((z) => (
                    <HotspotLabel
                      key={z.id}
                      zone={z}
                      hovered={hovered === z.id || (z.id === "projects" && !!hoveredProject)}
                      hidden={focused}
                      onSelect={onSelect}
                      onHover={hover}
                    />
                  ))}
                </div>
                <MugNote text={props.breakNote} onNext={props.onBreakNote} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="vignette" aria-hidden="true" />
    </div>
  );
}
