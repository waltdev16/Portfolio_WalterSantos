// Página 404 para direcciones que no existen.

import Link from "next/link";
import { BlueprintGrid } from "@/components/effects/Blueprint";
import { T } from "@/i18n/Translate";

export default function NotFound() {
  return (
    <main id="main" className="relative grid min-h-dvh place-items-center overflow-hidden px-5">
      <BlueprintGrid fade="radial" />
      <div className="relative text-center">
        <pre aria-hidden="true" className="font-mono text-[11px] text-muted">
{`+--------------------+
|  ERR 404           |
|  route not indexed |
+--------------------+`}
        </pre>
        <h1 className="mt-8 font-display text-5xl font-bold tracking-[-0.04em] sm:text-7xl"><T>Page not found</T></h1>
        <p className="mt-4 text-muted"><T>This address doesn’t match any page in the portfolio.</T></p>
        <Link
          href="/"
          className="mt-10 inline-flex h-11 items-center rounded-full bg-fg px-5 text-sm font-medium text-bg hover:bg-accent hover:text-ink"
        >
          <T>Back to the home page</T>
        </Link>
      </div>
    </main>
  );
}
