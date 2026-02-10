import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  // For GitHub Pages: set base to '/your-repo-name/'
  // For custom domain or root deployment: set base to '/'
  base: process.env.GITHUB_PAGES === 'true' ? '/PIMBuddy/' : '/',
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Optimize build for production (esbuild is faster and included with Vite)
    minify: 'esbuild',
    target: 'es2020',
    rollupOptions: {
      output: {
        // Aggressive code splitting for better performance
        manualChunks(id) {
          // Vendor chunks - split by library
          if (id.includes('node_modules')) {
            if (id.includes('@azure/msal-browser')) {
              return 'vendor-msal';
            }
            if (id.includes('@microsoft/microsoft-graph-client')) {
              return 'vendor-graph';
            }
            // All other vendor code
            return 'vendor-libs';
          }

          // Split each page into its own chunk (lazy loaded)
          if (id.includes('/src/pages/')) {
            const match = id.match(/pages\/(.+)\.js/);
            if (match) {
              return `page-${match[1].toLowerCase()}`;
            }
          }

          // Core application code (router, managers)
          if (id.includes('/src/core/')) {
            return 'core';
          }

          // Services bundle
          if (id.includes('/src/services/')) {
            return 'services';
          }

          // Utilities bundle
          if (id.includes('/src/utils/')) {
            return 'utils';
          }
        },
        // Better file naming for caching
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    // Warn about chunks over 500KB
    chunkSizeWarningLimit: 500
  },
  server: {
    port: 3000,
    open: true
  }
});
