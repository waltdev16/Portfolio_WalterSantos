import { useSyncExternalStore } from "react";
import { SCENE } from "../config/scene";

export interface StageMetrics {
  vw: number;
  vh: number;
  /** Illustration pixels → screen pixels. */
  scale: number;
  /** "cover": room fills the screen. "pan": room keeps a readable size and scrolls sideways (phones, portrait). */
  mode: "cover" | "pan";
  width: number;
  height: number;
}

function measure(): StageMetrics {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  // Below this ratio, fitting the whole room would make it unreadable.
  const pan = vw / vh < 1.2;
  const scale = pan ? vh / SCENE.height : Math.max(vw / SCENE.width, vh / SCENE.height);
  return { vw, vh, scale, mode: pan ? "pan" : "cover", width: SCENE.width * scale, height: SCENE.height * scale };
}

let current: StageMetrics | null = null;
const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  if (listeners.size === 1) window.addEventListener("resize", onResize);
  return () => {
    listeners.delete(cb);
    if (!listeners.size) window.removeEventListener("resize", onResize);
  };
}
function onResize() {
  current = measure();
  listeners.forEach((l) => l());
}
function snapshot() {
  return (current ??= measure());
}

export function useStage() {
  return useSyncExternalStore(subscribe, snapshot, snapshot);
}
