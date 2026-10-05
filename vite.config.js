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
        }
      }
    }
  };
});
