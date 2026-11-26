"use client";

// Encabezado de cada colección dentro de "Selected projects" (etiqueta, título y bajada).

import { Reveal } from "@/components/effects/Reveal";
import { useT } from "@/i18n/t";

export function CollectionHeader({ id, label, title, lede }: { id: string; label: string; title: string; lede: string }) {
  const t = useT();
  return (
    <Reveal className="mb-10 grid gap-4 border-t border-line pt-5 sm:mb-14 short:mb-8 lg:grid-cols-12 lg:items-end">
      <div className="lg:col-span-7">
        <p className="type-label mb-3">{t(label).toUpperCase()}</p>
        <h3 id={id} className="font-display text-[clamp(1.9rem,4vw,3.2rem)] font-semibold leading-[0.98] tracking-[-0.03em] text-fg">
          {t(title)}
        </h3>
      </div>
      <p className="max-w-md text-[15px] leading-relaxed text-muted lg:col-span-4 lg:col-start-9">{t(lede)}</p>
    </Reveal>
  );
}
