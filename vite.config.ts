/// <reference types="vitest/config" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
// `base` est relatif pour permettre un hébergement dans un sous-répertoire
// (ex. GitHub Pages : https://<user>.github.io/FNPPR-Fermage/).
export default defineConfig({
  base: "./",
  plugins: [react()],
  test: {
    environment: "node",
    globals: true,
  },
});
