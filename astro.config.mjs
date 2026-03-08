import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://sentra.dev',
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
});
