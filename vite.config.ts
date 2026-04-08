import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('/node_modules/react/') || id.includes('/node_modules/react-dom/') || id.includes('/node_modules/scheduler/')) return 'react-vendor';
          if (id.includes('/node_modules/react-router/') || id.includes('/node_modules/react-router-dom/')) return 'router-vendor';
          if (id.includes('/node_modules/@supabase/')) return 'supabase-vendor';
          if (id.includes('/node_modules/@sentry/')) return 'sentry-vendor';
          if (id.includes('/node_modules/reset.css/')) return 'style-vendor';
          return 'vendor';
        },
      },
    },
  },
})
