"use client";

// Bucle de animación de las mascotas: un solo requestAnimationFrame para todas, pausado fuera de pantalla.

import { useEffect, useRef } from "react";
import { PETS, type Pose } from "./petDefinitions";
import { createPet, poke, stageEvent, tickPet, type Pet, type World } from "./petBehavior";
import type { PetRefs } from "./PixelPet";
import { HERO_EVENT } from "@/components/intro/introState";

/**
 * Runs the pets: one requestAnimationFrame loop for all of them, writing
 * transforms, sprites and bubbles straight to the DOM (no React re-renders).
 * Paused while the shelf is off-screen or the tab is hidden; with
 * prefers-reduced-motion the pets stay still and only answer clicks.
 */
export function usePetSimulation(shelf: React.RefObject<HTMLElement | null>) {
  const refs = useRef<PetRefs[]>(PETS.map(() => ({ root: null, sprite: null, bubble: null, name: null })));
  const api = useRef<{ poke: (i: number) => void; hover: (i: number, on: boolean) => void }>({ poke: () => undefined, hover: () => undefined });

  useEffect(() => {
    const el = shelf.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const size = () => parseFloat(getComputedStyle(el).getPropertyValue("--pet-size")) || 40;
    const world: World = { width: el.clientWidth, size: size(), cursor: null, hovered: null, pets: [], eventIn: 9 + Math.random() * 8 };
    world.pets = PETS.map((def, i) => createPet(def, ((i + 0.5) / PETS.length) * (world.width - world.size) + (Math.random() - 0.5) * 20));

    const drawn = PETS.map(() => "");
    const shownBubble = PETS.map(() => "");
    const draw = (i: number, p: Pet) => {
      const r = refs.current[i];
      if (!r.root || !r.sprite) return;
      const moving = p.state === "walk" || p.state === "run" || p.state === "curious" || p.typing;
      const frame = moving ? Math.floor(p.clock * (p.state === "run" ? 10 : 6)) : Math.floor(p.clock * 1.6);
      const pose: Pose = { frame, blink: p.blinking > 0 && p.expr !== "sleep", expr: p.expr, typing: p.typing };
      const key = `${pose.frame % 6}|${pose.blink}|${pose.expr}|${pose.typing}`;
      if (key !== drawn[i]) {
        drawn[i] = key;
        const ctx = r.sprite.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, 16, 16);
          p.def.draw((x, y, w, h, c) => {
            ctx.fillStyle = c;
            ctx.fillRect(x, y, w, h);
          }, pose);
        }
      }
      r.root.style.transform = `translate3d(${p.x.toFixed(1)}px, ${(-p.y).toFixed(1)}px, 0)`;
      r.root.style.opacity = String(p.opacity);
      r.root.style.zIndex = p.def.floats ? "3" : p.state === "jump" ? "2" : "1";
      r.root.dataset.dir = p.dir > 0 ? "right" : "left";
      r.root.dataset.state = p.state;
      if (r.bubble && p.bubble !== shownBubble[i]) {
        shownBubble[i] = p.bubble;
        r.bubble.textContent = p.bubble;
        r.bubble.dataset.show = p.bubble ? "true" : "";
      }
      if (r.name) r.name.dataset.show = p.showName > 0 ? "true" : "";
    };

    api.current = {
      poke: (i) => poke(world.pets[i], world),
      hover: (i, on) => {
        world.hovered = on ? world.pets[i] : world.hovered === world.pets[i] ? null : world.hovered;
        if (on) world.pets[i].showName = 1.2;
      },
    };

    let raf = 0;
    let last = 0;
    let visible = true;
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - (last || now)) / 1000);
      last = now;
      if (!reduced) {
        world.eventIn -= dt;
        if (world.eventIn <= 0) stageEvent(world);
        world.pets.forEach((p) => tickPet(p, world, dt));
      } else {
        // still pets: only bubbles and names time out
        world.pets.forEach((p) => {
          p.bubbleFor = Math.max(0, p.bubbleFor - dt);
          if (!p.bubbleFor) p.bubble = "";
          p.showName = Math.max(0, p.showName - dt);
          if (p.state === "jump") {
            p.state = "idle";
            p.vy = 0;
          }
        });
      }
      world.pets.forEach((p, i) => draw(i, p));
      raf = requestAnimationFrame(loop);
    };
    const play = () => {
      // nothing to animate while the cinematic intro covers the page
      if (document.documentElement.dataset.intro === "play") return;
      if (raf || !visible || document.hidden) return;
      last = 0;
      raf = requestAnimationFrame(loop);
    };
    const pause = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    world.pets.forEach((p, i) => draw(i, p));
    play();

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) play();
      else pause();
    });
    io.observe(el);
    const onVisibility = () => (document.hidden ? pause() : play());
    document.addEventListener("visibilitychange", onVisibility);
    const ro = new ResizeObserver(() => {
      world.width = el.clientWidth;
      world.size = size();
    });
    ro.observe(el);
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.bottom;
      const near = x > -120 && x < r.width + 120 && y > -220 && y < 120;
      world.cursor = near ? { x, y } : null;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener(HERO_EVENT, play);

    return () => {
      pause();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener(HERO_EVENT, play);
    };
  }, [shelf]);

  return { refs, api };
}
