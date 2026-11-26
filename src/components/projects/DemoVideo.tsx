"use client";

// Video de demostración de un proyecto. Se pausa al salir de la página
// (Next.js puede conservar la página oculta en caché y el audio seguiría sonando).

import { useEffect, useRef } from "react";

export function DemoVideo({ src, label }: { src: string; label: string }) {
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const element = video.current;
    return () => element?.pause();
  }, []);

  return <video ref={video} src={src} aria-label={label} controls playsInline preload="metadata" className="block h-auto w-full" />;
}
