import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://invitacion.dizaru.com',
  base: '/liliana-y-daniel',
  integrations: [
    react(),
    tailwind(),
  ],
  output: 'static',
});
