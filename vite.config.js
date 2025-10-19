// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { sitemapPlugin } from "vite-plugin-sitemap";

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    sitemapPlugin({
      hostname: "https://digitalhat.vercel.app", // 🔗 your live domain
      outDir: "dist", // sitemap output directory
      readable: true, // makes sitemap readable for debugging
    }),
  ],

  build: {
    outDir: "dist",
    minify: "esbuild", // fast & SEO-safe minification
    rollupOptions: {
      output: {
        manualChunks: undefined, // better code splitting
      },
    },
  },

  server: {
    host: "0.0.0.0",
    port: 5173,
  },
});
