import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isHttps = mode === 'https' || process.env.HTTPS === 'true';
  return {
    plugins: [
      react(),
      ...(isHttps ? [basicSsl()] : [])
    ],
    server: {
      host: '0.0.0.0',
      port: 3000,
      https: isHttps,
      allowedHosts: 'all',
      proxy: {
        '/replicate-api': {
          target: 'https://api.replicate.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/replicate-api/, '')
        },
        '/cloudflare-ai': {
          target: 'https://api.cloudflare.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/cloudflare-ai/, '')
        },
        '/pollinations-ai': {
          target: 'https://image.pollinations.ai',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/pollinations-ai/, '')
        }
      }
    },
    build: {
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('/scheduler/')) {
                return 'vendor-react';
              }
              if (id.includes('@mediapipe')) {
                return 'vendor-mediapipe';
              }
              if (id.includes('@google/genai') || id.includes('@gradio')) {
                return 'vendor-ai';
              }
              if (id.includes('lottie-web')) {
                return 'vendor-lottie';
              }
              if (id.includes('framer-motion') || id.includes('motion') || id.includes('gsap') || id.includes('lenis')) {
                return 'vendor-motion';
              }
              if (id.includes('ogl') || id.includes('html2canvas')) {
                return 'vendor-graphics';
              }
            }
          }
        }
      }
    }
  };
});
