import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://tudominio.com',
  base: '/yareli-y-luis',
  integrations: [
    react(),
    tailwind(),
  ],
  output: 'static',
});
