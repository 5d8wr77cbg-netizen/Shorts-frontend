import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,   // позволяет открыть с телефона по IP компьютера
    port: 5173,
  },
});
