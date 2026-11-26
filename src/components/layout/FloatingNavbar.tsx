"use client";

// Barra de navegación: links a las secciones, idioma, botón World, Projects y menú móvil.

import Link from "next/link";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { sections } from "@/data/navigation";
import { useActiveSection } from "@/hooks/useActiveSection";
import { cn } from "@/lib/utils";
import { WorldButton } from "@/components/world/WorldButton";
import { LanguageSwitch } from "./LanguageSwitch";
import { useT } from "@/i18n/t";

const ids = sections.map((s) => s.id);
const desktopLinks = sections.filter((s) => s.id !== "projects");

export function FloatingNavbar({ forceActive }: { forceActive?: string }) {
  const t = useT();
  const observed = useActiveSection(ids);
  const active = forceActive ?? observed;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // home page, hero on screen: the nav lies flat across the top instead of a capsule
  const [flat, setFlat] = useState(!forceActive);
  const menuButton = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);
  // reading progress: a thin fluor bar along the top edge
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 220, damping: 32, mass: 0.3 });

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      setFlat(!forceActive && window.scrollY < window.innerHeight * 0.55);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [forceActive]);

  // the capsule wraps its content: measure the items and expose the width as
  // --nav-fit (a number, so the flat ↔ capsule change can still animate)
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const measure = () => {
      if (window.innerWidth < 1024) {
        nav.style.removeProperty("--nav-fit");
        return;
      }
      const items = [...nav.children].filter((el): el is HTMLElement => {
        const h = el as HTMLElement;
        return h.offsetWidth > 0 && getComputedStyle(h).position !== "absolute";
      });
      const content = items.reduce((sum, el) => sum + el.offsetWidth, 0);
      const gaps = 4 * (items.length - 1) + 8 * 2 + 4; // gap-1, plus ml-2 before World and Projects, ml-1 before the language
      const spacer = window.innerWidth >= 1280 ? 40 : 16; // breathing room after the logo
      const frame = 12 + 2; // p-1.5 and the border
      nav.style.setProperty("--nav-fit", `${Math.ceil(content + gaps + spacer + frame + 2)}px`);
    };
    measure();
    const ro = new ResizeObserver(measure);
    [...nav.children].forEach((el) => ro.observe(el));
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onResize = () => { if (desktop.matches) setOpen(false); };
    const outside = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onResize);
    document.addEventListener("pointerdown", outside);
    return () => {
      window.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onResize);
      document.removeEventListener("pointerdown", outside);
    };
  }, [open]);

  const activeLabel = sections.find((s) => s.id === active);

  return (
    <>
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-fluor"
      style={{ scaleX: progress }}
    />
    <header
      className={cn(
        "pointer-events-none fixed inset-x-0 top-3 z-50 flex justify-center px-3 transition-[padding] duration-700 sm:top-5",
        flat && "sm:px-[calc(3vw-0.375rem)]",
        !forceActive && "nav-intro",
      )}
    >
      <nav
        ref={navRef}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false);
        }}
        aria-label={t("Main")}
        className={cn(
          "pointer-events-auto relative flex w-full items-center gap-1 rounded-full border p-1.5 transition-[max-width,background-color,border-color,backdrop-filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
          flat && !open
            ? "max-w-[52rem] border-transparent bg-transparent sm:max-w-[120rem]"
            : cn("max-w-[52rem] backdrop-blur-xl lg:max-w-[min(var(--nav-fit,56rem),100%)]", scrolled || open ? "border-[#293241] bg-[#10151d]/85" : "border-[#293241]/60 bg-[#10151d]/45"),
        )}
      >
        <Link
          href="/#top"
          onClick={() => setOpen(false)}
          className="flex h-9 shrink-0 items-center gap-2 rounded-full pl-3 pr-3 font-mono text-[12px] text-fog"
          aria-label={`Walter Santos — ${t("back to top")}`}
        >
          <span aria-hidden="true" className="grid size-5 place-items-center rounded-[3px] border border-[#3a4352] text-[9px] leading-none">
            WS
          </span>
          <span className="hidden sm:inline lg:hidden xl:inline">walter.santos</span>
        </Link>

        {/* Desktop links */}
        <ul className="ml-auto hidden shrink-0 items-center lg:flex">
          {desktopLinks.map((s) => {
            const isActive = active === s.id;
            return (
              <li key={s.id} className="relative">
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-full bg-[#1b2230]"
                    transition={{ type: "spring", stiffness: 380, damping: 34 }}
                  />
                )}
                <Link
                  href={`/#${s.id}`}
                  aria-current={isActive ? "location" : undefined}
                  className={cn(
                    "relative block rounded-full px-2.5 py-2 text-[13px] transition-colors xl:px-3.5",
                    isActive ? "text-fog" : "text-[#9099a8] hover:text-fog",
                  )}
                >
                  {t(s.label)}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* mobile: where you are */}
        <span className="ml-auto hidden font-mono text-[11px] text-[#9099a8] min-[420px]:inline lg:hidden" aria-hidden="true">
          {activeLabel ? `${activeLabel.code} / ${t(activeLabel.label)}` : `001 / ${t("Index")}`}
        </span>

        {/* language: EN / ES, shared with Walter's World */}
        <LanguageSwitch className="ml-1 hidden shrink-0 lg:block" />

        {/* the creative area: its own colour, apart from the professional sections */}
        <WorldButton size="sm" label="World" className="shrink-0 max-[419px]:ml-auto min-[420px]:ml-3 lg:ml-2" />

        <Link
          href="/#projects"
          aria-current={active === "projects" ? "location" : undefined}
          className={cn(
            "ml-2 hidden h-9 shrink-0 items-center gap-2 rounded-full px-4 text-[13px] font-medium transition-colors lg:inline-flex",
            active === "projects" ? "bg-fluor text-[#080b10]" : "bg-fog text-[#080b10] hover:bg-fluor",
          )}
        >
          {t("Projects")}

        </Link>


        <button
          ref={menuButton}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="ml-2 grid size-9 place-items-center rounded-full bg-fog text-[#080b10] lg:hidden"
        >
          <span className="sr-only">{t(open ? "Close menu" : "Open menu")}</span>
          {open ? <X className="size-4" aria-hidden="true" /> : <Menu className="size-4" aria-hidden="true" />}
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-0 top-[calc(100%+0.5rem)] max-h-[calc(100svh-6rem)] origin-top overflow-y-auto overscroll-contain rounded-3xl border border-[#293241] bg-[#10151d] p-3 shadow-[0_24px_60px_-20px_rgb(0_0_0/0.8)] lg:hidden"
            >
              <ul>
                {sections.map((s) => (
                  <li key={s.id}>
                    <Link
                      href={`/#${s.id}`}
                      onClick={() => setOpen(false)}
                      aria-current={active === s.id ? "location" : undefined}
                      className={cn(
                        "flex items-baseline justify-between rounded-2xl px-4 py-3 font-display text-2xl tracking-tight",
                        active === s.id ? "bg-[#1b2230] text-fog" : "text-[#c6ccd6]",
                      )}
                    >
                      {t(s.label)}
                      <span className="font-mono text-[11px] text-[#9099a8]">SYS / {s.code}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-2 flex items-center justify-between gap-3 border-t border-[#293241] px-1 pt-3">
                <span className="font-mono text-[11px] text-[#9099a8]">{t("Language")}</span>
                <LanguageSwitch variant="segmented" />
              </div>
              <div className="mt-3 px-1">
                <WorldButton size="lg" label="Enter Walter's World" className="w-full justify-center" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
    </>
  );
}
