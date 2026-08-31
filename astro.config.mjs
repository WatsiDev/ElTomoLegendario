// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  site: 'https://eltomolegendario.netlify.app',
  build: {
    inlineStylesheets: 'always',
  },
  integrations: [react(), sitemap(), icon()],
  vite: {
    plugins: [tailwindcss()],
  },
});