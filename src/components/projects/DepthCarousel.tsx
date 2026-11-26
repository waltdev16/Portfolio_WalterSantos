"use client";

// Carrusel con profundidad 3D (adaptado de DepthCarousel de React Bits, MIT, con GSAP).
// Las tarjetas se apilan hacia atrás con perspectiva; la del frente es la activa.
//
// Cambios respecto al original:
// - TypeScript y contenido libre por tarjeta (renderCard) en lugar de solo imágenes.
// - La rueda del mouse solo mueve el carrusel con gestos horizontales: el scroll
//   vertical de la página nunca se bloquea.
// - Un arrastre no se confunde con un clic; clic en la tarjeta activa = onActivate.
// - Autoplay controlable desde fuera (paused) y detenido fuera de pantalla o con la
//   pestaña oculta. Con movimiento reducido no hay autoplay ni transiciones.
// - Textos accesibles traducibles (labels).

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import "./DepthCarousel.css";

export type DepthCarouselLabels = {
  carousel: string;
  previous: string;
  next: string;
  slides: string;
  /** "{n}" y "{total}" se reemplazan */
  slide: string;
  goTo: string;
};

type Props<T> = {
  items: T[];
  /** clave estable de cada elemento (no cambia al traducir) */
  getKey: (item: T) => string;
  renderCard: (item: T, active: boolean) => React.ReactNode;
  cardWidth?: number;
  cardHeight?: number;
  radius?: number;
  tint?: string;
  depth?: number;
  spread?: number;
  tilt?: number;
  tiltDirection?: "left" | "right";
  perspective?: number;
  visibleCards?: number;
  falloff?: number;
  blur?: number;
  duration?: number;
  ease?: string;
  autoplay?: boolean;
  autoplayDelay?: number;
  /** pausa controlada desde fuera (botón de pausa) */
  paused?: boolean;
  loop?: boolean;
  showControls?: boolean;
  showIndicators?: boolean;
  labels: DepthCarouselLabels;
  onChange?: (index: number, item: T) => void;
  /** clic o Enter sobre la tarjeta activa */
  onActivate?: (index: number, item: T) => void;
  /** el usuario interactuó (arrastre, flechas, teclado…): sirve para pausar el autoplay */
  onInteract?: () => void;
  className?: string;
};

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

