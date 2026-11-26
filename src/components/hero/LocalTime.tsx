"use client";

// Hora local de El Salvador que se muestra en el Hero.

import { useSyncExternalStore } from "react";

const fmt = new Intl.DateTimeFormat("en-US", { timeZone: "America/El_Salvador", hour: "2-digit", minute: "2-digit", hour12: false });

let listeners = new Set<() => void>();
let timer: number | undefined;
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  if (!timer) timer = window.setInterval(() => listeners.forEach((l) => l()), 15_000);
  return () => {
    listeners.delete(cb);
    if (!listeners.size) {
      clearInterval(timer);
      timer = undefined;
      listeners = new Set();
    }
  };
};
const read = () => fmt.format(new Date());

/** Live local time in El Salvador (UTC−6). Empty on the server to avoid a hydration mismatch. */
export function LocalTime() {
  const time = useSyncExternalStore(subscribe, read, () => "");
  return (
    <time suppressHydrationWarning className="tabular-nums">
      {time ? `${time} · GMT−6` : " "}
    </time>
  );
}
