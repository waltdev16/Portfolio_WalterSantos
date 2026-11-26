"use client";

// Párrafo que se revela palabra por palabra y subraya las frases clave (se activa al entrar en pantalla).

import { cn } from "@/lib/utils";
import { useT } from "@/i18n/t";

/**
 * Paragraph that un-blurs word by word the first time it enters the viewport,
 * then underlines the key phrases with a soft highlight.
 *
 * Pure markup + CSS (driven by RevealObserver): the text is in the DOM,
 * readable and selectable from the start; without JS it is simply shown.
 * Total duration stays under ~800 ms regardless of length.
 */
export function BlurHighlight({
  text,
  highlights = [],
  className,
  as: Tag = "p",
}: {
  text: string;
  highlights?: string[];
  className?: string;
  as?: "p" | "div";
}) {
  const t = useT();
  text = t(text);
  highlights = highlights.map(t);
  // Split the text into plain and highlighted segments, in order.
  type Seg = { text: string; mark: boolean };
  const segments: Seg[] = [];
  let rest = text;
  while (rest.length) {
    let next: { idx: number; phrase: string } | null = null;
    for (const h of highlights) {
      const idx = rest.indexOf(h);
      if (idx >= 0 && (!next || idx < next.idx)) next = { idx, phrase: h };
    }
    if (!next) {
      segments.push({ text: rest, mark: false });
      break;
    }
    if (next.idx > 0) segments.push({ text: rest.slice(0, next.idx), mark: false });
    segments.push({ text: next.phrase, mark: true });
    rest = rest.slice(next.idx + next.phrase.length);
  }

  const totalWords = text.split(/\s+/).filter(Boolean).length;
  // spread the stagger over ~250 ms so the whole pass takes ~800 ms
  const step = Math.max(2, Math.round(250 / Math.max(1, totalWords)));
  let i = 0;

  const words = (s: string) =>
    s.split(/(\s+)/).map((w, k) => {
      if (!w) return null;
      if (/^\s+$/.test(w)) return w;
      const n = i++;
      return (
        <span key={k} className="bh-w" style={{ "--i": n } as React.CSSProperties}>
          {w}
        </span>
      );
    });

  return (
    // RevealObserver adds data-shown from outside React, possibly before this
    // subtree has hydrated; that attribute is expected to differ
    <Tag data-reveal="blur" suppressHydrationWarning className={cn(className)} style={{ "--step": `${step}ms` } as React.CSSProperties}>
      {segments.map((seg, k) =>
        seg.mark ? (
          <mark key={k} className="bh-mark">
            {words(seg.text)}
          </mark>
        ) : (
          <span key={k}>{words(seg.text)}</span>
        ),
      )}
    </Tag>
  );
}