export function DepthCarousel<T>({
  items,
  getKey,
  renderCard,
  cardWidth = 300,
  cardHeight = 380,
  radius = 18,
  tint = "#05060a",
  depth = 220,
  spread = 90,
  tilt = 22,
  tiltDirection = "right",
  perspective = 1400,
  visibleCards = 4,
  falloff = 0.2,
  blur = 6,
  duration = 700,
  ease = "power3.out",
  autoplay = false,
  autoplayDelay = 3200,
  paused = false,
  loop = true,
  showControls = true,
  showIndicators = true,
  labels,
  onChange,
  onActivate,
  onInteract,
  className = "",
}: Props<T>) {
  const count = items.length;

  const rootRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const overlayRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // Estado de la animación en refs: se actualiza en cada cuadro sin re-renderizar React
  const posRef = useRef(0);
  const focusRef = useRef(0);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const scaleRef = useRef(1);
  const dragRef = useRef<{ x: number; startPos: number; lastX: number; lastT: number; v: number; moved: boolean; id: number } | null>(null);
  const justDraggedRef = useRef(false);
  const wheelTimerRef = useRef(0);
  const reducedRef = useRef(false);

  const [active, setActive] = useState(0);

  // Callbacks y configuración más recientes, sin reiniciar efectos
  const latest = useRef({ items, onChange, onActivate, onInteract });
  const cfgRef = useRef({ count, depth, spread, tilt, tiltDirection, visibleCards, falloff, blur, duration, ease, loop, cardWidth, cardHeight });
  useEffect(() => {
    latest.current = { items, onChange, onActivate, onInteract };
    cfgRef.current = { count, depth, spread, tilt, tiltDirection, visibleCards, falloff, blur, duration, ease, loop, cardWidth, cardHeight };
  });

  // Coloca cada tarjeta según su distancia a la posición actual (puede ser fraccionaria)
  const layout = useCallback((pos: number) => {
    const cfg = cfgRef.current;
    const n = cfg.count;
    if (!n) return;
    const dir = cfg.tiltDirection === "left" ? -1 : 1;
    const sc = scaleRef.current;

    for (let i = 0; i < n; i++) {
      const el = cardRefs.current[i];
      if (!el) continue;

      let d = i - pos;
      if (cfg.loop && n > 1) {
        d = ((d % n) + n) % n;
        if (d > n / 2) d -= n;
      }

      const back = Math.max(0, d);
      const az = Math.abs(d);
      const shown = az <= cfg.visibleCards + 0.5;

      const tz = -cfg.depth * d;
      const tx = dir * cfg.spread * d;
      const ry = dir * cfg.tilt * clamp(d, 0, 1);

      let opacity = d < 0 ? Math.max(0, 1 + d) : 1;
      if (!shown) opacity = 0;

      const brightness = Math.max(0.35, 1 - back * cfg.falloff * 0.8);
      const blurPx = cfg.blur > 0 ? Math.min(cfg.blur, (back / Math.max(1, cfg.visibleCards)) * cfg.blur) : 0;

      el.style.transform = `translate(-50%, -50%) scale(${sc}) translateX(${tx.toFixed(2)}px) translateZ(${tz.toFixed(2)}px) rotateY(${ry.toFixed(3)}deg)`;
      el.style.opacity = opacity.toFixed(3);
      el.style.filter = blurPx > 0.01 ? `brightness(${brightness.toFixed(3)}) blur(${blurPx.toFixed(2)}px)` : `brightness(${brightness.toFixed(3)})`;
      el.style.zIndex = String(Math.round(2000 - Math.abs(d) * 20));
      el.style.pointerEvents = shown && opacity > 0.05 ? "auto" : "none";

      const ov = overlayRefs.current[i];
      if (ov) ov.style.opacity = clamp(back * cfg.falloff * 0.55, 0, 0.6).toFixed(3);
    }
  }, []);

  const notify = useCallback((idx: number) => {
    setActive(idx);
    const { items: list, onChange: cb } = latest.current;
    cb?.(idx, list[idx]);
  }, []);

  const tweenTo = useCallback(
    (target: number, animate: boolean) => {
      tweenRef.current?.kill();
      const cfg = cfgRef.current;
      const proxy = { p: posRef.current };
      const dur = animate && !reducedRef.current ? cfg.duration / 1000 : 0;
      tweenRef.current = gsap.to(proxy, {
        p: target,
        duration: dur,
        ease: cfg.ease,
        onUpdate: () => {
          posRef.current = proxy.p;
          layout(proxy.p);
        },
        onComplete: () => {
          const n = cfg.count;
          if (n > 0) posRef.current = ((posRef.current % n) + n) % n;
          layout(posRef.current);
        },
      });
    },
    [layout],
  );

  const setFocus = useCallback(
    (rawIndex: number, animate = true) => {
      const cfg = cfgRef.current;
      const n = cfg.count;
      if (!n) return;
      const idx = cfg.loop ? ((rawIndex % n) + n) % n : clamp(rawIndex, 0, n - 1);
      let delta = idx - posRef.current;
      if (cfg.loop && n > 1) {
        delta = ((delta % n) + n) % n;
        if (delta > n / 2) delta -= n;
      }
      tweenTo(posRef.current + delta, animate);
      if (idx !== focusRef.current) {
        focusRef.current = idx;
        notify(idx);
      }
    },
    [tweenTo, notify],
  );

  const navigateBy = useCallback((step: number) => setFocus(focusRef.current + step, true), [setFocus]);
  const userNavigate = useCallback(
    (step: number) => {
      latest.current.onInteract?.();
      navigateBy(step);
    },
    [navigateBy],
  );

  // Escala todo el conjunto según el ancho disponible
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ro = new ResizeObserver((entries) => {
      const { width: w, height: h } = entries[0].contentRect;
      const cfg = cfgRef.current;
      const needed = cfg.cardWidth + Math.abs(cfg.spread) * 2 + Math.min(120, w * 0.15);
      // se ajusta al ancho y también a la altura disponible (deja sitio a los indicadores)
      const byHeight = h > 0 ? (h - 64) / cfgRef.current.cardHeight : 1;
      scaleRef.current = clamp(Math.min(w / needed, byHeight), 0.4, 1);
      layout(posRef.current);
    });
    ro.observe(root);
    return () => ro.disconnect();
  }, [layout]);

  // Rueda / trackpad: solo gestos horizontales; el scroll vertical sigue a la página
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      const cfg = cfgRef.current;
      if (cfg.count < 2) return;
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) * 1.2) return;
      e.preventDefault();
      latest.current.onInteract?.();
      tweenRef.current?.kill();
      const delta = e.deltaMode === 1 ? e.deltaX * 24 : e.deltaX;
      posRef.current += clamp(delta / (cfg.cardWidth * 0.9), -0.6, 0.6);
      layout(posRef.current);
      window.clearTimeout(wheelTimerRef.current);
      wheelTimerRef.current = window.setTimeout(() => setFocus(Math.round(posRef.current), true), 130);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      window.clearTimeout(wheelTimerRef.current);
    };
  }, [layout, setFocus]);

  // Arrastre con mouse o dedo
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (cfgRef.current.count < 2 || (e.target as HTMLElement).closest("button")) return;
    tweenRef.current?.kill();
    dragRef.current = { x: e.clientX, startPos: posRef.current, lastX: e.clientX, lastT: performance.now(), v: 0, moved: false, id: e.pointerId };
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const drag = dragRef.current;
      if (!drag) return;
      const cfg = cfgRef.current;
      const stepPx = Math.max(cfg.cardWidth * 0.55 * scaleRef.current, 40);
      const dx = e.clientX - drag.x;
      if (!drag.moved && Math.abs(dx) > 6) {
        drag.moved = true;
        latest.current.onInteract?.();
        rootRef.current?.setPointerCapture(drag.id);
      }
      if (!drag.moved) return;
      const now = performance.now();
      drag.v = (e.clientX - drag.lastX) / Math.max(now - drag.lastT, 1);
      drag.lastX = e.clientX;
      drag.lastT = now;
      posRef.current = drag.startPos - dx / stepPx;
      layout(posRef.current);
    },
    [layout],
  );

  const onPointerEnd = useCallback(() => {
    const drag = dragRef.current;
    if (!drag) return;
    dragRef.current = null;
    if (!drag.moved) {
      // sin arrastre: vuelve a su sitio si se había interrumpido una transición
      setFocus(Math.round(posRef.current), true);
      return;
    }
    // el clic que llega justo después de soltar no debe abrir el proyecto
    justDraggedRef.current = true;
    window.setTimeout(() => (justDraggedRef.current = false), 0);
    const cfg = cfgRef.current;
    const stepPx = Math.max(cfg.cardWidth * 0.55 * scaleRef.current, 40);
    setFocus(Math.round(posRef.current - (drag.v * 180) / stepPx), true);
  }, [setFocus]);

  // Teclado: solo cuando el foco está dentro del carrusel
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        userNavigate(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        userNavigate(1);
      } else if ((e.key === "Enter" || e.key === " ") && e.target === rootRef.current) {
        e.preventDefault();
        latest.current.onActivate?.(focusRef.current, latest.current.items[focusRef.current]);
      }
    },
    [userNavigate],
  );

  const onCardClick = useCallback(
    (index: number) => {
      if (justDraggedRef.current) return;
      if (index === focusRef.current) {
        latest.current.onActivate?.(index, latest.current.items[index]);
        return;
      }
      latest.current.onInteract?.();
      setFocus(index, true);
    },
    [setFocus],
  );

  // Autoplay: avanza solo si nadie interactúa, el carrusel está en pantalla y la pestaña visible
  useEffect(() => {
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = rootRef.current;
    if (!autoplay || paused || reducedRef.current || count < 2 || !root) return;
    let hovered = false;
    let focused = false;
    let onScreen = true;
    const io = new IntersectionObserver(([entry]) => (onScreen = entry.isIntersecting));
    io.observe(root);
    const timer = window.setInterval(() => {
      if (!hovered && !focused && onScreen && !document.hidden && !dragRef.current) navigateBy(1);
    }, Math.max(autoplayDelay, 600));
    const onEnter = () => (hovered = true);
    const onLeave = () => (hovered = false);
    const onFocusIn = () => (focused = true);
    const onFocusOut = () => (focused = false);
    root.addEventListener("pointerenter", onEnter);
    root.addEventListener("pointerleave", onLeave);
    root.addEventListener("focusin", onFocusIn);
    root.addEventListener("focusout", onFocusOut);
    return () => {
      window.clearInterval(timer);
      io.disconnect();
      root.removeEventListener("pointerenter", onEnter);
      root.removeEventListener("pointerleave", onLeave);
      root.removeEventListener("focusin", onFocusIn);
      root.removeEventListener("focusout", onFocusOut);
    };
  }, [autoplay, paused, autoplayDelay, count, navigateBy]);

  // Reacomoda cuando cambian las medidas (por ejemplo al pasar a móvil)
  useEffect(() => {
    layout(posRef.current);
  }, [layout, depth, spread, tilt, tiltDirection, visibleCards, falloff, blur, cardWidth, cardHeight, radius, count]);

  // Limpieza al desmontar
  useEffect(
    () => () => {
      tweenRef.current?.kill();
      window.clearTimeout(wheelTimerRef.current);
    },
    [],
  );

  const style = useMemo(() => ({ "--dc-perspective": `${perspective}px` }) as React.CSSProperties, [perspective]);

  return (
    <div
      ref={rootRef}
      className={`depth-carousel ${className}`.trim()}
      style={style}
      role="group"
      aria-roledescription="carousel"
      aria-label={labels.carousel}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      onKeyDown={onKeyDown}
    >
      <div className="depth-carousel__stage">
        {items.map((item, i) => (
          <div
            key={getKey(item)}
            className="depth-carousel__card"
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            style={{ width: cardWidth, height: cardHeight, borderRadius: radius }}
            role="group"
            aria-roledescription="slide"
            aria-label={labels.slide.replace("{n}", String(i + 1)).replace("{total}", String(count))}
            aria-hidden={active !== i}
            onClick={() => onCardClick(i)}
          >
            {renderCard(item, active === i)}
            <span
              className="depth-carousel__tint"
              ref={(el) => {
                overlayRefs.current[i] = el;
              }}
              style={{ background: tint }}
            />
          </div>
        ))}
      </div>

      {showControls && count > 1 && (
        <>
          <button type="button" className="depth-carousel__arrow depth-carousel__arrow--prev" aria-label={labels.previous} onClick={() => userNavigate(-1)}>
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button type="button" className="depth-carousel__arrow depth-carousel__arrow--next" aria-label={labels.next} onClick={() => userNavigate(1)}>
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </>
      )}

      {showIndicators && count > 1 && (
        <div className="depth-carousel__dots" role="group" aria-label={labels.slides}>
          {items.map((item, i) => (
            <button
              key={getKey(item)}
              type="button"
              aria-pressed={active === i}
              aria-label={labels.goTo.replace("{n}", String(i + 1))}
              className={`depth-carousel__dot${active === i ? " is-active" : ""}`}
              onClick={() => {
                latest.current.onInteract?.();
                setFocus(i, true);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
