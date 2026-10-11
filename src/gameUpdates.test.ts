import { describe, expect, it } from 'vitest';
import updatesFile from '../game-updates.json';
import {
  addUpdate,
  cleanMessage,
  findGameByRepo,
  formatKst,
  isCommitSha,
  latestSha,
  renderUpdatesMarkdown,
  type GameUpdates,
} from './gameUpdates';
import { games } from './games';

const sha = (ch: string) => ch.repeat(40);

describe('게임 업데이트 기록', () => {
  it('저장소 이름으로 게임을 찾는다(대소문자 무시)', () => {
    expect(findGameByRepo(games, 'khk9562/turtle-rider')?.slug).toBe('turtle-rider');
    expect(findGameByRepo(games, 'khk9562/whatifyouwereaphilosophystudent')?.slug).toBe('philosophy');
    expect(findGameByRepo(games, 'khk9562/unknown')).toBeUndefined();
  });

  it('커밋 메시지는 첫 줄만, 표를 깨는 글자는 지운다', () => {
    expect(cleanMessage('FIX: a | b `c`\n\n본문')).toBe('FIX: a b c');
    expect(cleanMessage('가'.repeat(200))).toHaveLength(120);
  });

  it('커밋 해시 형식을 확인한다', () => {
    expect(isCommitSha(sha('a'))).toBe(true);
    expect(isCommitSha('main')).toBe(false);
  });

  it('새 기록은 맨 앞에 넣고, 같은 커밋이 맨 앞이면 바꾸지 않는다', () => {
    const first = { sha: sha('a'), message: '첫', updatedAt: '2026-10-11T00:00:00Z' };
    const second = { sha: sha('b'), message: '둘', updatedAt: '2026-10-12T00:00:00Z' };
    const one = addUpdate({}, 'cattetris', first);
    const two = addUpdate(one.updates, 'cattetris', second);
    expect(two.changed).toBe(true);
    expect(latestSha(two.updates, 'cattetris')).toBe(sha('b'));
    expect(two.updates.cattetris).toHaveLength(2);
    expect(addUpdate(two.updates, 'cattetris', second).changed).toBe(false);
  });

  it('한국 시간으로 표시한다', () => {
    expect(formatKst('2026-10-11T15:30:00Z')).toBe('2026-10-12 00:30');
  });

  it('게임마다 표를 만들고 커밋 링크를 단다', () => {
    const updates: GameUpdates = {
      'turtle-rider': [{ sha: sha('c'), message: 'FEAT: 새 단계', updatedAt: '2026-10-11T00:00:00Z' }],
    };
    const md = renderUpdatesMarkdown(games, updates);
    expect(md).toContain('## 거북 라이더 (turtle-rider)');
    expect(md).toContain(`[ccccccc](https://github.com/khk9562/turtle-rider/commit/${sha('c')}) | FEAT: 새 단계 |`);
    expect(md).toContain('## 냥스택 (cattetris)\n\n아직 기록이 없습니다.');
  });

  it('저장된 기록은 모든 게임에 올바른 커밋을 갖는다', () => {
    const saved = updatesFile as GameUpdates;
    for (const game of games) {
      const current = latestSha(saved, game.slug);
      expect(current && isCommitSha(current)).toBe(true);
    }
  });
});
