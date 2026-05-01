import { VitePWA } from 'vite-plugin-pwa';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import {defineConfig, loadEnv} from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        strategies: 'generateSW',
        manifest: false,
        includeAssets: [
          'icons/icon-192.png',
          'icons/icon-512.png',
          'icons/maskable-icon.png',
          'favicon.png',
          'apple-touch-icon.png',
          'offline.html',
          'manifest.json',
        ],
        workbox: {
          navigateFallback: '/offline.html',
          globPatterns: ['**/*.{js,css,html,svg,json,ico,woff2}'],
          runtimeCaching: [
            {
              urlPattern: ({request, url}) => request.destination === 'image' || url.pathname.startsWith('/icons/'),
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'static-images',
              },
            },
          ],
        },
        devOptions: {
          enabled: true,
          navigateFallback: 'index.html',
        },
      }),
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
