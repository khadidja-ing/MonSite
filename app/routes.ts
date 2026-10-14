/**
 * Liste des pages du site et de leur adresse.
 * Pour ajouter une page : créer le fichier dans app/routes/ et l'ajouter ici.
 */
import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("outils", "routes/outils.tsx"),
  route("outils/:slug", "routes/outil.tsx"),
  route("categories", "routes/categories.tsx"),
  route("categories/:slug", "routes/categorie.tsx"),
  route("services", "routes/services.tsx"),
  route("ressources", "routes/ressources.tsx"),
  route("ressources/:slug", "routes/article.tsx"),
  route("a-propos", "routes/a-propos.tsx"),
  route("contact", "routes/contact.tsx"),
  route("mentions-legales", "routes/mentions-legales.tsx"),
  route("confidentialite", "routes/confidentialite.tsx"),
  route("conditions-utilisation", "routes/conditions-utilisation.tsx"),
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
