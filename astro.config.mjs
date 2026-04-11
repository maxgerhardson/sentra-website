import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://sentrik.dev',
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
});
