import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Project pages live at https://rama-na.github.io/HappyPlate/ — the repo name is
// case-sensitive in that path, so `base` must match it exactly.
export default defineConfig({
  base: '/HappyPlate/',
  plugins: [react()],
  build: {
    assetsInlineLimit: 2048,
    target: 'es2020',
  },
});
