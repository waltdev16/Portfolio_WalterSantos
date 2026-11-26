"use client";

// Carrusel de certificados con filtros y vista ampliada. Se genera a partir de src/data/credentials.ts.

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ExternalLink, Maximize2, X } from "lucide-react";
import type { Credential, CredentialCategory } from "@/types";
import { categoryLabel, credentialFilters } from "@/data/credentials";
import { cn } from "@/lib/utils";
import { CredentialVisual } from "./CredentialVisual";
import { useLocalized, useT } from "@/i18n/t";

type Filter = "all" | CredentialCategory;

function VerifyLink({ href, compact = false }: { href: string; compact?: boolean }) {
  const t = useT();
  const credly = href.includes("credly.com");
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group/v inline-flex items-center gap-2 transition-colors",
        compact
          ? "font-mono text-[11px] text-fg underline decoration-line underline-offset-4 hover:text-accent hover:decoration-accent"
          : "h-11 rounded-full bg-fg px-5 text-sm font-medium text-bg hover:bg-accent hover:text-[#f2f4f7]",
      )}
    >
      {t(credly ? "Verify on Credly" : "Verify credential")}
      <ExternalLink className="size-3.5 transition-transform group-hover/v:-translate-y-0.5 group-hover/v:translate-x-0.5" aria-hidden="true" />
      <span className="sr-only">{t("(opens in a new tab)")}</span>
    </a>
  );
}

/**
 * Credential gallery.
 * - Filters: All / Microsoft / Languages / Extracurricular.
 * - Native horizontal scroll with snap: swipe on touch, trackpad on desktop.
 * - Arrows, position indicator, progress rule. No autoplay.
 * - Keyboard: ←/→/Home/End move between cards when focus is inside.
 * - Each card opens a native <dialog> with the full document.
 */
