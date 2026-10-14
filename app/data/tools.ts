import type { Tool } from "./types";

/**
 * Catalogue des outils d'IA.
 * PROVISOIRE : quelques fiches de départ, remplacées par le catalogue vérifié.
 */
export const tools: Tool[] = [
  {
    slug: "chatgpt",
    name: "ChatGPT",
    publisher: "OpenAI",
    website: "https://chatgpt.com",
    category: "texte",
    otherCategories: ["agents-assistants"],
    tagline: "Assistant conversationnel généraliste pour écrire, résumer et répondre à des questions.",
    description: "Fiche provisoire.",
    uses: ["Rédiger un texte", "Résumer un document", "Répondre à des questions"],
    access: "a-confirmer",
    sources: [],
    lastChecked: "2026-10-14",
    featured: true,
  },
  {
    slug: "claude",
    name: "Claude",
    publisher: "Anthropic",
    website: "https://claude.ai",
    category: "texte",
    otherCategories: ["developpement"],
    tagline: "Assistant conversationnel pour écrire, analyser des documents et programmer.",
    description: "Fiche provisoire.",
    uses: ["Analyser un document", "Rédiger un texte", "Aider à programmer"],
    access: "a-confirmer",
    sources: [],
    lastChecked: "2026-10-14",
    featured: true,
  },
  {
    slug: "gemini",
    name: "Gemini",
    publisher: "Google",
    website: "https://gemini.google.com",
    category: "texte",
    tagline: "Assistant conversationnel de Google, relié à ses services.",
    description: "Fiche provisoire.",
    uses: ["Rédiger un texte", "Rechercher une information", "Résumer"],
    access: "a-confirmer",
    sources: [],
    lastChecked: "2026-10-14",
    featured: true,
  },
];

export function getTool(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug);
}
