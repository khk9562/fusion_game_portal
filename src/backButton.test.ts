import { describe, expect, it } from 'vitest';
import { backButtonSnippet, injectBackButton } from './backButton';

describe('포털로 돌아가기 버튼', () => {
  const page = '<!doctype html><html><head></head><body><div id="root"></div></body></html>';

  it('</body> 바로 앞에 넣는다', () => {
    const html = injectBackButton(page);
    expect(html.indexOf('id="fgp-back"')).toBeGreaterThan(html.indexOf('<div id="root">'));
    expect(html.endsWith('</body></html>')).toBe(true);
  });

  it('두 번 넣어도 하나만 들어간다', () => {
    const twice = injectBackButton(injectBackButton(page));
    expect(twice.match(/id="fgp-back"/g)).toHaveLength(1);
  });

  it('자리를 고를 수 있고 기본은 위 가운데다', () => {
    expect(backButtonSnippet()).toContain('left:50%');
    expect(backButtonSnippet('bottom-right')).toContain('bottom:calc(');
  });

  it('주소의 /games/ 앞부분을 포털 주소로 쓴다', () => {
    const script = backButtonSnippet().match(/<script>([\s\S]*?)<\/script>/)?.[1] ?? '';
    const anchor = { href: '' };
    const run = (pathname: string) => {
      new Function('document', 'location', script)({ getElementById: () => anchor }, { pathname });
      return anchor.href;
    };
    expect(run('/fusion_game_portal/games/philosophy/select')).toBe('/fusion_game_portal/');
    expect(run('/games/cattetris/')).toBe('/');
  });
});
