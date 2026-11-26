import Image from "next/image";

// Imagen de una experiencia (captura real o portada), en formato 16:10.
// Si la experiencia no tiene imagen, no se muestra nada.
export function ExperienceVisual({ image, alt }: { image?: string | null; alt?: string }) {
  if (!image) return null;
  return (
    <div className="relative aspect-[16/10] overflow-hidden border border-line bg-bg-2">
      <Image src={image} alt={alt ?? ""} fill sizes="(min-width: 1024px) 34rem, 100vw" className="object-cover" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
    </div>
  );
}
