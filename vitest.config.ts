import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Configuration des tests automatiques (séparée de celle du site).
export default defineConfig({
  resolve: {
    alias: { "~": fileURLToPath(new URL("./app", import.meta.url)) },
  },
  test: {
    include: ["app/**/*.test.ts"],
    environment: "node",
  },
});
