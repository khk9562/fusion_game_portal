/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base를 상대 경로로 두면 GitHub Pages 하위 경로(/fusion_game_portal/)에서도 그대로 동작한다
export default defineConfig({
  base: './',
  plugins: [react()],
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
