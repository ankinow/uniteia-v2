import { qwikCity } from '@builder.io/qwik-city/vite'
import { qwikVite } from '@builder.io/qwik/optimizer'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(() => {
  const buildLocale = process.env.LOCALE || 'en'
  return {
    plugins: [
      tailwindcss(),
      qwikCity({ trailingSlash: false }),
      qwikVite({
        entryStrategy: { type: 'smart' },
      }),
      tsconfigPaths(),
    ],
    define: {
      // Pass build locale to SSG routes via Vite define (process.env is not
      // automatically available during Vite SSG builds)
      'process.env.LOCALE': JSON.stringify(buildLocale),
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: undefined,
        },
      },
      target: 'es2022',
      minify: 'esbuild' as const,
      cssMinify: true,
      reportCompressedSize: true,
      chunkSizeWarningLimit: 15,
    },
    server: {
      port: 3000,
    },
    preview: {
      port: 4000,
    },
  }
})
