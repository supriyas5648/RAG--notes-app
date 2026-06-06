/**
 * vite.config.js - Vite Build Configuration
 * 
 * This file configures Vite, the build tool and dev server.
 * 
 * WHAT IS VITE?
 * - Modern build tool for JavaScript projects
 * - Much faster than Webpack/Create React App
 * - Hot Module Replacement (HMR): auto-reload in browser when you save files
 * - Optimized production builds
 * - Better developer experience
 * 
 * ALTERNATIVES:
 * - Webpack (older, more complex)
 * - Create React App (abstraction over Webpack, slower)
 * - Rollup (lower-level bundler)
 * 
 * We use Vite because it's:
 * 1. FAST: Instant server start, instant reloads
 * 2. EASY: Minimal configuration needed
 * 3. MODERN: Built for ES modules natively
 * 4. POWERFUL: Can build for production with optimizations
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// defineConfig provides TypeScript intellisense even in .js files
export default defineConfig({
  // Plugins enhance Vite's capabilities
  plugins: [
    // @vitejs/plugin-react adds React-specific features:
    // - Fast Refresh (HMR for React)
    // - JSX transformation
    // - Automatic React import in JSX files
    react()
  ],
  
  // Server configuration for development
  server: {
    // Port to run dev server on
    // Access app at http://localhost:5173
    port: 5173,
    
    // Automatically open browser when dev server starts
    open: true,
    
    // Proxy API calls to backend
    // Any request to /api/* gets forwarded to backend
    proxy: {
      '/api': {
        target: 'http://localhost:5000',  // Backend server URL
        changeOrigin: true,               // Needed for cross-origin requests
        rewrite: (path) => path.replace(/^\/api/, '/api')  // Keep /api path
      }
    }
  },
  
  // Build configuration for production
  build: {
    // Output directory
    outDir: 'dist',
    
    // Minimize output (compress CSS, JS, HTML)
    minify: 'terser',
    
    // Source map for debugging in production
    // Set to false in production to reduce bundle size
    sourcemap: false
  }
})

/**
 * HOW TO USE:
 * 
 * Development:
 * npm run dev
 * - Starts dev server at http://localhost:5173
 * - Auto-reloads when you save files
 * - Shows errors in terminal and browser console
 * 
 * Production Build:
 * npm run build
 * - Creates optimized bundle in 'dist' folder
 * - Ready to deploy to web server
 * - Minified and optimized for performance
 * 
 * Preview Production Build:
 * npm run preview
 * - Runs the production build locally
 * - Helps verify it works before deploying
 */
