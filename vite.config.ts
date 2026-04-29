import { qwikCity } from '@builder.io/qwik-city/vite'
import { qwikVite } from '@builder.io/qwik/optimizer'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(() => {
  return {
    plugins: [
      qwikCity({ trailingSlash: false }),
      qwikVite({
        entryStrategy: { type: 'smart' },
      }),
      tsconfigPaths(),
    ],
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
