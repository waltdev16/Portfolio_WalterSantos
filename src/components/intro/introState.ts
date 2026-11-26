// Estado compartido de la intro: script de arranque, eventos y cuándo puede empezar la entrada del Hero.
/**
 * Shared state of the cinematic intro.
 *
 * A tiny inline script in <head> (INTRO_BOOT) decides before first paint
 * whether the intro plays: first visit of the session, on the home page, with
 * WebGL available and without prefers-reduced-motion. It marks
 * <html data-intro="play">, which hides the page and locks scroll from the very
 * first frame. Components read that flag instead of guessing.
 *
 * Coming back from Walter's World it sets <html data-portal="cover"> instead:
 * the page stays covered in the World's colour until the return portal plays.
 */
export const INTRO_KEY = "ws-intro-seen";
export const HERO_EVENT = "ws:intro-hero";
export const REPLAY_EVENT = "ws:intro-replay";

export const INTRO_BOOT = `(function(){try{var d=document.documentElement;if(location.pathname!=="/")return;var r=Number(sessionStorage.getItem("ws-portal-return"));if(r&&Date.now()-r<20000){d.dataset.portal="cover";sessionStorage.setItem("${INTRO_KEY}","1");return;}if(sessionStorage.getItem("${INTRO_KEY}"))return;if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;var c=document.createElement("canvas");var g=c.getContext("webgl2")||c.getContext("webgl");if(!g)return;var l=g.getExtension("WEBGL_lose_context");l&&l.loseContext();d.dataset.intro="play"}catch(e){}})();`;

/** runs `start` now, or when the intro hands over to the hero */
export function whenHeroMayStart(start: () => void) {
  if (document.documentElement.dataset.intro !== "play") {
    start();
    return () => undefined;
  }
  const on = () => start();
  window.addEventListener(HERO_EVENT, on, { once: true });
  return () => window.removeEventListener(HERO_EVENT, on);
}

export function requestIntroReplay() {
  window.dispatchEvent(new Event(REPLAY_EVENT));
}
