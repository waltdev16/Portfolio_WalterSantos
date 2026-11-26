// Transición de portal entre el portafolio y Walter's World (ida, vuelta, precarga y restauración del scroll).
/**
 * The portal between the portfolio and Walter's World (/world).
 *
 * Going in (click on any World button):
 *   1. activation — the button pulses, its arrow leans forward, the page dims
 *      and stops taking clicks;
 *   2. portal — a dark disc with a warm orange rim grows from the exact spot
 *      of the button until it covers the screen (transform + opacity only);
 *   3. the World opens underneath in the same colour and lights its garage up.
 * Coming back, the World dims and pulls away; here the disc covers the page
 * on load and shrinks back into the World button, with the visitor's scroll
 * position restored.
 *
 * Same origin: the two sides hand over through sessionStorage.
 */
const PORTAL_IN = "ws-portal";
const RETURN = "ws-portal-return";
const SCROLL = "ws-portal-scroll";
const FRESH_MS = 20000;

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- preloading ---------- */
let preloaded: Promise<void> | null = null;

/** Warms the World's page, code, styles and main artwork (once). */
export function preloadWorld() {
  if (preloaded) return preloaded;
  const hint = (href: string, as?: string) => {
    const link = document.createElement("link");
    link.rel = as ? "preload" : "prefetch";
    if (as) link.as = as;
    link.href = href;
    if (as === "script") link.crossOrigin = "anonymous";
    document.head.appendChild(link);
  };
  preloaded = fetch("/world", { credentials: "same-origin" })
    .then((r) => r.text())
    .then((html) => {
      for (const m of html.matchAll(/(?:src|href)="(\/world\/[^"]+\.(?:js|css|webp))"/g)) {
        const url = m[1];
        hint(url, url.endsWith(".js") ? "script" : url.endsWith(".css") ? "style" : "image");
      }
      hint("/world/garage/en/base.webp", "image");
    })
    .catch(() => undefined);
  return preloaded;
}

/* ---------- the disc ---------- */
/** distance from (x, y) to the farthest corner of the viewport, plus a margin */
const radius = (x: number, y: number) => Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y)) + 40;

function disc(x: number, y: number) {
  const r = radius(x, y);
  const el = document.createElement("div");
  el.className = "world-portal";
  el.setAttribute("aria-hidden", "true");
  el.style.setProperty("--x", `${x}px`);
  el.style.setProperty("--y", `${y}px`);
  el.style.setProperty("--r", `${r}px`);
  el.innerHTML = '<span class="world-portal__disc"></span><span class="world-portal__rim"></span>';
  document.body.appendChild(el);
  return el;
}

