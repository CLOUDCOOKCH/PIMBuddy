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
        manualChunks: {
          'msal': ['@azure/msal-browser'],
          'graph': ['@microsoft/microsoft-graph-client']
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
});
