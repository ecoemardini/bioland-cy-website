// BIOLAND-Cy website — Astro static build, deployed on Cloudflare Pages.
// Content lives in src/content and is edited through Sveltia CMS at /admin.
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://biolandcy.eu',
  // privacy.html, accessibility.html keep their old addresses
  build: { format: 'file', inlineStylesheets: 'auto' },
  trailingSlash: 'never',
  compressHTML: true,
  image: { responsiveStyles: false },
  // esbuild keeps scroll-driven animation longhands as written (Lightning CSS folds animation-timeline into the shorthand, which browsers reject)
  vite: { build: { cssMinify: 'esbuild' } },
  integrations: [sitemap({ filter: (page) => !page.includes('/admin') && !page.endsWith('/404') })],
});