function centerOf(el: Element | null) {
  const r = el?.getBoundingClientRect();
  if (!r || !r.width) return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

/* ---------- going in ---------- */
let entering = false;

export function enterWorld(button: HTMLElement) {
  if (entering) return;
  entering = true;
  try {
    // remember where the visitor was: the section around the button and how far
    // its top was from the top of the screen (robust to images loading later)
    const section = button.closest("section[id]") ?? [...document.querySelectorAll("main section[id]")].find((el) => el.getBoundingClientRect().bottom > window.innerHeight / 2);
    sessionStorage.setItem(SCROLL, JSON.stringify({ y: window.scrollY, id: section?.id ?? null, top: section?.getBoundingClientRect().top ?? 0 }));
    sessionStorage.removeItem(RETURN);
  } catch {
    /* no storage: the World still opens, the way back starts at the top */
  }
  const go = () => {
    try {
      sessionStorage.setItem(PORTAL_IN, String(Date.now()));
    } catch {
      /* the World then opens with its own entrance only */
    }
    // /world is a separate (Vite) app, not a Next.js route: a real page load is intended
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.assign("/world");
  };
  const loading = preloadWorld();
  if (reducedMotion()) {
    go();
    return;
  }

  const { x, y } = centerOf(button);
  const root = document.documentElement;
  // 1. activation: pulse, arrow forward, page dims, clicks off
  button.dataset.portal = "active";
  root.dataset.portal = "out";
  const portal = disc(x, y);
  const site = document.getElementById("site") ?? document.body;
  site.animate(
    [
      { opacity: 1, transform: "scale(1)" },
      { opacity: 0.35, transform: "scale(0.985)" },
    ],
    { duration: 650, delay: 120, easing: "cubic-bezier(0.65, 0, 0.35, 1)", fill: "forwards" },
  );
  // 2. portal: the disc and its warm rim grow from the button
  const grow = portal.querySelector(".world-portal__disc")!.animate(
    [{ clipPath: `circle(0px at ${x}px ${y}px)` }, { clipPath: `circle(${radius(x, y)}px at ${x}px ${y}px)` }],
    { duration: 820, delay: 200, easing: "cubic-bezier(0.7, 0, 0.25, 1)", fill: "forwards" },
  );
  portal.querySelector(".world-portal__rim")!.animate(
    [
      { transform: "translate(-50%, -50%) scale(0)", opacity: 0 },
      { opacity: 1, offset: 0.25 },
      { transform: "translate(-50%, -50%) scale(1)", opacity: 0.9, offset: 0.85 },
      { transform: "translate(-50%, -50%) scale(1.02)", opacity: 0 },
    ],
    { duration: 900, delay: 180, easing: "cubic-bezier(0.7, 0, 0.25, 1)", fill: "forwards" },
  );
  // 3. once covered (and the World is warm in the cache, or after a short wait), go
  const covered = grow.finished.catch(() => undefined);
  const enough = new Promise((r) => window.setTimeout(r, 1500));
  Promise.all([covered, Promise.race([loading, enough])]).then(go);
  // safety: never leave the page dimmed if something above failed
  window.setTimeout(go, 2600);
}

/* ---------- coming back ---------- */

/** True when the visitor is returning from the World through its back button. */
export function isReturning() {
  try {
    const at = Number(sessionStorage.getItem(RETURN));
    return !!at && Date.now() - at < FRESH_MS;
  } catch {
    return false;
  }
}

/** Restores the scroll position and shrinks the portal back into the World button. */
export function playReturn() {
  const root = document.documentElement;
  let portal: HTMLElement | null = null;
  let saved: { y: number; id: string | null; top: number } | null = null;
  try {
    saved = JSON.parse(sessionStorage.getItem(SCROLL) ?? "null");
    sessionStorage.removeItem(RETURN);
  } catch {
    /* start at the top */
  }
  const restore = () => {
    if (!saved) return;
    const el = saved.id ? document.getElementById(saved.id) : null;
    const top = el ? el.getBoundingClientRect().top + window.scrollY - saved.top : saved.y;
    window.scrollTo({ top, behavior: "instant" as ScrollBehavior });
  };
  const done = () => {
    delete root.dataset.portal;
    portal?.remove();
    portal = null;
  };

  const reveal = () => {
    if (reducedMotion()) return done();
    // the World button on screen (the biggest one: section, nav or footer)
    const target =
      [...document.querySelectorAll<HTMLElement>(".world-btn")]
        .filter((b) => {
          const r = b.getBoundingClientRect();
          return r.width > 0 && r.bottom > 0 && r.top < window.innerHeight;
        })
        .sort((a, b) => b.getBoundingClientRect().width - a.getBoundingClientRect().width)[0] ?? null;
    const { x, y } = centerOf(target);
    const el = disc(x, y);
    portal = el;
    el.classList.add("is-full");
    // swap the boot cover for the full disc in the same frame, then close it into the button
    requestAnimationFrame(() => {
      root.dataset.portal = "return";
      const shrink = el.querySelector(".world-portal__disc")!.animate(
        [{ clipPath: `circle(${radius(x, y)}px at ${x}px ${y}px)` }, { clipPath: `circle(0px at ${x}px ${y}px)` }],
        { duration: 900, delay: 80, easing: "cubic-bezier(0.7, 0, 0.25, 1)", fill: "forwards" },
      );
      el.querySelector(".world-portal__rim")!.animate(
        [
          { transform: "translate(-50%, -50%) scale(1.02)", opacity: 0 },
          { transform: "translate(-50%, -50%) scale(1)", opacity: 0.9, offset: 0.15 },
          { opacity: 1, offset: 0.75 },
          { transform: "translate(-50%, -50%) scale(0)", opacity: 0 },
        ],
        { duration: 900, delay: 80, easing: "cubic-bezier(0.7, 0, 0.25, 1)", fill: "forwards" },
      );
      document.getElementById("site")?.animate(
        [
          { opacity: 0.35, transform: "scale(0.985)" },
          { opacity: 1, transform: "scale(1)" },
        ],
        { duration: 800, delay: 220, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
      );
      target?.animate([{ boxShadow: "0 0 0 0 rgb(255 138 61 / 0.6)" }, { boxShadow: "0 0 0 14px rgb(255 138 61 / 0)" }], {
        duration: 700,
        delay: 900,
        easing: "ease-out",
      });
      shrink.finished.then(done, done);
    });
  };

  restore();
  // once more after late layout (fonts, images) while the page is still covered,
  // then open the portal from wherever the World button ended up
  window.setTimeout(() => {
    restore();
    reveal();
  }, 100);
  // safety: never leave the page covered
  window.setTimeout(done, 2500);
}

/** Back/forward cache: a page restored after leaving must not stay dimmed. */
export function resetAfterBfcache() {
  entering = false;
  delete document.documentElement.dataset.portal;
  document.querySelectorAll(".world-portal").forEach((el) => el.remove());
  document.querySelectorAll<HTMLElement>("[data-portal]").forEach((el) => delete el.dataset.portal);
  document.getElementById("site")?.getAnimations().forEach((a) => a.cancel());
}
