"use client";

// Un solo IntersectionObserver para todos los elementos con data-reveal (activa su animación al ser visibles).

import { useEffect } from "react";

/**
 * One IntersectionObserver for every [data-reveal] element on the page.
 *
 * - Elements already on screen at start-up are marked as shown immediately
 *   (no flash), then the `js-reveal` class enables the hidden state for the rest.
 * - A MutationObserver picks up elements added later (route changes,
 *   expanded panels).
 * - Each element is revealed once, then unobserved.
 */
export function RevealObserver() {
  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const show = (el: Element) => el.setAttribute("data-shown", "");

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            show(e.target);
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );

    const inView = (el: Element) => {
      const r = el.getBoundingClientRect();
      return r.top < window.innerHeight && r.bottom > 0;
    };

    const track = (el: Element, initial: boolean) => {
      if (el.hasAttribute("data-shown")) return;
      if (reduced || (initial && inView(el))) show(el);
      else io.observe(el);
    };

    document.querySelectorAll("[data-reveal]").forEach((el) => track(el, true));
    root.classList.add("js-reveal");

    const mo = new MutationObserver((records) => {
      for (const r of records) {
        r.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node.matches("[data-reveal]")) track(node, false);
          node.querySelectorAll("[data-reveal]").forEach((el) => track(el, false));
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
