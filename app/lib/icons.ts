/**
 * Correspondance entre les noms d'icônes utilisés dans les données et les
 * icônes de la bibliothèque Lucide. Les données restent ainsi indépendantes
 * de l'affichage.
 */
import {
  AudioLines,
  BookOpen,
  Bot,
  Building2,
  ChartColumn,
  Clapperboard,
  Code,
  Compass,
  Globe,
  GraduationCap,
  Image,
  Lightbulb,
  Megaphone,
  MessageCircle,
  PenLine,
  Plug,
  Search,
  ShieldCheck,
  Users,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import type { IconName } from "~/data/types";

export const icons: Record<IconName, LucideIcon> = {
  "pen-line": PenLine,
  image: Image,
  clapperboard: Clapperboard,
  "audio-lines": AudioLines,
  code: Code,
  workflow: Workflow,
  megaphone: Megaphone,
  chart: ChartColumn,
  bot: Bot,
  building: Building2,
  "graduation-cap": GraduationCap,
  compass: Compass,
  "message-circle": MessageCircle,
  plug: Plug,
  globe: Globe,
  users: Users,
  lightbulb: Lightbulb,
  search: Search,
  shield: ShieldCheck,
  "book-open": BookOpen,
};

export function getIcon(name: IconName): LucideIcon {
  return icons[name];
}
