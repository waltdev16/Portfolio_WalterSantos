import { setLocale, t } from "./i18n";
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { MENU_ORDER, zoneById, type ZoneDef, type ZoneId } from "./config/scene";
import type { WorldProject, ProjectLanguage } from "../data/projects";
import { breaks } from "../data/breaks";
import { useDialogFocus } from "./hooks/useDialogFocus";
import { useStage } from "./hooks/useStage";
import { useReducedMotion } from "./hooks/useReducedMotion";
import { sound } from "./audio/sound";
import { MOTION } from "./motion";
import { WorldScene } from "./scene/WorldScene";
import { WorldControls } from "./ui/WorldControls";
import { consumeArrival, leaveToPortfolio } from "./portal";
import { FocusOverlay } from "./ui/FocusOverlay";
import { ZoneDock } from "./ui/ZoneDock";
import { Showcase } from "./ui/Showcase";

import { PlayerDock } from "./music/PlayerDock";
import { usePlayer } from "./music/player";
import { AboutExperience } from "./experiences/AboutExperience";
import { Terminal } from "./experiences/Terminal";
import { MusicCrate } from "./experiences/MusicCrate";
import { MomentsGallery } from "./experiences/MomentsGallery";
import { EngineeringCorner } from "./experiences/EngineeringCorner";
import "./world.css";
import "./ui/shared.css";
import "./ui/panel.css";
import "./ui/dock.css";
import "./ui/showcase.css";

// The archive brings its own fonts and styles: loaded only when a book is opened.
const ArchiveExperience = lazy(() => import("./experiences/archive/ArchiveExperience"));

/** Screen rect of the zone's lit object nearest to the last pointer press (e.g. which book stack). */
let lastPointer: { x: number; y: number } | null = null;

const rectOf = (sel: string) => {
  const rects = Array.from(document.querySelectorAll(sel)).map((el) => el.getBoundingClientRect());
  if (!rects.length) return null;
  if (!lastPointer || rects.length === 1) return rects[0];
  const p = lastPointer;
  const d = (r: DOMRect) => Math.hypot(r.left + r.width / 2 - p.x, r.top + r.height / 2 - p.y);
  return rects.reduce((a, b) => (d(b) < d(a) ? b : a));
};

/**
 * Walter's World — root of the experience.
 * Self-contained so it can later be mounted on a /world route of the portfolio.
 *
 * Explore: `active === null`, every object can be hovered and selected.
 * Selecting plays a short feedback (`selecting`), then the object's own
 * experience opens (`active`). Every experience closes with a reverse animation.
 */
