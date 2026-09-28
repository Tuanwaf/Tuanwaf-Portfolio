import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// Served from https://tuanwaf.github.io/Tuanwaf-Portfolio/
const base = process.env.BASE_PATH ?? '/Tuanwaf-Portfolio/';

export default defineConfig({
  base,
  build: { target: 'es2020', chunkSizeWarningLimit: 900 },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'icons/*.png', 'icons/logo.svg', 'img/*'],
      manifest: {
        id: base,
        name: 'Wafiq — Portfolio',
        short_name: 'Wafiq',
        description: 'Apps, games and AI training by Tuan Ahmad Wafiq.',
        lang: 'en',
        start_url: base,
        scope: base,
        display: 'standalone',
        display_override: ['standalone', 'minimal-ui'],
        orientation: 'any',
        background_color: '#FFF8F1',
        theme_color: '#FFF8F1',
        categories: ['portfolio', 'education', 'games'],
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
        shortcuts: [
          { name: 'Playground', url: `${base}#work`, icons: [{ src: 'icons/icon-192.png', sizes: '192x192' }] },
          { name: 'Trainer', url: `${base}#trainer`, icons: [{ src: 'icons/icon-192.png', sizes: '192x192' }] },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,woff2,webp,png,jpg,svg,ico}'],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        navigateFallback: `${base}index.html`,
        runtimeCaching: [
          // Preview clips: cache after first view, honour range requests (Safari).
          {
            urlPattern: ({ url }) => url.pathname.endsWith('.mp4'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'clips',
              rangeRequests: true,
              cacheableResponse: { statuses: [200] },
              expiration: { maxEntries: 12 },
            },
          },
          {
            urlPattern: ({ url }) => url.pathname.endsWith('.pdf'),
            handler: 'NetworkFirst',
            options: { cacheName: 'docs' },
          },
        ],
      },
    }),
  ],
});
