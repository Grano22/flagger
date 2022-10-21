import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/FlaggerFeaturesManager.ts'),
      name: 'Flagger',
      fileName: 'FlaggerFeaturesManager'
    }
  },
  plugins: [react()],
  server: {
    watch: {
      usePolling: true
    }
  },
})
