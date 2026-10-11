import { describe, expect, it } from 'vitest';
import { gamePath, games } from './games';
import { sprites } from './thumbnails/sprites';

describe('게임 목록', () => {
  it('slug가 겹치지 않고 주소에 쓸 수 있는 글자다', () => {
    const slugs = games.map((game) => game.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9-]+$/);
  });
});

describe.each(games)('$slug', (game) => {
  it('빌드에 쓸 GitHub 저장소와 결과 폴더가 있다', () => {
    expect(game.repo).toMatch(/^https:\/\/github\.com\/[^/]+\/[^/]+$/);
    expect(game.outDir).toMatch(/^[\w-]+$/);
  });

  it('포털 안 게임 경로는 상대 경로다(GitHub Pages 하위 경로 대응)', () => {
    expect(gamePath(game)).toBe(`games/${game.slug}/`);
  });

  it('새로고침 대비 화면 경로는 파일 이름으로 쓸 수 있다', () => {
    for (const route of game.spaRoutes ?? []) expect(route).toMatch(/^[\w-]+$/);
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
