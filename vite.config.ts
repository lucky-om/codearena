/**
 * Vite Configuration
 * Developed by: Lucky
 * Project: Code Arena — Wildcard Draw System (Inferno'26)
 * Live: https://codearena.luckyverse.tech
 */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Use "/" for custom domain (CNAME) — assets resolve from root.
  // NOTE: If you ever remove the CNAME and serve from a GitHub sub-path
  //       (e.g. /codearena/), change this back to "./" or the repo sub-path.
  base: "/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    // Ensure source maps are NOT produced in production (security)
    sourcemap: false,
  },
});
