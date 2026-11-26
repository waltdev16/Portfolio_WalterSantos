import { useEffect } from "react";

const focusable = 'a[href], button, input, select, textarea, [tabindex]';

/** Mantiene Tab en la ventana superior, oculta el fondo a lectores y devuelve el foco al cerrar. */
export function useDialogFocus() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".world");
    if (!root) return;
    let current: HTMLElement | null = null;
    let raf = 0;
    const origins = new Map<HTMLElement, HTMLElement | SVGElement | null>();
    const blocked = new Map<HTMLElement, boolean>();
    const restoreBackground = () => {
      blocked.forEach((wasInert, el) => { el.inert = wasInert; });
      blocked.clear();
    };
    const candidates = () => current ? Array.from(current.querySelectorAll<HTMLElement>(focusable)).filter(
      el => el.tabIndex >= 0 && !el.matches(":disabled") && !el.closest("[inert], [hidden]") &&
        getComputedStyle(el).visibility !== "hidden" && el.getClientRects().length > 0,
    ) : [];
    const focusInside = () => {
      if (!current) return;
      current.tabIndex = -1;
      (candidates()[0] ?? current).focus({ preventScroll: true });
    };
    const sync = () => {
      const dialogs = root.querySelectorAll<HTMLElement>('[role="dialog"][aria-modal="true"]');
      const next = dialogs[dialogs.length - 1] ?? null;
      if (next === current) return;
      cancelAnimationFrame(raf);
      const previous = current;
      restoreBackground();
      current = next;
      if (current && !origins.has(current)) {
        const focused = document.activeElement;
        origins.set(current, focused instanceof HTMLElement || focused instanceof SVGElement ? focused : null);
      }
      // Solo se desactivan hermanos: nunca un antecesor del diálogo.
      if (current) {
        let child: Element = current;
        while (child.parentElement && child !== root) {
          for (const sibling of child.parentElement.children) {
            if (sibling !== child && sibling instanceof HTMLElement) {
              blocked.set(sibling, sibling.inert);
              sibling.inert = true;
            }
          }
          child = child.parentElement;
        }
      }
      const origin = previous && !previous.isConnected ? origins.get(previous) : null;
      if (previous && !previous.isConnected) origins.delete(previous);
      raf = requestAnimationFrame(() => {
        if (origin?.isConnected && !origin.closest("[inert]") && (!current || current.contains(origin))) {
          origin.focus({ preventScroll: true });
        } else if (current && !current.contains(document.activeElement)) focusInside();
      });
    };
    const onKey = (event: KeyboardEvent) => {
      if (!current || event.key !== "Tab" || event.defaultPrevented) return;
      const list = candidates();
      const first = list[0];
      const last = list[list.length - 1];
      if (!first || !current.contains(document.activeElement) ||
          (event.shiftKey && (document.activeElement === first || document.activeElement === current)) ||
          (!event.shiftKey && document.activeElement === last)) {
        event.preventDefault();
        (event.shiftKey ? last : first)?.focus();
        if (!first) current.focus();
      }
    };
    const onFocus = (event: FocusEvent) => {
      if (current && !current.contains(event.target as Node)) focusInside();
    };
    const observer = new MutationObserver(sync);
    observer.observe(root, { childList: true, subtree: true });
    document.addEventListener("keydown", onKey);
    document.addEventListener("focusin", onFocus);
    sync();
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("focusin", onFocus);
      restoreBackground();
    };
  }, []);
}