export function WalterWorld() {
  useDialogFocus();
  useEffect(() => {
    const rememberPointer = (e: PointerEvent) => { lastPointer = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("pointerdown", rememberPointer, true);
    return () => window.removeEventListener("pointerdown", rememberPointer, true);
  }, []);
  const stage = useStage();
  const [lang, setLang] = useState<ProjectLanguage>(() => {
    try { return localStorage.getItem("world-language") === "es" ? "es" : "en"; }
    catch { return "en"; }
  });
  setLocale(lang);
  useEffect(() => {
    try { localStorage.setItem("world-language", lang); } catch { /* Preferencia solo en memoria. */ }
    document.documentElement.lang = lang;
  }, [lang]);
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);
  // arrived through the portfolio's portal: no loading card, the garage lights up directly
  const [arrived] = useState(consumeArrival);
  const [active, setActive] = useState<ZoneId | null>(null);
  const [selecting, setSelecting] = useState<ZoneId | null>(null);
  const [selectedProject, setSelectedProject] = useState<WorldProject["id"] | null>(null);
  const [showcase, setShowcase] = useState<{ index: number; origin: HTMLElement | null } | null>(null);
  const [liftedCert, setLiftedCert] = useState<string | null>(null);
  const [mug, setMug] = useState<{ i: number; on: boolean }>(() => ({ i: Math.floor(Math.random() * breaks.length), on: false }));
  const [origin, setOrigin] = useState<DOMRect | null>(null);
  const { album, playing, mode } = usePlayer();
  const [rev, setRev] = useState(0);
  const returnFocus = useRef<HTMLElement | null>(null);
  const mugTimer = useRef<number | undefined>(undefined);
  const compact = stage.vw < 900 || stage.mode === "pan";

  const openCert = useCallback((index: number, from: HTMLElement | null) => {
    returnFocus.current ??= document.activeElement as HTMLElement | null;
    setActive("certificates");
    setShowcase({ index, origin: from });
    sound.play("open");
  }, []);

  const showMug = useCallback(() => {
    setMug((m) => ({ i: m.on ? (m.i + 1) % breaks.length : m.i, on: true }));
    sound.play("select");
    clearTimeout(mugTimer.current);
    mugTimer.current = window.setTimeout(() => setMug((m) => ({ i: (m.i + 1) % breaks.length, on: false })), 7000);
  }, []);

  const open = useCallback(
    (id: ZoneId) => {
      const z = zoneById(id);
        if (z.experience === "bubble") return showMug();
      if (z.experience === "action") {
        setRev((r) => r + 1);
        sound.play("select");
        return;
      }
      if (z.experience === "showcase") return openCert(0, document.querySelector<HTMLElement>(".wall-frame"));
      returnFocus.current = document.activeElement as HTMLElement | null;
      setOrigin(rectOf(`.light--${id}`));
      setMug((m) => ({ ...m, on: false }));
      setSelecting(id);
      sound.play("open");
      // selection feedback first, then the experience
      window.setTimeout(
        () => {
          setSelecting(null);
          setActive(id);
        },
        reduced ? 0 : MOTION.select * 1000,
      );
    },
    [openCert, reduced, showMug],
  );

  const close = useCallback(() => {
    setActive(null);
    setShowcase(null);
    setLiftedCert(null);
    setSelectedProject(null);
    sound.play("back");
    const el = returnFocus.current;
    returnFocus.current = null;
    requestAnimationFrame(() => el?.focus?.({ preventScroll: true }));
  }, []);

  /** Jump from one experience straight into another (terminal commands, links). */
  const goTo = useCallback(
    (id: ZoneId, project?: WorldProject["id"]) => {
      setActive(null);
      setShowcase(null);
      if (project) setSelectedProject(project);
      requestAnimationFrame(() => open(id));
    },
    [open],
  );

  const onSelect = useCallback((z: ZoneDef) => open(z.id), [open]);
  const onSelectProject = useCallback(
    (id: WorldProject["id"]) => {
      setSelectedProject(id);
      if (active !== "projects") open("projects");
      else sound.play("select");
    },
    [active, open],
  );
  const onProgress = useCallback((_n: number, _total: number) => {}, []);
  const onReady = useCallback(() => setReady(true), []);
  const onHoverAny = useCallback(() => {}, []);

  useEffect(() => () => clearTimeout(mugTimer.current), []);

  const z = active ? zoneById(active) : null;
  const lens = z?.experience === "gallery" && origin ? { x: origin.left + origin.width * 0.62, y: origin.top + origin.height * 0.55 } : null;

  return (
    <main className={`world${ready ? " is-ready" : ""}${arrived ? " world--portal" : ""}${active ? ` is-open is-open--${active}` : ""}`}>
      <h1 className="sr-only">Walter's World — Walter Santos</h1>
      {!active && !selecting && !showcase && <WorldControls lang={lang} onLanguage={setLang} onBack={() => {
        if (active || showcase) { close(); return; }
        leaveToPortfolio(reduced);
      }} />}
      <nav className="world-keyboard-nav" aria-label={t("Accessible object navigation")}>
        {MENU_ORDER.map((id) => (
          <button key={id} type="button" onClick={() => active ? goTo(id) : open(id)}>
            {t(zoneById(id).title)}
          </button>
        ))}
      </nav>
      <WorldScene
        lang={lang}
        stage={stage}
        reduced={reduced}
        active={active}
        selecting={selecting}
        selectedProject={selectedProject}
        onSelect={onSelect}
        onSelectProject={onSelectProject}
        onProgress={onProgress}
        onReady={onReady}
        onHoverAny={onHoverAny}
        music={{ armOn: !!album, spinning: !!album && (playing || mode === "fallback") }}
        liftedCert={liftedCert}
        onOpenCert={openCert}
        breakNote={mug.on ? t(breaks[mug.i]) : null}
        onBreakNote={showMug}
        rev={rev}
      />

      {z?.experience === "panel" && <FocusOverlay lang={lang} key={z.id} zone={z.id} compact={compact} reduced={reduced} selectedProject={selectedProject} onSelectProject={onSelectProject} onClose={close} />}
      {z?.experience === "about" && <AboutExperience reduced={reduced} onClose={close} onOpenCertificates={() => goTo("certificates")} />}
      {z?.experience === "terminal" && <Terminal lang={lang} origin={origin} reduced={reduced} onClose={close} onNavigate={goTo} />}
      {z?.experience === "crate" && <MusicCrate reduced={reduced} onClose={close} />}
      {z?.experience === "gallery" && <MomentsGallery lens={lens} reduced={reduced} onClose={close} />}
      {z?.experience === "engineering" && <EngineeringCorner reduced={reduced} onClose={close} />}
      {z?.experience === "archive" && (
        <Suspense fallback={<div className="xp-loading" aria-label={t("Opening the archive")} />}>
          <ArchiveExperience origin={origin} reduced={reduced} onClose={close} />
        </Suspense>
      )}
      {showcase && (
        <Showcase
          key={showcase.index + (showcase.origin ? "w" : "")}
          start={showcase.index}
          origin={showcase.origin}
          reduced={reduced}
          onLift={setLiftedCert}
          onClose={close}
        />
      )}

      <PlayerDock compact={compact} onOpen={() => (active ? goTo("music") : open("music"))} />
      {compact && !active && <ZoneDock onGo={open} />}
      <p className="sr-only" aria-live="polite">
        {z ? `${t(z.title)} ${lang === "es" ? "abierto" : "open"}` : ""}
      </p>
    </main>
  );
}
