import type { Config } from "@react-router/dev/config";
import { categories } from "./app/data/categories";
import { articles } from "./app/data/articles";
import { tools } from "./app/data/tools";

export default {
  // Pas de serveur : le site est composé de fichiers statiques, faciles et
  // peu coûteux à héberger.
  ssr: false,

  // Chaque page est pré-générée en HTML au moment de la construction :
  // chargement plus rapide et meilleure lecture par les moteurs de recherche.
  async prerender({ getStaticPaths }) {
    return [
      ...getStaticPaths(),
      ...tools.map((tool) => `/outils/${tool.slug}`),
      ...categories.map((category) => `/categories/${category.slug}`),
      ...articles.map((article) => `/ressources/${article.slug}`),
    ];
  },
} satisfies Config;
