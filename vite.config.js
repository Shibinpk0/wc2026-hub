import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["brand-2026.png", "trophy.png"],
      manifest: {
        name: "FIFA World Cup 2026 Hub",
        short_name: "WC2026",
        description: "The ultimate fan hub for the 2026 World Cup",
        theme_color: "#0055FF",
        background_color: "#0B1120",
        display: "standalone",
        icons: [
          { src: "/brand-2026.png", sizes: "192x192", type: "image/png" },
          { src: "/brand-2026.png", sizes: "512x512", type: "image/png" },
        ],
      },
    }),
  ],
  server: {
    allowedHosts: true,
    proxy: {
      "/api": {
        target: "https://worldcup26.ir",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
