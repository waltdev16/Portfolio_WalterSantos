"use client";

// Navegación secuencial entre proyectos de una misma colección (Anterior / Siguiente
// + teclas [ y ]). Mismo diseño que la navegación de los proyectos académicos.
// Se usa en los proyectos independientes; la lista sale de los datos, así que
// funciona sola al agregar proyectos nuevos.

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useT } from "@/i18n/t";

export type PagerItem = { href: string; index: string; title: string };

/** Anterior y siguiente en forma circular (el último lleva al primero). */
export function circularNeighbors<T>(list: T[], current: number): { prev: T; next: T } | null {
  if (list.length < 2 || current < 0) return null;
  return {
    prev: list[(current - 1 + list.length) % list.length],
    next: list[(current + 1) % list.length],
  };
}

/** Regresa al inicio cada vez que cambia el proyecto (evita conservar el scroll anterior). */
export function useScrollTopOnChange(key: string) {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [key]);
}

/** Teclas [ y ]; no actúan mientras se escribe ni con Ctrl/Alt/Cmd (atajos del navegador). */
function usePagerKeys(prevHref: string, nextHref: string) {
  const router = useRouter();
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      if (target instanceof HTMLElement && (target.matches("input, textarea, select") || target.isContentEditable)) return;
      if (event.ctrlKey || event.altKey || event.metaKey || event.repeat || event.defaultPrevented) return;
      if (event.key === "[") {
        event.preventDefault();
        router.push(prevHref, { scroll: true });
      } else if (event.key === "]") {
        event.preventDefault();
        router.push(nextHref, { scroll: true });
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router, prevHref, nextHref]);
}

export function ProjectPager({ prev, next }: { prev: PagerItem; next: PagerItem }) {
  const t = useT();
  usePagerKeys(prev.href, next.href);

  return (
    <nav aria-label={t("More projects")} className="grid border-t border-line sm:grid-cols-2">
      <Link href={prev.href} scroll={true} className="group flex flex-col gap-2 py-10 sm:border-r sm:border-line sm:pr-8">
        <span className="inline-flex items-center gap-2 font-mono text-[11px] text-muted">
          <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
          {t("Previous")} / {prev.index}
          <kbd className="rounded border border-line px-1.5 py-0.5 text-[10px]">[</kbd>
        </span>
        <span className="font-display text-2xl font-semibold tracking-[-0.02em] group-hover:text-accent">{prev.title}</span>
      </Link>
      <Link href={next.href} scroll={true} className="group flex flex-col items-end gap-2 border-t border-line py-10 text-right sm:border-t-0 sm:pl-8">
        <span className="inline-flex items-center gap-2 font-mono text-[11px] text-muted">
          {t("Next")} / {next.index}
          <kbd className="rounded border border-line px-1.5 py-0.5 text-[10px]">]</kbd>
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </span>
        <span className="font-display text-2xl font-semibold tracking-[-0.02em] group-hover:text-accent">{next.title}</span>
      </Link>
    </nav>
  );
}
