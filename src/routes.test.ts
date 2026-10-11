import { getTransformedRoutes } from '@vercel/routing-utils';
import { describe, expect, it } from 'vitest';
import vercelConfig from '../vercel.json';
import { gamePath, games } from './games';
import { sprites } from './thumbnails/sprites';

// Vercel이 vercel.json을 해석하는 방식 그대로 경로를 풀어 본다.
const { routes, error } = getTransformedRoutes(vercelConfig);

function resolve(path: string) {
  for (const route of routes ?? []) {
    if ('handle' in route) continue;
    const pattern = new RegExp(route.src);
    if (!pattern.test(path)) continue;
    const location = route.headers?.Location;
    if (route.status && location) return { redirect: path.replace(pattern, location) };
    if (route.dest) return { rewrite: path.replace(pattern, route.dest) };
  }
  return {};
}

describe('vercel.json', () => {
  it('Vercel이 읽을 수 있는 설정이다', () => {
    expect(error).toBeNull();
  });

  it('모든 rewrite가 등록된 게임을 가리킨다', () => {
    const slugs = games.map((game) => game.slug);
    for (const { source } of vercelConfig.rewrites) {
      expect(slugs).toContain(source.match(/^\/games\/([^/]+)\//)?.[1]);
    }
  });
});

describe.each(games)('$slug 경로', (game) => {
  const base = gamePath(game);
  const rewrite = vercelConfig.rewrites.find((r) => r.source.startsWith(base));
  // 게임 배포의 첫 화면 주소. Vercel은 https://x.vercel.app/, GitHub Pages는 https://<user>.github.io/<repo>/ 형태다
  const target = rewrite?.destination.replace('$1', '') ?? '';

  it('게임 배포 주소(https, 끝 슬래시)가 있다', () => {
    expect(rewrite).toBeDefined();
    expect(target).toMatch(/^https:\/\/[^/]+(\/[^/]+)*\/$/);
  });

  it('끝 슬래시 없는 주소는 슬래시 붙은 주소로 보낸다(상대 경로 자산이 깨지지 않도록)', () => {
    expect(resolve(base.slice(0, -1))).toEqual({ redirect: base });
  });

  it('게임 첫 화면과 하위 파일, 화면 경로를 게임 배포로 넘긴다', () => {
    expect(resolve(base)).toEqual({ rewrite: target });
    expect(resolve(`${base}assets/index.js`)).toEqual({ rewrite: `${target}assets/index.js` });
    expect(resolve(`${base}select`)).toEqual({ rewrite: `${target}select` });
  });

  it('썸네일 픽셀 아트가 올바르다', () => {
    const sprite = sprites[game.slug];
    expect(sprite).toBeDefined();
    const width = sprite.rows[0].length;
    for (const row of sprite.rows) {
      expect(row).toHaveLength(width);
      for (const ch of row.replaceAll('.', '')) expect(sprite.palette).toHaveProperty(ch);
    }
  });
});
