/// <reference types="vitest/config" />
import { readFileSync } from 'node:fs';
import { defineConfig, type ProxyOptions } from 'vite';
import react from '@vitejs/plugin-react';

type Rewrite = { source: string; destination: string };

// 배포 환경에서는 vercel.json의 rewrites가 /games/<slug>/ 요청을 각 게임의 Vercel 배포로 넘긴다.
// 로컬 개발 서버에서도 같은 주소로 게임을 열 수 있도록 같은 규칙을 프록시로 만든다.
function devProxyFromVercel(): Record<string, ProxyOptions> {
  const { rewrites } = JSON.parse(readFileSync(new URL('./vercel.json', import.meta.url), 'utf8')) as {
    rewrites: Rewrite[];
  };
  return Object.fromEntries(
    rewrites.map(({ source, destination }) => {
      const prefix = source.replace('(.*)', '');
      // 목적지가 GitHub Pages처럼 하위 경로(/turtle-rider/)일 수 있어 경로 앞부분을 바꿔 끼운다
      const target = new URL(destination.replace('$1', ''));
      return [
        prefix,
        {
          target: target.origin,
          changeOrigin: true,
          rewrite: (path: string) => target.pathname + path.slice(prefix.length),
        },
      ];
    }),
  );
}

export default defineConfig({
  plugins: [react()],
  server: { proxy: devProxyFromVercel() },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
