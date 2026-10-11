// 게임별 업데이트 기록. 게임 저장소 main에 푸시되면 record-game-update 워크플로가 이 형식으로 기록하고,
// 포털은 각 게임의 맨 위(가장 최근) 커밋으로 빌드한다. 원본은 game-updates.json, 사람이 읽는 표는 GAME_UPDATES.md.
import type { Game } from './games';

export type GameUpdate = {
  sha: string;
  message: string;
  updatedAt: string; // ISO 8601
};

// slug별 기록. 각 배열은 최신이 앞에 온다
export type GameUpdates = Record<string, GameUpdate[]>;

const MAX_ENTRIES_PER_GAME = 100;

// "owner/repo" 형태의 저장소 이름으로 게임을 찾는다(대소문자 무시)
export function findGameByRepo(games: Game[], repo: string) {
  const target = repo.trim().toLowerCase();
  return games.find((game) => game.repo.toLowerCase().endsWith(`/${target}`));
}

// 커밋 메시지 첫 줄만 남기고 표를 깨는 글자를 정리한다
export function cleanMessage(message: string) {
  const firstLine = message.split(/\r?\n/)[0] ?? '';
  const flat = firstLine.replace(/[|`<>]/g, ' ').replace(/\s+/g, ' ').trim();
  return flat.length > 120 ? `${flat.slice(0, 119)}…` : flat;
}

export function isCommitSha(sha: string) {
  return /^[0-9a-f]{40}$/.test(sha);
}

// 새 기록을 맨 앞에 넣는다. 같은 커밋이 이미 맨 앞이면 그대로 돌려준다
export function addUpdate(updates: GameUpdates, slug: string, update: GameUpdate) {
  const entries = updates[slug] ?? [];
  if (entries[0]?.sha === update.sha) return { updates, changed: false };
  return {
    updates: { ...updates, [slug]: [update, ...entries].slice(0, MAX_ENTRIES_PER_GAME) },
    changed: true,
  };
}

export function latestSha(updates: GameUpdates, slug: string) {
  return updates[slug]?.[0]?.sha;
}

// ISO 시각을 한국 시간 "YYYY-MM-DD HH:mm"으로
export function formatKst(iso: string) {
  const kst = new Date(new Date(iso).getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().slice(0, 16).replace('T', ' ');
}

export function renderUpdatesMarkdown(games: Game[], updates: GameUpdates) {
  const sections = games.map((game) => {
    const entries = updates[game.slug] ?? [];
    const rows = entries.map(
      (entry) =>
        `| ${formatKst(entry.updatedAt)} | [${entry.sha.slice(0, 7)}](${game.repo}/commit/${entry.sha}) | ${entry.message} |`,
    );
    return [
      `## ${game.title} (${game.slug})`,
      '',
      entries.length ? '| 날짜 (KST) | 커밋 | 내용 |\n|---|---|---|\n' + rows.join('\n') : '아직 기록이 없습니다.',
    ].join('\n');
  });

  return [
    '# 게임 업데이트 기록',
    '',
    '게임 저장소의 `main`에 푸시되면 자동으로 기록됩니다. 이 기록이 바뀌면 포털이 다시 배포되고, 각 게임의 맨 위 커밋으로 빌드합니다.',
    '이 파일은 `game-updates.json`에서 만들어지므로 직접 고치지 않습니다.',
    '',
    ...sections.flatMap((section) => [section, '']),
  ].join('\n');
}
