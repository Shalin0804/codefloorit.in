import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // the three.js scene chunk is large by nature and only ever lazy-loaded on desktop
  build: { target: "es2020", chunkSizeWarningLimit: 600 },
});
