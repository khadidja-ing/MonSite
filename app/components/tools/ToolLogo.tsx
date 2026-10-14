import type { Tool } from "~/data/types";
import { cn } from "~/lib/cn";

/**
 * Illustration neutre d'un outil : ses initiales sur un fond de couleur.
 * Les logos officiels sont des marques déposées ; on ne les affiche pas sans
 * autorisation. La couleur est choisie à partir du nom, elle est donc stable.
 */
const palettes = [
  "bg-brand-50 text-brand-700 ring-brand-100",
  "bg-accent-50 text-accent-800 ring-accent-100",
  "bg-violet-50 text-violet-700 ring-violet-100",
  "bg-sky-50 text-sky-800 ring-sky-100",
  "bg-rose-50 text-rose-700 ring-rose-100",
  "bg-amber-50 text-amber-800 ring-amber-100",
  "bg-emerald-50 text-emerald-800 ring-emerald-100",
  "bg-ink-100 text-ink-800 ring-ink-200",
];

function initials(name: string): string {
  const words = name.replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

function hash(text: string): number {
  let value = 0;
  for (const char of text) value = (value * 31 + char.charCodeAt(0)) >>> 0;
  return value;
}

export function ToolLogo({ tool, size = "md" }: { tool: Pick<Tool, "name">; size?: "md" | "lg" }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center justify-center rounded-2xl font-display font-bold ring-1 ring-inset",
        palettes[hash(tool.name) % palettes.length],
        size === "lg" ? "size-16 text-xl" : "size-12 text-base",
      )}
    >
      {initials(tool.name)}
    </span>
  );
}
