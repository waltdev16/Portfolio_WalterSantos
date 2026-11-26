"use client";

// Terreno de puntos del Hero (canvas 2D) con relieve iluminado bajo el cursor. Se pausa fuera de pantalla.

import { useEffect, useRef } from "react";
import { cn, seeded } from "@/lib/utils";
import { HERO_EVENT } from "@/components/intro/introState";

/**
 * A slow-moving "data terrain": a perspective field of points whose height
 * comes from layered sine waves. The cursor lifts nearby points.
 *
 * Performance:
 * - Canvas 2D, a single rAF loop, no React re-renders.
 * - Point count scales with viewport width; DPR is capped.
 * - Pauses when off-screen or when the tab is hidden.
 * - With prefers-reduced-motion it draws one static frame.
 *
 * Entrance: the field rises from the horizon toward the viewer, row by row;
 * after that it behaves exactly as before.
 */

/** Seconds for the whole field to finish rising. */
const INTRO = 1.6;

type Point = { u: number; v: number; seed: number };

export function ParticleField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const styles = getComputedStyle(document.documentElement);
    const fog = styles.getPropertyValue("--fog-400").trim() || "#9099a8";
    const signal = styles.getPropertyValue("--signal").trim() || "#c6f432";

    let width = 0;
    let height = 0;
    let dpr = 1;
    let points: Point[] = [];
    let glow = new Float32Array(0);
    let accentX = new Float32Array(0), accentY = accentX, accentS = accentX, accentA = accentX;
    let glowShade = new Float32Array(0);
    let raf = 0;
    let running = false;
    let visible = true;
    let start = performance.now();

    const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999, active: false };

    function build() {
      const rect = canvas!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, width < 768 ? 1.5 : 2);
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cols = Math.max(36, Math.min(104, Math.round(width / 15)));
      const rows = Math.round(cols * 0.46);
      const rand = seeded(2026);
      points = [];
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          // Organic distribution: drop some points and jitter the rest.
          if (rand() < 0.14) continue;
          points.push({
            u: (i + (rand() - 0.5) * 0.7) / (cols - 1) - 0.5,
            v: (j + (rand() - 0.5) * 0.7) / (rows - 1),
            seed: rand(),
          });
        }
      }
      glow = new Float32Array(points.length);
      accentX = new Float32Array(points.length);
      accentY = new Float32Array(points.length);
      accentS = new Float32Array(points.length);
      accentA = new Float32Array(points.length);
      glowShade = new Float32Array(points.length).fill(0.7);
    }

    function heightAt(u: number, v: number, t: number) {
      const ridge = Math.exp(-((u - 0.12) ** 2) * 9 - (v - 0.45) ** 2 * 6);
      return (
        Math.sin(u * 5.2 + t * 0.22) * 0.32 +
        Math.sin(v * 7.5 - t * 0.31 + u * 2.6) * 0.26 +
        Math.sin((u + v) * 12 + t * 0.17) * 0.1 +
        ridge * 1.15
      );
    }

    function draw(now: number) {
      const t = reduced ? 4 : (now - start) / 1000;
      ctx!.clearRect(0, 0, width, height);

      // Ease the pointer for smooth, non-jittery reaction.
      pointer.x += (pointer.tx - pointer.x) * 0.08;
      pointer.y += (pointer.ty - pointer.y) * 0.08;

      const horizon = height * 0.16;
      const spread = width * 1.35;
      const cx = width * 0.6;
      const amp = height * 0.13;
      const radius = Math.min(190, width * 0.16);
      ctx!.fillStyle = fog;
      let accents = 0;

      for (let k = 0; k < points.length; k++) {
        const p = points[k];
        const depth = 1 + p.v * 3.2;
        const h = heightAt(p.u, p.v, t);
        const x = cx + (p.u * spread) / depth;
        let y = horizon + (height * 0.8) / depth - (h * amp) / depth;

        // entrance: far rows first, each point rises into place and fades in
        let enter = 1;
        if (!reduced && t < INTRO + 0.2) {
          const k = Math.min(1, Math.max(0, (t - (1 - p.v) * 0.85 - p.seed * 0.22) / 0.6));
          enter = 1 - (1 - k) ** 3;
          if (enter <= 0) continue;
          y += (1 - enter) * 26;
        }

        // cursor: the points under it rise into a soft relief and light up,
        // then keep a short afterglow as the cursor moves on
        let lift = 0;
        if (pointer.active) {
          const dx = x - pointer.x;
          const dy = (y - pointer.y) * 1.35;
          const d2 = dx * dx + dy * dy;
          if (d2 < radius * radius) {
            const d = Math.sqrt(d2);
            lift = (1 - d / radius) ** 2 * (3 - 2 * (1 - d / radius));
          }
        }
        glow[k] = Math.max(lift, glow[k] * 0.955);
        const g = glow[k];
        if (g > 0.002) {
          y -= g * 26;
          // light comes from above: the near side of the bump stays darker
          const shade = pointer.active ? Math.min(1, Math.max(0.35, 0.75 + (pointer.y - y) / radius)) : 0.7;
          glowShade[k] = shade;
        }

        const near = 1 - p.v;
        const lit = g > 0.06 + p.seed * 0.42;
        const alpha = Math.min(
          0.95,
          (0.2 + near * 0.55 + Math.max(0, h) * 0.2) * (1 + g * 0.6) + (lit ? g * 0.55 * glowShade[k] : 0),
        );
        const size = (2.7 / depth) * (0.75 + p.seed * 0.5) + g * (lit ? 1.4 : 0.6);

        // Accent on the highest crests and on the lit relief under the cursor:
        // drawn in a second pass, so the colour is set twice per frame, not per point
        if (h > 1.2 || lit) {
          accentX[accents] = x;
          accentY[accents] = y;
          accentS[accents] = size;
          accentA[accents] = alpha * enter;
          accents++;
          continue;
        }
        ctx!.globalAlpha = alpha * enter;
        ctx!.fillRect(x, y, size, size);
      }
      ctx!.fillStyle = signal;
      for (let i = 0; i < accents; i++) {
        ctx!.globalAlpha = accentA[i];
        ctx!.fillRect(accentX[i], accentY[i], accentS[i], accentS[i]);
      }
      ctx!.globalAlpha = 1;
    }

    function loop(now: number) {
      draw(now);
      raf = requestAnimationFrame(loop);
    }

    function play() {
      // nothing to animate while the cinematic intro covers the page
      if (document.documentElement.dataset.intro === "play") return;
      if (running || reduced || !visible || document.hidden) return;
      running = true;
      raf = requestAnimationFrame(loop);
    }

    function pause() {
      running = false;
      cancelAnimationFrame(raf);
    }

    build();
    draw(performance.now());
    canvas.dataset.ready = "true";
    play();

    const ro = new ResizeObserver(() => {
      build();
      draw(performance.now());
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) play();
      else pause();
    });
    io.observe(canvas);

    const onVisibility = () => (document.hidden ? pause() : play());
    // the field rises again when the cinematic intro hands over to the hero
    const onHero = () => {
      start = performance.now();
      play();
    };
    window.addEventListener(HERO_EVENT, onHero);
    document.addEventListener("visibilitychange", onVisibility);

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const rect = canvas.getBoundingClientRect();
      pointer.tx = e.clientX - rect.left;
      pointer.ty = e.clientY - rect.top;
      if (!pointer.active) {
        pointer.x = pointer.tx;
        pointer.y = pointer.ty;
      }
      pointer.active = true;
    };
    const onLeave = () => {
      pointer.active = false;
    };
    if (!reduced) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerleave", onLeave);
    }

    return () => {
      pause();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener(HERO_EVENT, onHero);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      tabIndex={-1}
      className={cn(
        "pointer-events-none opacity-0 transition-opacity duration-[1600ms] data-[ready=true]:opacity-100",
        className,
      )}
    />
  );
}
