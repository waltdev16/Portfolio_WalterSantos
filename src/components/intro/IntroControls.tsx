"use client";

// Botones "Omitir introducción" y "Repetir introducción".

import { requestIntroReplay } from "./introState";
import { T } from "@/i18n/Translate";

/** "Skip intro": bottom-right, quiet, keyboard reachable. */
export function SkipIntro({ onSkip, visible }: { onSkip: () => void; visible: boolean }) {
  return (
    <button type="button" onClick={onSkip} className="intro-skip" data-visible={visible || undefined}>
      <T>Skip intro</T>
    </button>
  );
}

/** A discreet way to watch the intro again (used in the footer). */
export function ReplayIntro({ className }: { className?: string }) {
  return (
    <button type="button" onClick={requestIntroReplay} className={className}>
      <T>Replay intro</T>
    </button>
  );
}
