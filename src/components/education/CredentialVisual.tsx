// Imagen de un certificado o insignia dentro del carrusel.

import Image from "next/image";
import type { Credential } from "@/types";
import { cn } from "@/lib/utils";
import { T } from "@/i18n/Translate";

/**
 * The picture of a credential inside a fixed 4:3 frame.
 * Images are contained, never cropped. Diplomas are cleaned, document-only
 * scans shown almost edge to edge; badges get extra padding. Without an image, a labeled placeholder.
 */
export function CredentialVisual({
  credential,
  className,
  sizes = "(min-width: 640px) 21rem, 80vw",
  priority = false,
}: {
  credential: Credential;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const badge = credential.kind === "badge";
  return (
    <div
      className={cn(
        "relative aspect-[4/3] w-full overflow-hidden",
        badge ? "bg-[#10151d]" : "bg-[#f7f8fa]",
        className,
      )}
    >
      {credential.image ? (
        <div className={cn("absolute", badge ? "inset-6 sm:inset-8" : "inset-1.5")}>
          <Image
            src={credential.image}
            alt={`${credential.name} — ${credential.issuer}`}
            fill
            sizes={sizes}
            priority={priority}
            className="object-contain"
          />
        </div>
      ) : (
        <div className="hatch absolute inset-0 grid place-items-center">
          <p className="font-mono text-[11px] text-[#48515f]"><T>Image coming soon</T></p>
        </div>
      )}
    </div>
  );
}
