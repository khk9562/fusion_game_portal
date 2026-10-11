// 게임 저장소의 푸시 알림을 game-updates.json과 GAME_UPDATES.md에 기록한다.
// 사용: node scripts/record-game-update.ts <owner/repo> <커밋 해시> <커밋 메시지> [ISO 시각]
// 기록이 바뀌면 "changed", 같은 커밋이 이미 맨 위면 "unchanged"를 출력한다.
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { games } from '../src/games.ts';
import {
  addUpdate,
  cleanMessage,
  findGameByRepo,
  isCommitSha,
  renderUpdatesMarkdown,
  type GameUpdates,
} from '../src/gameUpdates.ts';

const root = path.resolve(import.meta.dirname, '..');
const jsonPath = path.join(root, 'game-updates.json');
const mdPath = path.join(root, 'GAME_UPDATES.md');

const [repo = '', sha = '', message = '', updatedAt = new Date().toISOString()] = process.argv.slice(2);

const game = findGameByRepo(games, repo);
if (!game) throw new Error(`포털에 등록되지 않은 저장소입니다: ${repo}`);
if (!isCommitSha(sha)) throw new Error(`커밋 해시 형식이 아닙니다: ${sha}`);

const current = JSON.parse(readFileSync(jsonPath, 'utf8')) as GameUpdates;
const { updates, changed } = addUpdate(current, game.slug, {
  sha,
  message: cleanMessage(message),
  updatedAt: new Date(updatedAt).toISOString(),
});

if (changed) {
  writeFileSync(jsonPath, `${JSON.stringify(updates, null, 2)}\n`);
  writeFileSync(mdPath, renderUpdatesMarkdown(games, updates));
}
console.log(changed ? 'changed' : 'unchanged');
