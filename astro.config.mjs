// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

import sitemap from '@astrojs/sitemap';

const siteUrl = 'https://www.cancha360.com'; // ¡IMPORTANTE para sitemap y SEO!

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: siteUrl,
  vite: {
    plugins: [tailwindcss()],
    // server: {
    //   proxy: {
    //     '/api': {
    //       target: 'https://o5pu7k2pie.execute-api.us-east-1.amazonaws.com/prod',
    //       changeOrigin: true,
    //       rewrite: (path) => path.replace(/^\/api/, '')
    //     }
    //   }
    // }
  },

  integrations: [react(), sitemap()]
});