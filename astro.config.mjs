// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://foodfocusthailand.com",
  output: "static",

  build: {
    inlineStylesheets: "auto",
    concurrency: 6,

  },

  compressHTML: false,

  image: {
    domains: ["foodfocusthailand.com"],
    remotePatterns: [{ protocol: "https" }],
  },

  vite: {
    build: {
      minify: 'esbuild',
      target: 'es2022'
    },
    esbuild: {
			target: 'es2022',
			// Fast minification settings
			minifyIdentifiers: false, // Skip for speed
			minifySyntax: true,
			minifyWhitespace: true,
		},
    plugins: [tailwindcss()],
  },

  integrations: [react(), sitemap()],
});
