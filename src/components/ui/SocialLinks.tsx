"use client";

// Enlaces a GitHub y LinkedIn (si falta la URL, se muestra un espacio pendiente).

import { profile } from "@/data/profile";
import { cn } from "@/lib/utils";
import { GithubIcon, LinkedinIcon } from "./BrandIcons";
import { useT } from "@/i18n/t";

/**
 * GitHub / LinkedIn links. When a URL is missing the item renders as a
 * disabled, labeled slot instead of a dead link.
 */
export function SocialLinks({ className }: { className?: string }) {
  const t = useT();
  const items = [
    { label: "GitHub", href: profile.github, Icon: GithubIcon },
    { label: "LinkedIn", href: profile.linkedin, Icon: LinkedinIcon },
  ];
  return (
    <ul className={cn("flex flex-wrap items-center gap-x-6 gap-y-2", className)}>
      {items.map(({ label, href, Icon }) => (
        <li key={label}>
          {href ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 text-sm text-fg transition-colors hover:text-accent"
            >
              <Icon className="size-4" />
              <span className="underline decoration-line underline-offset-4 group-hover:decoration-accent">{label}</span>
            </a>
          ) : (
            <span
              className="inline-flex items-center gap-2 text-sm text-muted"
              title={`${label} — ${t("profile coming soon")}`}
            >
              <Icon className="size-4 opacity-60" />
              {label}
              <span className="font-mono text-[10px]">· {t("link pending")}</span>
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
