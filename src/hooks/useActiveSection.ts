"use client";

// Detecta qué sección está en pantalla para resaltarla en la navegación.

import { useEffect, useState } from "react";

/**
 * Returns the id of the section currently crossing the middle band
 * of the viewport. One IntersectionObserver, no scroll listeners.
 */
export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string>("top");

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (!elements.length) return;

    const visible = new Map<string, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) visible.set(entry.target.id, entry.isIntersecting);
        const current = ids.find((id) => visible.get(id));
        setActive(current ?? "top");
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}