export function CredentialCarousel({ items: source }: { items: Credential[] }) {
  const t = useT();
  const items = useLocalized(source);
  const track = useRef<HTMLUListElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [edges, setEdges] = useState({ start: true, end: false });
  const [scrollable, setScrollable] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);
  const open = items.find((item) => item.id === openId) ?? null;

  const visible = filter === "all" ? items : items.filter((c) => c.category === filter);

  const cards = () => Array.from(track.current?.querySelectorAll<HTMLElement>("[data-card]") ?? []);

  const sync = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 1);
    setEdges({ start: el.scrollLeft < 4, end: el.scrollLeft > max - 4 });
    setScrollable(max > 4);
    const pad = parseFloat(getComputedStyle(el).paddingLeft) || 0;
    let best = 0;
    let bestD = Infinity;
    Array.from(el.querySelectorAll<HTMLElement>("[data-card]")).forEach((c, i) => {
      const dist = Math.abs(c.offsetLeft - pad - el.scrollLeft);
      if (dist < bestD) {
        bestD = dist;
        best = i;
      }
    });
    setIndex(best);
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(sync);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    const ro = new ResizeObserver(onScroll);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
    // the track remounts when the filter changes (key), so re-attach
  }, [sync, filter]);

  // open the native dialog once its content has rendered (so autofocus works)
  useEffect(() => {
    const d = dialog.current;
    if (open && d && !d.open) d.showModal();
  }, [open]);

  function go(i: number, focus = false) {
    const el = track.current;
    const list = cards();
    if (!el || !list.length) return;
    const target = Math.max(0, Math.min(list.length - 1, i));
    const pad = parseFloat(getComputedStyle(el).paddingLeft) || 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: list[target].offsetLeft - pad, behavior: reduced ? "auto" : "smooth" });
    if (focus) list[target].querySelector<HTMLElement>("button")?.focus({ preventScroll: true });
  }

  function onKeyDown(e: React.KeyboardEvent) {
    const list = cards();
    const current = list.findIndex((c) => c.contains(document.activeElement));
    const from = current >= 0 ? current : index;
    const map: Record<string, number> = { ArrowRight: from + 1, ArrowLeft: from - 1, Home: 0, End: list.length - 1 };
    if (e.key in map) {
      e.preventDefault();
      go(map[e.key], true);
    }
  }

  function choose(f: Filter) {
    setFilter(f);
    track.current?.scrollTo({ left: 0 });
    requestAnimationFrame(sync);
  }

  const count = (f: Filter) => (f === "all" ? items.length : items.filter((c) => c.category === f).length);

  return (
    <div>
      {/* Filters + controls */}
      <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label={t("Filter credentials")} className="flex flex-wrap gap-2">
          {credentialFilters.map((f) => {
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => choose(f.id)}
                aria-pressed={active}
                className={cn(
                  "inline-flex h-9 items-center gap-2 rounded-full border px-4 text-[13px] transition-colors duration-300",
                  active ? "border-fg bg-fg text-bg" : "border-line text-fg hover:border-fg",
                )}
              >
                {t(f.label)}
                <span className={cn("font-mono text-[10px]", active ? "opacity-70" : "text-muted")}>{count(f.id)}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-5">
          <p className="font-mono text-[12px] text-fg" aria-live="polite" aria-atomic="true">
            <span className="sr-only">{t("Credential")} </span>
            {String(index + 1).padStart(2, "0")}
            <span className="text-muted"> / {String(visible.length).padStart(2, "0")}</span>
          </p>
          <span className="hidden h-px w-32 bg-line sm:block" aria-hidden="true">
            <span
              className="block h-px origin-left bg-fg transition-transform duration-300"
              style={{ transform: `scaleX(${Math.max(0.08, progress)})` }}
            />
          </span>
          <div className={cn("flex gap-2", !scrollable && "invisible")}>
            {[
              { label: t("Previous credential"), to: index - 1, off: edges.start, Icon: ArrowLeft },
              { label: t("Next credential"), to: index + 1, off: edges.end, Icon: ArrowRight },
            ].map(({ label, to, off, Icon }) => (
              <button
                key={label}
                type="button"
                onClick={() => go(to)}
                disabled={off}
                aria-label={label}
                className="grid size-11 place-items-center rounded-full border border-line text-fg transition-colors hover:border-fg hover:bg-fg hover:text-bg active:scale-95 disabled:pointer-events-none disabled:opacity-35"
              >
                <Icon className="size-4" aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Track */}
      <ul
        key={filter}
        ref={track}
        onKeyDown={onKeyDown}
        aria-label={t("Certifications and achievements")}
        className="no-scrollbar relative -mx-5 flex snap-x snap-mandatory items-stretch gap-4 overflow-x-auto scroll-px-5 px-5 pb-8 pt-2 sm:-mx-10 sm:scroll-px-10 sm:gap-5 sm:px-10"
      >
        {visible.map((c, i) => (
          <li
            key={c.id}
            data-card
            className="intro flex w-[min(80vw,21rem)] shrink-0 snap-start flex-col"
            style={{ "--d": `${i * 0.05}s` } as React.CSSProperties}
          >
            <article className="group flex h-full flex-col border border-line bg-surface p-2 transition-[transform,box-shadow,border-color] duration-500 ease-blueprint hover:-translate-y-1 hover:border-muted/50 hover:shadow-[0_22px_44px_-30px_rgb(8_11_16/0.5)] focus-within:-translate-y-1">
              <button type="button" onClick={() => setOpenId(c.id)} aria-haspopup="dialog" className="block text-left">
                <span className="relative block overflow-hidden">
                  <span className="block transition-transform duration-700 ease-blueprint group-hover:scale-[1.02]">
                    <CredentialVisual credential={c} />
                  </span>
                  <span className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-[#080b10] text-[#f2f4f7] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
                    <Maximize2 className="size-3.5" aria-hidden="true" />
                  </span>
                </span>
                <span className="mt-4 flex items-center justify-between gap-3 px-2 font-mono text-[10.5px] text-muted">
                  <span>{t(categoryLabel[c.category])}</span>
                  <span className="text-fg">{c.year ?? ""}</span>
                </span>
                <span className="mt-2 block px-2 font-display text-[1.05rem] font-medium leading-snug tracking-[-0.01em] text-fg">
                  {c.name}
                </span>
                {c.subtitle && <span className="mt-0.5 block px-2 text-[13px] text-muted">{c.subtitle}</span>}
                <span className="sr-only">{t("— open larger view")}</span>
              </button>
              <div className="mt-auto flex items-end justify-between gap-3 px-2 pb-2 pt-4">
                <span className="text-[13px] leading-snug text-muted">{c.issuer}</span>
                {c.verifyUrl && <VerifyLink href={c.verifyUrl} compact />}
              </div>
            </article>
          </li>
        ))}
        {/* trailing room so every card, including the last, can snap to the start */}
        <li aria-hidden="true" className="w-[calc(100%-min(80vw,21rem)-1.25rem)] shrink-0" />
      </ul>

      {/* Detail dialog */}
      <dialog
        ref={dialog}
        onClose={() => setOpenId(null)}
        onClick={(e) => {
          if (e.target === dialog.current) dialog.current?.close();
        }}
        aria-labelledby="credential-title"
        className="credential-dialog m-auto w-[min(94vw,72rem)] max-w-none overflow-visible bg-transparent p-0 text-fg backdrop:bg-[#080b10]/80 backdrop:backdrop-blur-sm"
      >
        {open && (
          <div className="theme-paper relative grid max-h-[92dvh] overflow-y-auto border border-line bg-bg lg:grid-cols-[1.6fr_1fr]">
            <div className={cn("grid place-items-center p-4 sm:p-8", open.kind === "badge" ? "bg-[#10151d]" : "bg-bg-2")}>
              {open.image ? (
                <Image
                  src={open.image}
                  alt={`${open.name} — ${open.issuer}`}
                  width={open.width ?? 1200}
                  height={open.height ?? 900}
                  sizes="(min-width: 1024px) 60vw, 94vw"
                  className={cn("h-auto max-h-[68dvh] w-auto max-w-full object-contain", open.kind === "badge" && "max-h-[22rem]")}
                />
              ) : (
                <CredentialVisual credential={open} className="max-w-xl" />
              )}
            </div>
            <div className="flex flex-col p-6 sm:p-8">
              <p className="type-label">{t(categoryLabel[open.category]).toUpperCase()}</p>
              <h3 id="credential-title" className="mt-3 pr-10 font-display text-2xl font-semibold leading-tight tracking-[-0.03em] sm:text-3xl">
                {open.name}
              </h3>
              {open.subtitle && <p className="mt-1 text-muted">{open.subtitle}</p>}
              {open.description && <p className="mt-5 text-[15px] leading-relaxed">{open.description}</p>}
              <dl className="mt-6 border-t border-line text-[14px]">
                {[
                  [t("Issuer"), open.issuer],
                  ...(open.date ? [[t("Date"), open.date]] : open.year ? [[t("Year"), open.year]] : []),
                  ...(open.credentialId ? [[t("Badge ID"), open.credentialId]] : []),
                ].map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[6rem_1fr] gap-4 border-b border-line py-3">
                    <dt className="font-mono text-[11px] text-muted">{k}</dt>
                    <dd className="break-words">{v}</dd>
                  </div>
                ))}
              </dl>
              {open.note && <p className="mt-4 font-mono text-[11px] leading-relaxed text-muted">{open.note}</p>}
              <div className="mt-auto pt-8">
                {open.verifyUrl ? (
                  <VerifyLink href={open.verifyUrl} />
                ) : (
                  <p className="font-mono text-[11px] text-muted">{t("No online verification available for this document.")}</p>
                )}
              </div>
            </div>
            <button
              type="button"
              autoFocus
              onClick={() => dialog.current?.close()}
              aria-label={t("Close")}
              className="absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-[#080b10] text-[#f2f4f7] transition-colors hover:bg-accent"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
        )}
      </dialog>
    </div>
  );
}
