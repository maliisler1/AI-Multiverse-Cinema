import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';

// Android bundles static assets; the original SSR build stays in vite.config.ts.
export default defineConfig(({ mode }) => {
  const testAds = loadEnv(mode, process.cwd(), '').VITE_ADMOB_TEST === 'true';
  return {
  plugins: [react(), tailwindcss(), {
    name: 'ad-build-config',
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'ad-build-config.json', source: JSON.stringify({ testAds }) });
    },
  }],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  define: { 'import.meta.env.VITE_MOBILE': JSON.stringify('true') },
  build: { outDir: 'dist-mobile', emptyOutDir: true },
  };
});
