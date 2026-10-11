// 각 게임 저장소의 최신 코드를 내려받아 빌드하고 dist/games/<slug>/에 넣는다. 포털 빌드(vite build) 다음에 실행한다.
// 게임 코드는 이 저장소에 커밋하지 않는다. 내려받은 코드는 .games/에 두고 다음 빌드에서 다시 쓴다.
import { execFileSync } from 'node:child_process';
import { copyFileSync, cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { games } from '../src/games.ts';

const root = path.resolve(import.meta.dirname, '..');
const workRoot = path.join(root, '.games');
const distRoot = path.join(root, 'dist');
const ref = process.env.GAMES_REF ?? 'main';

const run = (cmd: string, args: string[], cwd: string) =>
  execFileSync(cmd, args, {
    cwd,
    stdio: 'inherit',
    // CRA는 CI=true면 린트 경고를 오류로 보고 빌드를 멈춘다. 게임 저장소의 경고로 포털 배포가 막히지 않게 끈다
    env: { ...process.env, CI: 'false' },
  });

if (!existsSync(path.join(distRoot, 'index.html'))) {
  throw new Error('dist/index.html이 없습니다. 먼저 npm run build로 포털을 빌드하세요.');
}

const built: Record<string, string> = {};

for (const game of games) {
  const workDir = path.join(workRoot, game.slug);
  console.log(`\n=== ${game.slug} (${game.repo} @ ${ref})`);

  if (existsSync(path.join(workDir, '.git'))) {
    run('git', ['fetch', '--depth', '1', 'origin', ref], workDir);
    run('git', ['reset', '--hard', 'FETCH_HEAD'], workDir);
  } else {
    mkdirSync(workRoot, { recursive: true });
    run('git', ['clone', '--depth', '1', '--branch', ref, `${game.repo}.git`, workDir], root);
  }

  run('npm', ['ci', '--no-audit', '--no-fund'], workDir);
  run('npm', ['run', 'build'], workDir);

  const outDir = path.join(workDir, game.outDir);
  const target = path.join(distRoot, 'games', game.slug);
  rmSync(target, { recursive: true, force: true });
  cpSync(outDir, target, { recursive: true });
  for (const route of game.spaRoutes ?? []) {
    copyFileSync(path.join(target, 'index.html'), path.join(target, `${route}.html`));
  }

  built[game.slug] = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: workDir }).toString().trim();
}

// 어떤 커밋으로 빌드했는지 남겨 둔다(배포 후 /games/versions.json에서 확인)
writeFileSync(path.join(distRoot, 'games', 'versions.json'), `${JSON.stringify(built, null, 2)}\n`);
console.log('\n게임 빌드 완료:', built);
