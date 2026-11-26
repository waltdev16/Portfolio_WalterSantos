/**
 * The portal between the portfolio (/) and Walter's World (/world).
 *
 * Both sites live on the same origin, so they hand over through
 * sessionStorage:
 *   - "ws-portal"        set by the portfolio when its portal closes over the
 *                        screen; the World then skips its loading card and
 *                        opens straight into the garage's own light-up.
 *   - "ws-portal-return" set here when leaving; the portfolio then opens its
 *                        portal back into the World button and restores the
 *                        visitor's scroll position.
 */
const FRESH_MS = 20000;

export function consumeArrival(): boolean {
  try {
    const at = Number(sessionStorage.getItem("ws-portal"));
    sessionStorage.removeItem("ws-portal");
    return !!at && Date.now() - at < FRESH_MS;
  } catch {
    return false;
  }
}

/** Dims the garage, pulls the camera back, then returns to the portfolio. */
export function leaveToPortfolio(reduced: boolean) {
  const main = document.querySelector(".world");
  if (main?.classList.contains("world--leaving")) return;
  try {
    sessionStorage.setItem("ws-portal-return", String(Date.now()));
  } catch {
    /* without storage the portfolio simply opens normally */
  }
  const go = () => window.location.assign("/");
  if (reduced || !main) return go();
  main.classList.add("world--leaving");
  window.setTimeout(go, 650);
}

// coming back from the bfcache after leaving: undo the exit state
if (typeof window !== "undefined") {
  window.addEventListener("pageshow", (e) => {
    if (e.persisted) document.querySelector(".world")?.classList.remove("world--leaving");
  });
}
