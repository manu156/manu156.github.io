import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import markdoc from "@astrojs/markdoc";
import tailwindcss from "@tailwindcss/vite";

const SERVER_PORT = 3000;
const SITE_URL = "https://manu156.github.io";

export default defineConfig({
  server: { port: SERVER_PORT },
  site: SITE_URL,
  integrations: [sitemap(), markdoc()],
  vite: {
    plugins: [tailwindcss()],
  },
});

