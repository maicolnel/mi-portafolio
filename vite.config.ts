import { defineConfig } from "vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: "/mi-portafolio/",
  build: {
    outDir: "dist",
    rollupOptions: {
      input: [
        path.resolve(__dirname, "index.html"),
        path.resolve(__dirname, "about.html"),
        path.resolve(__dirname, "projects.html"),
        path.resolve(__dirname, "contact.html")
      ]
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  }
});
