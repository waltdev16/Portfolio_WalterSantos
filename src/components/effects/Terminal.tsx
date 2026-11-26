"use client";

// Tarjeta tipo terminal que escribe sus líneas cuando entra en pantalla.

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type TerminalLine = {
  text: string;
  tone?: "cmd" | "ok" | "key" | "plain" | "dim";
};

const toneClass: Record<NonNullable<TerminalLine["tone"]>, string> = {
  cmd: "text-fog",
  ok: "text-[#7fd1a8]",
  key: "text-fog",
  plain: "text-[#c6ccd6]",
  dim: "text-[#76808f]",
};

/**
 * Terminal-style card that types its lines once when it scrolls into view.
 * The full text is always in the DOM (for screen readers and layout);
 * the typing only reveals it visually, so there is no layout shift.
 */
export function Terminal({
  lines,
  title = "walter@portfolio: ~",
  className,
  speed = 14,
}: {
  lines: TerminalLine[];
  title?: string;
  className?: string;
  speed?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const total = lines.reduce((n, l) => n + l.text.length + 1, 0);
  // Character offset where each line starts.
  const offsets = lines.map((_, i) => lines.slice(0, i).reduce((n, l) => n + l.text.length + 1, 0));
  // idle: full text visible (SSR, no JS, reduced motion) · armed: hidden, about to type · typing
  const [phase, setPhase] = useState<"idle" | "armed" | "typing">("idle");
  const [count, setCount] = useState(0);
  const shown = phase === "idle" ? total : count;

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Arm a little before it enters the viewport, start typing once it's in view.
    const arm = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setPhase((p) => (p === "idle" ? "armed" : p));
          arm.disconnect();
        }
      },
      { rootMargin: "0px 0px 400px 0px" },
    );
    const start = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setPhase("typing");
          start.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    arm.observe(el);
    start.observe(el);
    return () => {
      arm.disconnect();
      start.disconnect();
    };
  }, []);

  useEffect(() => {
    if (phase !== "typing") return;
    let raf = 0;
    let last = performance.now();
    let n = 0;
    const tick = (now: number) => {
      const steps = Math.floor((now - last) / speed);
      if (steps > 0) {
        n = Math.min(total, n + steps * 2);
        last = now;
        setCount(n);
      }
      if (n < total) raf = requestAnimationFrame(tick);
      else setPhase("idle"); // El idioma puede cambiar sin repetir una entrada ya completada.
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase, speed, total]);

  return (
    <div
      ref={ref}
      className={cn(
        "overflow-hidden rounded-md border border-[#293241] bg-[#0c1017] text-left shadow-[0_30px_80px_-40px_rgb(0_0_0/0.7)]",
        className,
      )}
    >
      <div className="flex items-center gap-3 border-b border-[#293241] px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden="true">
          <i className="block size-2 rounded-full bg-[#3a4352]" />
          <i className="block size-2 rounded-full bg-[#3a4352]" />
          <i className="block size-2 rounded-full bg-[#3a4352]" />
        </span>
        <span className="font-mono text-[11px] text-[#76808f]">{title}</span>
      </div>

      <p className="sr-only">{lines.map((l) => l.text).join(". ")}</p>

      <pre
        aria-hidden="true"
        className="overflow-x-auto px-4 py-4 font-mono text-[12px] leading-[1.75] sm:px-5 sm:text-[13px]"
      >
        {lines.map((line, i) => {
          const visible = Math.max(0, Math.min(line.text.length, shown - offsets[i]));
          const isLast = i === lines.length - 1;
          return (
            <span key={i} className={cn("block min-h-[1.75em]", toneClass[line.tone ?? "plain"])}>
              {line.text.slice(0, visible)}
              <span className="invisible">{line.text.slice(visible)}</span>
              {isLast && shown >= total && <span className="caret ml-0.5 inline-block w-[0.6em] bg-fluor">&nbsp;</span>}
            </span>
          );
        })}
      </pre>
    </div>
  );
}
