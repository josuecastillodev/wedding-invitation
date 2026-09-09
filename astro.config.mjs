import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://tudominio.com',
  base: '/bautizo-valentina',
  integrations: [
    react(),
    tailwind(),
  ],
  output: 'static',
});
