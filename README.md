# 퓨전 게임 포털 (fusion_game_portal)

여러 미니 게임을 한 주소에서 고르고 바로 플레이하는 포털입니다.

- 주소: https://khk9562.github.io/fusion_game_portal/
- 게임 코드는 각 저장소에서 따로 관리합니다. 이 저장소에는 포털 화면, "어느 저장소를 어떻게 빌드할지", 게임별 업데이트 기록만 둡니다.
- 게임을 따로 배포해 둘 필요가 없습니다. 게임 `main`에 푸시하면 포털이 기록하고 함께 빌드해 배포합니다. 기록: [GAME_UPDATES.md](GAME_UPDATES.md)

| 포털 경로 | 게임 | 저장소 |
|---|---|---|
| `games/turtle-rider/` | 거북 라이더 | [turtle-rider](https://github.com/khk9562/turtle-rider) |
| `games/cattetris/` | 냥스택 | [cattetris](https://github.com/khk9562/cattetris) |
| `games/philosophy/` | 당신이 철학과 학생이 된다면? | [WhatIfYouWereAPhilosophyStudent](https://github.com/khk9562/WhatIfYouWereAPhilosophyStudent) |

## 동작 방식

```
게임 저장소 main에 푸시
  → notify-portal.yml이 포털에 알림 (repository_dispatch: game-updated)
  → record-game-update.yml이 게임별 업데이트 기록을 포털 main에 커밋
      game-updates.json (원본), GAME_UPDATES.md (사람이 읽는 표)
  → deploy-pages.yml이 배포
      1) 포털 빌드 → dist/
      2) 게임마다 game-updates.json의 맨 위 커밋을 받아 npm ci → npm run build → dist/games/<slug>/
      3) dist/를 gh-pages 브랜치에 푸시 → GitHub Pages
```

- 배포가 실행되는 때: 포털 `main`에 변경이 생길 때(게임 업데이트 기록 포함), Actions 탭에서 직접 실행할 때. 정기 배포는 없습니다.
- 포털은 기록된 커밋으로만 빌드하므로, `main`의 기록이 곧 배포된 버전입니다. 이전 버전으로 되돌리려면 `game-updates.json`에서 해당 게임의 맨 위 항목을 지우고 커밋하면 됩니다.
- 어떤 커밋으로 빌드했는지는 배포된 사이트의 `games/versions.json`에서도 볼 수 있습니다.

## 자동 배포 설정

워크플로 원본은 `docs/workflows/`에 있습니다. `.github/workflows/`는 Claude 세션 권한으로 푸시할 수 없으므로 아래 파일은 GitHub 웹에서 직접 추가합니다.

| 원본 | 넣을 곳 |
|---|---|
| `docs/workflows/deploy-pages.yml` | 이 저장소 `.github/workflows/deploy-pages.yml` |
| `docs/workflows/record-game-update.yml` | 이 저장소 `.github/workflows/record-game-update.yml` |
| `docs/workflows/notify-portal.yml` | 각 게임 저장소 `.github/workflows/notify-portal.yml` (세 저장소 모두 같은 파일) |

게임 저장소가 포털에 알리려면 토큰이 필요합니다.
1. GitHub **Settings > Developer settings > Personal access tokens > Fine-grained tokens**에서 토큰을 만듭니다. Repository access는 `fusion_game_portal`만, Permissions는 **Contents: Read and write**.
2. 각 게임 저장소의 **Settings > Secrets and variables > Actions > New repository secret**에 이름 `PORTAL_DISPATCH_TOKEN`으로 넣습니다.

## 게임 쪽 조건
포털의 하위 경로(`/fusion_game_portal/games/<slug>/`)에서 동작하려면 게임이 **상대 경로**로 자산을 불러와야 합니다.

- Vite: `vite.config.ts`에 `base: './'`
- Create React App: `package.json`에 `"homepage": "."`
- 라우터를 쓰면 basename을 현재 주소에서 계산합니다(예: 철학과 게임의 `src/shared/basename.ts`).
- 새로고침해도 열려야 하는 화면 경로는 `src/games.ts`의 `spaRoutes`에 적습니다. GitHub Pages는 `/select` 요청에 `select.html`을 내려주므로 빌드 때 `index.html`을 복사해 둡니다.
- `/icons/...`처럼 `/`로 시작하는 경로를 쓰지 않습니다.
- `npm ci`와 `npm run build`만으로 빌드되어야 합니다.

## 게임 추가하기
1. 게임이 위 조건을 지키는지 확인합니다.
2. `src/games.ts`에 게임 정보(저장소, 결과 폴더, 화면 경로)를 추가합니다.
   게임 저장소에 `notify-portal.yml`과 `PORTAL_DISPATCH_TOKEN`도 넣습니다(위 "자동 배포 설정").
3. `src/thumbnails/sprites.ts`에 썸네일 픽셀 아트를 추가합니다.
4. `npm test`와 `npm run build:all`로 확인합니다.

## 개발
```bash
npm install
npm run dev         # 포털 화면만 개발
npm test
npm run lint
npm run build       # 포털만 dist/에 빌드
npm run build:all   # 포털 + 게임 세 개 빌드(game-updates.json의 커밋, 게임 코드는 .games/에 받음)
GAMES_REF=main npm run build:all  # 기록과 상관없이 모든 게임을 최신 main으로 빌드
npm run preview     # build:all 결과 미리 보기
npm run deploy:pages  # 로컬에서 직접 gh-pages로 배포(평소에는 Actions가 자동 배포)
```

## GitHub Pages 설정
- **Settings > Pages > Build and deployment**에서 Source가 **Deploy from a branch**, Branch가 **gh-pages / (root)**인지 확인합니다.
- 워크플로를 고칠 때는 `docs/workflows/`의 원본과 `.github/workflows/`의 파일을 함께 고칩니다.
