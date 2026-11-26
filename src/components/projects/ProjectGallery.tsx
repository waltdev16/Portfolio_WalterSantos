// Galería adaptable de capturas y videos de un proyecto.

import Image from "next/image";
import type { EvidenceItem } from "@/types";
import { cn } from "@/lib/utils";
import { CornerMarks } from "@/components/effects/Blueprint";
import { Reveal } from "@/components/effects/Reveal";
import { ImageReveal } from "@/components/effects/Motion";
import { T } from "@/i18n/Translate";
import { DemoVideo } from "./DemoVideo";

/** Detecta archivos de video. */
function isVideo(src: string | null | undefined) {
  return !!src && /\.(mp4|webm)(?:[?#].*)?$/i.test(src);
}

/** Captura individual, video o marcador pendiente. */
function EvidenceFrame({
  item,
  figure,
  className,
  priority = false,
}: {
  item: EvidenceItem;
  figure: string;
  className?: string;
  priority?: boolean;
}) {
  const video = isVideo(item.src);

  return (
    <figure className={cn("group mx-auto w-full min-w-0", className)}>
      <ImageReveal
        className={cn(
          "relative w-full overflow-hidden border border-line bg-transparent",
          !item.src && "aspect-[16/10]"
        )}
      >
        {item.src && video ? (
          <DemoVideo src={item.src} label={item.alt} />
        ) : item.src ? (
          <Image
            src={item.src}
            alt={item.alt}
            width={1600}
            height={1000}
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={priority}
            unoptimized
            className="block h-auto w-full"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center">
            <p className="text-center font-mono text-[11px] text-muted">
              <T>[ CAPTURE PENDING ]</T>
              <span className="mt-1 block text-[10px] text-muted/80">
                <T>Screenshot coming soon</T>
              </span>
            </p>
          </div>
        )}
        {/* Marcas técnicas sin interferir con los controles. */}
        <div className="pointer-events-none absolute inset-0">
          <CornerMarks className="[&>span]:m-2" size={10} />
        </div>
      </ImageReveal>
      <figcaption className="mt-3 flex items-start gap-3 font-mono text-[11px] leading-relaxed text-muted">
        <span className="shrink-0 text-fg">{figure}</span>
        <span>{item.caption}</span>
      </figcaption>
    </figure>
  );
}

/** Distribución adaptable según las evidencias disponibles. */
export function ProjectGallery({
  items,
  startAt = 2,
}: {
  items: EvidenceItem[];
  startAt?: number;
}) {
  if (!items.length) return null;

  const fig = (i: number) =>
    `FIG. ${String(i + startAt).padStart(2, "0")}`;

  // Una captura: centrada y con tamaño limitado.
  if (items.length === 1) {
    return (
      <Reveal className="mx-auto w-full max-w-[800px]">
        <EvidenceFrame item={items[0]} figure={fig(0)} priority />
      </Reveal>
    );
  }

  // Tres evidencias: distribución asimétrica original.
  if (items.length === 3) {
    const [lead, ...rest] = items;
    return (
      <div className="grid items-start gap-8 lg:grid-cols-12">
        <Reveal className="min-w-0 lg:col-span-8">
          <EvidenceFrame item={lead} figure={fig(0)} priority />
        </Reveal>
        <div className="grid min-w-0 items-start gap-8 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1">
          {rest.map((item, i) => (
            <Reveal key={`${item.caption}-${i}`} delay={0.08 * (i + 1)} className="min-w-0">
              <EvidenceFrame item={item} figure={fig(i + 1)} />
            </Reveal>
          ))}
        </div>
      </div>
    );
  }

  // Galería Masonry para múltiples capturas.
  return (
    <div className="columns-1 gap-8 md:columns-2">
      {items.map((item, i) => (
        <div key={`${item.caption}-${i}`} className="mb-8 inline-block w-full break-inside-avoid align-top">
          <Reveal delay={Math.min(0.08 * i, 0.4)}>
            <EvidenceFrame item={item} figure={fig(i)} priority={i === 0} />
          </Reveal>
        </div>
      ))}
    </div>
  );
}
