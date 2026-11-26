"use client";

// Visor de una aplicación incrustada (HYDRA, SortlyScan, simuladores...).
// - Solo se carga en la página del proyecto y cuando el visor está cerca de la pantalla.
// - Al salir de la página (o si Next.js la oculta en caché) el iframe se vacía:
//   así una escena 3D no sigue consumiendo recursos en segundo plano.
// - Mientras carga se muestra la portada; siempre hay un botón para abrir la app aparte.

// 01. Importaciones
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, LoaderCircle, Maximize2, Minimize2 } from "lucide-react";
import { useT } from "@/i18n/t";

type Props = {
  src: string;
  title: string;
  /** imagen de espera (portada de detalle) */
  poster?: string | null;
  /** dirección para abrir en una pestaña nueva (por defecto, src) */
  externalUrl?: string | null;
  allowCamera?: boolean;
};

// 02. Configuración
const SLOW_LOAD_MS = 12000;

export function InteractiveEmbed({ src, title, poster, externalUrl, allowCamera = false }: Props) {
  const t = useT();

  // 03. Estado del componente
  const frameRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [slow, setSlow] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  // 04. Carga diferida: el iframe recibe su dirección al acercarse a la pantalla
  useEffect(() => {
    const frame = frameRef.current;
    const iframe = iframeRef.current;
    if (!frame || !iframe) return;

    let slowTimer = 0;
    const start = () => {
      if (iframe.getAttribute("src") === src) return;
      iframe.setAttribute("src", src);
      slowTimer = window.setTimeout(() => setSlow(true), SLOW_LOAD_MS);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          start();
          observer.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    observer.observe(frame);

    return () => {
      observer.disconnect();
      window.clearTimeout(slowTimer);
      // libera la aplicación (WebGL, audio, cámara) al salir o al ocultarse la página
      iframe.setAttribute("src", "about:blank");
      setLoaded(false);
      setSlow(false);
    };
  }, [src]);

  // 05. Pantalla completa
  useEffect(() => {
    const onChange = () => setFullscreen(document.fullscreenElement === frameRef.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await frameRef.current?.requestFullscreen();
    } catch {
      // algunos navegadores (por ejemplo iOS) no permiten pantalla completa en elementos
    }
  };

  const onLoad = () => {
    if (iframeRef.current?.getAttribute("src") !== src) return; // ignora about:blank
    setLoaded(true);
    setSlow(false);
  };

  const openUrl = externalUrl ?? src;

  // 06. Renderizado
  return (
    <div>
      <div
        ref={frameRef}
        className="relative aspect-video w-full overflow-hidden border border-line bg-black fullscreen:h-screen fullscreen:w-screen fullscreen:aspect-auto fullscreen:border-0"
      >
        <iframe
          ref={iframeRef}
          title={title}
          onLoad={onLoad}
          className="absolute inset-0 h-full w-full border-0"
          allow={allowCamera ? "fullscreen; camera" : "fullscreen"}
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />

        {/* Portada y estado de carga (evita la pantalla negra mientras arranca la app) */}
        {!loaded && (
          <div className="absolute inset-0 grid place-items-center bg-bg-2" aria-live="polite">
            {poster && <Image src={poster} alt="" fill sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover opacity-35" />}
            <div className="relative flex max-w-sm flex-col items-center gap-3 px-6 text-center font-mono text-[12px] text-fg">
              <LoaderCircle className="size-5 animate-spin text-accent motion-reduce:animate-none" aria-hidden="true" />
              <span>{t("Loading interactive demo…")}</span>
              {slow && <span className="text-muted">{t("If the demo does not load here, open it in a new tab.")}</span>}
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={toggleFullscreen}
          aria-label={fullscreen ? t("Exit fullscreen") : t("Fullscreen")}
          title={fullscreen ? t("Exit fullscreen") : t("Fullscreen")}
          className="absolute bottom-3 right-3 z-10 flex size-9 items-center justify-center border border-white/20 bg-black/70 text-white backdrop-blur-md transition-colors hover:border-white hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
        >
          {fullscreen ? <Minimize2 className="size-4" aria-hidden="true" /> : <Maximize2 className="size-4" aria-hidden="true" />}
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] text-muted">
        <span>{t("Interactive demo")}</span>
        <a
          href={openUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-fg underline decoration-line underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
        >
          {t("Open in new tab")}
          <ArrowUpRight className="size-3.5" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
