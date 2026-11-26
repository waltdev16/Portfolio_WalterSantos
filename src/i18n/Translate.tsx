"use client";

// Componente <T> que traduce su texto (permite traducir dentro de componentes de servidor).

import { useT } from "./t";

/** Translates its text child: lets server components stay server components. */
export function T({ children }: { children: string }) {
  return <>{useT()(children)}</>;
}
